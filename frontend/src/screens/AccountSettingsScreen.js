import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function AccountSettingsScreen({ navigation }) {
  const { session, updateProfile, logout } = useAuth();
  const [name, setName] = useState(session?.user?.name || '');
  const [phone, setPhone] = useState(session?.user?.phone || '');
  const [saving, setSaving] = useState(false);

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
        <AppButton title="Save" onPress={save} loading={saving} />
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
