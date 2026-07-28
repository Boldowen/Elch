import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing } from '../theme';
import { useT } from '../localization';

export default function WelcomeScreen({ navigation }) {
  const { selectRole } = useAuth();
  const { t } = useT();

  const pick = (role) => {
    selectRole(role);
    navigation.navigate('Auth', {
      mode: role === 'traveler' ? 'register' : 'login',
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <BrandMark dark />
      <View style={styles.center}>
        <View style={styles.globe}>
          <Text style={styles.globeEmoji}>🌍</Text>
        </View>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.sub}>{t('welcome.sub')}</Text>
      </View>
      <View style={styles.row}>
        <RoleCard
          title={t('welcome.travel')}
          subtitle={t('welcome.travelSub')}
          accent
          onPress={() => pick('traveler')}
        />
        <RoleCard
          title={t('welcome.guide')}
          subtitle={t('welcome.guideSub')}
          onPress={() => pick('guide')}
        />
      </View>
    </SafeAreaView>
  );
}

function RoleCard({ title, subtitle, accent, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, accent ? styles.cardAccent : styles.cardMuted]}
    >
      <Text style={[styles.cardTitle, accent && { color: '#fff' }]}>{title}</Text>
      <Text style={[styles.cardSub, accent && { color: 'rgba(255,255,255,0.8)' }]}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.introBackground,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  center: { flex: 1, justifyContent: 'center' },
  globe: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.introPanel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  globeEmoji: { fontSize: 56 },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: colors.white,
  },
  sub: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.6)',
  },
  row: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: 14,
    minHeight: 120,
  },
  cardAccent: { backgroundColor: colors.introAccent },
  cardMuted: { backgroundColor: colors.introPanel },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.white, marginBottom: 6 },
  cardSub: { fontSize: 12, lineHeight: 17, color: 'rgba(255,255,255,0.55)' },
});
