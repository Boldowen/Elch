import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StateBox } from '../components/ui';
import { bookingsRepository } from '../repositories/listingsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import { formatDateTime, formatMoney, useT } from '../localization';
import { useHideTabBarOnScroll } from '../navigation/useHideTabBarOnScroll';

const cancellable = new Set(['PENDING', 'CONFIRMED']);

export default function TripsScreen({ navigation }) {
  const onScroll = useHideTabBarOnScroll();
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { t, language } = useT();

  const load = useCallback(async () => {
    if (!session) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setItems(await bookingsRepository.list());
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session]);

  useEffect(() => navigation.addListener('focus', load), [navigation, load]);

  const cancel = (booking) => {
    Alert.alert(t('trips.cancelTitle'), t('trips.cancelBody'), [
      { text: t('trips.keep'), style: 'cancel' },
      {
        text: t('trips.cancel'),
        style: 'destructive',
        onPress: async () => {
          try {
            await bookingsRepository.updateStatus(booking.id, 'CANCEL');
            await load();
          } catch (e) {
            Alert.alert(t('trips.cancelFailed'), apiErrorMessage(e));
          }
        },
      },
    ]);
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Text style={styles.title}>{t('trips.title')}</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t('trips.loginCopy')}</Text>
          <Pressable onPress={() => navigation.navigate('Auth', { mode: 'login' })}>
            <Text style={styles.link}>{t('profile.login')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>{t('trips.title')}</Text>
      <StateBox
        loading={loading}
        error={error}
        empty={!items.length}
        emptyText={t('trips.empty')}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
            />
          }
          renderItem={({ item }) => {
            const startsAt = item.startsAt ? new Date(item.startsAt) : null;
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.listing?.title || item.guide?.name || 'Booking'}
                  </Text>
                  <View style={[styles.badge, styles[`badge${item.status}`]]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.meta}>
                  {startsAt ? formatDateTime(startsAt, language) : t('trips.dateMissing')}
                </Text>
                <Text style={styles.meta}>
                  {item.guests} · {formatMoney(item.amount, item.currency, language)}
                </Text>
                {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
                {item.status === 'DRAFT' ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('trips.resumeDraft')}
                    onPress={() => navigation.navigate('Booking', { draftId: item.id })}
                    style={styles.cancel}
                  >
                    <Text style={styles.cancelText}>{t('trips.resumeDraft')}</Text>
                  </Pressable>
                ) : null}
                {cancellable.has(item.status) ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('trips.cancel')}
                    onPress={() => cancel(item)}
                    style={styles.cancel}
                  >
                    <Text style={styles.cancelText}>{t('trips.cancel')}</Text>
                  </Pressable>
                ) : null}
                {item.status === 'COMPLETED' && !item.review ? (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.navigate('CreateReview', { bookingId: item.id, title: item.listing?.title || item.guide?.name })}
                    style={styles.cancel}
                  >
                    <Text style={styles.cancelText}>Write verified review</Text>
                  </Pressable>
                ) : null}
                {['CONFIRMED', 'IN_PROGRESS'].includes(item.status) ? (
                  <Pressable onPress={() => navigation.navigate('PaymentMethods', { booking: item, role: 'traveler' })} style={styles.cancel}>
                    <Text style={styles.cancelText}>Payment policy {item.payment ? `· ${item.payment.status}` : ''}</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          }}
        />
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyText: { color: colors.inkSoft },
  link: { color: colors.brand, fontWeight: '700' },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.ink },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.secondary,
  },
  badgeCONFIRMED: { backgroundColor: '#DDF4E7' },
  badgeCANCELLED: { backgroundColor: '#F3E1E1' },
  badgeDECLINED: { backgroundColor: '#F3E1E1' },
  badgeText: { color: colors.ink, fontSize: 10, fontWeight: '700' },
  meta: { color: colors.inkSoft, marginTop: 6, fontSize: 13 },
  note: { color: colors.ink, marginTop: 10, lineHeight: 19 },
  cancel: { minHeight: 44, justifyContent: 'center', marginTop: 10 },
  cancelText: { color: colors.brand, fontWeight: '700' },
});
