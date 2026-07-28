import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip, ListingCard, StateBox } from '../components/ui';
import { categoryKeyMap, categoryTabs } from '../data/images';
import { listingsRepository } from '../repositories/listingsRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

export default function ExploreScreen({ navigation }) {
  const { t } = useT();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const label = categoryTabs[tab];
      if (label === 'Guides') {
        setItems([]);
        setLoading(false);
        return;
      }
      const category = categoryKeyMap[label];
      const data = await listingsRepository.fetch({
        category: category === 'trending' ? undefined : category,
        search: query.trim() || undefined,
      });
      setItems(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab, query]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search places, camps, guides..."
            placeholderTextColor={colors.inkSoft}
            style={styles.search}
            onSubmitEditing={load}
            returnKeyType="search"
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          {categoryTabs.map((label, i) => (
            <Chip
              key={label}
              label={label}
              active={tab === i}
              onPress={() => setTab(i)}
            />
          ))}
        </ScrollView>
      </View>

      {categoryTabs[tab] === 'Guides' ? (
        <View style={styles.guidesCta}>
          <Text style={styles.ctaTitle}>Find local guides</Text>
          <Text style={styles.ctaSub}>
            Browse verified guides for horse rides, city walks, and more.
          </Text>
          <Pressable
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Guides')}
          >
            <Text style={styles.ctaBtnText}>Open guides</Text>
          </Pressable>
        </View>
      ) : (
        <StateBox loading={loading} error={error} empty={!items.length} emptyText="No listings found.">
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={items.some((item) => item.isCached) ? (
              <View
                style={styles.cachedBanner}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                <Text style={styles.cachedText}>{t('common.cached')}</Text>
              </View>
            ) : null}
            renderItem={({ item }) => (
              <ListingCard
                item={item}
                onPress={() =>
                  navigation.navigate('ListingDetail', { id: item.id })
                }
              />
            )}
          />
        </StateBox>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    letterSpacing: -0.4,
  },
  searchRow: { marginTop: 10 },
  search: {
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    paddingHorizontal: 18,
    fontSize: 15,
    color: colors.ink,
  },
  guidesCta: {
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.secondary,
  },
  ctaTitle: { fontSize: 20, fontWeight: '700', color: colors.ink },
  ctaSub: { color: colors.inkSoft, marginTop: 8, marginBottom: 16 },
  ctaBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaBtnText: { color: '#fff', fontWeight: '700' },
  cachedBanner: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 14,
  },
  cachedText: { color: colors.ink, lineHeight: 19 },
});
