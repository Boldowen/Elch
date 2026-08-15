import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import RiskBadge from '../itinerary/RiskBadge';

export default function ToolResultCard({ route, tools = [], title = 'Verified route context' }) {
  if (!route && !tools.length) return null;
  return (
    <View style={styles.root}>
      <View style={styles.headingRow}>
        <Ionicons name="git-network-outline" size={18} color={colors.brand} />
        <Text style={styles.heading}>{title}</Text>
      </View>
      {route ? (
        <View style={styles.routeRow}>
          <View style={styles.routeCopy}>
            <Text style={styles.routeName}>{route.name}</Text>
            {route.recommendedDays ? (
              <Text style={styles.meta}>
                {route.recommendedDays.min}–{route.recommendedDays.max} days
              </Text>
            ) : null}
          </View>
          <RiskBadge risk={route.riskClass} />
        </View>
      ) : null}
      {tools.length ? (
        <View style={styles.tools}>
          {tools.map((tool) => (
            <Text key={tool} style={styles.tool}>{String(tool).replaceAll('_', ' ')}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 9,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
  },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  heading: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  routeCopy: { flex: 1 },
  routeName: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  meta: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  tools: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tool: {
    color: colors.inkSoft,
    fontSize: 10,
    textTransform: 'lowercase',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
  },
});
