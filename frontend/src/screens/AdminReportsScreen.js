import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, StateBox } from '../components/ui';
import { trustSafetyRepository } from '../repositories/trustSafetyRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

export default function AdminReportsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(async () => {
    try { setError(null); setItems(await trustSafetyRepository.reports()); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const action = async (item, type) => {
    try {
      if (type === 'DISMISS') await trustSafetyRepository.dismiss(item.id, 'Dismissed after admin review');
      else await trustSafetyRepository.moderate(item.id, type, 'Action taken after admin review', type === 'TEMPORARY_SUSPENSION' ? 24 : undefined);
      await load();
    } catch (e) { Alert.alert('Moderation failed', apiErrorMessage(e)); }
  };
  return (
    <SafeAreaView style={styles.root}>
      <ScreenHeader title="Safety reports" onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!items.length} emptyText="No open reports.">
        <FlatList data={items} keyExtractor={(item) => item.id} contentContainerStyle={styles.body} renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.reason} · {item.targetType}</Text>
            <Text style={styles.meta}>Reporter: {item.reporter?.name} · {item.targetId}</Text>
            <Text style={styles.details}>{item.details || 'No additional details'}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.button} onPress={() => action(item, 'DISMISS')}><Text>Dismiss</Text></Pressable>
              <Pressable style={styles.button} onPress={() => action(item, 'WARNING')}><Text>Warn</Text></Pressable>
              {(item.targetType === 'POST' || item.targetType === 'MESSAGE') ? <Pressable style={styles.danger} onPress={() => action(item, 'CONTENT_REMOVE')}><Text style={styles.dangerText}>Remove</Text></Pressable> : null}
              {item.targetType === 'USER' ? <Pressable style={styles.danger} onPress={() => action(item, 'TEMPORARY_SUSPENSION')}><Text style={styles.dangerText}>Suspend 24h</Text></Pressable> : null}
            </View>
          </View>
        )} />
      </StateBox>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white }, body: { padding: spacing.lg },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 14, marginBottom: 12 },
  title: { color: colors.ink, fontWeight: '700' }, meta: { color: colors.inkSoft, fontSize: 12, marginTop: 5 }, details: { color: colors.ink, marginTop: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }, button: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: 10 },
  danger: { backgroundColor: '#B42318', borderRadius: radius.sm, padding: 10 }, dangerText: { color: colors.white, fontWeight: '700' },
});
