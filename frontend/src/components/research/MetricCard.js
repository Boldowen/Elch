import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';

export default function MetricCard({ icon, label, value, detail, tone = 'brand', style }) {
  const iconColor = tone === 'warning' ? colors.warning : tone === 'success' ? colors.success : colors.brand;
  const backgroundColor = tone === 'warning' ? colors.warningSoft : tone === 'success' ? colors.successSoft : '#FFF1F2';
  return (
    <View accessibilityRole="summary" style={[styles.root, style]}>
      <View style={[styles.icon, { backgroundColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { minWidth: 145, flexGrow: 1, flexBasis: 155, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  icon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  value: { color: colors.ink, fontSize: 23, fontWeight: '800' },
  label: { color: colors.ink, fontSize: 12, fontWeight: '700', marginTop: 3 },
  detail: { color: colors.inkSoft, fontSize: 10, lineHeight: 15, marginTop: 4 },
});
