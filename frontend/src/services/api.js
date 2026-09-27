import axios from 'axios';
import { API_BASE_URL } from '../config';
import { storage } from './storage';
import { domainErrorMessage } from './domainErrors';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

let refreshing = false;
let waiters = [];
let sessionExpiredHandler = null;

export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler;
  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

function flushWaiters(error) {
  waiters.forEach((w) => (error ? w.reject(error) : w.resolve()));
  waiters = [];
}

async function refreshTokens() {
  const session = storage.readSessionSync() || (await storage.readSession());
  if (!session?.refreshToken) {
    const error = new Error('No refresh token');
    error.code = 'SESSION_EXPIRED';
    throw error;
  }
  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken: session.refreshToken,
  }, { timeout: 10000 });
  if (storage.readSessionSync()?.refreshToken !== session.refreshToken) {
    const error = new Error('Session changed while refreshing');
    error.code = 'SESSION_CHANGED';
    throw error;
  }
  const next = {
    user: data.user ?? session.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? session.refreshToken,
  };
  await storage.saveSession(next);
  return next;
}

api.interceptors.request.use(async (config) => {
  const session = storage.readSessionSync() || (await storage.readSession());
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config || {};
    const status = error.response?.status;
    const requestPath = String(config.url || '');
    const isPublicAuthRequest = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-email',
      '/auth/resend-verification',
      '/auth/social',
    ].some((path) => requestPath.includes(path));
    const isNetwork =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network');

    // Transient retry
    const method = String(config.method || 'get').toLowerCase();
    const idempotencyKey = config.headers?.get?.('Idempotency-Key') || config.headers?.['Idempotency-Key'];
    const safelyRetryable = ['get', 'head', 'options'].includes(method) || Boolean(idempotencyKey);
    if (isNetwork && !isPublicAuthRequest && safelyRetryable) {
      const retries = config.__networkRetries || 0;
      if (retries < 2) {
        config.__networkRetries = retries + 1;
        await new Promise((r) => setTimeout(r, 350 * (retries + 1)));
        return api.request(config);
      }
    }

    // A rejected login/register is not an expired session. Trying to refresh
    // here can keep the login button spinning against an old stored token.
    if (status !== 401 || config.__retried || isPublicAuthRequest) {
      return Promise.reject(error);
    }

    if (refreshing) {
      await new Promise((resolve, reject) => {
        waiters.push({ resolve, reject });
      });
      const session = storage.readSessionSync();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      config.__retried = true;
      return api.request(config);
    }

    refreshing = true;
    try {
      const next = await refreshTokens();
      flushWaiters(null);
      config.headers.Authorization = `Bearer ${next.accessToken}`;
      config.__retried = true;
      return api.request(config);
    } catch (e) {
      flushWaiters(e);
      if (e.code === 'SESSION_EXPIRED' || [401, 403].includes(e.response?.status)) {
        try {
          await storage.clearSession();
        } finally {
          sessionExpiredHandler?.();
        }
      }
      return Promise.reject(e);
    } finally {
      refreshing = false;
    }
  },
);

export function apiErrorMessage(error) {
  const data = error?.response?.data;
  const language = storage.preferenceSync('language') || 'en';
  const localized = domainErrorMessage(data?.code || error?.code, language);
  if (localized) return localized;
  if (typeof data?.message === 'string') return data.message;
  if (Array.isArray(data?.message)) return data.message.join(', ');
  if (data?.error) return String(data.error);
  if (!error?.response && (error?.code === 'ECONNABORTED' || error?.message?.includes('Network'))) {
    return domainErrorMessage('NETWORK_UNAVAILABLE', language);
  }
  return error?.message || domainErrorMessage('UNKNOWN_ERROR', language);
}
