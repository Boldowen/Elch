import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../../theme';

const TYPES = {
  document: { backgroundColor: '#EFF6FF', color: '#1D4ED8', icon: 'document-text-outline' },
  ai: { backgroundColor: '#FFF7ED', color: '#C2410C', icon: 'sparkles-outline' },
  human: { backgroundColor: '#ECFDF5', color: '#047857', icon: 'person-circle-outline' },
  neutral: { backgroundColor: '#F3F4F6', color: '#4B5563', icon: 'ellipse-outline' },
};

export default function VerificationBadge({ type = 'neutral', label }) {
  const palette = TYPES[type] || TYPES.neutral;
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[styles.root, { backgroundColor: palette.backgroundColor }]}
    >
      <Ionicons name={palette.icon} size={14} color={palette.color} />
      <Text style={[styles.text, { color: palette.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill },
  text: { fontSize: 11, fontWeight: '800' },
});
