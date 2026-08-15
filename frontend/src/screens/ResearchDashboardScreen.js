import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, ScreenHeader, StateBox } from '../components/ui';
import DistributionList from '../components/research/DistributionList';
import MetricCard from '../components/research/MetricCard';
import { researchRepository } from '../repositories/researchRepository';
import { researchSummaryHasData } from '../models/research';
import { apiErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatMoney, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function score(value) {
  return value === null || value === undefined ? '—' : Number(value).toFixed(1);
}

function exportFileName(format) {
  return `elch-research-${new Date().toISOString().slice(0, 10)}.${format}`;
}

async function deliverExport(exported) {
  const fileName = exportFileName(exported.format);
  if (
    Platform.OS === 'web' &&
    globalThis.document &&
    globalThis.Blob &&
    globalThis.URL?.createObjectURL
  ) {
    const blob = new globalThis.Blob([exported.content], { type: exported.contentType });
    const url = globalThis.URL.createObjectURL(blob);
    const link = globalThis.document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    globalThis.document.body.appendChild(link);
    link.click();
    link.remove();
    globalThis.URL.revokeObjectURL(url);
    return;
  }
  await Share.share({ title: fileName, message: exported.content });
}

function DashboardError({ title, message, retryLabel, onRetry }) {
  return (
    <View style={styles.centerState} accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={34} color={colors.warning} />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateCopy}>{message}</Text>
      <AppButton title={retryLabel} onPress={onRetry} style={styles.retry} />
    </View>
  );
}

