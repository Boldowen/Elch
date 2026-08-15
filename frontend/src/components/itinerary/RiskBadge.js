import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius } from '../../theme';

const PALETTE = {
  R0: { backgroundColor: '#ECFDF5', color: '#047857' },
  R1: { backgroundColor: '#EFF6FF', color: '#1D4ED8' },
  R2: { backgroundColor: '#FFFBEB', color: '#B45309' },
  R3: { backgroundColor: '#FFF1F2', color: '#BE123C' },
  R4: { backgroundColor: '#450A0A', color: '#FFFFFF' },
};

export default function RiskBadge({ risk = 'R0', label }) {
  const key = String(risk).toUpperCase();
  const palette = PALETTE[key] || PALETTE.R0;
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label ? `${label}: ${key}` : key}
      style={[styles.badge, { backgroundColor: palette.backgroundColor }]}
    >
      <Text style={[styles.text, { color: palette.color }]}>{label ? `${label} ` : ''}{key}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill },
  text: { fontSize: 11, fontWeight: '800' },
});
