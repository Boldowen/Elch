import React, { useCallback, useEffect, useState } from 'react';
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

const AUTHORITIES = ['GOVERNMENT', 'LEGAL', 'OFFICIAL_TOURISM', 'UNESCO', 'LOCAL_AUTHORITY', 'MUSEUM', 'PROTECTED_AREA', 'VERIFIED_OPERATOR', 'OTHER'];
const KNOWLEDGE_ACTIONS = ['KEEP', 'DISABLE', 'ENABLE'];
const SOURCE_DECISIONS = ['HUMAN_VERIFIED', 'REJECTED'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function isoDate(value) {
  const parsed = new Date(`${String(value || '').trim()}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function Chips({ values, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {values.map((option) => (
        <Chip key={option} label={option} active={value === option} onPress={() => onChange(option)} />
      ))}
    </ScrollView>
  );
}

export default function AdminSourceReviewScreen({ navigation }) {
  const { t, language } = useT();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chunkSaving, setChunkSaving] = useState(null);
  const [error, setError] = useState(null);
  const [detailError, setDetailError] = useState(null);

  const load = useCallback(async (search = query, refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setItems(await adminRepository.tourismSources({ ...(search.trim() ? { query: search.trim() } : {}), limit: 100 }));
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query]);

  useEffect(() => {
    load('', false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openSource = async (source) => {
    setSelected(source);
    setDraft({
      lastVerifiedAt: today(),
      validTo: source.validTo ? source.validTo.slice(0, 10) : '',
      authorityLevel: source.authorityLevel,
      licenseOrUsageNote: source.licenseOrUsageNote || '',
      reviewStatus: source.reviewStatus === 'REJECTED' ? 'REJECTED' : 'HUMAN_VERIFIED',
      reviewNotes: source.reviewNotes || '',
      knowledgeAction: 'KEEP',
    });
    setDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await adminRepository.tourismSource(source.id);
      setSelected(detail);
    } catch (nextError) {
      setDetailError(apiErrorMessage(nextError));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeSource = () => {
    if (saving || chunkSaving) return;
    setSelected(null);
    setDraft(null);
    setDetailError(null);
  };

  const saveSource = async () => {
    const verified = isoDate(draft?.lastVerifiedAt);
    const validTo = draft?.validTo ? isoDate(draft.validTo) : undefined;
    if (!verified || (draft?.validTo && !validTo)) {
      Alert.alert(t('sourceReview.invalidDate'), t('sourceReview.invalidDateCopy'));
      return;
    }
    if (!draft?.licenseOrUsageNote?.trim() || (draft.reviewStatus === 'REJECTED' && !draft.reviewNotes.trim())) {
      Alert.alert(t('sourceReview.invalidDecision'), t('sourceReview.invalidDecisionCopy'));
      return;
    }
    const perform = async () => {
      setSaving(true);
      setDetailError(null);
      try {
        await adminRepository.reviewTourismSource(selected.id, {
          lastVerifiedAt: verified,
          ...(validTo ? { validTo } : {}),
          authorityLevel: draft.authorityLevel,
          licenseOrUsageNote: draft.licenseOrUsageNote.trim(),
          reviewStatus: draft.reviewStatus,
          ...(draft.reviewNotes.trim() ? { reviewNotes: draft.reviewNotes.trim() } : {}),
          ...(draft.knowledgeAction === 'KEEP' ? {} : { disableKnowledge: draft.knowledgeAction === 'DISABLE' }),
        });
        await load(query, true);
        await openSource({ ...selected, authorityLevel: draft.authorityLevel, validTo: validTo || selected.validTo });
      } catch (nextError) {
        setDetailError(apiErrorMessage(nextError));
      } finally {
        setSaving(false);
      }
    };
    if (draft.knowledgeAction === 'DISABLE') {
      Alert.alert(t('sourceReview.disableTitle'), t('sourceReview.disableCopy'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('sourceReview.disable'), style: 'destructive', onPress: perform },
      ]);
    } else {
      await perform();
    }
  };

  const toggleChunk = async (chunk) => {
    setChunkSaving(chunk.id);
    setDetailError(null);
    try {
      const updated = await adminRepository.reviewTourismKnowledge(chunk.id, {
        active: !chunk.active,
        lastVerifiedAt: new Date().toISOString(),
      });
      setSelected((current) => ({
        ...current,
        knowledge: current.knowledge.map((item) => item.id === chunk.id ? { ...item, ...updated } : item),
      }));
    } catch (nextError) {
      setDetailError(apiErrorMessage(nextError));
    } finally {
      setChunkSaving(null);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('sourceReview.title')} onBack={selected ? closeSource : () => navigation.goBack()} />
      <AdminAccessBoundary>
        {selected ? (
          <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={detailLoading} onRefresh={() => openSource(selected)} />}>
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>{selected.title}</Text>
              <Text style={styles.heroCopy}>{selected.organization} · {selected.sourceType}</Text>
              <Text style={styles.heroCopy}>{t('sourceReview.status')}: {selected.reviewStatus}</Text>
              <Text style={styles.url} numberOfLines={2}>{selected.url}</Text>
            </View>
            {detailError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{detailError}</Text> : null}
            <StateBox loading={detailLoading && !selected.knowledge?.length}>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('sourceReview.sourceDecision')}</Text>
                <Text style={styles.label}>{t('sourceReview.decision')}</Text>
                <Chips values={SOURCE_DECISIONS} value={draft?.reviewStatus} onChange={(value) => setDraft((current) => ({ ...current, reviewStatus: value }))} />
                <AppInput label={t('adminKnowledge.lastVerified')} value={draft?.lastVerifiedAt || ''} onChangeText={(value) => setDraft((current) => ({ ...current, lastVerifiedAt: value }))} keyboardType="numbers-and-punctuation" />
                <AppInput label={t('adminKnowledge.validTo')} value={draft?.validTo || ''} onChangeText={(value) => setDraft((current) => ({ ...current, validTo: value }))} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
                <AppInput label={t('adminKnowledge.licenseOrUsage')} value={draft?.licenseOrUsageNote || ''} onChangeText={(value) => setDraft((current) => ({ ...current, licenseOrUsageNote: value }))} multiline inputStyle={styles.longInput} />
                <AppInput label={t('sourceReview.reviewNotes')} value={draft?.reviewNotes || ''} onChangeText={(value) => setDraft((current) => ({ ...current, reviewNotes: value }))} multiline inputStyle={styles.longInput} />
                <Text style={styles.label}>{t('adminKnowledge.authority')}</Text>
                <Chips values={AUTHORITIES} value={draft?.authorityLevel} onChange={(value) => setDraft((current) => ({ ...current, authorityLevel: value }))} />
                <Text style={styles.label}>{t('sourceReview.knowledgeAction')}</Text>
                <Chips values={KNOWLEDGE_ACTIONS} value={draft?.knowledgeAction} onChange={(value) => setDraft((current) => ({ ...current, knowledgeAction: value }))} />
                <Text style={styles.help}>{t(`sourceReview.action${draft?.knowledgeAction || 'KEEP'}`)}</Text>
                <AppButton title={t('sourceReview.save')} onPress={saveSource} loading={saving} disabled={Boolean(chunkSaving)} />
              </View>

              <Text style={styles.sectionTitle}>{t('sourceReview.chunks')} ({selected.knowledge?.length || 0})</Text>
              {!selected.knowledge?.length ? (
                <View style={styles.empty}><Text style={styles.help}>{t('sourceReview.noChunks')}</Text></View>
              ) : selected.knowledge.map((chunk) => (
                <View key={chunk.id} style={styles.chunkCard}>
                  <View style={styles.chunkTop}>
                    <View style={styles.chunkCopy}>
                      <Text style={styles.chunkTitle}>{chunk.title}</Text>
                      <Text style={styles.help}>#{chunk.chunkIndex + 1} · {chunk.category} · {chunk.tokenCount} tokens</Text>
                    </View>
                    <View style={[styles.badge, chunk.active ? styles.badgeActive : styles.badgeInactive]}>
                      <Text style={styles.badgeText}>{chunk.active ? t('sourceReview.active') : t('sourceReview.inactive')}</Text>
                    </View>
                  </View>
                  <Text style={styles.help}>{t('sourceReview.verified')} {formatDateTime(chunk.lastVerifiedAt, language) || '—'}</Text>
                  <AppButton
                    title={chunk.active ? t('sourceReview.deactivate') : t('sourceReview.activate')}
                    variant={chunk.active ? 'ghost' : 'secondary'}
                    onPress={() => toggleChunk(chunk)}
                    loading={chunkSaving === chunk.id}
                    disabled={Boolean(chunkSaving) || saving}
                    style={styles.chunkAction}
                  />
                </View>
              ))}
            </StateBox>
          </ScrollView>
        ) : (
          <View style={styles.flex}>
            <View style={styles.searchRow}>
              <AppInput label={t('sourceReview.search')} value={query} onChangeText={setQuery} returnKeyType="search" onSubmitEditing={() => load(query)} style={styles.searchInput} />
              <AppButton title={t('sourceReview.searchButton')} onPress={() => load(query)} style={styles.searchButton} />
            </View>
            <StateBox loading={loading} error={error} empty={!items.length} emptyText={t('sourceReview.empty')}>
              <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(query, true)} />}>
                {items.map((source) => (
                  <Pressable key={source.id} accessibilityRole="button" accessibilityLabel={`${source.title}, ${source.organization}`} onPress={() => openSource(source)} style={({ pressed }) => [styles.sourceCard, pressed && styles.pressed]}>
                    <View style={styles.sourceCopy}>
                      <Text style={styles.sourceTitle}>{source.title}</Text>
                      <Text style={styles.help}>{source.organization} · {source.authorityLevel}</Text>
                      <Text style={styles.help}>{t('sourceReview.status')}: {source.reviewStatus}</Text>
                      <Text style={styles.help}>{source.counts.knowledge} {t('sourceReview.chunks').toLowerCase()} · {t('sourceReview.verified')} {formatDateTime(source.lastVerifiedAt, language) || '—'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} />
                  </Pressable>
                ))}
              </ScrollView>
            </StateBox>
          </View>
        )}
      </AdminAccessBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: spacing.md },
  hero: { padding: 16, gap: 5, borderRadius: radius.xl, backgroundColor: colors.ink },
  heroTitle: { color: colors.white, fontSize: 21, fontWeight: '800' },
  heroCopy: { color: 'rgba(255,255,255,0.7)', lineHeight: 19 },
  url: { color: '#FDA4AF', fontSize: 12, lineHeight: 18 },
  card: { padding: 16, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, backgroundColor: colors.white },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  label: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  longInput: { minHeight: 92, textAlignVertical: 'top' },
  chips: { paddingVertical: 3, paddingRight: 8 },
  help: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 5 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, padding: 12, borderRadius: radius.md, backgroundColor: '#FEF2F2' },
  empty: { padding: 24, alignItems: 'center', borderRadius: radius.lg, backgroundColor: colors.white },
  chunkCard: { padding: 14, gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  chunkTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  chunkCopy: { flex: 1 },
  chunkTitle: { color: colors.ink, fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
  badgeActive: { backgroundColor: colors.successSoft },
  badgeInactive: { backgroundColor: '#FEF2F2' },
  badgeText: { color: colors.ink, fontSize: 10, fontWeight: '800' },
  chunkAction: { marginTop: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  searchInput: { flex: 1, marginBottom: 0 },
  searchButton: { width: 110 },
  list: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: 9 },
  sourceCard: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  sourceCopy: { flex: 1 },
  sourceTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.72 },
});
