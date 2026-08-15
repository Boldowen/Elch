import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import RiskBadge from './RiskBadge';

function readableRule(rule) {
  return String(rule || 'Validation').replaceAll('_', ' ').toLowerCase();
}

export default function ValidationSummary({ result, labels }) {
  if (!result) return null;
  const errors = result.issues.filter((issue) => issue.severity === 'ERROR');
  const warnings = result.issues.filter((issue) => issue.severity !== 'ERROR');
  const summary = result.summary;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.root, result.valid ? styles.pass : styles.fail]}
    >
      <View style={styles.headingRow}>
        <Ionicons
          name={result.valid ? 'checkmark-circle-outline' : 'construct-outline'}
          size={22}
          color={result.valid ? colors.success : '#B42318'}
        />
        <Text style={styles.heading}>{result.valid ? labels.passed : labels.needsRepair}</Text>
        <View style={styles.spacer} />
        <RiskBadge risk={summary.highestRisk} />
      </View>
      <Text style={styles.meta}>
        {summary.days} {labels.days} · {summary.distanceKm} km · {Math.round(summary.travelMinutes / 60)} {labels.travelHours}
      </Text>
      {[...errors, ...warnings].map((issue, index) => (
        <View key={`${issue.rule}-${index}`} style={styles.issue}>
          <Text style={[styles.rule, issue.severity === 'ERROR' ? styles.error : styles.warning]}>
            {issue.severity === 'ERROR' ? labels.blocking : labels.warning} · {readableRule(issue.rule)}
          </Text>
          <Text style={styles.message}>{issue.message}</Text>
        </View>
      ))}
      {result.disclaimer ? <Text style={styles.disclaimer}>{result.disclaimer}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 14, borderRadius: radius.lg, borderWidth: 1, gap: 8 },
  pass: { backgroundColor: colors.successSoft, borderColor: '#A7F3D0' },
  fail: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heading: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  spacer: { flex: 1 },
  meta: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  issue: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 8 },
  rule: { fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  error: { color: '#B42318' },
  warning: { color: colors.warning },
  message: { color: colors.ink, fontSize: 12, lineHeight: 18, marginTop: 3 },
  disclaimer: { color: colors.inkSoft, fontSize: 11, lineHeight: 16, marginTop: 2 },
});
