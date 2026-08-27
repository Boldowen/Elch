import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useT } from '../../localization';
import { colors, spacing } from '../../theme';

export default function AdminAccessBoundary({ children }) {
  const { session } = useAuth();
  const { t } = useT();
  const isAdmin = Boolean(session?.user?.roles?.includes('ADMIN'));

  if (isAdmin) return children;

  return (
    <View style={styles.root} accessibilityLiveRegion="assertive">
      <Ionicons name="lock-closed-outline" size={38} color={colors.inkSoft} />
      <Text style={styles.title}>{t('admin.restricted')}</Text>
      <Text style={styles.copy}>{t('admin.restrictedCopy')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xxl,
    backgroundColor: colors.white,
  },
  title: { color: colors.ink, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  copy: { color: colors.inkSoft, lineHeight: 20, textAlign: 'center', maxWidth: 480 },
});
