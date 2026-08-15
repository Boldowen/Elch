import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import VerificationBadge from './VerificationBadge';

export default function AssessmentModuleCard({ icon, title, description, status, statusType = 'neutral', onPress, disabled, loading, actionLabel }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${status}`}
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.root, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        {loading ? <ActivityIndicator size="small" color={colors.brand} /> : <Ionicons name={icon} size={21} color={colors.brand} />}
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <VerificationBadge type={statusType} label={status} />
        </View>
        <Text style={styles.description}>{description}</Text>
        {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
      </View>
      {!disabled ? <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  copy: { flex: 1, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
  title: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  description: { color: colors.inkSoft, fontSize: 12, lineHeight: 18 },
  action: { color: colors.brand, fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.72 },
  pressed: { opacity: 0.78 },
});
