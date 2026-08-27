import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader, StateBox } from '../components/ui';
import { bookingsRepository } from '../repositories/listingsRepository';
import { bookingMatchesPayload } from '../models/bookings';
import { apiErrorMessage } from '../services/api';
import { storage } from '../services/storage';
import { formatDateTime, formatMoney, useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function dateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function timeValue(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function inferDuration(booking, kind) {
  const start = new Date(booking.startsAt).getTime();
  const end = new Date(booking.endsAt).getTime();
  const unit = kind === 'guide' ? 3_600_000 : 86_400_000;
  return String(Math.max(1, Math.ceil((end - start) / unit)));
}

function StepBar({ phase, t }) {
  const steps = ['FORM', 'REVIEW', 'DRAFT', 'CONFIRMATION'];
  const current = Math.max(0, steps.indexOf(phase));
  return (
    <View style={styles.steps} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: 4, now: current + 1 }}>
      {steps.map((step, index) => (
        <View key={step} style={styles.stepItem}>
          <View style={[styles.stepDot, index <= current && styles.stepDotActive]}>
            <Text style={[styles.stepNumber, index <= current && styles.stepNumberActive]}>{index + 1}</Text>
          </View>
          <Text style={[styles.stepLabel, index === current && styles.stepLabelActive]} numberOfLines={1}>{t(`booking.step${step}`)}</Text>
        </View>
      ))}
    </View>
  );
}

function Summary({ title, booking, payload, quote, kind, unit, price, currency, t, language }) {
  const startsAt = booking?.startsAt || payload?.startsAt;
  const endsAt = booking?.endsAt || payload?.endsAt;
  const guests = booking?.guests || payload?.guests;
  const note = booking?.note || payload?.note;
  const displayCurrency = booking?.currency || quote?.currency || currency;
  const amount = booking
    ? booking.amountMinor / 100
    : quote
      ? quote.amountMinor / 100
      : Number(price) || 0;
  return (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('booking.starts')}</Text><Text style={styles.summaryValue}>{formatDateTime(startsAt, language)}</Text></View>
      <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('booking.ends')}</Text><Text style={styles.summaryValue}>{formatDateTime(endsAt, language)}</Text></View>
      <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('booking.guests')}</Text><Text style={styles.summaryValue}>{guests}</Text></View>
      {!booking && price ? <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{t('booking.rate')}</Text><Text style={styles.summaryValue}>{formatMoney(price, currency, language)} / {unit}</Text></View> : null}
      <View style={styles.summaryRow}><Text style={styles.totalLabel}>{t('booking.total')}</Text><Text style={styles.total}>{formatMoney(amount, displayCurrency, language)}</Text></View>
      {quote || booking ? (
        <Text style={styles.disclaimer}>
          {t('booking.base')} {formatMoney((booking?.baseAmountMinor ?? quote?.baseAmountMinor ?? 0) / 100, displayCurrency, language)} · {t('booking.fees')} {formatMoney(((booking?.cleaningFeeMinor ?? quote?.cleaningFeeMinor ?? 0) + (booking?.serviceFeeMinor ?? quote?.serviceFeeMinor ?? 0) + (booking?.taxMinor ?? quote?.taxMinor ?? 0) + (booking?.extraGuestFeeMinor ?? quote?.extraGuestFeeMinor ?? 0)) / 100, displayCurrency, language)} · {t('booking.deposit')} {formatMoney((booking?.depositMinor ?? quote?.depositMinor ?? 0) / 100, displayCurrency, language)}
        </Text>
      ) : null}
      {note ? <View style={styles.noteBox}><Text style={styles.summaryLabel}>{t('booking.notes')}</Text><Text style={styles.noteText}>{note}</Text></View> : null}
      {kind ? <Text style={styles.disclaimer}>{kind === 'guide' ? t('booking.guideDraft') : t('booking.listingDraft')}</Text> : null}
    </View>
  );
}

