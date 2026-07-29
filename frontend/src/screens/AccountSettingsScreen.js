import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';
import { authRepository } from '../repositories/authRepository';

export default function AccountSettingsScreen({ navigation }) {
  const { session, updateProfile, logout } = useAuth();
  const [name, setName] = useState(session?.user?.name || '');
  const [phone, setPhone] = useState(session?.user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const save = async () => {
    if (name.trim().length < 2) {
      Alert.alert('Check your name', 'Name must contain at least two characters.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      Alert.alert('Saved', 'Your account was updated.');
    } catch (e) {
      Alert.alert('Could not save', apiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Account settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <AppInput label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
        <AppInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <AppInput label="Email" value={session?.user?.email || ''} editable={false} />
        {!session?.user?.emailVerifiedAt ? (
          <AppButton
            title="Resend verification email"
            variant="ghost"
            loading={resending}
            onPress={async () => {
              setResending(true);
              try {
                await authRepository.resendVerification(session?.user?.email || '');
                Alert.alert('Check your email', 'If the address can be verified, a new link has been sent.');
              } catch (e) {
                Alert.alert('Could not resend', apiErrorMessage(e));
              } finally {
                setResending(false);
              }
            }}
          />
        ) : null}
        <AppButton title="Save" onPress={save} loading={saving} />
        <AppInput label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry />
        <AppInput label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        <AppButton
          title="Change password"
          variant="ghost"
          loading={changingPassword}
          onPress={async () => {
            if (!currentPassword || newPassword.length < 8) {
              Alert.alert('Check password', 'Enter your current password and a new password of at least 8 characters.');
              return;
            }
            setChangingPassword(true);
            try {
              await authRepository.changePassword(currentPassword, newPassword);
              await logout();
              Alert.alert('Password changed', 'Please sign in again. Other devices have also been signed out.');
              navigation.reset({ index: 0, routes: [{ name: 'Auth', params: { mode: 'login' } }] });
            } catch (e) {
              Alert.alert('Could not change password', apiErrorMessage(e));
            } finally {
              setChangingPassword(false);
            }
          }}
        />
        <AppButton
          title="Log out"
          variant="ghost"
          onPress={async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
          }}
          style={{ marginTop: 12 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg },
});
