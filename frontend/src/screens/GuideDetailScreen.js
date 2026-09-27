import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, ScreenHeader, StateBox } from '../components/ui';
import VerificationBadge from '../components/guide-research/VerificationBadge';
import { guidesRepository } from '../repositories/guidesRepository';
import { conversationsRepository } from '../repositories/conversationsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { formatDateTime, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function readable(value) {
  return String(value || '—').toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function valueOrDash(value) {
  return value === null || value === undefined ? '—' : String(Math.round(Number(value) * 10) / 10);
}

function verificationType(status) {
  if (['HUMAN_VERIFIED', 'VERIFIED'].includes(status)) return 'human';
  if (status === 'DOCUMENT_VERIFIED') return 'document';
  if (['AI_PRE_SCREENED', 'AI', 'AI_SCORED'].includes(status)) return 'ai';
  return 'neutral';
}

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function GuideDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { session } = useAuth();
  const { t, language } = useT();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setGuide(await guidesRepository.one(id));
      } catch (e) {
        setError(apiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const chat = async () => {
    if (!session) {
      navigation.navigate('Auth', { mode: 'login' });
      return;
    }
    try {
      const userId = guide.userId || guide.id;
      const convId = await conversationsRepository.direct(userId);
      navigation.navigate('Chat', { id: convId, title: guide.name, peerId: userId });
    } catch (e) {
      Alert.alert(t('guideProfile.error'), apiErrorMessage(e));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('guideProfile.title')} onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!guide}>
        {guide ? (
          <ScrollView contentContainerStyle={styles.body}>
            <Image source={guide.photo || undefined} style={styles.photo} />
            <Text style={styles.name}>{guide.name}</Text>
            <Text style={styles.meta}>
              {guide.location} · ★ {guide.rating} ({guide.reviews})
            </Text>
            <Text style={styles.meta}>
              {guide.experience} {t('guideProfile.years')} · ${guide.price}/{t('guideProfile.hour')}
            </Text>
            <View style={styles.centerBadges}>
              {guide.verified ? <VerificationBadge type="neutral" label={t('guideProfile.marketplaceVerified')} /> : null}
              <VerificationBadge type="neutral" label={readable(guide.legalRole)} />
            </View>

            <Text style={styles.section}>{t('guideProfile.about')}</Text>
            <Text style={styles.bio}>{guide.bio || t('guideProfile.defaultBio')}</Text>
            <Text style={styles.section}>{t('guideProfile.languages')}</Text>
            <Text style={styles.bio}>{guide.languages.join(', ') || '—'}</Text>
            <Text style={styles.section}>{t('guideProfile.specialties')}</Text>
            <Text style={styles.bio}>
              {guide.specialties.join(', ') || '—'}
            </Text>

            <View style={styles.metrics}>
              <Metric label={t('guideProfile.experience')} value={`${guide.experience} ${t('guideProfile.years')}`} />
              <Metric label={t('guideProfile.completedTrips')} value={guide.completedTrips} />
              <Metric label={t('guideProfile.rating')} value={`${guide.rating} / 5`} />
            </View>

            <Text style={styles.section}>{t('guideProfile.availability')}</Text>
            <Text style={styles.bio}>{guide.availability.join(', ') || t('guideProfile.availabilityUnknown')}</Text>
            <Text style={styles.caution}>{t('guideProfile.availabilityNotice')}</Text>

            <View style={styles.researchNotice}>
              <Text style={styles.noticeTitle}>{t('guideProfile.evidenceLevels')}</Text>
              <View style={styles.legend}>
                <VerificationBadge type="document" label={t('assessment.documentVerified')} />
                <VerificationBadge type="ai" label={t('assessment.aiPrescreened')} />
                <VerificationBadge type="human" label={t('assessment.humanVerified')} />
              </View>
              <Text style={styles.noticeCopy}>{t('assessment.badgesDifferent')}</Text>
            </View>

            <Text style={styles.section}>{t('guideProfile.languageEvidence')}</Text>
            {guide.languageAssessments.length ? guide.languageAssessments.map((item, index) => (
              <View key={`${item.language}-${item.createdAt || index}`} style={styles.evidenceCard}>
                <Text style={styles.cardTitle}>{item.language.toUpperCase()}</Text>
                {item.aiEstimatedCefr ? (
                  <View style={styles.evidenceLine}>
                    <VerificationBadge type="ai" label={t('assessment.aiPrescreened')} />
                    <Text style={styles.cardValue}>{item.aiEstimatedCefr} · {t('guideProfile.confidence')} {valueOrDash(item.aiConfidence === null ? null : item.aiConfidence * 100)}%</Text>
                  </View>
                ) : null}
                {item.humanVerifiedCefr ? (
                  <View style={styles.evidenceLine}>
                    <VerificationBadge type="human" label={t('assessment.humanVerified')} />
                    <Text style={styles.cardValue}>{item.humanVerifiedCefr}</Text>
                  </View>
                ) : null}
                {item.officialEvidenceType ? (
                  <View style={styles.evidenceLine}>
                    <VerificationBadge
                      type={item.status === 'DOCUMENT_VERIFIED' ? 'document' : 'neutral'}
                      label={item.status === 'DOCUMENT_VERIFIED' ? t('assessment.documentVerified') : readable(item.status)}
                    />
                    <Text style={styles.cardValue}>{readable(item.officialEvidenceType)}</Text>
                  </View>
                ) : null}
                {!item.aiEstimatedCefr && !item.humanVerifiedCefr && !item.officialEvidenceType ? (
                  <Text style={styles.muted}>{t('guideProfile.noPublishedEvidence')}</Text>
                ) : null}
              </View>
            )) : <Text style={styles.muted}>{t('guideProfile.noPublishedEvidence')}</Text>}

            <Text style={styles.section}>{t('guideProfile.competencyScores')}</Text>
            <View style={styles.metrics}>
              <View style={styles.scoreCard}>
                <VerificationBadge
                  type={guide.knowledgeAssessment ? verificationType(guide.knowledgeAssessment.evaluatorType) : 'neutral'}
                  label={!guide.knowledgeAssessment ? t('guideProfile.notAssessed') : guide.knowledgeAssessment.evaluatorType === 'HUMAN' ? t('assessment.humanVerified') : t('assessment.aiPrescreened')}
                />
                <Text style={styles.score}>{valueOrDash(guide.knowledgeAssessment?.score)}</Text>
                <Text style={styles.metricLabel}>{t('guideProfile.knowledgeScore')}</Text>
              </View>
              <View style={styles.scoreCard}>
                <VerificationBadge
                  type={!guide.skillAssessment ? 'neutral' : guide.skillAssessment.humanReviewStatus === 'VERIFIED' ? 'human' : 'ai'}
                  label={!guide.skillAssessment ? t('guideProfile.notAssessed') : guide.skillAssessment.humanReviewStatus === 'VERIFIED' ? t('assessment.humanVerified') : t('assessment.aiPrescreened')}
                />
                <Text style={styles.score}>{valueOrDash(guide.skillAssessment?.score)}</Text>
                <Text style={styles.metricLabel}>{t('guideProfile.skillScore')}</Text>
              </View>
            </View>

            <Text style={styles.section}>{t('guideProfile.routeCompetencies')}</Text>
            {guide.routeCompetencies.length ? guide.routeCompetencies.map((item, index) => (
              <View key={`${item.routeFamily}-${item.passedAt || index}`} style={styles.evidenceCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{readable(item.routeFamily)}</Text>
                  <VerificationBadge type={verificationType(item.status)} label={readable(item.status)} />
                </View>
                <Text style={styles.cardValue}>{t('guideProfile.score')}: {valueOrDash(item.score)}</Text>
                {item.expiresAt ? <Text style={styles.muted}>{t('guideProfile.expires')}: {formatDateTime(item.expiresAt, language)}</Text> : null}
              </View>
            )) : <Text style={styles.muted}>{t('guideProfile.noRouteCompetency')}</Text>}

            <Text style={styles.section}>{t('guideProfile.firstAid')}</Text>
            <View style={styles.evidenceCard}>
              <View style={styles.evidenceLine}>
                <VerificationBadge type={guide.firstAid?.certificateStatus === 'DOCUMENT_VERIFIED' ? 'document' : 'neutral'} label={readable(guide.firstAid?.certificateStatus || 'NOT_PROVIDED')} />
                <Text style={styles.cardValue}>{t('guideProfile.certificate')}</Text>
              </View>
              <View style={styles.evidenceLine}>
                <VerificationBadge type={guide.firstAid?.theoryScore === null || guide.firstAid?.theoryScore === undefined ? 'neutral' : 'ai'} label={guide.firstAid?.theoryScore === null || guide.firstAid?.theoryScore === undefined ? t('guideProfile.notAssessed') : t('assessment.aiPrescreened')} />
                <Text style={styles.cardValue}>{t('guideProfile.theoryScore')}: {valueOrDash(guide.firstAid?.theoryScore)}</Text>
              </View>
              <View style={styles.evidenceLine}>
                <VerificationBadge type={verificationType(guide.firstAid?.practicalVerificationStatus)} label={readable(guide.firstAid?.practicalVerificationStatus || 'NOT_ASSESSED')} />
                <Text style={styles.cardValue}>{t('guideProfile.practicalSkill')}</Text>
              </View>
              <Text style={styles.caution}>{t('guideProfile.firstAidNotice')}</Text>
            </View>

            <Text style={styles.section}>{t('guideProfile.verifiedDocuments')}</Text>
            {guide.evidence.length ? guide.evidence.map((item, index) => (
              <View key={`${item.type}-${item.verifiedAt || index}`} style={styles.evidenceCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{readable(item.type)}</Text>
                  <VerificationBadge type="document" label={t('assessment.documentVerified')} />
                </View>
                <Text style={styles.cardValue}>{item.issuer}</Text>
                {item.expiresAt ? <Text style={styles.muted}>{t('guideProfile.expires')}: {formatDateTime(item.expiresAt, language)}</Text> : null}
              </View>
            )) : <Text style={styles.muted}>{t('guideProfile.noPublishedEvidence')}</Text>}

            <AppButton
              title={t('guideProfile.request')}
              onPress={() => {
                if (!session) {
                  navigation.navigate('Auth', { mode: 'login' });
                  return;
                }
                navigation.navigate('Booking', {
                  kind: 'guide',
                  id: guide.userId || guide.id,
                  title: guide.name,
                  price: guide.price,
                  unit: 'hour',
                });
              }}
              style={{ marginTop: 24 }}
            />
            <AppButton
              title={t('guideProfile.message')}
              variant="secondary"
              onPress={chat}
              style={{ marginTop: 10 }}
            />
          </ScrollView>
        ) : null}
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.ink,
  },
  meta: {
    textAlign: 'center',
    color: colors.inkSoft,
    marginTop: 4,
    fontSize: 14,
  },
  section: {
    marginTop: 22,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  bio: { marginTop: 8, fontSize: 15, lineHeight: 22, color: colors.ink },
  centerBadges: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 18 },
  metric: { minWidth: 100, flexGrow: 1, flexBasis: 105, padding: 12, borderRadius: radius.md, backgroundColor: colors.secondary },
  metricValue: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  metricLabel: { color: colors.inkSoft, fontSize: 10, lineHeight: 14, marginTop: 3 },
  caution: { color: colors.warning, fontSize: 11, lineHeight: 17, marginTop: 7 },
  researchNotice: { gap: 9, marginTop: 22, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' },
  noticeTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  noticeCopy: { color: colors.inkSoft, fontSize: 12, lineHeight: 18 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  evidenceCard: { gap: 9, marginTop: 9, padding: 13, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  evidenceLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 9 },
  cardHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { flexShrink: 1, color: colors.ink, fontSize: 14, fontWeight: '800' },
  cardValue: { flexShrink: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  muted: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 7 },
  scoreCard: { minWidth: 145, flexGrow: 1, flexBasis: 150, gap: 7, padding: 13, borderRadius: radius.lg, backgroundColor: colors.secondary },
  score: { color: colors.ink, fontSize: 27, fontWeight: '900' },
});
