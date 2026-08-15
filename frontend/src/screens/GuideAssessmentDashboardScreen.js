import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, ScreenHeader, StateBox } from '../components/ui';
import AssessmentModuleCard from '../components/guide-research/AssessmentModuleCard';
import VerificationBadge from '../components/guide-research/VerificationBadge';
import { guideAssessmentsRepository } from '../repositories/guideAssessmentsRepository';
import { apiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const ROUTE_FAMILIES = ['CENTRAL_HERITAGE', 'GOBI', 'KHUVSGUL', 'WESTERN_ALTAI'];

function readable(value) {
  const text = String(value || '').replaceAll('_', ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function verificationType(status) {
  if (status === 'HUMAN_REVIEWED' || status === 'HUMAN_VERIFIED') return 'human';
  if (status === 'AI_SCORED' || status === 'AI_PRE_SCREENED') return 'ai';
  if (status === 'DOCUMENT_VERIFIED') return 'document';
  return 'neutral';
}

export default function GuideAssessmentDashboardScreen({ navigation }) {
  const { session } = useAuth();
  const { t, language } = useT();
  const isGuide = Boolean(session?.user?.roles?.includes('GUIDE'));
  const [dashboard, setDashboard] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [routeFamily, setRouteFamily] = useState('CENTRAL_HERITAGE');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(null);
  const mounted = useRef(true);
  const requestId = useRef(0);
  const startLock = useRef(false);

  const typeLabels = useMemo(() => ({
    LANGUAGE: t('assessment.language'),
    GENERAL_KNOWLEDGE: t('assessment.knowledge'),
    GUIDE_SKILL: t('assessment.guideSkill'),
    ROUTE_COMPETENCY: t('assessment.route'),
    SAFETY_SCENARIO: t('assessment.safety'),
    FIRST_AID_THEORY: t('assessment.firstAid'),
  }), [t]);

  const statusLabels = useMemo(() => ({
    NOT_STARTED: t('assessment.statusNotStarted'),
    IN_PROGRESS: t('assessment.statusInProgress'),
    SUBMITTED: t('assessment.statusSubmitted'),
    AI_SCORED: t('assessment.statusAiScored'),
    HUMAN_REVIEWED: t('assessment.statusHumanReviewed'),
    COMPLETED: t('assessment.statusCompleted'),
    CANCELLED: t('assessment.statusCancelled'),
  }), [t]);

  const routeLabels = useMemo(() => ({
    CENTRAL_HERITAGE: t('assessment.routeCentral'),
    GOBI: t('assessment.routeGobi'),
    KHUVSGUL: t('assessment.routeKhuvsgul'),
    WESTERN_ALTAI: t('assessment.routeAltai'),
  }), [t]);

  const load = useCallback(async (showInitial = false) => {
    if (!isGuide) {
      setLoading(false);
      return;
    }
    const currentRequest = ++requestId.current;
    if (showInitial) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const [nextDashboard, nextAttempts] = await Promise.all([
        guideAssessmentsRepository.dashboard(),
        guideAssessmentsRepository.attempts(),
      ]);
      if (!mounted.current || currentRequest !== requestId.current) return;
      setDashboard(nextDashboard);
      setAttempts(nextAttempts);
    } catch (nextError) {
      if (mounted.current && currentRequest === requestId.current) setError(apiErrorMessage(nextError));
    } finally {
      if (mounted.current && currentRequest === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [isGuide]);

  useEffect(() => {
    mounted.current = true;
    load(true);
    const unsubscribe = navigation.addListener('focus', () => load(false));
    return () => {
      mounted.current = false;
      requestId.current += 1;
      unsubscribe();
    };
  }, [load, navigation]);

  const latestFor = useCallback((assessmentType, family) => attempts.find((attempt) =>
    attempt.assessmentType === assessmentType &&
    (assessmentType !== 'ROUTE_COMPETENCY' || attempt.routeFamily === family),
  ), [attempts]);

  const modules = useMemo(() => [
    { key: 'language', assessmentType: 'LANGUAGE', icon: 'chatbubbles-outline', title: t('assessment.language'), description: t('assessment.languageCopy') },
    { key: 'knowledge', assessmentType: 'GENERAL_KNOWLEDGE', icon: 'library-outline', title: t('assessment.knowledge'), description: t('assessment.knowledgeCopy') },
    { key: 'guide-skill', assessmentType: 'GUIDE_SKILL', icon: 'people-outline', title: t('assessment.guideSkill'), description: t('assessment.guideSkillCopy') },
    { key: 'route', assessmentType: 'ROUTE_COMPETENCY', routeFamily, icon: 'map-outline', title: t('assessment.route'), description: `${t('assessment.routeCopy')} · ${routeLabels[routeFamily]}` },
    { key: 'safety', assessmentType: 'SAFETY_SCENARIO', icon: 'shield-checkmark-outline', title: t('assessment.safety'), description: t('assessment.safetyCopy') },
    { key: 'first-aid', assessmentType: 'FIRST_AID_THEORY', icon: 'medkit-outline', title: t('assessment.firstAid'), description: t('assessment.firstAidCopy') },
  ], [routeFamily, routeLabels, t]);

  const openModule = async (module) => {
    if (startLock.current) return;
    const existing = latestFor(module.assessmentType, module.routeFamily);
    if (existing?.status === 'IN_PROGRESS') {
      navigation.navigate('AssessmentSession', { attemptId: existing.id });
      return;
    }
    startLock.current = true;
    setStarting(module.key);
    setError(null);
    try {
      const attempt = await guideAssessmentsRepository.start({
        assessmentType: module.assessmentType,
        ...(module.routeFamily ? { routeFamily: module.routeFamily } : {}),
        language: 'en',
      });
      if (mounted.current) navigation.navigate('AssessmentSession', { attemptId: attempt.id });
    } catch (nextError) {
      if (mounted.current) setError(apiErrorMessage(nextError));
    } finally {
      startLock.current = false;
      if (mounted.current) setStarting(null);
    }
  };

  const refreshAction = isGuide ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('assessment.refresh')}
      disabled={loading || refreshing}
      onPress={() => load(false)}
      hitSlop={10}
      style={styles.refresh}
    >
      <Ionicons name="refresh" size={20} color={colors.ink} />
    </Pressable>
  ) : null;

  if (!isGuide) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScreenHeader title={t('assessment.title')} onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={34} color={colors.inkSoft} />
          <Text style={styles.centerTitle}>{t('assessment.profileRequired')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('assessment.title')} onBack={() => navigation.goBack()} right={refreshAction} />
      <StateBox loading={loading} error={error && !dashboard} empty={!dashboard} emptyText={t('assessment.profileRequired')}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>{t('assessment.researchPrescreen')}</Text>
            <Text style={styles.title}>{t('assessment.dashboard')}</Text>
            <Text style={styles.copy}>{dashboard?.label || t('assessment.disclaimer')}</Text>
            <View style={styles.badges}>
              <VerificationBadge type="document" label={t('assessment.documentVerified')} />
              <VerificationBadge type="ai" label={t('assessment.aiPrescreened')} />
              <VerificationBadge type="human" label={t('assessment.humanVerified')} />
            </View>
            <Text style={styles.badgeNote}>{t('assessment.badgesDifferent')}</Text>
          </View>

          {error ? <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text> : null}

          <View style={styles.languageNote}>
            <Ionicons name="language-outline" size={19} color="#2563EB" />
            <Text style={styles.languageText}>{t('assessment.currentQuestionLanguage')}</Text>
          </View>

          <Text style={styles.section}>{t('assessment.routeSelection')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeRow}>
            {ROUTE_FAMILIES.map((family) => (
              <Chip key={family} label={routeLabels[family]} active={routeFamily === family} onPress={() => setRouteFamily(family)} />
            ))}
          </ScrollView>

          <Text style={styles.section}>{t('assessment.modules')}</Text>
          <View style={styles.modules}>
            {modules.map((module) => {
              const latest = latestFor(module.assessmentType, module.routeFamily);
              const status = latest?.status || 'NOT_STARTED';
              return (
                <AssessmentModuleCard
                  key={module.key}
                  icon={module.icon}
                  title={module.title}
                  description={module.description}
                  status={statusLabels[status] || readable(status)}
                  statusType={verificationType(status)}
                  loading={starting === module.key}
                  disabled={Boolean(starting && starting !== module.key)}
                  actionLabel={status === 'IN_PROGRESS' ? t('assessment.resume') : t('assessment.start')}
                  onPress={() => openModule(module)}
                />
              );
            })}
          </View>

          <Text style={styles.section}>{t('assessment.currentEvidence')}</Text>
          <View style={styles.evidenceGrid}>
            <View style={styles.evidenceCard}>
              <Text style={styles.evidenceTitle}>{t('assessment.aiLanguageEstimate')}</Text>
              <Text style={styles.evidenceValue}>{dashboard?.languageEstimate?.aiEstimatedCefr || '—'}</Text>
              <Text style={styles.evidenceCopy}>{t('assessment.languageNotOfficial')}</Text>
              {dashboard?.languageEstimate?.humanVerifiedCefr ? (
                <Text style={styles.evidenceCopy}>{t('assessment.humanVerifiedCefr')}: {dashboard.languageEstimate.humanVerifiedCefr}</Text>
              ) : null}
            </View>
            <View style={styles.evidenceCard}>
              <Text style={styles.evidenceTitle}>{t('assessment.route')}</Text>
              <Text style={styles.evidenceValue}>{dashboard?.routeCompetencies?.length || 0}</Text>
              <Text style={styles.evidenceCopy}>{t('assessment.routeCompetenciesRecorded')}</Text>
            </View>
            <View style={styles.evidenceCard}>
              <Text style={styles.evidenceTitle}>{t('assessment.firstAid')}</Text>
              <Text style={styles.evidenceValue}>{dashboard?.firstAid?.theoryScore ?? '—'}</Text>
              <Text style={styles.evidenceCopy}>
                {t('assessment.practicalStatus')}: {dashboard?.firstAid?.practicalVerificationStatus === 'NOT_ASSESSED' || !dashboard?.firstAid
                  ? t('assessment.notAssessed')
                  : readable(dashboard.firstAid.practicalVerificationStatus)}
              </Text>
            </View>
          </View>

          <View style={styles.history}>
            <Text style={styles.section}>{t('assessment.history')}</Text>
            {!attempts.length ? (
              <Text style={styles.empty}>{t('assessment.noAttempts')}</Text>
            ) : attempts.map((attempt) => (
              <Pressable
                key={attempt.id}
                accessibilityRole="button"
                accessibilityLabel={`${typeLabels[attempt.assessmentType] || readable(attempt.assessmentType)}, ${statusLabels[attempt.status] || readable(attempt.status)}`}
                onPress={() => navigation.navigate('AssessmentSession', { attemptId: attempt.id })}
                style={({ pressed }) => [styles.attempt, pressed && styles.pressed]}
              >
                <View style={styles.attemptCopy}>
                  <Text style={styles.attemptTitle}>{typeLabels[attempt.assessmentType] || readable(attempt.assessmentType)}</Text>
                  <Text style={styles.attemptMeta}>
                    {attempt.routeFamily ? `${routeLabels[attempt.routeFamily] || readable(attempt.routeFamily)} · ` : ''}
                    {formatDateTime(attempt.createdAt, language)}
                  </Text>
                </View>
                <VerificationBadge type={verificationType(attempt.status)} label={statusLabels[attempt.status] || readable(attempt.status)} />
                <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} />
              </Pressable>
            ))}
          </View>

          <View style={styles.consent}>
            <Text style={styles.consentTitle}>{t('assessment.consentTitle')}</Text>
            <Text style={styles.consentCopy}>{t('assessment.consentCopy')}</Text>
          </View>
        </ScrollView>
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 48, gap: 16 },
  refresh: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hero: { gap: 9, padding: 16, borderRadius: radius.lg, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { color: colors.ink, fontSize: 24, fontWeight: '800' },
  copy: { color: colors.inkSoft, fontSize: 13, lineHeight: 20 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  badgeNote: { color: colors.inkSoft, fontSize: 11, lineHeight: 16 },
  languageNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' },
  languageText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  section: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  routeRow: { paddingRight: 18 },
  modules: { gap: 10 },
  evidenceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  evidenceCard: { minWidth: 190, flexGrow: 1, flexBasis: 220, gap: 5, padding: 14, borderRadius: radius.lg, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  evidenceTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  evidenceValue: { color: colors.ink, fontSize: 25, fontWeight: '900' },
  evidenceCopy: { color: colors.inkSoft, fontSize: 11, lineHeight: 16 },
  history: { gap: 8, marginTop: 6 },
  empty: { color: colors.inkSoft, fontSize: 13, padding: 14, borderRadius: radius.md, backgroundColor: colors.secondary },
  attempt: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  attemptCopy: { flex: 1 },
  attemptTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  attemptMeta: { color: colors.inkSoft, fontSize: 11, marginTop: 3 },
  consent: { gap: 5, padding: 14, borderRadius: radius.md, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' },
  consentTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  consentCopy: { color: colors.ink, fontSize: 12, lineHeight: 18 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, padding: 10, borderRadius: radius.sm, backgroundColor: '#FEF2F2', overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32, backgroundColor: colors.white },
  centerTitle: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.75 },
});
