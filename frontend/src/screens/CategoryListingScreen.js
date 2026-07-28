import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListingCard, ScreenHeader, StateBox } from '../components/ui';
import { listingsRepository } from '../repositories/listingsRepository';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';
import { useT } from '../localization';

export default function CategoryListingScreen({ navigation, route }) {
  const { t } = useT();
  const categoryKey = route.params?.categoryKey || 'trending';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listingsRepository.fetch({
          category: categoryKey === 'trending' ? undefined : categoryKey,
        });
        setItems(data);
      } catch (e) {
        setError(apiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryKey]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader
        title={categoryKey}
        onBack={() => navigation.goBack()}
      />
      <StateBox loading={loading} error={error} empty={!items.length}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg }}
          ListHeaderComponent={
            <View>
              {items.some((item) => item.isCached) ? (
                <View
                  style={styles.cachedBanner}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                >
                  <Text style={styles.cachedText}>{t('common.cached')}</Text>
                </View>
              ) : null}
              <Text style={styles.sub}>{items.length} places</Text>
            </View>
          }
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  sub: { color: colors.inkSoft, marginBottom: 12 },
  cachedBanner: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  cachedText: { color: colors.ink, lineHeight: 19 },
});
