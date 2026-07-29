import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { authRepository } from '../repositories/authRepository';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function VerifyEmailScreen({ navigation, route }) {
  const token = route.params?.token;
  const { refreshUser } = useAuth();
  const [state, setState] = useState({ loading: true, error: null });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return undefined;
    started.current = true;
    let active = true;
    (async () => {
      try {
        await authRepository.verifyEmail(String(token || ''));
        await refreshUser?.();
        if (active) setState({ loading: false, error: null });
      } catch (error) {
        if (active) setState({ loading: false, error: apiErrorMessage(error) });
      }
    })();
    return () => { active = false; };
  }, [refreshUser, token]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        {state.loading ? <ActivityIndicator size="large" color={colors.brand} /> : null}
        <Text style={styles.title}>{state.error ? 'Email verification failed' : 'Email verified'}</Text>
        <Text style={styles.text}>{state.error || 'Your email address has been verified successfully.'}</Text>
        {!state.loading ? <AppButton title="Continue" onPress={() => navigation.navigate('Main')} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: 18 },
  title: { color: colors.ink, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  text: { color: colors.inkSoft, lineHeight: 21, textAlign: 'center' },
});
