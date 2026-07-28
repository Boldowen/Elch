import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { bookingsRepository } from '../repositories/listingsRepository';
import { apiErrorMessage } from '../services/api';
import { formatMoney, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function dateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function BookingScreen({ navigation, route }) {
  const { kind, id, title, price = 0, unit = 'unit' } = route.params;
  const tomorrow = new Date(Date.now() + 86_400_000);
  const [date, setDate] = useState(dateValue(tomorrow));
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(kind === 'guide' ? '2' : '1');
  const [guests, setGuests] = useState('1');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, language } = useT();

  const durationLabel = kind === 'guide' ? t('booking.hours') : t('booking.nights');
  const estimatedTotal = useMemo(
    () => (Number(price) * Math.max(1, Number(duration) || 1)).toFixed(2),
    [price, duration],
  );

  const submit = async () => {
    const start = new Date(`${date}T${time}:00`);
    const durationNumber = Number(duration);
    const guestNumber = Number(guests);
    if (
      Number.isNaN(start.getTime()) ||
      start.getTime() <= Date.now() ||
      !Number.isInteger(durationNumber) ||
      durationNumber < 1 ||
      durationNumber > 30 ||
      !Number.isInteger(guestNumber) ||
      guestNumber < 1 ||
      guestNumber > 30
    ) {
      Alert.alert(
        t('booking.check'),
        t('booking.checkBody'),
      );
      return;
    }

    const unitMs = kind === 'guide' ? 3_600_000 : 86_400_000;
    const end = new Date(start.getTime() + durationNumber * unitMs);
    setLoading(true);
    try {
      await bookingsRepository.create({
        ...(kind === 'guide' ? { guideId: id } : { listingId: id }),
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
        guests: guestNumber,
        note: note.trim() || undefined,
      });
      Alert.alert(
        t('booking.sent'),
        t('booking.sentBody'),
      );
      navigation.navigate('Main', { screen: 'Trips' });
    } catch (error) {
      Alert.alert(t('booking.failed'), apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('booking.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>
          {t('booking.review')}
        </Text>
        <AppInput
          label={t('booking.date')}
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
        />
        <AppInput
          label={t('booking.time')}
          value={time}
          onChangeText={setTime}
          keyboardType="numbers-and-punctuation"
        />
        <AppInput
          label={durationLabel}
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
        />
        <AppInput
          label={t('booking.guests')}
          value={guests}
          onChangeText={setGuests}
          keyboardType="number-pad"
        />
        <AppInput
          label={t('booking.notes')}
          value={note}
          onChangeText={setNote}
          placeholder={t('booking.notesHint')}
          multiline
          style={styles.note}
        />

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('booking.rate')}</Text>
            <Text style={styles.summaryValue}>{formatMoney(price, 'USD', language)} / {unit}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('booking.total')}</Text>
            <Text style={styles.total}>{formatMoney(estimatedTotal, 'USD', language)}</Text>
          </View>
          <Text style={styles.disclaimer}>
            {t('booking.pilot')}
          </Text>
          <Text style={styles.policyTitle}>{t('booking.cancellation')}</Text>
          <Text style={styles.disclaimer}>{t('booking.cancellationBody')}</Text>
        </View>

        <AppButton title={t('booking.send')} onPress={submit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', color: colors.ink },
  sub: {
    color: colors.inkSoft,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 22,
  },
  note: { minHeight: 96 },
  summary: {
    backgroundColor: colors.secondary,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 18,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: { color: colors.inkSoft },
  summaryValue: { color: colors.ink, fontWeight: '600' },
  totalLabel: { color: colors.ink, fontWeight: '700' },
  total: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  disclaimer: { color: colors.inkSoft, fontSize: 12, lineHeight: 17 },
  policyTitle: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 4 },
});
