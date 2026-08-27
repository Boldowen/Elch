import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminAccessBoundary from '../components/admin/AdminAccessBoundary';
import { AppButton, AppInput, Chip, ScreenHeader, StateBox } from '../components/ui';
import { adminRepository } from '../repositories/adminRepository';
import { apiErrorMessage } from '../services/api';
import { formatDateTime, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const DECISIONS = ['VERIFIED', 'REASSESSMENT_REQUIRED', 'REJECTED'];
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SCORE_REQUIRED = new Set(['ROUTE_COMPETENCY', 'GUIDE_SKILL', 'SAFETY_SCENARIO']);

function ResponseCard({ item, index, t }) {
  const answer = item.responseText || (item.responsePayload ? JSON.stringify(item.responsePayload, null, 2) : '—');
  return (
    <View style={styles.responseCard}>
      <Text style={styles.questionMeta}>{t('blindReview.question')} {index + 1} · {item.question.category} · {item.question.difficulty}</Text>
      <Text style={styles.prompt}>{item.question.prompt}</Text>
      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>{t('blindReview.response')}</Text>
        <Text style={styles.answer}>{answer}</Text>
      </View>
      {item.audioReference ? <Text style={styles.audio}>{t('blindReview.audioReference')}: {item.audioReference}</Text> : null}
    </View>
  );
}

export default function AdminAssessmentReviewScreen({ navigation }) {
  const { t, language } = useT();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState('VERIFIED');
  const [score, setScore] = useState('');
  const [passed, setPassed] = useState(true);
  const [cefr, setCefr] = useState('B1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setItems(await adminRepository.blindAssessmentQueue());
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectAttempt = (attempt) => {
    setSelected(attempt);
    setDecision('VERIFIED');
    setScore('');
    setPassed(true);
    setCefr('B1');
    setNotes('');
    setSaveError(null);
  };

  const requiresScore = useMemo(() => SCORE_REQUIRED.has(selected?.assessmentType), [selected]);

  const submit = () => {
    const parsedScore = score.trim() === '' ? undefined : Number(score);
    if (parsedScore !== undefined && (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 100)) {
      Alert.alert(t('blindReview.invalidScore'), t('blindReview.invalidScoreCopy'));
      return;
    }
    if (decision === 'VERIFIED' && requiresScore && (parsedScore === undefined || !passed)) {
      Alert.alert(t('blindReview.verificationIncomplete'), t('blindReview.verificationIncompleteCopy'));
      return;
    }
    if (decision === 'VERIFIED' && selected.assessmentType === 'LANGUAGE' && !cefr) {
      Alert.alert(t('blindReview.verificationIncomplete'), t('blindReview.languageLevelRequired'));
      return;
    }
    const payload = {
      decision,
      ...(parsedScore === undefined ? {} : { humanScore: parsedScore }),
      humanPassed: decision === 'VERIFIED' ? passed : false,
      ...(selected.assessmentType === 'LANGUAGE' && decision === 'VERIFIED' ? { humanCefr: cefr } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };
    Alert.alert(t('blindReview.confirmTitle'), t('blindReview.confirmCopy'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('blindReview.submit'),
        onPress: async () => {
          setSaving(true);
          setSaveError(null);
          try {
            await adminRepository.reviewAssessment(selected.id, payload);
            setSelected(null);
            await load(true);
          } catch (nextError) {
            setSaveError(apiErrorMessage(nextError));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('blindReview.title')} onBack={selected ? () => setSelected(null) : () => navigation.goBack()} />
      <AdminAccessBoundary>
        {selected ? (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.blindNotice}>
              <Ionicons name="eye-off-outline" size={23} color={colors.brand} />
              <View style={styles.noticeCopy}>
                <Text style={styles.noticeTitle}>{t('blindReview.blindActive')}</Text>
                <Text style={styles.help}>{t('blindReview.blindCopy')}</Text>
              </View>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaTitle}>{selected.assessmentType}</Text>
              <Text style={styles.help}>{selected.routeFamily || selected.language || t('blindReview.general')} · {formatDateTime(selected.submittedAt, language) || '—'}</Text>
              <Text style={styles.identifier}>{selected.id}</Text>
            </View>

            {selected.responses.map((response, index) => (
              <ResponseCard key={response.id || `${selected.id}-${index}`} item={response} index={index} t={t} />
            ))}

            <View style={styles.reviewCard}>
              <Text style={styles.sectionTitle}>{t('blindReview.humanDecision')}</Text>
              <Text style={styles.label}>{t('blindReview.decision')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {DECISIONS.map((value) => <Chip key={value} label={value} active={decision === value} onPress={() => setDecision(value)} />)}
              </ScrollView>
              <AppInput label={t('blindReview.score')} value={score} onChangeText={setScore} keyboardType="decimal-pad" placeholder={requiresScore ? t('blindReview.scoreRequired') : t('blindReview.scoreOptional')} />
              <Text style={styles.label}>{t('blindReview.passed')}</Text>
              <View style={styles.binaryRow}>
                <Chip label={t('common.yes')} active={passed} onPress={() => setPassed(true)} />
                <Chip label={t('common.no')} active={!passed} onPress={() => setPassed(false)} />
              </View>
              {selected.assessmentType === 'LANGUAGE' && decision === 'VERIFIED' ? (
                <>
                  <Text style={styles.label}>{t('blindReview.humanCefr')}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                    {CEFR_LEVELS.map((value) => <Chip key={value} label={value} active={cefr === value} onPress={() => setCefr(value)} />)}
                  </ScrollView>
                </>
              ) : null}
              <AppInput label={t('blindReview.notes')} value={notes} onChangeText={setNotes} multiline autoCapitalize="sentences" />
              {saveError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{saveError}</Text> : null}
              <AppButton title={t('blindReview.submit')} onPress={submit} loading={saving} />
            </View>
          </ScrollView>
        ) : (
          <StateBox loading={loading} error={error} empty={!items.length} emptyText={t('blindReview.empty')}>
            <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}>
              <View style={styles.blindNotice}>
                <Ionicons name="eye-off-outline" size={23} color={colors.brand} />
                <View style={styles.noticeCopy}>
                  <Text style={styles.noticeTitle}>{t('blindReview.blindActive')}</Text>
                  <Text style={styles.help}>{t('blindReview.blindCopy')}</Text>
                </View>
              </View>
              {items.map((attempt) => (
                <Pressable key={attempt.id} accessibilityRole="button" accessibilityLabel={`${attempt.assessmentType}, ${attempt.responses.length} responses`} onPress={() => selectAttempt(attempt)} style={({ pressed }) => [styles.queueCard, pressed && styles.pressed]}>
                  <View style={styles.queueCopy}>
                    <Text style={styles.queueTitle}>{attempt.assessmentType}</Text>
                    <Text style={styles.help}>{attempt.routeFamily || attempt.language || t('blindReview.general')} · {attempt.responses.length} {t('blindReview.responses')}</Text>
                    <Text style={styles.help}>{formatDateTime(attempt.submittedAt, language) || '—'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} />
                </Pressable>
              ))}
            </ScrollView>
          </StateBox>
        )}
      </AdminAccessBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: spacing.md },
  list: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: 9 },
  blindNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderWidth: 1, borderColor: '#FECDD3', borderRadius: radius.lg, backgroundColor: '#FFF1F2' },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: colors.ink, fontWeight: '800' },
  help: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  queueCard: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  queueCopy: { flex: 1 },
  queueTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  metaCard: { padding: 15, borderRadius: radius.lg, backgroundColor: colors.ink },
  metaTitle: { color: colors.white, fontSize: 18, fontWeight: '800' },
  identifier: { color: 'rgba(255,255,255,0.52)', fontSize: 10, marginTop: 6 },
  responseCard: { padding: 15, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  questionMeta: { color: colors.brand, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  prompt: { color: colors.ink, fontSize: 15, lineHeight: 22, fontWeight: '700', marginTop: 7 },
  answerBox: { padding: 12, borderRadius: radius.md, backgroundColor: colors.secondary, marginTop: 12 },
  answerLabel: { color: colors.inkSoft, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  answer: { color: colors.ink, lineHeight: 21, marginTop: 5 },
  audio: { color: colors.inkSoft, fontSize: 11, marginTop: 9 },
  reviewCard: { padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, backgroundColor: colors.white },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 10 },
  label: { color: colors.ink, fontSize: 13, fontWeight: '700', marginBottom: 6, marginTop: 8 },
  chips: { paddingVertical: 3, paddingRight: 8, marginBottom: 12 },
  binaryRow: { flexDirection: 'row', marginBottom: 12 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, marginBottom: 12 },
});
