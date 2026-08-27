import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminAccessBoundary from '../components/admin/AdminAccessBoundary';
import { ScreenHeader } from '../components/ui';
import { useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const SECTIONS = [
  { route: 'AdminKnowledge', icon: 'library-outline', title: 'admin.knowledge', copy: 'admin.knowledgeCopy' },
  { route: 'AdminRouteGraph', icon: 'git-network-outline', title: 'admin.routeGraph', copy: 'admin.routeGraphCopy' },
  { route: 'AdminSafetyPlans', icon: 'shield-checkmark-outline', title: 'admin.safetyPlans', copy: 'admin.safetyPlansCopy' },
  { route: 'AdminGuideEvidence', icon: 'documents-outline', title: 'admin.guideEvidence', copy: 'admin.guideEvidenceCopy' },
  { route: 'AdminAssessmentReview', icon: 'eye-off-outline', title: 'admin.blindReview', copy: 'admin.blindReviewCopy' },
  { route: 'AdminGuideApplications', icon: 'person-add-outline', title: 'admin.guideApplications', copy: 'admin.guideApplicationsCopy' },
  { route: 'ResearchDashboard', icon: 'analytics-outline', title: 'admin.research', copy: 'admin.researchCopy' },
  { route: 'AdminReports', icon: 'warning-outline', title: 'admin.reports', copy: 'admin.reportsCopy' },
];

export default function AdminWorkspaceScreen({ navigation }) {
  const { t } = useT();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('admin.title')} onBack={() => navigation.goBack()} />
      <AdminAccessBoundary>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>{t('admin.protected')}</Text>
            <Text style={styles.heading}>{t('admin.heading')}</Text>
            <Text style={styles.copy}>{t('admin.copy')}</Text>
          </View>
          <View style={styles.grid}>
            {SECTIONS.map((section) => (
              <Pressable
                key={section.route}
                accessibilityRole="button"
                accessibilityLabel={t(section.title)}
                accessibilityHint={t(section.copy)}
                onPress={() => navigation.navigate(section.route)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name={section.icon} size={22} color={colors.brand} />
                </View>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{t(section.title)}</Text>
                  <Text style={styles.cardText}>{t(section.copy)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.inkSoft} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </AdminAccessBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: spacing.lg, paddingBottom: 56, gap: spacing.lg },
  hero: { padding: 18, gap: 7, borderRadius: radius.xl, backgroundColor: colors.ink },
  eyebrow: { color: '#FDA4AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  heading: { color: colors.white, fontSize: 24, fontWeight: '800' },
  copy: { color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 20, maxWidth: 680 },
  grid: { gap: 10 },
  card: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  cardPressed: { opacity: 0.76 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  cardCopy: { flex: 1 },
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  cardText: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
});
