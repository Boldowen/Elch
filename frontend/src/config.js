import { Platform } from 'react-native';

// Android emulator reaches host machine via 10.0.2.2
// Physical device: set EXPO_PUBLIC_API_BASE_URL to your computer's LAN IP.
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const defaultPort = process.env.EXPO_PUBLIC_API_PORT || '3001';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  `http://${defaultHost}:${defaultPort}/api/v1`;

export const GOOGLE_AUTH = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};
