import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader } from '../components/ui';
import { bookingsRepository } from '../repositories/listingsRepository';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

const METHODS = ['CASH_ON_ARRIVAL', 'BANK_TRANSFER', 'PROVIDER_TERMINAL'];

export default function PaymentMethodsScreen({ navigation, route }) {
  const booking = route.params?.booking;
  const role = route.params?.role || 'traveler';
  const [payment, setPayment] = useState(booking?.payment || null);
  const [method, setMethod] = useState(payment?.arrangement || 'CASH_ON_ARRIVAL');
  const [instructions, setInstructions] = useState(payment?.instructions || '');
  const [loading, setLoading] = useState(false);
  const { t } = useT();
  const run = async (operation) => { setLoading(true); try { setPayment(await operation()); } catch (error) { Alert.alert('Payment policy update failed', apiErrorMessage(error)); } finally { setLoading(false); } };
  const needsAgreement = payment?.status === 'PENDING' && (role === 'provider' ? !payment.agreedByProviderAt : !payment.agreedByTravelerAt);
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title="Payment policy" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('payment.arrival')}</Text>
          <Text style={styles.copy}>{t('payment.arrivalBody')}</Text>
        </View>
        {booking ? (
          <>
            <Text style={styles.heading}>Booking arrangement</Text>
            <View style={styles.methods}>{METHODS.map((value) => <Pressable key={value} onPress={() => setMethod(value)} style={[styles.method, method === value && styles.methodActive]}><Text style={method === value ? styles.methodTextActive : styles.methodText}>{value.replaceAll('_', ' ')}</Text></Pressable>)}</View>
            <AppInput label="Instructions (no card details)" value={instructions} onChangeText={setInstructions} multiline />
            <AppButton title="Propose arrangement" loading={loading} onPress={() => run(() => bookingsRepository.proposePayment(booking.id, method, instructions.trim() || undefined))} />
            {needsAgreement ? <AppButton title="Agree to arrangement" variant="secondary" loading={loading} onPress={() => run(() => bookingsRepository.agreePayment(booking.id))} style={{ marginTop: 10 }} /> : null}
            {payment?.status === 'AGREED' && role === 'provider' ? <AppButton title="Confirm payment received" loading={loading} onPress={() => run(() => bookingsRepository.markPaymentPaid(booking.id))} style={{ marginTop: 10 }} /> : null}
            {payment ? <Text style={styles.status}>Status: {payment.status}</Text> : null}
          </>
        ) : null}
        <View style={styles.notice}><Text style={styles.noticeTitle}>{t('payment.protect')}</Text><Text style={styles.copy}>{t('payment.protectBody')}</Text></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white }, body: { padding: spacing.lg, gap: 12 }, card: { borderRadius: radius.md, backgroundColor: colors.secondary, padding: 18 },
  notice: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 18 }, title: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  heading: { color: colors.ink, fontWeight: '700', marginTop: 8 }, noticeTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' }, copy: { color: colors.inkSoft, lineHeight: 21, marginTop: 8 },
  methods: { gap: 8 }, method: { minHeight: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, justifyContent: 'center', paddingHorizontal: 12 }, methodActive: { backgroundColor: colors.ink },
  methodText: { color: colors.ink }, methodTextActive: { color: colors.white, fontWeight: '700' }, status: { color: colors.brand, fontWeight: '700', textAlign: 'center', marginTop: 6 },
});
