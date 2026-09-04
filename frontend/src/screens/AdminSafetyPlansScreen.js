import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminAccessBoundary from '../components/admin/AdminAccessBoundary';
import { AppButton, AppInput, ScreenHeader, StateBox } from '../components/ui';
import { adminRepository } from '../repositories/adminRepository';
import { apiErrorMessage } from '../services/api';
import { formatDateTime, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function StatusPill({ value }) {
  const approved = value === 'APPROVED';
  const rejected = value === 'REJECTED' || value === 'REVOKED' || value === 'EXPIRED';
  return (
    <View style={[styles.pill, approved && styles.pillApproved, rejected && styles.pillRejected]}>
      <Text style={styles.pillText}>{value}</Text>
    </View>
  );
}

function TextList({ title, values, empty, t }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {values.length ? values.map((value, index) => (
        <View key={`${title}-${index}`} style={styles.listRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listText}>{value}</Text>
        </View>
      )) : <Text style={styles.help}>{empty || t('safetyAdmin.none')}</Text>}
    </View>
  );
}

function ErrorPanel({ error, onRetry, t }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={36} color={colors.warning} />
      <Text style={styles.centerTitle}>{t('safetyAdmin.loadFailed')}</Text>
      <Text style={styles.centerCopy}>{error}</Text>
      <AppButton title={t('common.retry')} onPress={onRetry} style={styles.retry} />
    </View>
  );
}

