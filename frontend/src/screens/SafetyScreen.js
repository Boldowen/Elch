import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ui';
import { useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const services = [
  { key: 'safety.fire', number: '101' },
  { key: 'safety.police', number: '102' },
  { key: 'safety.ambulance', number: '103' },
];

export default function SafetyScreen({ navigation }) {
  const { t } = useT();
  const call = async (number) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch {
      Alert.alert(t('safety.title'), number);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('safety.title')} onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.copy}>{t('safety.copy')}</Text>
        <View style={styles.list}>
          {services.map((service) => (
            <View key={service.number} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{t(service.key)}</Text>
                <Text style={styles.number}>{service.number}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t('safety.call')} ${t(service.key)} ${service.number}`}
                onPress={() => call(service.number)}
                style={styles.call}
              >
                <Text style={styles.callText}>{t('safety.call')}</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View style={styles.offline}>
          <Text style={styles.offlineTitle}>{t('safety.offline')}</Text>
          <Text style={styles.copy}>{t('safety.trip')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg },
  copy: { color: colors.inkSoft, lineHeight: 21 },
  list: { marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.ink, fontWeight: '700' },
  number: { color: colors.inkSoft, marginTop: 4, fontSize: 16 },
  call: { minWidth: 88, minHeight: 48, borderRadius: radius.md, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  callText: { color: colors.white, fontWeight: '700' },
  offline: { marginTop: 22, borderRadius: radius.md, backgroundColor: colors.secondary, padding: 16 },
  offlineTitle: { color: colors.ink, fontWeight: '700', marginBottom: 8 },
});
