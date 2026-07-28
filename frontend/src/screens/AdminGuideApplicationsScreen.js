import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

export default function AdminGuideApplicationsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [scores, setScores] = useState({});
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
    const score = Number(scores[item.id] ?? 80);
    if (decision === 'APPROVE' && (!Number.isInteger(score) || score < 0 || score > 100)) {
      Alert.alert('Invalid score', 'Assessment score must be between 0 and 100.');
      return;
    }
    try {
      await guidesRepository.reviewApplication(item.id, decision, score);
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
              <Text style={styles.label}>Assessment score</Text>
              <TextInput
                accessibilityLabel="Assessment score"
                value={String(scores[item.id] ?? 80)}
                onChangeText={(value) => setScores((current) => ({ ...current, [item.id]: value }))}
                keyboardType="number-pad"
                style={styles.score}
              />
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
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  reject: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: colors.ink, fontWeight: '700' },
  approve: { flex: 1, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  approveText: { color: colors.white, fontWeight: '700' },
});
