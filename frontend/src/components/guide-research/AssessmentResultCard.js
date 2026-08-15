import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../ui';
import { colors, radius } from '../../theme';
import VerificationBadge from './VerificationBadge';

function valueOrDash(value, suffix = '') {
  return value === null || value === undefined ? '—' : `${Math.round(Number(value) * 10) / 10}${suffix}`;
}

function statusBadgeType(status) {
  if (status === 'HUMAN_REVIEWED') return 'human';
  if (status === 'AI_SCORED') return 'ai';
  return 'neutral';
}

export default function AssessmentResultCard({
  attempt,
  languageEstimate,
  labels,
  evaluating,
  transcriptConsent,
  onToggleConsent,
  onEvaluateLanguage,
  onDone,
}) {
  const isLanguage = attempt.assessmentType === 'LANGUAGE';
  const isFirstAid = attempt.assessmentType === 'FIRST_AID_THEORY';
  const canEvaluateLanguage = isLanguage && attempt.status === 'SUBMITTED' && !languageEstimate && !attempt.aiEstimatedCefr;
  const confidence = languageEstimate?.confidence ?? attempt.aiConfidence;
  const confidencePercent = confidence === null || confidence === undefined
    ? null
    : confidence <= 1 ? confidence * 100 : confidence;
  const outcome = attempt.status === 'HUMAN_REVIEWED' && attempt.humanPassed !== null
    ? attempt.humanPassed
    : attempt.passed;

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Ionicons name="ribbon-outline" size={34} color={colors.brand} />
        <Text style={styles.title}>{labels.resultTitle}</Text>
        <Text style={styles.type}>{labels.assessmentType(attempt.assessmentType)}</Text>
        <VerificationBadge type={statusBadgeType(attempt.status)} label={labels.status(attempt.status)} />
      </View>

      <View style={styles.prescreenNotice}>
        <Ionicons name="flask-outline" size={19} color="#2563EB" />
        <Text style={styles.noticeText}>{labels.resultPrescreenOnly}</Text>
      </View>

      {isLanguage ? (
        <View style={styles.languageNotice}>
          <VerificationBadge type="ai" label={labels.aiLanguageEstimate} />
          <Text style={styles.noticeText}>{labels.languageNotOfficial}</Text>
        </View>
      ) : null}

      {isFirstAid ? (
        <View style={styles.firstAidNotice}>
          <Ionicons name="medkit-outline" size={19} color="#B42318" />
          <Text style={styles.noticeText}>{labels.firstAidTheoryOnly}</Text>
        </View>
      ) : null}

      <View style={styles.metrics}>
        <ResultMetric label={labels.platformScore} value={valueOrDash(attempt.score)} />
        <ResultMetric label={labels.aiScore} value={valueOrDash(attempt.aiScore)} />
        <ResultMetric label={labels.humanScore} value={valueOrDash(attempt.humanScore)} />
      </View>

      {outcome !== null ? (
        <Text style={[styles.outcome, outcome ? styles.pass : styles.fail]}>
          {outcome ? labels.passed : labels.notPassed}
        </Text>
      ) : (
        <Text style={styles.pending}>{labels.pendingReview}</Text>
      )}

      {languageEstimate || attempt.aiEstimatedCefr ? (
        <View style={styles.languageResult}>
          <Text style={styles.languageLevel}>{languageEstimate?.estimatedCefr || attempt.aiEstimatedCefr}</Text>
          <Text style={styles.languageLabel}>{labels.aiLanguageEstimate}</Text>
          <Text style={styles.confidence}>
            {labels.confidence}: {valueOrDash(confidencePercent, '%')}
          </Text>
          {languageEstimate ? (
            <View style={styles.dimensionGrid}>
              {Object.entries(languageEstimate.scores).map(([dimension, score]) => (
                <ResultMetric key={dimension} label={labels.dimension(dimension)} value={valueOrDash(score)} compact />
              ))}
            </View>
          ) : null}
          {languageEstimate?.feedback.map((feedback, index) => (
            <Text key={`${feedback}-${index}`} style={styles.feedback}>• {feedback}</Text>
          ))}
          {languageEstimate?.unsafeActions.map((action, index) => (
            <Text key={`${action}-${index}`} style={styles.unsafe}>• {action}</Text>
          ))}
          <Text style={styles.humanRequired}>{labels.humanLanguageReview}</Text>
        </View>
      ) : null}

      {isLanguage && attempt.humanCefr ? (
        <View style={styles.humanResult}>
          <VerificationBadge type="human" label={labels.humanVerifiedCefr} />
          <Text style={styles.humanLevel}>{attempt.humanCefr}</Text>
        </View>
      ) : null}

      {canEvaluateLanguage ? (
        <>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel={labels.transcriptConsent}
            accessibilityState={{ checked: Boolean(transcriptConsent), disabled: Boolean(evaluating) }}
            disabled={evaluating}
            onPress={onToggleConsent}
            style={({ pressed }) => [styles.consent, evaluating && styles.disabled, pressed && styles.pressed]}
          >
            <Ionicons
              name={transcriptConsent ? 'checkbox' : 'square-outline'}
              size={22}
              color={transcriptConsent ? colors.brand : colors.inkSoft}
            />
            <Text style={styles.consentText}>{labels.transcriptConsent}</Text>
          </Pressable>
          <AppButton
            title={labels.evaluateLanguage}
            onPress={onEvaluateLanguage}
            loading={evaluating}
            disabled={!transcriptConsent}
          />
        </>
      ) : null}
      <AppButton title={labels.backToDashboard} variant="secondary" onPress={onDone} />
    </View>
  );
}

