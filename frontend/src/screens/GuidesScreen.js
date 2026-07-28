import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuideCard, ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function GuidesScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await guidesRepository.all();
      setItems(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Guides" onBack={() => navigation.goBack()} />
      <StateBox
        loading={loading}
        error={error}
        empty={!items.length}
        emptyText="No guides available."
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id || item.userId}
          contentContainerStyle={{ padding: spacing.lg }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
            />
          }
          ListHeaderComponent={
            <Text style={styles.sub}>Verified local experts</Text>
          }
          renderItem={({ item }) => (
            <GuideCard
              item={item}
              onPress={() =>
                navigation.navigate('GuideDetail', {
                  id: item.id || item.userId,
                })
              }
            />
          )}
        />
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  sub: {
    color: colors.inkSoft,
    marginBottom: 12,
    fontSize: 14,
  },
});
