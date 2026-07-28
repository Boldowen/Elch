import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const LINKS = [
  { key: 'profile.account', route: 'AccountSettings' },
  { key: 'profile.saved', route: 'SavedTrips' },
  { key: 'profile.payment', route: 'PaymentMethods' },
  { key: 'profile.safety', route: 'Safety' },
  { key: 'profile.help', route: 'HelpCenter' },
  { key: 'profile.becomeGuide', route: 'GuideRegistration' },
  { key: 'profile.guideWorkspace', route: 'GuideDashboard' },
  { key: 'profile.ranking', route: 'GuideRanking' },
];

export default function ProfileScreen({ navigation }) {
  const { session, logout, language, setLanguage } = useAuth();
  const { t } = useT();

  if (!session) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        <View style={styles.guest}>
          <Text style={styles.guestText}>{t('profile.signInCopy')}</Text>
          <AppButton title={t('profile.login')} onPress={() => navigation.navigate('Auth', { mode: 'login' })} />
          <AppButton title={t('profile.create')} variant="secondary" onPress={() => navigation.navigate('Auth', { mode: 'register' })} style={{ marginTop: 10 }} />
        </View>
      </SafeAreaView>
    );
  }

  const user = session.user;
  const links = user.roles?.includes('ADMIN')
    ? [{ key: 'Guide applications', route: 'AdminGuideApplications', literal: true }, ...LINKS]
    : LINKS;
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        <View style={styles.hero}>
          <Image source={user.avatarUrl || undefined} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.roles}>{user.roles?.join(' · ')}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langRow}>
          {['en', 'mn', 'zh', 'ru', 'ko', 'ja'].map((lang) => (
            <Pressable key={lang} onPress={() => setLanguage(lang)} accessibilityRole="button" accessibilityState={{ selected: language === lang }} style={[styles.lang, language === lang && styles.langActive]}>
              <Text style={[styles.langText, language === lang && styles.langTextActive]}>{lang.toUpperCase()}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {links.map((link) => (
          <Pressable key={link.route} accessibilityRole="button" style={styles.link} onPress={() => navigation.navigate(link.route)}>
            <Text style={styles.linkText}>{link.literal ? link.key : t(link.key)}</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        ))}
        <AppButton title={t('profile.logout')} variant="ghost" onPress={logout} style={{ margin: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  title: { fontSize: 28, fontWeight: '600', color: colors.ink, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  guest: { padding: spacing.xl, gap: 8, marginTop: 40 },
  guestText: { color: colors.inkSoft, marginBottom: 16, fontSize: 15 },
  hero: { alignItems: 'center', padding: spacing.xl },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.secondary, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: colors.ink },
  email: { color: colors.inkSoft, marginTop: 4 },
  roles: { color: colors.brand, marginTop: 6, fontWeight: '600', fontSize: 13 },
  langRow: { gap: 8, paddingHorizontal: spacing.lg, paddingBottom: 14 },
  lang: { minWidth: 48, minHeight: 40, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  langActive: { backgroundColor: colors.ink },
  langText: { fontWeight: '700', color: colors.ink, fontSize: 12 },
  langTextActive: { color: colors.white },
  link: { minHeight: 52, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  linkText: { flex: 1, fontSize: 16, color: colors.ink, fontWeight: '500' },
  chev: { fontSize: 22, color: colors.inkSoft },
});
