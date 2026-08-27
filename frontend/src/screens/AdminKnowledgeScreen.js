import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminAccessBoundary from '../components/admin/AdminAccessBoundary';
import { AppButton, AppInput, Chip, ScreenHeader } from '../components/ui';
import { adminRepository } from '../repositories/adminRepository';
import { apiErrorMessage } from '../services/api';
import { useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const SOURCE_TYPES = ['WEBSITE', 'LAW', 'REGULATION', 'REPORT', 'DATASET', 'MAP', 'ARTICLE', 'BOOK', 'OTHER'];
const AUTHORITY_LEVELS = ['GOVERNMENT', 'LEGAL', 'OFFICIAL_TOURISM', 'UNESCO', 'LOCAL_AUTHORITY', 'MUSEUM', 'PROTECTED_AREA', 'VERIFIED_OPERATOR', 'OTHER'];
const CATEGORIES = ['HISTORY', 'CULTURE', 'GEOGRAPHY', 'NATURE', 'LAW', 'SAFETY', 'FIRST_AID_REFERENCE', 'ROUTE_INFORMATION', 'DESTINATION_INFORMATION', 'TOURISM_GUIDANCE'];
const ROUTE_FAMILIES = ['', 'CENTRAL_HERITAGE', 'GOBI', 'KHUVSGUL', 'WESTERN_ALTAI'];

function dateValue(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function toDateTime(value) {
  if (!String(value || '').trim()) return undefined;
  const parsed = new Date(`${String(value).trim()}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function OptionRow({ label, values, value, onChange }) {
  return (
    <View style={styles.optionField}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionRow}>
        {values.map((option) => (
          <Chip
            key={option || 'ALL'}
            label={option || '—'}
            active={value === option}
            onPress={() => onChange(option)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ReviewRow({ label, value }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || '—'}</Text>
    </View>
  );
}

export default function AdminKnowledgeScreen({ navigation }) {
  const { t } = useT();
  const [source, setSource] = useState({
    title: '',
    organization: '',
    sourceType: 'WEBSITE',
    authorityLevel: 'OFFICIAL_TOURISM',
    url: '',
    language: 'en',
    publishedAt: '',
    validFrom: '',
    validTo: '',
    lastVerifiedAt: dateValue(),
  });
  const [sourceReview, setSourceReview] = useState(false);
  const [createdSource, setCreatedSource] = useState(null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState(null);
  const [knowledge, setKnowledge] = useState({
    title: '',
    content: '',
    region: '',
    routeFamily: '',
    category: 'TOURISM_GUIDANCE',
    language: 'en',
    chunkSize: '1200',
  });
  const [knowledgeReview, setKnowledgeReview] = useState(false);
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestResult, setIngestResult] = useState(null);
  const [ingestError, setIngestError] = useState(null);

  const sourcePayload = useMemo(() => ({
    title: source.title.trim(),
    organization: source.organization.trim(),
    sourceType: source.sourceType,
    authorityLevel: source.authorityLevel,
    url: source.url.trim(),
    language: source.language.trim().toLowerCase(),
    ...(toDateTime(source.publishedAt) ? { publishedAt: toDateTime(source.publishedAt) } : {}),
    ...(toDateTime(source.validFrom) ? { validFrom: toDateTime(source.validFrom) } : {}),
    ...(toDateTime(source.validTo) ? { validTo: toDateTime(source.validTo) } : {}),
    lastVerifiedAt: toDateTime(source.lastVerifiedAt),
  }), [source]);

  const patchSource = (field, value) => setSource((current) => ({ ...current, [field]: value }));
  const patchKnowledge = (field, value) => setKnowledge((current) => ({ ...current, [field]: value }));

  const reviewSource = () => {
    const optionalDates = [source.publishedAt, source.validFrom, source.validTo].filter(Boolean);
    if (!sourcePayload.title || !sourcePayload.organization || !/^https?:\/\//i.test(sourcePayload.url) || !sourcePayload.language) {
      Alert.alert(t('adminKnowledge.invalidSource'), t('adminKnowledge.invalidSourceCopy'));
      return;
    }
    if (!sourcePayload.lastVerifiedAt || optionalDates.some((value) => !toDateTime(value))) {
      Alert.alert(t('adminKnowledge.invalidDate'), t('adminKnowledge.invalidDateCopy'));
      return;
    }
    setSourceError(null);
    setSourceReview(true);
  };

  const createSource = async () => {
    setSourceLoading(true);
    setSourceError(null);
    try {
      const created = await adminRepository.createTourismSource(sourcePayload);
      setCreatedSource(created);
      setKnowledge((current) => ({
        ...current,
        title: current.title || created.title,
        language: current.language || created.language,
      }));
      setSourceReview(false);
    } catch (error) {
      setSourceError(apiErrorMessage(error));
    } finally {
      setSourceLoading(false);
    }
  };

  const reviewKnowledge = () => {
    const chunkSize = Number(knowledge.chunkSize);
    if (!knowledge.title.trim() || !knowledge.content.trim() || !knowledge.language.trim() || !Number.isInteger(chunkSize) || chunkSize < 200 || chunkSize > 3000) {
      Alert.alert(t('adminKnowledge.invalidContent'), t('adminKnowledge.invalidContentCopy'));
      return;
    }
    setIngestError(null);
    setKnowledgeReview(true);
  };

  const ingest = async () => {
    if (!createdSource?.id) return;
    setIngestLoading(true);
    setIngestError(null);
    try {
      const result = await adminRepository.ingestTourismKnowledge({
        sourceId: createdSource.id,
        title: knowledge.title.trim(),
        content: knowledge.content.trim(),
        ...(knowledge.region.trim() ? { region: knowledge.region.trim() } : {}),
        ...(knowledge.routeFamily ? { routeFamily: knowledge.routeFamily } : {}),
        category: knowledge.category,
        language: knowledge.language.trim().toLowerCase(),
        chunkSize: Number(knowledge.chunkSize),
      });
      setIngestResult(result);
      setKnowledgeReview(false);
    } catch (error) {
      setIngestError(apiErrorMessage(error));
    } finally {
      setIngestLoading(false);
    }
  };

  const reset = () => {
    setCreatedSource(null);
    setSourceReview(false);
    setSourceError(null);
    setIngestResult(null);
    setIngestError(null);
    setSource((current) => ({ ...current, title: '', organization: '', url: '', publishedAt: '', validFrom: '', validTo: '', lastVerifiedAt: dateValue() }));
    setKnowledge((current) => ({ ...current, title: '', content: '', region: '' }));
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('adminKnowledge.title')} onBack={() => navigation.goBack()} />
      <AdminAccessBoundary>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>{t('adminKnowledge.noticeTitle')}</Text>
              <Text style={styles.noticeCopy}>{t('adminKnowledge.noticeCopy')}</Text>
            </View>

            <Text style={styles.sectionTitle}>1. {t('adminKnowledge.source')}</Text>
            {!createdSource && !sourceReview ? (
              <View style={styles.card}>
                <AppInput label={t('adminKnowledge.sourceTitle')} value={source.title} onChangeText={(value) => patchSource('title', value)} autoCapitalize="sentences" />
                <AppInput label={t('adminKnowledge.organization')} value={source.organization} onChangeText={(value) => patchSource('organization', value)} autoCapitalize="words" />
                <OptionRow label={t('adminKnowledge.sourceType')} values={SOURCE_TYPES} value={source.sourceType} onChange={(value) => patchSource('sourceType', value)} />
                <OptionRow label={t('adminKnowledge.authority')} values={AUTHORITY_LEVELS} value={source.authorityLevel} onChange={(value) => patchSource('authorityLevel', value)} />
                <AppInput label={t('adminKnowledge.url')} value={source.url} onChangeText={(value) => patchSource('url', value)} keyboardType="url" autoCapitalize="none" />
                <AppInput label={t('adminKnowledge.language')} value={source.language} onChangeText={(value) => patchSource('language', value)} maxLength={16} />
                <AppInput label={t('adminKnowledge.publishedAt')} value={source.publishedAt} onChangeText={(value) => patchSource('publishedAt', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                <AppInput label={t('adminKnowledge.validFrom')} value={source.validFrom} onChangeText={(value) => patchSource('validFrom', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                <AppInput label={t('adminKnowledge.validTo')} value={source.validTo} onChangeText={(value) => patchSource('validTo', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                <AppInput label={t('adminKnowledge.lastVerified')} value={source.lastVerifiedAt} onChangeText={(value) => patchSource('lastVerifiedAt', value)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                {sourceError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{sourceError}</Text> : null}
                <AppButton title={t('adminKnowledge.reviewSource')} onPress={reviewSource} />
              </View>
            ) : null}

            {sourceReview && !createdSource ? (
              <View style={styles.card}>
                <Text style={styles.reviewTitle}>{t('adminKnowledge.reviewBeforeCreate')}</Text>
                <ReviewRow label={t('adminKnowledge.sourceTitle')} value={sourcePayload.title} />
                <ReviewRow label={t('adminKnowledge.organization')} value={sourcePayload.organization} />
                <ReviewRow label={t('adminKnowledge.sourceType')} value={sourcePayload.sourceType} />
                <ReviewRow label={t('adminKnowledge.authority')} value={sourcePayload.authorityLevel} />
                <ReviewRow label={t('adminKnowledge.url')} value={sourcePayload.url} />
                <ReviewRow label={t('adminKnowledge.language')} value={sourcePayload.language} />
                <ReviewRow label={t('adminKnowledge.lastVerified')} value={source.lastVerifiedAt} />
                {sourceError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{sourceError}</Text> : null}
                <View style={styles.actions}>
                  <AppButton title={t('common.edit')} variant="secondary" onPress={() => setSourceReview(false)} style={styles.action} disabled={sourceLoading} />
                  <AppButton title={t('adminKnowledge.createSource')} onPress={createSource} loading={sourceLoading} style={styles.action} />
                </View>
              </View>
            ) : null}

            {createdSource ? (
              <View style={styles.success} accessibilityLiveRegion="polite">
                <Text style={styles.successTitle}>{t('adminKnowledge.sourceCreated')}</Text>
                <Text style={styles.successCopy}>{createdSource.title} · {createdSource.organization}</Text>
                <Text style={styles.identifier}>{createdSource.id}</Text>
              </View>
            ) : null}

            <Text style={[styles.sectionTitle, !createdSource && styles.disabledText]}>2. {t('adminKnowledge.content')}</Text>
            {createdSource && !knowledgeReview && !ingestResult ? (
              <View style={styles.card}>
                <AppInput label={t('adminKnowledge.chunkTitle')} value={knowledge.title} onChangeText={(value) => patchKnowledge('title', value)} autoCapitalize="sentences" />
                <AppInput label={t('adminKnowledge.region')} value={knowledge.region} onChangeText={(value) => patchKnowledge('region', value)} autoCapitalize="words" />
                <OptionRow label={t('adminKnowledge.routeFamily')} values={ROUTE_FAMILIES} value={knowledge.routeFamily} onChange={(value) => patchKnowledge('routeFamily', value)} />
                <OptionRow label={t('adminKnowledge.category')} values={CATEGORIES} value={knowledge.category} onChange={(value) => patchKnowledge('category', value)} />
                <AppInput label={t('adminKnowledge.language')} value={knowledge.language} onChangeText={(value) => patchKnowledge('language', value)} maxLength={16} />
                <AppInput label={t('adminKnowledge.chunkSize')} value={knowledge.chunkSize} onChangeText={(value) => patchKnowledge('chunkSize', value)} keyboardType="number-pad" />
                <AppInput label={t('adminKnowledge.rawContent')} value={knowledge.content} onChangeText={(value) => patchKnowledge('content', value)} multiline inputStyle={styles.contentInput} autoCapitalize="sentences" />
                {ingestError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{ingestError}</Text> : null}
                <AppButton title={t('adminKnowledge.reviewContent')} onPress={reviewKnowledge} />
              </View>
            ) : null}

            {createdSource && knowledgeReview && !ingestResult ? (
              <View style={styles.card}>
                <Text style={styles.reviewTitle}>{t('adminKnowledge.reviewBeforeIngest')}</Text>
                <ReviewRow label={t('adminKnowledge.chunkTitle')} value={knowledge.title.trim()} />
                <ReviewRow label={t('adminKnowledge.region')} value={knowledge.region.trim()} />
                <ReviewRow label={t('adminKnowledge.routeFamily')} value={knowledge.routeFamily} />
                <ReviewRow label={t('adminKnowledge.category')} value={knowledge.category} />
                <ReviewRow label={t('adminKnowledge.chunkSize')} value={knowledge.chunkSize} />
                <ReviewRow label={t('adminKnowledge.characters')} value={String(knowledge.content.trim().length)} />
                <Text style={styles.preview} numberOfLines={8}>{knowledge.content.trim()}</Text>
                {ingestError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{ingestError}</Text> : null}
                <View style={styles.actions}>
                  <AppButton title={t('common.edit')} variant="secondary" onPress={() => setKnowledgeReview(false)} style={styles.action} disabled={ingestLoading} />
                  <AppButton title={t('adminKnowledge.ingest')} onPress={ingest} loading={ingestLoading} style={styles.action} />
                </View>
              </View>
            ) : null}

            {ingestResult ? (
              <View style={styles.success} accessibilityLiveRegion="polite">
                <Text style={styles.successTitle}>{t('adminKnowledge.ingested')}</Text>
                <Text style={styles.successCopy}>{ingestResult.chunks} {t('adminKnowledge.chunks')}</Text>
                <AppButton title={t('adminKnowledge.addAnother')} variant="secondary" onPress={reset} style={styles.resetButton} />
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </AdminAccessBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: spacing.md },
  notice: { padding: 15, borderRadius: radius.lg, backgroundColor: colors.warningSoft, borderWidth: 1, borderColor: '#FDE68A' },
  noticeTitle: { color: colors.ink, fontWeight: '800' },
  noticeCopy: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 4 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: spacing.sm },
  disabledText: { color: colors.inkSoft },
  card: { padding: 16, borderRadius: radius.xl, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  optionField: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  optionRow: { paddingVertical: 2, paddingRight: 8 },
  reviewTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  reviewRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewLabel: { color: colors.inkSoft, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  reviewValue: { color: colors.ink, fontSize: 14, lineHeight: 20, marginTop: 3 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: spacing.lg },
  action: { flex: 1, minWidth: 160 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  success: { padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: '#A7F3D0', backgroundColor: colors.successSoft },
  successTitle: { color: colors.success, fontWeight: '800' },
  successCopy: { color: colors.ink, marginTop: 4 },
  identifier: { color: colors.inkSoft, fontSize: 11, marginTop: 5 },
  contentInput: { minHeight: 220 },
  preview: { color: colors.ink, lineHeight: 20, marginTop: 14, padding: 12, borderRadius: radius.md, backgroundColor: colors.secondary },
  resetButton: { marginTop: 14 },
});