function ResultMetric({ label, value, compact = false }) {
  return (
    <View style={[styles.metric, compact && styles.metricCompact]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 14, padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  hero: { alignItems: 'center', gap: 7, paddingVertical: 8 },
  title: { color: colors.ink, fontSize: 23, fontWeight: '800', textAlign: 'center' },
  type: { color: colors.inkSoft, fontSize: 13, textAlign: 'center' },
  languageNotice: { gap: 7, padding: 12, borderRadius: radius.md, backgroundColor: '#FFF7ED' },
  prescreenNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' },
  firstAidNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: radius.md, backgroundColor: '#FEF2F2' },
  noticeText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metric: { minWidth: 95, flexGrow: 1, flexBasis: 100, padding: 12, borderRadius: radius.md, backgroundColor: colors.secondary },
  metricCompact: { minWidth: 105 },
  metricValue: { color: colors.ink, fontSize: 19, fontWeight: '800' },
  metricLabel: { color: colors.inkSoft, fontSize: 10, lineHeight: 14, marginTop: 2 },
  outcome: { padding: 11, borderRadius: radius.md, textAlign: 'center', fontSize: 13, fontWeight: '800', overflow: 'hidden' },
  pass: { color: colors.success, backgroundColor: colors.successSoft },
  fail: { color: '#B42318', backgroundColor: '#FEF2F2' },
  pending: { color: colors.warning, backgroundColor: colors.warningSoft, padding: 11, borderRadius: radius.md, textAlign: 'center', fontSize: 12, lineHeight: 18, overflow: 'hidden' },
  languageResult: { alignItems: 'center', gap: 8, padding: 14, borderWidth: 1, borderColor: '#FED7AA', borderRadius: radius.lg, backgroundColor: '#FFFBEB' },
  languageLevel: { color: colors.ink, fontSize: 36, fontWeight: '900' },
  languageLabel: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  confidence: { color: colors.inkSoft, fontSize: 11 },
  dimensionGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  feedback: { alignSelf: 'stretch', color: colors.ink, fontSize: 12, lineHeight: 18 },
  unsafe: { alignSelf: 'stretch', color: '#B42318', fontSize: 12, lineHeight: 18 },
  humanRequired: { color: colors.warning, fontSize: 11, lineHeight: 16, textAlign: 'center', fontWeight: '700' },
  humanResult: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 13, borderWidth: 1, borderColor: '#BBF7D0', borderRadius: radius.lg, backgroundColor: '#F0FDF4' },
  humanLevel: { color: colors.ink, fontSize: 24, fontWeight: '900' },
  consent: { minHeight: 48, flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 11, borderRadius: radius.md, backgroundColor: colors.secondary },
  consentText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.75 },
});
