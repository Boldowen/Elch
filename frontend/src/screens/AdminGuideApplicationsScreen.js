import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

export default function AdminGuideApplicationsScreen({ navigation }) {
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
      Alert.alert('Invalid assessment', 'Each assessment category must be between 0 and 25.');
      return;
    }
    if (decision === 'REJECT' && !draft.decisionReason?.trim()) {
      Alert.alert('Reason required', 'Add a decision reason before rejecting.');
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
      Alert.alert('Review failed', apiErrorMessage(e));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Guide applications" onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!items.length} emptyText="No pending applications.">
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.body}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.user?.name || 'Applicant'}</Text>
              <Text style={styles.meta}>{item.user?.email}</Text>
              <Text style={styles.meta}>{item.city}, {item.country} · {item.experienceYears} years</Text>
              <Text style={styles.bio}>{item.bio}</Text>
              <Text style={styles.label}>Languages</Text>
              <Text style={styles.value}>{Object.entries(item.languages || {}).map(([name, level]) => `${name} (${level})`).join(', ')}</Text>
              <Text style={styles.label}>Expertise</Text>
              <Text style={styles.value}>{(item.expertise || []).join(', ')}</Text>
              <Text style={styles.label}>Reference</Text>
              <Text style={styles.value}>{item.referenceContact || 'None'}</Text>
              <Text style={styles.label}>Assessment (each 0–25)</Text>
              {['localKnowledge', 'communication', 'safety', 'professionalism'].map((field) => (
                <TextInput
                  key={field}
                  accessibilityLabel={field}
                  placeholder={field}
                  value={String(reviews[item.id]?.[field] ?? 20)}
                  onChangeText={(value) => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], [field]: value } }))}
                  keyboardType="number-pad"
                  style={styles.score}
                />
              ))}
              <Text style={styles.label}>Decision reason (required for reject)</Text>
              <TextInput
                value={reviews[item.id]?.decisionReason || ''}
                onChangeText={(value) => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], decisionReason: value } }))}
                multiline
                style={styles.note}
              />
              <Text style={styles.label}>Internal note</Text>
              <TextInput
                value={reviews[item.id]?.internalNote || ''}
                onChangeText={(value) => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], internalNote: value } }))}
                multiline
                style={styles.note}
              />
              <View style={styles.actions}>
                {['documentStatus', 'referenceStatus'].map((field) => {
                  const value = reviews[item.id]?.[field] || 'VERIFIED';
                  return (
                    <Pressable key={field} onPress={() => setReviews((current) => ({ ...current, [item.id]: { ...current[item.id], [field]: value === 'VERIFIED' ? 'FAILED' : 'VERIFIED' } }))} style={styles.checkButton}>
                      <Text style={styles.value}>{field === 'documentStatus' ? 'Document' : 'Reference'}: {value}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.actions}>
                <Pressable accessibilityRole="button" onPress={() => review(item, 'REJECT')} style={styles.reject}>
                  <Text style={styles.rejectText}>Reject</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => review(item, 'APPROVE')} style={styles.approve}>
                  <Text style={styles.approveText}>Approve</Text>
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