export default function AdminSafetyPlansScreen({ navigation }) {
  const { t, language } = useT();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setItems(await adminRepository.safetyPlanQueue());
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = (plan) => {
    setSelected(plan);
    setNotes('');
    setRevokeReason('');
    setActionError(null);
  };

  const decide = (decision) => {
    const trimmed = notes.trim();
    if (decision === 'REJECTED' && trimmed.length < 5) {
      Alert.alert(t('safetyAdmin.notesRequired'), t('safetyAdmin.notesRequiredCopy'));
      return;
    }
    Alert.alert(
      decision === 'APPROVED' ? t('safetyAdmin.approveTitle') : t('safetyAdmin.rejectTitle'),
      decision === 'APPROVED' ? t('safetyAdmin.approveCopy') : t('safetyAdmin.rejectCopy'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: decision === 'APPROVED' ? t('safetyAdmin.approve') : t('safetyAdmin.reject'),
          style: decision === 'REJECTED' ? 'destructive' : 'default',
          onPress: async () => {
            setSaving(true);
            setActionError(null);
            try {
              const updated = await adminRepository.reviewSafetyPlan(selected.id, {
                decision,
                ...(trimmed ? { notes: trimmed } : {}),
              });
              setSelected(updated);
              setItems((current) => current.filter((item) => item.id !== selected.id));
            } catch (nextError) {
              setActionError(apiErrorMessage(nextError));
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  const revoke = () => {
    const reason = revokeReason.trim();
    if (reason.length < 5) {
      Alert.alert(t('safetyAdmin.reasonRequired'), t('safetyAdmin.reasonRequiredCopy'));
      return;
    }
    Alert.alert(t('safetyAdmin.revokeTitle'), t('safetyAdmin.revokeCopy'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('safetyAdmin.revoke'),
        style: 'destructive',
        onPress: async () => {
          setSaving(true);
          setActionError(null);
          try {
            setSelected(await adminRepository.revokeSafetyPlan(selected.id, { reason }));
          } catch (nextError) {
            setActionError(apiErrorMessage(nextError));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const headerBack = selected ? () => {
    if (saving) return;
    setSelected(null);
    setActionError(null);
    load(true);
  } : () => navigation.goBack();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('safetyAdmin.title')} onBack={headerBack} />
      <AdminAccessBoundary>
        {selected ? (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.hero}>
              <View style={styles.heroTop}>
                <View style={styles.heroCopy}>
                  <Text style={styles.eyebrow}>{t('safetyAdmin.humanReview')}</Text>
                  <Text style={styles.heroTitle}>{selected.title}</Text>
                </View>
                <StatusPill value={selected.status} />
              </View>
              <Text style={styles.heroMeta}>
                {selected.route?.name || selected.route?.code || '—'} · {selected.riskLevel} · v{selected.version}
              </Text>
              <Text style={styles.heroMeta}>
                {formatDateTime(selected.tripStartAt, language) || '—'} — {formatDateTime(selected.tripEndAt, language) || '—'}
              </Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('safetyAdmin.assignment')}</Text>
              <Text style={styles.label}>{t('safetyAdmin.guide')}</Text>
              <Text style={styles.value}>{selected.guide?.name || '—'} · {selected.guide?.status || '—'} · {selected.guide?.verified ? t('safetyAdmin.verified') : t('safetyAdmin.unverified')}</Text>
              <Text style={styles.label}>{t('safetyAdmin.creator')}</Text>
              <Text style={styles.value}>{selected.creator?.name || '—'}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('safetyAdmin.itinerary')}</Text>
              {selected.itinerary.map((item, index) => (
                <View key={`${item.day}-${item.nodeCode}-${index}`} style={styles.itineraryRow}>
                  <View style={styles.day}><Text style={styles.dayText}>{item.day}</Text></View>
                  <View style={styles.rowCopy}>
                    <Text style={styles.valueStrong}>{item.nodeCode}</Text>
                    <Text style={styles.help}>{item.activity}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('safetyAdmin.emergencyContacts')}</Text>
              {selected.emergencyContacts.map((contact, index) => (
                <View key={`${contact.phone}-${index}`} style={styles.contactRow}>
                  <Text style={styles.valueStrong}>{contact.name} · {contact.role}</Text>
                  <Text style={styles.help}>{contact.phone}</Text>
                </View>
              ))}
            </View>

            {[
              [t('safetyAdmin.communications'), selected.communicationsPlan],
              [t('safetyAdmin.evacuation'), selected.evacuationPlan],
              [t('safetyAdmin.medical'), selected.medicalPlan],
            ].map(([title, value]) => (
              <View key={title} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.paragraph}>{value || '—'}</Text>
              </View>
            ))}

            <TextList title={t('safetyAdmin.riskMitigations')} values={selected.riskMitigations} t={t} />
            <TextList title={t('safetyAdmin.equipment')} values={selected.equipmentChecklist} t={t} />
            <TextList title={t('safetyAdmin.permits')} values={selected.permitReferences} t={t} />

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('safetyAdmin.audit')}</Text>
              {selected.audit.map((entry, index) => (
                <View key={entry.id || `${entry.action}-${index}`} style={styles.auditRow}>
                  <View style={styles.auditDot} />
                  <View style={styles.rowCopy}>
                    <Text style={styles.valueStrong}>{entry.action} · v{entry.planVersion}</Text>
                    <Text style={styles.help}>{entry.actor?.name || t('safetyAdmin.system')} · {formatDateTime(entry.createdAt, language) || '—'}</Text>
                    {entry.reason ? <Text style={styles.auditReason}>{entry.reason}</Text> : null}
                  </View>
                </View>
              ))}
            </View>

            {selected.status === 'SUBMITTED' ? (
              <View style={styles.decisionCard}>
                <Text style={styles.sectionTitle}>{t('safetyAdmin.decision')}</Text>
                <Text style={styles.help}>{t('safetyAdmin.decisionCopy')}</Text>
                <AppInput
                  label={t('safetyAdmin.notes')}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  maxLength={4000}
                  autoCapitalize="sentences"
                  inputStyle={styles.noteInput}
                />
                {actionError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{actionError}</Text> : null}
                <View style={styles.actions}>
                  <AppButton title={t('safetyAdmin.reject')} variant="ghost" onPress={() => decide('REJECTED')} disabled={saving} style={styles.action} />
                  <AppButton title={t('safetyAdmin.approve')} onPress={() => decide('APPROVED')} loading={saving} style={styles.action} />
                </View>
              </View>
            ) : null}

            {selected.status === 'APPROVED' ? (
              <View style={styles.dangerCard}>
                <Text style={styles.sectionTitle}>{t('safetyAdmin.revokeApproval')}</Text>
                <Text style={styles.help}>{t('safetyAdmin.revokeWarning')}</Text>
                <AppInput
                  label={t('safetyAdmin.revokeReason')}
                  value={revokeReason}
                  onChangeText={setRevokeReason}
                  multiline
                  maxLength={4000}
                  autoCapitalize="sentences"
                />
                {actionError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{actionError}</Text> : null}
                <AppButton title={t('safetyAdmin.revoke')} variant="ghost" onPress={revoke} loading={saving} />
              </View>
            ) : null}

            {selected.status !== 'SUBMITTED' && selected.status !== 'APPROVED' ? (
              <View style={styles.resultCard} accessibilityLiveRegion="polite">
                <Text style={styles.valueStrong}>{t('safetyAdmin.reviewComplete')}</Text>
                <Text style={styles.help}>{selected.reviewNotes || t('safetyAdmin.noReviewNotes')}</Text>
                <AppButton title={t('safetyAdmin.backToQueue')} variant="secondary" onPress={headerBack} style={styles.resultButton} />
              </View>
            ) : null}
          </ScrollView>
        ) : (
          <StateBox loading={loading}>
            {error ? (
              <ErrorPanel error={error} onRetry={() => load()} t={t} />
            ) : items.length ? (
              <ScrollView
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.brand} />}
              >
                <View style={styles.notice}>
                  <Ionicons name="shield-checkmark-outline" size={24} color={colors.brand} />
                  <View style={styles.rowCopy}>
                    <Text style={styles.valueStrong}>{t('safetyAdmin.queueNotice')}</Text>
                    <Text style={styles.help}>{t('safetyAdmin.queueNoticeCopy')}</Text>
                  </View>
                </View>
                {items.map((plan) => (
                  <Pressable
                    key={plan.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${plan.title}, ${plan.riskLevel}, ${plan.status}`}
                    accessibilityHint={t('safetyAdmin.openHint')}
                    onPress={() => open(plan)}
                    style={({ pressed }) => [styles.queueCard, pressed && styles.pressed]}
                  >
                    <View style={styles.rowCopy}>
                      <Text style={styles.queueTitle}>{plan.title}</Text>
                      <Text style={styles.help}>{plan.route?.name || plan.route?.code || '—'} · {plan.riskLevel}</Text>
                      <Text style={styles.help}>{plan.guide?.name || '—'} · {formatDateTime(plan.tripStartAt, language) || '—'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={19} color={colors.inkSoft} />
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.center} accessibilityLiveRegion="polite">
                <Ionicons name="checkmark-circle-outline" size={38} color={colors.success} />
                <Text style={styles.centerTitle}>{t('safetyAdmin.empty')}</Text>
                <Text style={styles.centerCopy}>{t('safetyAdmin.emptyCopy')}</Text>
                <AppButton title={t('common.retry')} variant="secondary" onPress={() => load()} style={styles.retry} />
              </View>
            )}
          </StateBox>
        )}
      </AdminAccessBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: spacing.md },
  list: { width: '100%', maxWidth: 960, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: 10 },
  hero: { padding: 17, gap: 7, borderRadius: radius.xl, backgroundColor: colors.ink },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  heroCopy: { flex: 1 },
  eyebrow: { color: '#FDA4AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: '800', marginTop: 4 },
  heroMeta: { color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 18 },
  pill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: '#FEF3C7' },
  pillApproved: { backgroundColor: '#A7F3D0' },
  pillRejected: { backgroundColor: '#FECACA' },
  pillText: { color: colors.ink, fontSize: 10, fontWeight: '900' },
  sectionCard: { padding: 15, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  decisionCard: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: '#FDE68A', backgroundColor: colors.warningSoft },
  dangerCard: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  resultCard: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: '#A7F3D0', backgroundColor: colors.successSoft },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  label: { color: colors.inkSoft, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginTop: 8 },
  value: { color: colors.ink, lineHeight: 20, marginTop: 3 },
  valueStrong: { color: colors.ink, fontWeight: '700', lineHeight: 20 },
  help: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  paragraph: { color: colors.ink, lineHeight: 21 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 5 },
  bullet: { color: colors.brand, fontWeight: '900' },
  listText: { flex: 1, color: colors.ink, lineHeight: 20 },
  itineraryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  day: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  dayText: { color: colors.brand, fontWeight: '900' },
  rowCopy: { flex: 1 },
  contactRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  auditRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8 },
  auditDot: { width: 9, height: 9, marginTop: 5, borderRadius: 5, backgroundColor: colors.brand },
  auditReason: { color: colors.ink, fontSize: 12, lineHeight: 18, marginTop: 4 },
  noteInput: { minHeight: 110 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: { flex: 1, minWidth: 150 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  resultButton: { marginTop: 14 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: '#FECDD3', backgroundColor: '#FFF1F2' },
  queueCard: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 92, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  queueTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  center: { flex: 1, minHeight: 320, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  centerTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  centerCopy: { color: colors.inkSoft, lineHeight: 20, textAlign: 'center', maxWidth: 480 },
  retry: { minWidth: 180, marginTop: 5 },
});
