import axios from 'axios';
import { API_BASE_URL } from '../config';
import { storage } from './storage';

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
    throw new Error('No refresh token');
  }
  const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken: session.refreshToken,
  });
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
    ].some((path) => requestPath.includes(path));
    const isNetwork =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network');

    // Transient retry
    if (isNetwork && !isPublicAuthRequest) {
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
      await storage.clearSession();
      sessionExpiredHandler?.();
      return Promise.reject(error);
    } finally {
      refreshing = false;
    }
  },
);

export function apiErrorMessage(error) {
  const data = error?.response?.data;
  if (typeof data?.message === 'string') return data.message;
  if (Array.isArray(data?.message)) return data.message.join(', ');
  if (data?.error) return String(data.error);
  if (!error?.response && (error?.code === 'ECONNABORTED' || error?.message?.includes('Network'))) {
    return `ELCH API-д холбогдож чадсангүй (${API_BASE_URL}). API хаяг болон Wi-Fi сүлжээг шалгана уу.`;
  }
  return error?.message || 'Something went wrong';
}
