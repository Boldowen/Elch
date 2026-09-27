import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../theme';
import RiskBadge from './RiskBadge';

function readableRule(rule) {
  return String(rule || 'Validation').replaceAll('_', ' ').toLowerCase();
}

/** Plan section 7.3 maps a verdict to how the traveler should read the result:
 * an impossible request must not look like one that merely needs adjusting. */
const TONES = {
  FEASIBLE: { style: 'pass', icon: 'checkmark-circle-outline', color: colors.success },
  REPAIRABLE: { style: 'fail', icon: 'construct-outline', color: '#B42318' },
  REQUIRES_EXTERNAL_APPROVAL: { style: 'gated', icon: 'shield-checkmark-outline', color: colors.warning },
  UNSOLVABLE: { style: 'blocked', icon: 'close-circle-outline', color: '#B42318' },
};

export default function ValidationSummary({ result, labels }) {
  if (!result) return null;
  const errors = result.issues.filter((issue) => issue.severity === 'ERROR');
  const warnings = result.issues.filter((issue) => issue.severity !== 'ERROR');
  const summary = result.summary;
  const status = result.feasibility?.status || (result.valid ? 'FEASIBLE' : 'REPAIRABLE');
  const tone = TONES[status] || TONES.REPAIRABLE;
  const heading = labels[`status${status}`] || (result.valid ? labels.passed : labels.needsRepair);

  return (
    <View accessibilityLiveRegion="polite" style={[styles.root, styles[tone.style]]}>
      <View style={styles.headingRow}>
        <Ionicons name={tone.icon} size={22} color={tone.color} />
        <Text style={styles.heading}>{heading}</Text>
        <View style={styles.spacer} />
        <RiskBadge risk={summary.highestRisk} />
      </View>
      <Text style={styles.meta}>
        {summary.days} {labels.days} · {summary.distanceKm} km · {Math.round(summary.travelMinutes / 60)} {labels.travelHours}
      </Text>

      {result.feasibility?.unsolvable && result.feasibility.reasons.length ? (
        <View style={styles.unsolvableBox}>
          <Text style={styles.unsolvableTitle}>{labels.unsolvableTitle}</Text>
          {result.feasibility.reasons.map((reason, index) => (
            <Text key={`${reason.code}-${index}`} style={styles.unsolvableReason}>
              • {reason.message}
            </Text>
          ))}
        </View>
      ) : null}

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
  gated: { backgroundColor: colors.warningSoft, borderColor: '#FDE68A' },
  blocked: { backgroundColor: '#FEF2F2', borderColor: '#B42318' },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heading: { flex: 1, color: colors.ink, fontSize: 16, fontWeight: '800' },
  spacer: { width: 4 },
  meta: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  unsolvableBox: { gap: 4, padding: 10, borderRadius: radius.md, backgroundColor: 'rgba(180,35,24,0.07)' },
  unsolvableTitle: { color: '#B42318', fontSize: 12, fontWeight: '800' },
  unsolvableReason: { color: colors.ink, fontSize: 12, lineHeight: 18 },
  issue: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 8 },
  rule: { fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  error: { color: '#B42318' },
  warning: { color: colors.warning },
  message: { color: colors.ink, fontSize: 12, lineHeight: 18, marginTop: 3 },
  disclaimer: { color: colors.inkSoft, fontSize: 11, lineHeight: 16, marginTop: 2 },
});