export default function BookingScreen({ navigation, route }) {
  const params = route.params || {};
  const resumeDraftId = params.draftId ? String(params.draftId) : null;
  const initialKind = params.kind === 'guide' ? 'guide' : 'listing';
  const initialId = params.id ? String(params.id) : null;
  const tomorrow = useMemo(() => new Date(Date.now() + 86_400_000), []);
  const [kind, setKind] = useState(initialKind);
  const [providerId, setProviderId] = useState(initialId);
  const [title, setTitle] = useState(String(params.title || ''));
  const [date, setDate] = useState(dateValue(tomorrow));
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(initialKind === 'guide' ? '2' : '1');
  const [guests, setGuests] = useState('1');
  const [note, setNote] = useState('');
  const [phase, setPhase] = useState('FORM');
  const [draft, setDraft] = useState(null);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(Boolean(resumeDraftId));
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [reconciliationNote, setReconciliationNote] = useState(null);
  const idempotencyKey = useRef(Crypto.randomUUID());
  const { t, language } = useT();

  const price = Number(params.price) || 0;
  const currency = String(params.currency || 'USD');
  const unit = String(params.unit || (kind === 'guide' ? 'hour' : 'night'));
  const pendingKey = providerId ? `bookingDraftPending:${kind}:${providerId}` : null;
  const durationLabel = kind === 'guide' ? t('booking.hours') : t('booking.nights');

  const payload = useMemo(() => {
    const start = new Date(`${date}T${time}:00`);
    const durationNumber = Number(duration);
    const guestNumber = Number(guests);
    if (!providerId || Number.isNaN(start.getTime()) || !Number.isInteger(durationNumber) || !Number.isInteger(guestNumber)) return null;
    const unitMs = kind === 'guide' ? 3_600_000 : 86_400_000;
    return {
      ...(kind === 'guide' ? { guideId: providerId } : { listingId: providerId }),
      startsAt: start.toISOString(),
      endsAt: new Date(start.getTime() + durationNumber * unitMs).toISOString(),
      guests: guestNumber,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
  }, [date, duration, guests, kind, note, providerId, time]);

  const hydrateFromDraft = useCallback((booking) => {
    const nextKind = booking.listingId ? 'listing' : 'guide';
    const start = new Date(booking.startsAt);
    setKind(nextKind);
    setProviderId(booking.listingId || booking.guideId);
    setTitle(booking.listing?.title || booking.guide?.name || t('booking.draftTitle'));
    setDate(dateValue(start));
    setTime(timeValue(start));
    setDuration(inferDuration(booking, nextKind));
    setGuests(String(booking.guests));
    setNote(booking.note || '');
    setDraft(booking);
    setPhase(booking.status === 'DRAFT' ? 'DRAFT' : 'CONFIRMATION');
  }, [t]);

  const loadDraft = useCallback(async (id = resumeDraftId) => {
    if (!id) return;
    setLoadingDraft(true);
    setError(null);
    try {
      hydrateFromDraft(await bookingsRepository.draft(id));
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setLoadingDraft(false);
    }
  }, [hydrateFromDraft, resumeDraftId]);

  useEffect(() => {
    if (resumeDraftId) loadDraft();
  }, [loadDraft, resumeDraftId]);

  useEffect(() => {
    if (resumeDraftId || !pendingKey || draft) return undefined;
    let active = true;
    (async () => {
      const pending = await storage.preference(pendingKey);
      if (!pending?.idempotencyKey || !pending?.payload) return;
      idempotencyKey.current = pending.idempotencyKey;
      try {
        const drafts = await bookingsRepository.drafts();
        const recovered = drafts.find((item) => bookingMatchesPayload(item, pending.payload));
        if (active && recovered) {
          hydrateFromDraft(recovered);
          setReconciliationNote(t('booking.recoveredDraft'));
          await storage.setPreference(pendingKey, null);
        }
      } catch {
        // Recovery is best effort. The same stored idempotency key is retained
        // for an explicit retry so duplicate drafts cannot be created.
      }
    })();
    return () => { active = false; };
  }, [draft, hydrateFromDraft, pendingKey, resumeDraftId, t]);

  useEffect(() => {
    if (!payload || phase !== 'FORM') {
      setQuote(null);
      setQuoteError(null);
      return undefined;
    }
    if (new Date(payload.startsAt).getTime() <= Date.now() || payload.guests < 1 || Number(duration) < 1) return undefined;
    let active = true;
    const timer = setTimeout(async () => {
      setQuoteLoading(true);
      setQuoteError(null);
      try {
        const nextQuote = await bookingsRepository.quote(payload);
        if (active) setQuote(nextQuote);
      } catch (nextError) {
        if (active) {
          setQuote(null);
          setQuoteError(apiErrorMessage(nextError));
        }
      } finally {
        if (active) setQuoteLoading(false);
      }
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [duration, payload, phase]);

  const validate = () => {
    const start = payload ? new Date(payload.startsAt) : null;
    const durationNumber = Number(duration);
    const guestNumber = Number(guests);
    if (!payload || !start || start.getTime() <= Date.now() || !Number.isInteger(durationNumber) || durationNumber < 1 || durationNumber > 30 || !Number.isInteger(guestNumber) || guestNumber < 1 || guestNumber > 30) {
      Alert.alert(t('booking.check'), t('booking.checkBody'));
      return false;
    }
    return true;
  };

  const review = () => {
    if (!validate()) return;
    setError(null);
    setPhase('REVIEW');
  };

  const reconcileCreate = async (operationPayload) => {
    const drafts = await bookingsRepository.drafts();
    return drafts.find((item) => bookingMatchesPayload(item, operationPayload)) || null;
  };

  const saveDraft = async () => {
    if (!validate()) return;
    setSaving(true);
    setError(null);
    setReconciliationNote(null);
    try {
      let saved;
      if (draft) {
        const updatePayload = { ...payload, ...(draft.updatedAt ? { expectedUpdatedAt: draft.updatedAt } : {}) };
        try {
          saved = await bookingsRepository.updateDraft(draft.id, updatePayload);
        } catch (updateError) {
          const current = await bookingsRepository.draft(draft.id).catch(() => null);
          if (!bookingMatchesPayload(current, payload)) throw updateError;
          saved = current;
          setReconciliationNote(t('booking.reconciledUpdate'));
        }
      } else {
        if (pendingKey) await storage.setPreference(pendingKey, { idempotencyKey: idempotencyKey.current, payload });
        try {
          saved = await bookingsRepository.createDraft(payload, idempotencyKey.current);
        } catch (createError) {
          const recovered = await reconcileCreate(payload).catch(() => null);
          if (!recovered) throw createError;
          saved = recovered;
          setReconciliationNote(t('booking.reconciledCreate'));
        }
        if (pendingKey) await storage.setPreference(pendingKey, null);
      }
      setDraft(saved);
      setPhase('DRAFT');
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setSaving(false);
    }
  };

  const submitDraft = async () => {
    if (!draft?.id) return;
    setSubmitting(true);
    setError(null);
    setReconciliationNote(null);
    try {
      let submitted;
      try {
        submitted = await bookingsRepository.submitDraft(draft.id);
      } catch (submitError) {
        const current = await bookingsRepository.draft(draft.id).catch(() => null);
        if (!current || current.status === 'DRAFT') throw submitError;
        submitted = current;
        setReconciliationNote(t('booking.reconciledSubmit'));
      }
      setDraft(submitted);
      setPhase('CONFIRMATION');
    } catch (nextError) {
      setError(apiErrorMessage(nextError));
    } finally {
      setSubmitting(false);
    }
  };

  const cancelDraft = () => {
    if (!draft?.id) return;
    Alert.alert(t('booking.deleteDraftTitle'), t('booking.deleteDraftCopy'), [
      { text: t('common.keep'), style: 'cancel' },
      {
        text: t('booking.deleteDraft'),
        style: 'destructive',
        onPress: async () => {
          setSaving(true);
          setError(null);
          try {
            await bookingsRepository.deleteDraft(draft.id);
            navigation.navigate('Main', { screen: 'Trips' });
          } catch (nextError) {
            setError(apiErrorMessage(nextError));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  const body = () => {
    if (phase === 'FORM') {
      return (
        <>
          <Text style={styles.title}>{title || t('booking.draftTitle')}</Text>
          <Text style={styles.sub}>{draft ? t('booking.editCopy') : t('booking.review')}</Text>
          <AppInput label={t('booking.date')} value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
          <AppInput label={t('booking.time')} value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
          <AppInput label={durationLabel} value={duration} onChangeText={setDuration} keyboardType="number-pad" />
          <AppInput label={t('booking.guests')} value={guests} onChangeText={setGuests} keyboardType="number-pad" />
          <AppInput label={t('booking.notes')} value={note} onChangeText={setNote} placeholder={t('booking.notesHint')} multiline />
          <View style={styles.quoteBox} accessibilityLiveRegion="polite">
            <Text style={styles.policyTitle}>{t('booking.liveQuote')}</Text>
            {quoteLoading ? <Text style={styles.disclaimer}>{t('booking.quoteLoading')}</Text> : null}
            {quoteError ? <Text style={styles.error}>{quoteError}</Text> : null}
            {quote ? <Text style={styles.quoteTotal}>{formatMoney(quote.amountMinor / 100, quote.currency || currency, language)}</Text> : null}
          </View>
          {error ? <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text> : null}
          <AppButton title={t('booking.reviewDraft')} onPress={review} disabled={quoteLoading} />
          {draft ? <AppButton title={t('booking.discardChanges')} variant="ghost" onPress={() => { hydrateFromDraft(draft); setError(null); }} style={styles.secondaryButton} /> : null}
        </>
      );
    }

    if (phase === 'REVIEW') {
      return (
        <>
          <Text style={styles.title}>{t('booking.reviewTitle')}</Text>
          <Text style={styles.sub}>{t('booking.reviewCopy')}</Text>
          <Summary title={title || t('booking.draftTitle')} payload={payload} quote={quote} kind={kind} unit={unit} price={price} currency={currency} t={t} language={language} />
          <View style={styles.policyBox}>
            <Text style={styles.policyTitle}>{t('booking.cancellation')}</Text>
            <Text style={styles.disclaimer}>{t('booking.cancellationBody')}</Text>
            <Text style={styles.disclaimer}>{t('booking.pilot')}</Text>
          </View>
          {error ? <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text> : null}
          <View style={styles.actions}>
            <AppButton title={t('common.edit')} variant="secondary" onPress={() => setPhase('FORM')} disabled={saving} style={styles.action} />
            <AppButton title={draft ? t('booking.saveChanges') : t('booking.createDraft')} onPress={saveDraft} loading={saving} style={styles.action} />
          </View>
        </>
      );
    }

    if (phase === 'DRAFT') {
      return (
        <>
          <View style={styles.statusHero} accessibilityLiveRegion="polite">
            <Text style={styles.statusEyebrow}>{t('booking.savedDraft')}</Text>
            <Text style={styles.statusTitle}>{t('booking.readyToSubmit')}</Text>
            <Text style={styles.statusCopy}>{t('booking.readyCopy')}</Text>
          </View>
          {reconciliationNote ? <Text style={styles.reconciliation}>{reconciliationNote}</Text> : null}
          <Summary title={title || t('booking.draftTitle')} booking={draft} kind={kind} unit={unit} price={price} currency={currency} t={t} language={language} />
          <Text style={styles.updated}>{t('booking.lastSaved')} {formatDateTime(draft.updatedAt, language)}</Text>
          {error ? <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text> : null}
          <AppButton title={t('booking.submitDraft')} onPress={submitDraft} loading={submitting} disabled={saving} />
          <AppButton title={t('booking.editDraft')} variant="secondary" onPress={() => { setPhase('FORM'); setError(null); }} disabled={submitting || saving} style={styles.secondaryButton} />
          <AppButton title={t('booking.deleteDraft')} variant="ghost" onPress={cancelDraft} disabled={submitting || saving} style={styles.secondaryButton} />
        </>
      );
    }

    return (
      <>
        <View style={styles.confirmation} accessibilityLiveRegion="polite">
          <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
          <Text style={styles.confirmationTitle}>{t('booking.sent')}</Text>
          <Text style={styles.confirmationCopy}>{t('booking.sentBody')}</Text>
        </View>
        {reconciliationNote ? <Text style={styles.reconciliation}>{reconciliationNote}</Text> : null}
        <Summary title={title || t('booking.draftTitle')} booking={draft} kind={kind} unit={unit} price={price} currency={currency} t={t} language={language} />
        <AppButton title={t('booking.openTrips')} onPress={() => navigation.navigate('Main', { screen: 'Trips' })} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('booking.title')} onBack={() => navigation.goBack()} />
      <StepBar phase={phase} t={t} />
      <StateBox loading={loadingDraft} error={loadingDraft ? null : error && !draft && resumeDraftId ? error : null}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.body}>
            {body()}
          </ScrollView>
        </KeyboardAvoidingView>
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.white },
  body: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.lg, paddingBottom: 56 },
  steps: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  stepItem: { flex: 1, alignItems: 'center', gap: 4 },
  stepDot: { width: 25, height: 25, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary },
  stepDotActive: { backgroundColor: colors.brand },
  stepNumber: { color: colors.inkSoft, fontSize: 11, fontWeight: '800' },
  stepNumberActive: { color: colors.white },
  stepLabel: { color: colors.inkSoft, fontSize: 9, fontWeight: '600' },
  stepLabelActive: { color: colors.ink, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink },
  sub: { color: colors.inkSoft, lineHeight: 20, marginTop: 6, marginBottom: 22 },
  quoteBox: { minHeight: 74, justifyContent: 'center', padding: 14, marginBottom: 16, borderRadius: radius.md, backgroundColor: colors.secondary },
  quoteTotal: { color: colors.ink, fontSize: 20, fontWeight: '800', marginTop: 4 },
  summary: { backgroundColor: colors.secondary, borderRadius: radius.lg, padding: 16, marginBottom: 16, gap: 10 },
  summaryTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 3 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  summaryLabel: { color: colors.inkSoft, fontSize: 13 },
  summaryValue: { flex: 1, color: colors.ink, fontWeight: '600', textAlign: 'right', fontSize: 13 },
  totalLabel: { color: colors.ink, fontWeight: '800' },
  total: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  disclaimer: { color: colors.inkSoft, fontSize: 12, lineHeight: 17 },
  noteBox: { paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  noteText: { color: colors.ink, lineHeight: 19, marginTop: 4 },
  policyBox: { padding: 15, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, gap: 7, marginBottom: 16 },
  policyTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: { flex: 1, minWidth: 160 },
  secondaryButton: { marginTop: 10 },
  error: { color: '#B42318', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  statusHero: { padding: 18, gap: 6, borderRadius: radius.xl, backgroundColor: colors.ink, marginBottom: 16 },
  statusEyebrow: { color: '#FDA4AF', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  statusTitle: { color: colors.white, fontSize: 22, fontWeight: '800' },
  statusCopy: { color: 'rgba(255,255,255,0.72)', lineHeight: 20 },
  updated: { color: colors.inkSoft, fontSize: 11, marginBottom: 14 },
  reconciliation: { color: colors.success, fontSize: 12, lineHeight: 18, fontWeight: '700', padding: 12, marginBottom: 14, borderRadius: radius.md, backgroundColor: colors.successSoft },
  confirmation: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  check: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.successSoft },
  checkText: { color: colors.success, fontSize: 30, fontWeight: '800' },
  confirmationTitle: { color: colors.ink, fontSize: 23, fontWeight: '800' },
  confirmationCopy: { color: colors.inkSoft, lineHeight: 20, textAlign: 'center', maxWidth: 480 },
});
