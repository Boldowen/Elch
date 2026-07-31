import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { AppButton, AppInput, BrandMark } from '../components/ui';
import { GOOGLE_AUTH } from '../config';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen({ navigation, route }) {
  const [mode, setMode] = useState(route.params?.mode || 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [providerLoading, setProviderLoading] = useState(null);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const { login, register, socialLogin, loading, error, pendingRole, clearError } = useAuth();
  const { t } = useT();
  const isRegister = mode === 'register';
  const platformGoogleId = Platform.select({ android: GOOGLE_AUTH.androidClientId, ios: GOOGLE_AUTH.iosClientId, web: GOOGLE_AUTH.webClientId });

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => setAppleAvailable(false));
  }, []);

  const finish = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    if (pendingRole === 'guide') navigation.navigate('GuideRegistration');
  };

  const completeSocial = async (provider, token, providerName) => {
    const ok = await socialLogin(provider, token, providerName);
    setProviderLoading(null);
    if (ok) finish();
  };

  const submit = async () => {
    clearError?.();
    if (!email.trim() || !password) return Alert.alert('Missing fields', 'Email and password are required.');
    if (isRegister && name.trim().length < 2) return Alert.alert('Check your name', 'Please enter your full name.');
    if (password.length < 8) return Alert.alert('Weak password', 'Password must be at least 8 characters.');
    if (isRegister && password !== confirm) return Alert.alert('Passwords do not match', 'Enter the same password in both fields.');
    const ok = isRegister ? await register(name.trim(), email.trim(), password) : await login(email.trim(), password);
    if (ok) finish();
  };

  const signInApple = async () => {
    clearError?.();
    setProviderLoading('apple');
    try {
      const credential = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL] });
      if (!credential.identityToken) throw new Error('Apple did not return an identity token');
      const providerName = credential.fullName ? AppleAuthentication.formatFullName(credential.fullName) : undefined;
      await completeSocial('apple', credential.identityToken, providerName);
    } catch (e) {
      setProviderLoading(null);
      if (e?.code !== 'ERR_REQUEST_CANCELED') Alert.alert('Apple sign-in failed', e.message || 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.navigate('Welcome')} style={styles.backButton}><Text style={styles.back}>‹</Text></Pressable>
          <View style={styles.brand}><BrandMark /></View>
          <Text style={styles.title}>{isRegister ? t('auth.create') : t('auth.welcome')}</Text>
          <Text style={styles.sub}>{pendingRole === 'guide' ? t('auth.guide') : t('auth.traveler')}</Text>
          {pendingRole === 'guide' ? <Text style={styles.rolePill}>{t('welcome.guide')}</Text> : null}
          {error ? <View style={styles.errorBox}><Text style={styles.error}>{error}</Text></View> : null}

          <View style={styles.form}>
            {isRegister ? <AppInput label={t('auth.name')} value={name} onChangeText={setName} autoCapitalize="words" placeholder="Your full name" /> : null}
            <AppInput label={t('auth.email')} value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" placeholder="traveler@elch.mn" />
            <View>
              <AppInput label={t('auth.password')} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="At least 8 characters" />
              <Pressable onPress={() => setShowPassword((value) => !value)} style={styles.eye} accessibilityRole="button"><Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text></Pressable>
            </View>
            {isRegister ? <AppInput label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry={!showPassword} placeholder="Repeat your password" /> : null}
          </View>
          {!isRegister ? <Pressable onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.forgot}>Forgot password?</Text></Pressable> : null}
          <AppButton title={isRegister ? t('auth.register') : t('auth.login')} onPress={submit} loading={loading && !providerLoading} />

          <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>or continue with</Text><View style={styles.line} /></View>
          {platformGoogleId ? (
            <ConfiguredGoogleButton
              loading={providerLoading === 'google'}
              disabled={Boolean(providerLoading)}
              clearError={clearError}
              onLoading={setProviderLoading}
              onAuthenticated={(token) => completeSocial('google', token)}
            />
          ) : (
            <GoogleButton
              onPress={() => Alert.alert('Google setup needed', 'Set EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID before starting Expo.')}
            />
          )}
          {appleAvailable ? <AppleAuthentication.AppleAuthenticationButton buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE} buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK} cornerRadius={radius.md} style={styles.appleButton} onPress={signInApple} /> : null}
          <Pressable onPress={() => { clearError?.(); setMode(isRegister ? 'login' : 'register'); }} style={styles.switchMode}>
            <Text style={styles.switchMuted}>{isRegister ? 'Already have an account? ' : 'New to ELCH? '}<Text style={styles.switchLink}>{isRegister ? t('auth.login') : t('auth.register')}</Text></Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ConfiguredGoogleButton({ loading, disabled, clearError, onLoading, onAuthenticated }) {
  const [request, response, prompt] = Google.useIdTokenAuthRequest(GOOGLE_AUTH);

  useEffect(() => {
    if (response?.type !== 'success') return;
    const token = response.params?.id_token || response.authentication?.idToken;
    if (token) onAuthenticated(token);
    else {
      onLoading(null);
      Alert.alert('Google sign-in failed', 'Google did not return an identity token.');
    }
  }, [response]);

  const signIn = async () => {
    clearError?.();
    onLoading('google');
    const result = await prompt();
    if (result.type !== 'success') onLoading(null);
  };

  return <GoogleButton loading={loading} disabled={!request || disabled} onPress={signIn} />;
}

function GoogleButton({ loading = false, disabled = false, onPress }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.socialButton, disabled && styles.disabled, pressed && styles.pressed]}>
      <Text style={styles.google}>G</Text>
      <Text style={styles.socialText}>{loading ? 'Connecting…' : 'Continue with Google'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 }, root: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.xl, paddingTop: 8, paddingBottom: 40 },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  back: { fontSize: 30, lineHeight: 31, color: colors.ink, marginTop: -2 }, brand: { marginTop: 24, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink, letterSpacing: -0.7 }, sub: { color: colors.inkSoft, marginTop: 6, fontSize: 15, lineHeight: 21 },
  rolePill: { alignSelf: 'flex-start', marginTop: 10, borderRadius: radius.pill, paddingHorizontal: 11, paddingVertical: 6, overflow: 'hidden', backgroundColor: '#FFF0F3', color: colors.brand, fontSize: 12, fontWeight: '700' },
  errorBox: { marginTop: 16, borderRadius: radius.md, padding: 12, backgroundColor: '#FFF1F2', borderWidth: 1, borderColor: '#FFE0E5' }, error: { color: colors.brandDark, lineHeight: 19 },
  form: { marginTop: 22 }, eye: { position: 'absolute', right: 12, bottom: 30, padding: 8 }, eyeText: { color: colors.inkSoft, fontSize: 12, fontWeight: '700' },
  forgot: { color: colors.brand, fontWeight: '600', alignSelf: 'flex-end', marginTop: -6, marginBottom: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 }, line: { flex: 1, height: 1, backgroundColor: colors.border }, or: { color: colors.inkSoft, fontSize: 13 },
  socialButton: { height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, backgroundColor: colors.white }, pressed: { opacity: 0.75 }, disabled: { opacity: 0.55 },
  google: { position: 'absolute', left: 18, color: '#4285F4', fontWeight: '900', fontSize: 18 }, socialText: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  appleButton: { width: '100%', height: 52, marginBottom: 12 }, switchMode: { alignItems: 'center', paddingVertical: 10 }, switchMuted: { color: colors.inkSoft, fontSize: 14 }, switchLink: { color: colors.brand, fontWeight: '700' },
});
