import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { authRepository } from '../repositories/authRepository';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authRepository.forgotPassword(email.trim());
      Alert.alert('Check your email', 'If an account exists, a password reset link has been sent.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Could not request reset', apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScreenHeader title="Forgot password" onBack={() => navigation.goBack()} />
      <Text style={styles.text}>Enter your account email. The reset link expires in 30 minutes.</Text>
      <AppInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <AppButton title="Send reset link" onPress={submit} loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white, padding: spacing.lg },
  text: { color: colors.inkSoft, lineHeight: 21, marginBottom: 18 },
});
