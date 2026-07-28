import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, BrandMark } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

export default function AuthScreen({ navigation, route }) {
  const initialMode = route.params?.mode || 'login';
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading, error, pendingRole, clearError } =
    useAuth();
  const { t } = useT();

  const isRegister = mode === 'register';

  const finish = () => {
    if (pendingRole === 'guide') {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      navigation.navigate('GuideRegistration');
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  const submit = async () => {
    clearError?.();
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }
    if (isRegister && !name.trim()) {
      Alert.alert('Missing fields', 'Name is required.');
      return;
    }
    const ok = isRegister
      ? await register(name.trim(), email.trim(), password)
      : await login(email.trim(), password);
    if (ok) finish();
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.top}>
            <Pressable onPress={() => navigation.navigate('Welcome')}>
              <Text style={styles.back}>‹</Text>
            </Pressable>
            <BrandMark />
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.iconBox}>
            <Text style={{ fontSize: 22 }}>
              {pendingRole === 'guide' ? '🗺️' : '🧭'}
            </Text>
          </View>
          <Text style={styles.title}>
            {isRegister
                ? t('auth.create')
                : t('auth.welcome')}
          </Text>
          <Text style={styles.sub}>
            {pendingRole === 'guide'
              ? t('auth.guide')
              : t('auth.traveler')}
          </Text>

          {isRegister ? (
            <AppInput label={t('auth.name')} value={name} onChangeText={setName} autoCapitalize="words" />
          ) : null}
          <AppInput
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="traveler@ventour.mn"
          />
          <AppInput
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password123!"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AppButton
            title={
              isRegister ? t('auth.register') : t('auth.login')
            }
            onPress={submit}
            loading={loading}
          />

          <View style={styles.links}>
            <Pressable
              onPress={() => setMode(isRegister ? 'login' : 'register')}
            >
              <Text style={styles.link}>
                {isRegister
                  ? t('auth.hasAccount')
                  : t('auth.new')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingBottom: 40 },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  back: { fontSize: 32, color: colors.ink, lineHeight: 34 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.5,
  },
  sub: { color: colors.inkSoft, marginTop: 6, marginBottom: 24, fontSize: 15 },
  error: { color: colors.brand, marginBottom: 12 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { color: colors.inkSoft, fontSize: 13 },
  links: { marginTop: 22, gap: 12, alignItems: 'center' },
  link: { color: colors.ink, fontWeight: '600', fontSize: 14 },
});
