import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { authRepository } from '../repositories/authRepository';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function ResetPasswordScreen({ navigation, route }) {
  const token = route.params?.token;
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (password !== confirmation || password.length < 8) {
      Alert.alert('Check password', 'Passwords must match and contain at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await authRepository.resetPassword(String(token || ''), password);
      await logout();
      Alert.alert('Password changed', 'Sign in again on all devices with your new password.');
      navigation.reset({ index: 0, routes: [{ name: 'Auth', params: { mode: 'login' } }] });
    } catch (error) {
      Alert.alert('Could not reset password', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Choose a new password</Text>
      <AppInput label="New password" value={password} onChangeText={setPassword} secureTextEntry />
      <AppInput label="Confirm password" value={confirmation} onChangeText={setConfirmation} secureTextEntry />
      <AppButton title="Reset password" onPress={submit} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', backgroundColor: colors.white, padding: spacing.lg },
  title: { color: colors.ink, fontSize: 24, fontWeight: '700', marginBottom: 22 },
});
