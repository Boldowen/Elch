import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';

export default function StarterPrompts({ prompts = [], onSelect, disabled = false }) {
  if (!prompts.length) return null;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {prompts.map((prompt) => (
        <Pressable
          key={prompt}
          accessibilityRole="button"
          accessibilityLabel={prompt}
          disabled={disabled}
          onPress={() => onSelect?.(prompt)}
          style={({ pressed }) => [
            styles.prompt,
            disabled && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="sparkles-outline" size={16} color={colors.brand} />
          <Text style={styles.text}>{prompt}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingVertical: 2, paddingRight: 18 },
  prompt: {
    width: 210,
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  text: { flex: 1, color: colors.ink, fontSize: 13, lineHeight: 18, fontWeight: '600' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.78 },
});
