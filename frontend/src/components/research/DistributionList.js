import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';

function readableLabel(value) {
  const text = String(value || 'Unknown').replaceAll('_', ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function DistributionList({ title, items = [], emptyText, valueSuffix = '' }) {
  const values = Array.isArray(items) ? items : [];
  const maximum = Math.max(1, ...values.map((item) => Number(item.count) || 0));
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {!values.length ? <Text style={styles.empty}>{emptyText}</Text> : values.map((item, index) => {
        const value = Number(item.count) || 0;
        const width = `${Math.max(2, Math.min(100, value / maximum * 100))}%`;
        return (
          <View key={`${item.label}-${index}`} style={styles.item}>
            <View style={styles.labelRow}>
              <Text style={styles.label} numberOfLines={1}>{readableLabel(item.label)}</Text>
              <Text style={styles.count}>{value}{valueSuffix}</Text>
            </View>
            <View style={styles.track}><View style={[styles.fill, { width }]} /></View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { minWidth: 270, flexGrow: 1, flexBasis: 320, gap: 11, padding: 15, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  title: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  empty: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, paddingVertical: 8 },
  item: { gap: 5 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { flex: 1, color: colors.ink, fontSize: 12, fontWeight: '600' },
  count: { color: colors.inkSoft, fontSize: 11, fontWeight: '700' },
  track: { height: 7, overflow: 'hidden', borderRadius: radius.pill, backgroundColor: colors.secondary },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.brand },
});