export default function ResearchDashboardScreen({ navigation }) {
  const { session } = useAuth();
  const { t, language } = useT();
  const isAdmin = Boolean(session?.user?.roles?.includes('ADMIN'));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [exportError, setExportError] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const requestId = useRef(0);
  const mounted = useRef(true);

  const load = useCallback(async (initial = false) => {
    if (!isAdmin) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    const currentRequest = ++requestId.current;
    if (initial) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await researchRepository.summary();
      if (mounted.current && currentRequest === requestId.current) setSummary(data);
    } catch (nextError) {
      if (mounted.current && currentRequest === requestId.current) setError(apiErrorMessage(nextError));
    } finally {
      if (mounted.current && currentRequest === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    mounted.current = true;
    load(true);
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, [load]);

  const runExport = async (format) => {
    if (!isAdmin || exporting) return;
    setExporting(format);
    setExportError(null);
    setExportStatus(null);
    try {
      const exported = await researchRepository.exportData(format);
      await deliverExport(exported);
      if (mounted.current) setExportStatus(t('researchDashboard.exportReady'));
    } catch (nextError) {
      if (mounted.current) setExportError(apiErrorMessage(nextError));
    } finally {
      if (mounted.current) setExporting(null);
    }
  };

  const headerAction = isAdmin ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('researchDashboard.refresh')}
      disabled={loading || refreshing}
      onPress={() => load(false)}
      hitSlop={10}
      style={styles.refreshButton}
    >
      <Ionicons name="refresh" size={20} color={colors.ink} />
    </Pressable>
  ) : null;

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScreenHeader title={t('researchDashboard.title')} onBack={() => navigation.goBack()} />
        <View style={styles.centerState}>
          <Ionicons name="lock-closed-outline" size={36} color={colors.inkSoft} />
          <Text style={styles.stateTitle}>{t('researchDashboard.restricted')}</Text>
          <Text style={styles.stateCopy}>{t('researchDashboard.restrictedCopy')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('researchDashboard.title')} onBack={() => navigation.goBack()} right={headerAction} />
      <StateBox loading={loading}>
        {error && !summary ? (
          <DashboardError
            title={t('researchDashboard.loadFailed')}
            message={error}
            retryLabel={t('researchDashboard.retry')}
            onRetry={() => load(true)}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(false)} tintColor={colors.brand} />}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>{t('researchDashboard.adminOnly')}</Text>
              <Text style={styles.heroTitle}>{t('researchDashboard.heading')}</Text>
              <Text style={styles.heroCopy}>{t('researchDashboard.copy')}</Text>
              {summary?.generatedAt ? (
                <Text style={styles.updated}>{t('researchDashboard.updated')} {formatDateTime(summary.generatedAt, language)}</Text>
              ) : null}
            </View>

            {error ? (
              <View style={styles.inlineError} accessibilityLiveRegion="assertive">
                <Text style={styles.inlineErrorText}>{error}</Text>
              </View>
            ) : null}

            {summary && !researchSummaryHasData(summary) ? (
              <View style={styles.emptyNotice} accessibilityLiveRegion="polite">
                <Ionicons name="analytics-outline" size={21} color={colors.inkSoft} />
                <View style={styles.emptyCopy}>
                  <Text style={styles.emptyTitle}>{t('researchDashboard.empty')}</Text>
                  <Text style={styles.emptyText}>{t('researchDashboard.emptyCopy')}</Text>
                </View>
              </View>
            ) : null}

            {summary ? (
              <>
                <View style={styles.metrics}>
                  <MetricCard icon="chatbubbles-outline" label={t('researchDashboard.requests')} value={summary.totalAiRequests} />
                  <MetricCard icon="cash-outline" label={t('researchDashboard.cost')} value={formatMoney(summary.estimatedAiCost, summary.currency, language)} detail={t('researchDashboard.estimated')} />
                  <MetricCard icon="warning-outline" label={t('researchDashboard.validatorFailures')} value={summary.routeValidationFailures} tone="warning" />
                  <MetricCard icon="ribbon-outline" label={t('researchDashboard.guideAssessments')} value={summary.guideAssessmentCount} tone="success" />
                </View>

                <View style={styles.grid}>
                  <DistributionList title={t('researchDashboard.modes')} items={summary.experimentModes} emptyText={t('researchDashboard.noDistribution')} />
                  <DistributionList title={t('researchDashboard.models')} items={summary.modelUsage} emptyText={t('researchDashboard.noDistribution')} />
                  <DistributionList title={t('researchDashboard.validationErrors')} items={summary.commonValidationErrors} emptyText={t('researchDashboard.noValidationErrors')} />
                </View>

                <Text style={styles.sectionTitle}>{t('researchDashboard.aiHuman')}</Text>
                <View style={styles.metrics}>
                  <MetricCard icon="sparkles-outline" label={t('researchDashboard.aiAverage')} value={score(summary.aiHumanComparison.aiAverage)} />
                  <MetricCard icon="people-outline" label={t('researchDashboard.humanAverage')} value={score(summary.aiHumanComparison.humanAverage)} tone="success" />
                  <MetricCard icon="git-compare-outline" label={t('researchDashboard.correlation')} value={score(summary.aiHumanComparison.correlation)} detail={`${summary.aiHumanComparison.sampleSize} ${t('researchDashboard.pairedReviews')}`} />
                </View>

                <Text style={styles.sectionTitle}>{t('researchDashboard.verification')}</Text>
                <View style={styles.grid}>
                  <DistributionList title={t('researchDashboard.routeCompetency')} items={summary.routeCompetencies} emptyText={t('researchDashboard.noDistribution')} />
                  <DistributionList title={t('researchDashboard.languageEstimates')} items={summary.languageEstimates} emptyText={t('researchDashboard.noDistribution')} />
                  <DistributionList title={t('researchDashboard.firstAid')} items={summary.firstAidVerification} emptyText={t('researchDashboard.noDistribution')} />
                </View>
              </>
            ) : null}

            <View style={styles.exportCard}>
              <View style={styles.exportHeading}>
                <Ionicons name="download-outline" size={21} color={colors.brand} />
                <View style={styles.exportCopy}>
                  <Text style={styles.exportTitle}>{t('researchDashboard.export')}</Text>
                  <Text style={styles.exportDescription}>{t('researchDashboard.exportCopy')}</Text>
                </View>
              </View>
              <View style={styles.exportActions}>
                <AppButton title={t('researchDashboard.exportJson')} onPress={() => runExport('json')} loading={exporting === 'json'} disabled={Boolean(exporting)} style={styles.exportButton} />
                <AppButton title={t('researchDashboard.exportCsv')} onPress={() => runExport('csv')} loading={exporting === 'csv'} disabled={Boolean(exporting)} variant="secondary" style={styles.exportButton} />
              </View>
              {exportStatus ? <Text style={styles.successText}>{exportStatus}</Text> : null}
              {exportError ? <Text style={styles.inlineErrorText}>{exportError}</Text> : null}
            </View>
          </ScrollView>
        )}
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 1040, alignSelf: 'center', padding: spacing.lg, paddingBottom: 56, gap: spacing.lg },
  refreshButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  hero: { gap: 7, padding: 17, borderRadius: radius.xl, backgroundColor: colors.ink },
  eyebrow: { color: '#FDA4AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: '800' },
  heroCopy: { maxWidth: 680, color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 20 },
  updated: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 3 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 10 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  emptyNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  emptyCopy: { flex: 1 },
  emptyTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  emptyText: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  inlineError: { padding: 12, borderRadius: radius.md, backgroundColor: '#FEF2F2' },
  inlineErrorText: { color: '#B42318', fontSize: 12, lineHeight: 18 },
  successText: { color: colors.success, fontSize: 12, fontWeight: '700' },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32, backgroundColor: colors.white },
  stateTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  stateCopy: { maxWidth: 480, color: colors.inkSoft, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  retry: { minWidth: 180, marginTop: 6 },
  exportCard: { gap: 13, padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  exportHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  exportCopy: { flex: 1 },
  exportTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  exportDescription: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  exportActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  exportButton: { minWidth: 180, flexGrow: 1, flexBasis: 200 },
});
