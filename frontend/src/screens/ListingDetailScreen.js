import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, ScreenHeader, StateBox } from '../components/ui';
import { listingsRepository } from '../repositories/listingsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function ListingDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { session } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listingsRepository.one(id);
        setItem(data);
      } catch (e) {
        setError(apiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const book = () => {
    if (!session) {
      navigation.navigate('Auth', { mode: 'login' });
      return;
    }
    navigation.navigate('Booking', {
      kind: 'listing',
      id,
      title: item.title,
      price: item.price,
      unit: item.priceUnit,
      currency: item.currency,
    });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Listing" onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error} empty={!item}>
        {item ? (
          <>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
              <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                {(item.images.length ? item.images : [null]).map((uri, i) => (
                  <Image
                    key={i}
                    source={uri}
                    style={styles.hero}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
              <View style={styles.body}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.location} · ★ {item.rating} ({item.reviews})
                </Text>
                <Text style={styles.desc}>{item.description}</Text>
                <Text style={styles.section}>Amenities</Text>
                {item.amenities.map((a) => (
                  <Text key={a} style={styles.bullet}>
                    · {a}
                  </Text>
                ))}
                <Text style={styles.section}>Host</Text>
                <Text style={styles.meta}>
                  {item.hostName}
                  {item.superhost ? ' · Superhost' : ''}
                </Text>
              </View>
            </ScrollView>
            <View style={styles.bar}>
              <View>
                <Text style={styles.price}>
                  ${item.price}{' '}
                  <Text style={styles.unit}>/ {item.priceUnit}</Text>
                </Text>
                <Text style={styles.dates}>{item.dates || 'Flexible dates'}</Text>
              </View>
              <AppButton
                title="Book"
                onPress={book}
                style={{ minWidth: 140 }}
              />
            </View>
          </>
        ) : null}
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  hero: { width: 390, height: 280, backgroundColor: colors.secondary },
  body: { padding: spacing.lg },
  title: { fontSize: 24, fontWeight: '700', color: colors.ink },
  meta: { color: colors.inkSoft, marginTop: 6, fontSize: 14 },
  desc: { marginTop: 16, fontSize: 15, lineHeight: 22, color: colors.ink },
  section: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  bullet: { color: colors.ink, marginBottom: 4, fontSize: 14 },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  price: { fontSize: 18, fontWeight: '700', color: colors.ink },
  unit: { fontSize: 14, fontWeight: '400', color: colors.inkSoft },
  dates: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
});
