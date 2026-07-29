import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { bookingsRepository, listingsRepository } from '../repositories/listingsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import { formatDateTime, formatMoney } from '../localization';

const STATUS_COPY = {
  PENDING: 'Identity and quality checks are in progress. Your profile is not public yet.',
  APPROVED: 'Your guide profile is verified and visible to travelers.',
  REJECTED: 'Your application needs changes before it can be reviewed again.',
  DRAFT: 'Complete and submit your application for review.',
};

export default function GuideDashboardScreen({ navigation }) {
  const { session, language } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const nextProfile = await guidesRepository.mine();
      setProfile(nextProfile);
      try {
        const [nextBookings, nextListings] = await Promise.all([
          bookingsRepository.providerList(),
          listingsRepository.mine(),
        ]);
        setBookings(nextBookings);
        setListings(nextListings);
      } catch {
        setBookings([]);
        setListings([]);
      }
    } catch (e) {
      if (e.response?.status === 404) {
        setProfile(null);
      } else {
        setError(apiErrorMessage(e));
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => navigation.addListener('focus', load), [navigation, load]);

  const answer = async (booking, action) => {
    try {
      await bookingsRepository.updateStatus(booking.id, action);
      await load();
    } catch (e) {
      Alert.alert('Could not update booking', apiErrorMessage(e));
    }
  };

  const toggleListing = async (listing) => {
    try {
      if (listing.status === 'PUBLISHED') await listingsRepository.unpublish(listing.id);
      else await listingsRepository.publish(listing.id);
      await load();
    } catch (e) {
      Alert.alert('Could not update listing', apiErrorMessage(e));
    }
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScreenHeader title="Guide workspace" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text style={styles.muted}>Log in to manage a guide profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Guide workspace" onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error}>
        <ScrollView contentContainerStyle={styles.body}>
          {profile ? (
            <>
              <View style={styles.statusCard}>
                <View style={styles.statusTop}>
                  <Text style={styles.label}>Application status</Text>
                  <Text style={styles.status}>{profile.status || 'PENDING'}</Text>
                </View>
                <Text style={styles.statusCopy}>
                  {STATUS_COPY[profile.status] || STATUS_COPY.PENDING}
                </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>
                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                </Text>
                <Text style={styles.label}>Rating</Text>
                <Text style={styles.value}>
                  ★ {profile.rating ?? 0} · {profile.reviewCount ?? 0} reviews
                </Text>
                <Text style={styles.label}>Completed trips</Text>
                <Text style={styles.value}>{profile.completedTrips ?? 0}</Text>
              </View>
              <Text style={styles.bio}>{profile.bio}</Text>
              <AppButton
                title="Edit application"
                variant="secondary"
                onPress={() => navigation.navigate('GuideProfileEdit')}
              />
              {profile.status === 'REJECTED' ? (
                <AppButton
                  title="Update and resubmit"
                  onPress={() => navigation.navigate('GuideRegistration')}
                  style={{ marginTop: 10 }}
                />
              ) : null}

              {profile.status === 'APPROVED' ? (
                <>
                  <Text style={styles.section}>Your listings</Text>
                  {!listings.length ? (
                    <Text style={styles.muted}>No listings yet.</Text>
                  ) : listings.map((listing) => (
                    <View key={listing.id} style={styles.booking}>
                      <View style={styles.statusTop}>
                        <Text style={styles.bookingTitle}>{listing.title}</Text>
                        <Text style={styles.bookingStatus}>{listing.status}</Text>
                      </View>
                      <Text style={styles.muted}>{listing.location} · {listing.defaultTotalUnits} unit(s)</Text>
                      {listing.status !== 'ARCHIVED' ? (
                        <Pressable accessibilityRole="button" onPress={() => toggleListing(listing)} style={styles.listingAction}>
                          <Text style={styles.declineText}>{listing.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                  <Text style={styles.section}>Booking requests</Text>
                  {!bookings.length ? (
                    <Text style={styles.muted}>No booking requests yet.</Text>
                  ) : (
                    bookings.map((booking) => (
                      <View key={booking.id} style={styles.booking}>
                        <View style={styles.statusTop}>
                          <Text style={styles.bookingTitle}>
                            {booking.traveler?.name || 'Traveler'}
                          </Text>
                          <Text style={styles.bookingStatus}>{booking.status}</Text>
                        </View>
                        <Text style={styles.muted}>
                          {formatDateTime(booking.startsAt, language)} · {booking.guests} guest{booking.guests === 1 ? '' : 's'}
                        </Text>
                        <Text style={styles.muted}>
                          {formatMoney(booking.amount, booking.currency, language)}
                        </Text>
                        {booking.note ? <Text style={styles.bookingNote}>{booking.note}</Text> : null}
                        {booking.status === 'PENDING' ? (
                          <View style={styles.actions}>
                            <Pressable
                              accessibilityRole="button"
                              onPress={() => answer(booking, 'DECLINE')}
                              style={styles.decline}
                            >
                              <Text style={styles.declineText}>Decline</Text>
                            </Pressable>
                            <Pressable
                              accessibilityRole="button"
                              onPress={() => answer(booking, 'ACCEPT')}
                              style={styles.accept}
                            >
                              <Text style={styles.acceptText}>Accept</Text>
                            </Pressable>
                          </View>
                        ) : null}
                        {['CONFIRMED', 'IN_PROGRESS'].includes(booking.status) ? (
                          <Pressable onPress={() => navigation.navigate('PaymentMethods', { booking, role: 'provider' })} style={styles.listingAction}>
                            <Text style={styles.declineText}>Payment policy {booking.payment ? `· ${booking.payment.status}` : ''}</Text>
                          </Pressable>
                        ) : null}
                      </View>
                    ))
                  )}
                </>
              ) : null}
            </>
          ) : (
            <View style={styles.center}>
              <Text style={styles.muted}>No guide application yet.</Text>
              <Pressable onPress={() => navigation.navigate('GuideRegistration')}>
                <Text style={styles.link}>Apply to become a guide</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
  statusCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 14,
  },
  statusTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  status: { color: colors.brand, fontWeight: '800', fontSize: 12 },
  statusCopy: { color: colors.ink, marginTop: 10, lineHeight: 20 },
  details: {
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 16,
  },
  label: { color: colors.inkSoft, fontSize: 12, marginTop: 6 },
  value: { color: colors.ink, fontSize: 16, fontWeight: '600', marginTop: 2 },
  bio: { color: colors.ink, lineHeight: 21, marginBottom: 20 },
  section: { color: colors.ink, fontSize: 19, fontWeight: '700', marginTop: 28, marginBottom: 12 },
  booking: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  bookingTitle: { color: colors.ink, fontWeight: '700', fontSize: 15 },
  bookingStatus: { color: colors.inkSoft, fontWeight: '700', fontSize: 11 },
  bookingNote: { color: colors.ink, marginTop: 10, lineHeight: 19 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  decline: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: { color: colors.ink, fontWeight: '700' },
  accept: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: { color: colors.white, fontWeight: '700' },
  listingAction: { minHeight: 44, justifyContent: 'center', marginTop: 8 },
  center: { padding: 40, alignItems: 'center' },
  muted: { color: colors.inkSoft, lineHeight: 19 },
  link: { color: colors.brand, fontWeight: '700', marginTop: 12 },
});
