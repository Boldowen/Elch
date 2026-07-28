import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  session: '@ventour/session',
  refreshToken: 'ventour.refreshToken',
  prefs: '@ventour/prefs',
  cachePrefix: '@ventour/cache:',
};

let memorySession = null;
const memoryCache = new Map();
const memoryPrefs = {};

async function setRefreshToken(value) {
  if (Platform.OS === 'web') {
    if (value) await AsyncStorage.setItem(KEYS.refreshToken, value);
    else await AsyncStorage.removeItem(KEYS.refreshToken);
    return;
  }
  if (value) await SecureStore.setItemAsync(KEYS.refreshToken, value);
  else await SecureStore.deleteItemAsync(KEYS.refreshToken);
}

async function getRefreshToken() {
  return Platform.OS === 'web'
    ? AsyncStorage.getItem(KEYS.refreshToken)
    : SecureStore.getItemAsync(KEYS.refreshToken);
}

export const storage = {
  async saveSession(session) {
    memorySession = session;
    await Promise.all([
      setRefreshToken(session?.refreshToken),
      AsyncStorage.setItem(KEYS.session, JSON.stringify({ user: session?.user ?? null })),
    ]);
  },

  async readSession() {
    if (memorySession) return memorySession;
    const [raw, storedRefreshToken] = await Promise.all([
      AsyncStorage.getItem(KEYS.session),
      getRefreshToken(),
    ]);
    if (!raw) return null;
    try {
      const persisted = JSON.parse(raw);
      // One-time migration from the MVP format, which persisted both tokens in
      // AsyncStorage. The rewritten value contains public user data only.
      const refreshToken = storedRefreshToken ?? persisted.refreshToken;
      if (!refreshToken) return null;
      if (!storedRefreshToken && persisted.refreshToken) {
        await Promise.all([
          setRefreshToken(persisted.refreshToken),
          AsyncStorage.setItem(KEYS.session, JSON.stringify({ user: persisted.user ?? null })),
        ]);
      }
      // Access tokens deliberately never leave process memory.
      memorySession = { user: persisted.user, refreshToken };
      return memorySession;
    } catch {
      return null;
    }
  },

  readSessionSync() {
    return memorySession;
  },

  async clearSession() {
    memorySession = null;
    await Promise.all([AsyncStorage.removeItem(KEYS.session), setRefreshToken(null)]);
  },

  async setPreference(key, value) {
    memoryPrefs[key] = value;
    const raw = await AsyncStorage.getItem(KEYS.prefs);
    const prefs = raw ? JSON.parse(raw) : {};
    prefs[key] = value;
    await AsyncStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
  },

  async preference(key) {
    if (memoryPrefs[key] != null) return memoryPrefs[key];
    const raw = await AsyncStorage.getItem(KEYS.prefs);
    if (!raw) return null;
    const prefs = JSON.parse(raw);
    Object.assign(memoryPrefs, prefs);
    return prefs[key] ?? null;
  },

  async cache(key, value) {
    memoryCache.set(key, value);
    await AsyncStorage.setItem(KEYS.cachePrefix + key, JSON.stringify(value));
  },

  async cached(key) {
    if (memoryCache.has(key)) return memoryCache.get(key);
    const raw = await AsyncStorage.getItem(KEYS.cachePrefix + key);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      memoryCache.set(key, value);
      return value;
    } catch {
      return null;
    }
  },

  async hydrate() {
    await this.readSession();
    const raw = await AsyncStorage.getItem(KEYS.prefs);
    if (raw) Object.assign(memoryPrefs, JSON.parse(raw));
  },
};
