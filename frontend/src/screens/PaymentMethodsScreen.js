import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ui';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

export default function PaymentMethodsScreen({ navigation }) {
  const { t } = useT();
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('payment.title')} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('payment.arrival')}</Text>
          <Text style={styles.copy}>{t('payment.arrivalBody')}</Text>
        </View>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>{t('payment.protect')}</Text>
          <Text style={styles.copy}>{t('payment.protectBody')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, gap: 12 },
  card: { borderRadius: radius.md, backgroundColor: colors.secondary, padding: 18 },
  notice: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 18 },
  title: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  noticeTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  copy: { color: colors.inkSoft, lineHeight: 21, marginTop: 8 },
});
