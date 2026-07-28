import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

export default function GuideRankingScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setItems(await guidesRepository.ranking());
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Guide ranking" onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!items.length}>
        <FlatList
          data={items}
          keyExtractor={(item, i) => item.userId || String(i)}
          contentContainerStyle={{ padding: spacing.lg }}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>#{index + 1}</Text>
              <Image source={item.photo || undefined} style={styles.photo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.location} · ★ {item.rating}
                </Text>
              </View>
              <Text style={styles.points}>{item.rankPoints} pts</Text>
            </View>
          )}
        />
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: colors.secondary,
    borderRadius: radius.lg,
    marginBottom: 10,
  },
  rank: { fontWeight: '800', color: colors.brand, width: 28 },
  photo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
  },
  name: { fontWeight: '700', color: colors.ink },
  meta: { color: colors.inkSoft, fontSize: 12 },
  points: { fontWeight: '700', color: colors.ink },
});
