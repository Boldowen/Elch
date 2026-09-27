import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatDateTime, formatMoney, useT } from '../localization';
import { colors } from '../theme';

export default function CancellationPolicy({ policy }) {
  const { t, language } = useT();
  const deadline = policy?.freeCancellationUntil;
  const feePercent = Number(policy?.lateCancellationPercent);
  const fee = Number.isFinite(feePercent) && Number.isSafeInteger(policy?.amountMinor)
    ? Math.round(policy.amountMinor * feePercent / 100) / 100
    : null;
  return (
    <View style={styles.body}>
      <Text style={styles.title} accessibilityRole="header">{t('booking.cancellation')}</Text>
      {deadline ? <>
        <Text style={styles.copy}>{t('booking.freeUntil')} {formatDateTime(deadline, language)}</Text>
        <Text style={styles.copy}>{t('booking.lateFee')} {feePercent}%{fee !== null ? ` (${formatMoney(fee, policy.currency || 'USD', language)})` : ''}</Text>
      </> : <Text style={styles.copy}>{t('booking.cancellationBody')}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: 7, marginVertical: 12 },
  title: { color: colors.ink, fontWeight: '700' },
  copy: { color: colors.inkSoft, lineHeight: 20, fontSize: 13 },
});
