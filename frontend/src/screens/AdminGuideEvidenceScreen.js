import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminAccessBoundary from '../components/admin/AdminAccessBoundary';
import { AppButton, AppInput, ScreenHeader, StateBox } from '../components/ui';
import { adminRepository } from '../repositories/adminRepository';
import { apiErrorMessage } from '../services/api';
import { formatDateTime, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function safeFileName(value, fallback = 'evidence-document') {
  const clean = String(value || fallback).replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').trim();
  return (clean || fallback).slice(0, 180);
}

function normalizeBytes(value) {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  if (typeof value === 'string') {
    const result = new Uint8Array(value.length);
    for (let index = 0; index < value.length; index += 1) result[index] = value.charCodeAt(index) & 0xff;
    return result;
  }
  throw new Error('Unsupported evidence document response');
}

async function deliverFile(fileName, contentType, payload) {
  const bytes = normalizeBytes(payload);
  if (Platform.OS === 'web' && globalThis.document && globalThis.Blob && globalThis.URL?.createObjectURL) {
    const url = globalThis.URL.createObjectURL(new globalThis.Blob([bytes], { type: contentType }));
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
  const file = new File(Paths.cache, fileName);
  file.create({ overwrite: true, intermediates: true });
  file.write(bytes);
  if (!(await Sharing.isAvailableAsync())) throw new Error('File sharing is unavailable on this device');
  await Sharing.shareAsync(file.uri, { mimeType: contentType, dialogTitle: fileName });
}

function bytesLabel(value) {
  const bytes = Number(value) || 0;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ErrorPanel({ error, onRetry, t }) {
  return (
    <View style={styles.center} accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={36} color={colors.warning} />
      <Text style={styles.centerTitle}>{t('evidenceAdmin.loadFailed')}</Text>
      <Text style={styles.centerCopy}>{error}</Text>
      <AppButton title={t('common.retry')} onPress={onRetry} style={styles.retry} />
    </View>
  );
}

export default function AdminGuideEvidenceScreen({ navigation }) {
  const { t, language } = useT();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setItems(await adminRepository.pendingGuideEvidence());
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

  const open = (item) => {
    setSelected(item);
    setDecision(null);
    setNote('');
    setActionError(null);
  };

  const download = async () => {
    setDownloading(true);
    setActionError(null);
    try {
      const file = await adminRepository.guideEvidenceFile(selected.id);
      await deliverFile(
        safeFileName(selected.file.name, `${selected.type.toLowerCase()}-evidence`),
        selected.file.mimeType || file.contentType,
        file.bytes,
      );
    } catch (nextError) {
      setActionError(apiErrorMessage(nextError));
    } finally {
      setDownloading(false);
    }
  };

  const submit = () => {
    if (!decision) {
      Alert.alert(t('evidenceAdmin.chooseDecision'), t('evidenceAdmin.chooseDecisionCopy'));
      return;
    }
    if (decision === 'FAILED' && note.trim().length < 3) {
      Alert.alert(t('evidenceAdmin.noteRequired'), t('evidenceAdmin.noteRequiredCopy'));
      return;
    }
    Alert.alert(
      decision === 'VERIFIED' ? t('evidenceAdmin.verifyTitle') : t('evidenceAdmin.failTitle'),
      decision === 'VERIFIED' ? t('evidenceAdmin.verifyCopy') : t('evidenceAdmin.failCopy'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: decision === 'VERIFIED' ? t('evidenceAdmin.verify') : t('evidenceAdmin.fail'),
          style: decision === 'FAILED' ? 'destructive' : 'default',
          onPress: async () => {
            setSaving(true);
            setActionError(null);
            try {
              await adminRepository.reviewGuideEvidence(selected.id, {
                status: decision,
                ...(note.trim() ? { reviewNote: note.trim() } : {}),
              });
              setItems((current) => current.filter((item) => item.id !== selected.id));
              setSelected(null);
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

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader
        title={t('evidenceAdmin.title')}
        onBack={selected ? () => { if (!saving && !downloading) setSelected(null); } : () => navigation.goBack()}
      />
      <AdminAccessBoundary>
        {selected ? (
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.notice}>
              <Ionicons name="lock-closed-outline" size={23} color={colors.brand} />
              <View style={styles.rowCopy}>
                <Text style={styles.valueStrong}>{t('evidenceAdmin.privateReview')}</Text>
                <Text style={styles.help}>{t('evidenceAdmin.privateReviewCopy')}</Text>
              </View>
            </View>

            <View style={styles.hero}>
              <Text style={styles.eyebrow}>{selected.type}</Text>
              <Text style={styles.heroTitle}>{selected.guide?.name || t('evidenceAdmin.unknownGuide')}</Text>
              <Text style={styles.heroMeta}>{selected.guide?.email || '—'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('evidenceAdmin.document')}</Text>
              <Text style={styles.label}>{t('evidenceAdmin.issuer')}</Text>
              <Text style={styles.value}>{selected.issuer || '—'}</Text>
              <Text style={styles.label}>{t('evidenceAdmin.file')}</Text>
              <Text style={styles.value}>{selected.file.name || t('evidenceAdmin.unnamedFile')}</Text>
              <Text style={styles.help}>{selected.file.mimeType || '—'} · {bytesLabel(selected.file.size)}</Text>
              <Text style={styles.label}>{t('evidenceAdmin.submitted')}</Text>
              <Text style={styles.value}>{formatDateTime(selected.createdAt, language) || '—'}</Text>
              <Text style={styles.label}>{t('evidenceAdmin.expires')}</Text>
              <Text style={styles.value}>{selected.expiresAt ? formatDateTime(selected.expiresAt, language) : t('evidenceAdmin.noExpiry')}</Text>
              <AppButton
                title={t('evidenceAdmin.openDocument')}
                variant="secondary"
                onPress={download}
                loading={downloading}
                disabled={saving}
                accessibilityHint={t('evidenceAdmin.openDocumentHint')}
                style={styles.downloadButton}
              />
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.sectionTitle}>{t('evidenceAdmin.decision')}</Text>
              <Text style={styles.help}>{t('evidenceAdmin.decisionCopy')}</Text>
              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: decision === 'FAILED' }}
                  accessibilityLabel={t('evidenceAdmin.fail')}
                  onPress={() => setDecision('FAILED')}
                  style={[styles.choice, decision === 'FAILED' && styles.choiceFailed]}
                >
                  <Ionicons name="close-circle-outline" size={22} color={decision === 'FAILED' ? '#B42318' : colors.inkSoft} />
                  <Text style={styles.choiceText}>{t('evidenceAdmin.fail')}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: decision === 'VERIFIED' }}
                  accessibilityLabel={t('evidenceAdmin.verify')}
                  onPress={() => setDecision('VERIFIED')}
                  style={[styles.choice, decision === 'VERIFIED' && styles.choiceVerified]}
                >
                  <Ionicons name="checkmark-circle-outline" size={22} color={decision === 'VERIFIED' ? colors.success : colors.inkSoft} />
                  <Text style={styles.choiceText}>{t('evidenceAdmin.verify')}</Text>
                </Pressable>
              </View>
              <AppInput
                label={t('evidenceAdmin.reviewNote')}
                value={note}
                onChangeText={setNote}
                placeholder={t('evidenceAdmin.reviewNotePlaceholder')}
                multiline
                maxLength={1000}
                autoCapitalize="sentences"
                inputStyle={styles.noteInput}
              />
              {actionError ? <Text style={styles.error} accessibilityLiveRegion="assertive">{actionError}</Text> : null}
              <AppButton title={t('evidenceAdmin.submit')} onPress={submit} loading={saving} disabled={downloading} />
            </View>
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
                  <Ionicons name="documents-outline" size={23} color={colors.brand} />
                  <View style={styles.rowCopy}>
                    <Text style={styles.valueStrong}>{t('evidenceAdmin.queueNotice')}</Text>
                    <Text style={styles.help}>{t('evidenceAdmin.queueNoticeCopy')}</Text>
                  </View>
                </View>
                {items.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.guide?.name || t('evidenceAdmin.unknownGuide')}, ${item.type}, ${item.issuer}`}
                    accessibilityHint={t('evidenceAdmin.openHint')}
                    onPress={() => open(item)}
                    style={({ pressed }) => [styles.queueCard, pressed && styles.pressed]}
                  >
                    <View style={styles.iconWrap}>
                      <Ionicons name={item.file.mimeType === 'application/pdf' ? 'document-text-outline' : 'image-outline'} size={22} color={colors.brand} />
                    </View>
                    <View style={styles.rowCopy}>
                      <Text style={styles.queueTitle}>{item.guide?.name || t('evidenceAdmin.unknownGuide')}</Text>
                      <Text style={styles.help}>{item.type} · {item.issuer}</Text>
                      <Text style={styles.help}>{item.file.name || t('evidenceAdmin.unnamedFile')} · {formatDateTime(item.createdAt, language) || '—'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={19} color={colors.inkSoft} />
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.center} accessibilityLiveRegion="polite">
                <Ionicons name="checkmark-circle-outline" size={38} color={colors.success} />
                <Text style={styles.centerTitle}>{t('evidenceAdmin.empty')}</Text>
                <Text style={styles.centerCopy}>{t('evidenceAdmin.emptyCopy')}</Text>
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
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: spacing.md },
  list: { width: '100%', maxWidth: 900, alignSelf: 'center', padding: spacing.lg, paddingBottom: 64, gap: 10 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderWidth: 1, borderColor: '#FECDD3', borderRadius: radius.lg, backgroundColor: '#FFF1F2' },
  rowCopy: { flex: 1 },
  valueStrong: { color: colors.ink, fontWeight: '800' },
  help: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  hero: { padding: 17, gap: 5, borderRadius: radius.xl, backgroundColor: colors.ink },
  eyebrow: { color: '#FDA4AF', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: '800' },
  heroMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  card: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  reviewCard: { padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: '#FDE68A', backgroundColor: colors.warningSoft },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginBottom: 7 },
  label: { color: colors.inkSoft, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginTop: 11 },
  value: { color: colors.ink, lineHeight: 20, marginTop: 3 },
  downloadButton: { marginTop: 16 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 13, marginBottom: 15 },
  choice: { flex: 1, minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  choiceFailed: { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  choiceVerified: { borderColor: '#6EE7B7', backgroundColor: colors.successSoft },
  choiceText: { color: colors.ink, fontWeight: '800' },
  noteInput: { minHeight: 110 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  queueCard: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 92, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  iconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F2' },
  queueTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.72 },
  center: { flex: 1, minHeight: 320, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 },
  centerTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  centerCopy: { color: colors.inkSoft, lineHeight: 20, textAlign: 'center', maxWidth: 480 },
  retry: { minWidth: 180, marginTop: 5 },
});
