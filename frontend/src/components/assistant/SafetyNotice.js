import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';

const TONES = {
  warning: {
    backgroundColor: colors.warningSoft,
    borderColor: '#FDE68A',
    icon: 'warning-outline',
    iconColor: colors.warning,
  },
  danger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    icon: 'alert-circle-outline',
    iconColor: '#B42318',
  },
  info: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    icon: 'information-circle-outline',
    iconColor: '#2563EB',
  },
};

export default function SafetyNotice({ title, messages = [], tone = 'warning' }) {
  const visibleMessages = (Array.isArray(messages) ? messages : [messages]).filter(Boolean);
  if (!title && !visibleMessages.length) return null;
  const palette = TONES[tone] || TONES.warning;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.root,
        { backgroundColor: palette.backgroundColor, borderColor: palette.borderColor },
      ]}
    >
      <Ionicons name={palette.icon} size={19} color={palette.iconColor} />
      <View style={styles.copy}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {visibleMessages.map((message, index) => (
          <Text key={`${message}-${index}`} style={styles.message}>
            {visibleMessages.length > 1 ? '• ' : ''}{message}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  copy: { flex: 1, gap: 3 },
  title: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  message: { color: colors.ink, fontSize: 12, lineHeight: 18 },
});
