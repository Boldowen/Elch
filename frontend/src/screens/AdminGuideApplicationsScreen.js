import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, StateBox } from '../components/ui';
import { useT } from '../localization';
import { guidesRepository } from '../repositories/guidesRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

const ASSESSMENT_FIELDS = [
  { name: 'localKnowledge', labelKey: 'guideApplications.localKnowledge' },
  { name: 'communication', labelKey: 'guideApplications.communication' },
  { name: 'safety', labelKey: 'guideApplications.safety' },
  { name: 'professionalism', labelKey: 'guideApplications.professionalism' },
];

const REVIEW_CHECKS = [
  { name: 'documentStatus', labelKey: 'guideApplications.document' },
  { name: 'referenceStatus', labelKey: 'guideApplications.referenceCheck' },
];

export default function AdminGuideApplicationsScreen({ navigation }) {
  const { t } = useT();
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await guidesRepository.applications());
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (item, decision) => {
    const draft = reviews[item.id] || {};
    const assessmentBreakdown = {
      localKnowledge: Number(draft.localKnowledge ?? 20),
      communication: Number(draft.communication ?? 20),
      safety: Number(draft.safety ?? 20),
      professionalism: Number(draft.professionalism ?? 20),
    };
    if (Object.values(assessmentBreakdown).some((score) => !Number.isInteger(score) || score < 0 || score > 25)) {
      Alert.alert(t('guideApplications.invalidAssessment'), t('guideApplications.invalidAssessmentCopy'));
      return;
    }
    if (decision === 'REJECT' && !draft.decisionReason?.trim()) {
      Alert.alert(t('guideApplications.reasonRequired'), t('guideApplications.reasonRequiredCopy'));
      return;
    }
    try {
      await guidesRepository.reviewApplication(item.id, {
        decision,
        decisionReason: draft.decisionReason?.trim() || undefined,
        internalNote: draft.internalNote?.trim() || undefined,
        assessmentBreakdown,
        documentStatus: draft.documentStatus || 'VERIFIED',
        referenceStatus: draft.referenceStatus || 'VERIFIED',
      });
      await load();
    } catch (e) {
      Alert.alert(t('guideApplications.reviewFailed'), apiErrorMessage(e));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('guideApplications.title')} onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!items.length} emptyText={t('guideApplications.empty')}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.body}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.user?.name || t('guideApplications.applicant')}</Text>
              <Text style={styles.meta}>{item.user?.email}</Text>
              <Text style={styles.meta}>{item.city}, {item.country} · {item.experienceYears} {t('guideApplications.years')}</Text>
              <Text style={styles.bio}>{item.bio}</Text>
              <Text style={styles.label}>{t('guideApplications.languages')}</Text>
              <Text style={styles.value}>{Object.entries(item.languages || {}).map(([name, level]) => `${name} (${level})`).join(', ')}</Text>
              <Text style={styles.label}>{t('guideApplications.expertise')}</Text>
              <Text style={styles.value}>{(item.expertise || []).join(', ')}</Text>
              <Text style={styles.label}>{t('guideApplications.reference')}</Text>
              <Text style={styles.value}>{item.referenceContact || t('guideApplications.none')}</Text>
              <Text style={styles.label}>{t('guideApplications.assessment')}</Text>
              {ASSESSMENT_FIELDS.map(({ name, labelKey }) => (
                <TextInput
                  key={name}
                  accessibilityLabel={t(labelKey)}
                  placeholder={t(labelKey)}
                  value={String(reviews[item.id]?.[name] ?? 20)}
                  onChangeText={(value) => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], [name]: value } }))}
                  keyboardType="number-pad"
                  style={styles.score}
                />
              ))}
              <Text style={styles.label}>{t('guideApplications.decisionReason')}</Text>
              <TextInput
                value={reviews[item.id]?.decisionReason || ''}
                onChangeText={(value) => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], decisionReason: value } }))}
                multiline
                style={styles.note}
              />
              <Text style={styles.label}>{t('guideApplications.internalNote')}</Text>
              <TextInput
                value={reviews[item.id]?.internalNote || ''}
                onChangeText={(value) => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], internalNote: value } }))}
                multiline
                style={styles.note}
              />
              <View style={styles.actions}>
                {REVIEW_CHECKS.map(({ name, labelKey }) => {
                  const value = reviews[item.id]?.[name] || 'VERIFIED';
                  return (
                    <Pressable key={name} onPress={() => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], [name]: value === 'VERIFIED' ? 'FAILED' : 'VERIFIED' } }))} style={styles.checkButton}>
                      <Text style={styles.value}>{t(labelKey)}: {t(value === 'VERIFIED' ? 'guideApplications.verified' : 'guideApplications.failed')}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.actions}>
                <Pressable accessibilityRole="button" onPress={() => review(item, 'REJECT')} style={styles.reject}>
                  <Text style={styles.rejectText}>{t('guideApplications.reject')}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => review(item, 'APPROVE')} style={styles.approve}>
                  <Text style={styles.approveText}>{t('guideApplications.approve')}</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 16, marginBottom: 14 },
  name: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  meta: { color: colors.inkSoft, marginTop: 4 },
  bio: { color: colors.ink, lineHeight: 20, marginTop: 14 },
  label: { color: colors.inkSoft, fontSize: 12, fontWeight: '600', marginTop: 14 },
  value: { color: colors.ink, marginTop: 3, lineHeight: 19 },
  score: { height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, marginTop: 6, color: colors.ink },
  note: { minHeight: 70, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, marginTop: 6, color: colors.ink, textAlignVertical: 'top' },
  checkButton: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 8, justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  reject: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: colors.ink, fontWeight: '700' },
  approve: { flex: 1, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  approveText: { color: colors.white, fontWeight: '700' },
});
