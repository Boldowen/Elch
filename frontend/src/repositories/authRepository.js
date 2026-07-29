import { api } from '../services/api';
import { storage } from '../services/storage';
import { mapSession, mapUser } from '../models';

export const authRepository = {
  async register({ name, email, password, role }) {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      role: String(role).toUpperCase(),
    });
    const session = mapSession(data);
    await storage.saveSession(session);
    return session;
  },

  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    const session = mapSession(data);
    await storage.saveSession(session);
    return session;
  },

  async logout() {
    const session = storage.readSessionSync() || (await storage.readSession());
    if (session?.refreshToken) {
      try {
        await api.post('/auth/logout', {
          refreshToken: session.refreshToken,
        });
      } catch {
        // ignore
      }
    }
    await storage.clearSession();
  },

  async me() {
    const { data } = await api.get('/users/me');
    return mapUser(data);
  },

  async updateProfile(payload) {
    const { data } = await api.patch('/users/me', payload);
    return mapUser(data);
  },

  async verifyEmail(token) {
    const { data } = await api.post('/auth/verify-email', { token });
    return data;
  },

  async resendVerification(email) {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await api.post('/auth/reset-password', { token, newPassword });
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
    return data;
  },
};
