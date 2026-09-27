import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, Chip, ScreenHeader, StateBox } from '../components/ui';
import { guidesRepository } from '../repositories/guidesRepository';
import { parseLocalDateTime } from '../models/availability';
import { apiErrorMessage } from '../services/api';
import { formatDateTime, useT } from '../localization';
import { colors, spacing } from '../theme';

export default function GuideAvailabilityScreen({ navigation }) {
  const { t, language } = useT();
  const [loaded, setLoaded] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('18:00');
  const [status, setStatus] = useState('AVAILABLE');
  const lock = useRef(false);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ulaanbaatar';

  const load = async () => {
    setLoading(true);
    setError(null);
    try { setSlots((await guidesRepository.ownAvailability()).slots || []); setLoaded(true); }
    catch (e) { setError(apiErrorMessage(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const add = () => {
    const from = parseLocalDateTime(date, start);
    const to = parseLocalDateTime(date, end);
    if (!from || !to || to <= from || to <= new Date() || slots.length >= 200) {
      setError(t('calendar.invalid'));
      return;
    }
    setSlots((items) => [...items, { startsAt: from.toISOString(), endsAt: to.toISOString(), timeZone, status }]);
    setError(null);
    setSaved(false);
  };

  const save = async () => {
    if (lock.current || !loaded) return;
    lock.current = true;
    setSaving(true);
    setError(null);
    try {
      const result = await guidesRepository.saveAvailability(slots.map(({ startsAt, endsAt, timeZone: zone, status: state }) => ({ startsAt, endsAt, timeZone: zone, status: state })));
      setSlots(result.slots || []);
      setSaved(true);
    } catch (e) { setError(apiErrorMessage(e)); }
    finally { lock.current = false; setSaving(false); }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('calendar.title')} onBack={() => navigation.goBack()} />
      <StateBox loading={loading}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.copy}>{t('calendar.copy')}</Text>
          <Text style={styles.copy}>{t('calendar.timeZone')} {timeZone}</Text>
          {slots.map((slot, index) => <View key={slot.id || `${slot.startsAt}:${index}`} style={styles.slot}>
            <Text style={styles.label}>{t(`calendar.${slot.status}`)}</Text>
            <Text style={styles.copy}>{formatDateTime(slot.startsAt, language)} — {formatDateTime(slot.endsAt, language)}</Text>
            <AppButton title={t('calendar.remove')} variant="ghost" disabled={saving} onPress={() => { setSlots((items) => items.filter((_, position) => position !== index)); setSaved(false); }} />
          </View>)}
          {!slots.length ? <Text style={styles.copy}>{t('calendar.unrestricted')}</Text> : null}
          <AppInput label={t('booking.date')} value={date} onChangeText={setDate} placeholder="2026-09-15" maxLength={10} editable={!saving} />
          <AppInput label={t('calendar.start')} value={start} onChangeText={setStart} maxLength={5} editable={!saving} />
          <AppInput label={t('calendar.end')} value={end} onChangeText={setEnd} maxLength={5} editable={!saving} />
          <View style={styles.options}>
            {['AVAILABLE', 'BLOCKED'].map((value) => <Chip key={value} label={t(`calendar.${value}`)} active={status === value} onPress={() => { if (!saving) setStatus(value); }} />)}
          </View>
          <AppButton title={t('calendar.add')} variant="secondary" disabled={saving} onPress={add} />
          {error ? <Text style={styles.error} accessibilityLiveRegion="assertive">{error}</Text> : null}
          {saved ? <Text style={styles.copy} accessibilityLiveRegion="polite">{t('calendar.saved')}</Text> : null}
          <AppButton title={t('common.save')} loading={saving} disabled={!loaded} onPress={save} />
          <AppButton title={t('common.retry')} variant="ghost" disabled={saving} onPress={load} />
        </ScrollView>
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { padding: spacing.lg, gap: 12, paddingBottom: 50 },
  copy: { color: colors.inkSoft, lineHeight: 21 },
  label: { color: colors.ink, fontWeight: '700' },
  slot: { padding: 14, backgroundColor: colors.secondary, borderRadius: 12, gap: 10 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  error: { color: colors.brandDark, lineHeight: 21 },
});
