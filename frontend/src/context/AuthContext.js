import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authRepository } from '../repositories/authRepository';
import { storage } from '../services/storage';
import { apiErrorMessage, setSessionExpiredHandler } from '../services/api';
import { mapUser } from '../models';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [pendingRole, setPendingRole] = useState('traveler');
  const [error, setError] = useState(null);
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    (async () => {
      await storage.hydrate();
      const s = await storage.readSession();
      setSession(s);
      const lang = await storage.preference('language');
      if (lang) setLanguageState(lang);
      setBooting(false);
    })();
  }, []);

  useEffect(() => setSessionExpiredHandler(() => {
    setSession(null);
    setError('Session expired, please sign in again');
  }), []);

  const selectRole = useCallback((role) => {
    setPendingRole(role);
  }, []);

  const runAuth = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const s = await fn();
      setSession(s);
      setLoading(false);
      return true;
    } catch (e) {
      setError(apiErrorMessage(e));
      setLoading(false);
      return false;
    }
  }, []);

  const login = useCallback(
    (email, password) =>
      runAuth(() => authRepository.login({ email, password })),
    [runAuth],
  );

  const register = useCallback(
    (name, email, password) =>
      runAuth(() =>
        authRepository.register({
          name,
          email,
          password,
          role: pendingRole,
        }),
      ),
    [runAuth, pendingRole],
  );

  const logout = useCallback(async () => {
    await authRepository.logout();
    setSession(null);
  }, []);

  const updateProfile = useCallback(
    async (profile) => {
      if (!session) return;
      const user = await authRepository.updateProfile(profile);
      const next = {
        ...session,
        user: mapUser({ ...session.user, ...user }),
      };
      setSession(next);
      await storage.saveSession(next);
      return user;
    },
    [session],
  );

  const updateName = useCallback(
    (name) => updateProfile({ name }),
    [updateProfile],
  );

  const setLanguage = useCallback(async (lang) => {
    setLanguageState(lang);
    await storage.setPreference('language', lang);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      booting,
      pendingRole,
      error,
      language,
      selectRole,
      login,
      register,
      logout,
      updateName,
      updateProfile,
      setLanguage,
      clearError: () => setError(null),
    }),
    [
      session,
      loading,
      booting,
      pendingRole,
      error,
      language,
      selectRole,
      login,
      register,
      logout,
      updateName,
      updateProfile,
      setLanguage,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
