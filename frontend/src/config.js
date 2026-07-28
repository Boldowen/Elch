import { Platform } from 'react-native';

// Android emulator reaches host machine via 10.0.2.2
// Physical device: set EXPO_PUBLIC_API_BASE_URL to your LAN IP
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  `http://${defaultHost}:3000/api/v1`;
