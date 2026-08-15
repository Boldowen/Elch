import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';

function canOpenSource(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

export default function SourceList({ sources = [], title = 'Sources', verifiedLabel = 'Verified' }) {
  const items = Array.isArray(sources) ? sources.filter(Boolean) : [];
  if (!items.length) return null;

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>{title}</Text>
      {items.map((source, index) => {
        const key = source.sourceId || source.id || `${source.title}-${index}`;
        const openable = canOpenSource(source.url);
        return (
          <Pressable
            key={key}
            disabled={!openable}
            accessibilityRole={openable ? 'link' : 'text'}
            accessibilityLabel={source.title || title}
            onPress={() => Linking.openURL(source.url)}
            style={({ pressed }) => [styles.source, pressed && styles.pressed]}
          >
            <Ionicons name="document-text-outline" size={16} color={colors.inkSoft} />
            <View style={styles.copy}>
              <Text style={styles.title}>{source.title || 'Source'}</Text>
              <Text style={styles.meta}>
                {source.authorityTier ? `Tier ${source.authorityTier}` : verifiedLabel}
                {source.lastVerifiedAt ? ` · ${verifiedLabel} ${source.lastVerifiedAt.slice(0, 10)}` : ''}
              </Text>
            </View>
            {openable ? <Ionicons name="open-outline" size={15} color={colors.brand} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 7, marginTop: 10 },
  heading: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  source: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
  },
  copy: { flex: 1 },
  title: { color: colors.ink, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  meta: { color: colors.inkSoft, fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.72 },
});
