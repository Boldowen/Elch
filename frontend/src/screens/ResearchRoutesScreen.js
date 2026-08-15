import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, AppInput, ScreenHeader, StateBox } from '../components/ui';
import AssistantMessage from '../components/assistant/AssistantMessage';
import SafetyNotice from '../components/assistant/SafetyNotice';
import StarterPrompts from '../components/assistant/StarterPrompts';
import ItineraryView from '../components/itinerary/ItineraryView';
import RiskBadge from '../components/itinerary/RiskBadge';
import ValidationSummary from '../components/itinerary/ValidationSummary';
import { assistantRepository } from '../repositories/assistantRepository';
import { routesRepository } from '../repositories/routesRepository';
import { apiErrorMessage } from '../services/api';
import { useT } from '../localization';
import { colors, radius, spacing } from '../theme';

const ACTIVITY_MINUTES = 120;

function nextResearchDate(now = new Date()) {
  let year = now.getUTCFullYear();
  let date = new Date(Date.UTC(year, 6, 1));
  if (date.getTime() <= now.getTime()) date = new Date(Date.UTC(year + 1, 6, 1));
  return date.toISOString().slice(0, 10);
}

function messageId(prefix, sequence) {
  return `${prefix}-${Date.now()}-${sequence}`;
}

export default function ResearchRoutesScreen({ navigation }) {
  const { t, language } = useT();
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [contextRouteId, setContextRouteId] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routesError, setRoutesError] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [asking, setAsking] = useState(false);
  const [assistantError, setAssistantError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const routeRequest = useRef(0);
  const assistantRequest = useRef(0);
  const validationRequest = useRef(0);
  const messageSequence = useRef(0);
  const mounted = useRef(true);

  const labels = useMemo(() => ({
    thinking: t('research.thinking'),
    confidence: t('research.confidence'),
    safety: t('research.safetyWarnings'),
    humanReview: t('research.humanReview'),
    limitations: t('research.limitations'),
    verifiedFacts: t('research.verifiedFacts'),
    recommendations: t('research.recommendations'),
    routeContext: t('research.routeContext'),
    sources: t('research.sources'),
    verified: t('research.verified'),
  }), [t]);

  const itineraryLabels = useMemo(() => ({
    risk: t('research.risk'),
    guideRequirements: t('research.guideRequirements'),
    language: t('research.language'),
    role: t('research.role'),
    skills: t('research.skills'),
    firstAidRequired: t('research.firstAidRequired'),
    day: t('research.day'),
    activityTime: t('research.activityTime'),
    hours: t('research.hours'),
    travelSegment: t('research.travelSegment'),
    season: t('research.season'),
    sources: t('research.sources'),
    verified: t('research.verified'),
  }), [t]);

  const validationLabels = useMemo(() => ({
    passed: t('research.validationPassed'),
    needsRepair: t('research.needsRepair'),
    days: t('research.days'),
    travelHours: t('research.travelHours'),
    blocking: t('research.blocking'),
    warning: t('research.warning'),
  }), [t]);

  const starterPrompts = useMemo(() => [
    t('research.promptTrip'),
    t('research.promptGuide'),
    t('research.promptCompare'),
    t('research.promptPacking'),
    t('research.promptOlder'),
    t('research.promptTranslate'),
  ], [t]);

  const selectRoute = useCallback(async (route, explicitContext = true) => {
    if (!route?.id) return;
    const requestId = ++routeRequest.current;
    validationRequest.current += 1;
    setSelected(route);
    setContextRouteId(explicitContext ? route.id : null);
    setRouteLoading(true);
    setRouteError(null);
    setValidationResult(null);
    setValidationError(null);
    setValidating(false);
    try {
      const detail = await routesRepository.detail(route.id);
      if (!mounted.current || requestId !== routeRequest.current) return;
      setSelected(detail);
    } catch (error) {
      if (!mounted.current || requestId !== routeRequest.current) return;
      setRouteError(apiErrorMessage(error));
    } finally {
      if (mounted.current && requestId === routeRequest.current) setRouteLoading(false);
    }
  }, []);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setRoutesError(null);
    try {
      const items = await routesRepository.list();
      if (!mounted.current) return;
      setRoutes(items);
      if (items[0]) await selectRoute(items[0], false);
    } catch (error) {
      if (mounted.current) setRoutesError(apiErrorMessage(error));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [selectRoute]);

  useEffect(() => {
    mounted.current = true;
    loadRoutes();
    return () => {
      mounted.current = false;
      routeRequest.current += 1;
      assistantRequest.current += 1;
      validationRequest.current += 1;
    };
  }, [loadRoutes]);

  const sendMessage = useCallback(async (providedText) => {
    const text = String(providedText ?? question).trim();
    if (!text || asking) return;
    const requestId = ++assistantRequest.current;
    const routeVersion = routeRequest.current;
    const userId = messageId('user', ++messageSequence.current);
    const pendingId = messageId('assistant', ++messageSequence.current);
    setQuestion('');
    setAssistantError(null);
    setAsking(true);
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text },
      { id: pendingId, role: 'assistant', text: '', pending: true },
    ]);

    try {
      const response = await assistantRepository.ask({
        message: text,
        language: language === 'mn' ? 'mn' : 'en',
        ...(contextRouteId ? { routeId: contextRouteId } : {}),
        travelDate: nextResearchDate(),
      });
      if (!mounted.current || requestId !== assistantRequest.current) return;
      setMessages((current) => current.map((message) =>
        message.id === pendingId
          ? { id: pendingId, role: 'assistant', text: response.answer, response }
          : message,
      ));
      if (response.route?.id && routeVersion === routeRequest.current) {
        const matchingRoute = routes.find((route) => route.id === response.route.id);
        if (matchingRoute && selected?.id !== matchingRoute.id) {
          await selectRoute(matchingRoute, true);
        } else {
          setContextRouteId(response.route.id);
        }
      }
    } catch (error) {
      if (!mounted.current || requestId !== assistantRequest.current) return;
      const message = apiErrorMessage(error);
      setMessages((current) => current.filter((item) => item.id !== pendingId));
      setAssistantError(message);
    } finally {
      if (mounted.current && requestId === assistantRequest.current) setAsking(false);
    }
  }, [asking, contextRouteId, language, question, routes, selectRoute, selected?.id]);

  const validateItinerary = useCallback(async () => {
    if (!selected?.id || selected.poiIds.length < 2 || validating) return;
    const routeId = selected.id;
    const requestId = ++validationRequest.current;
    setValidating(true);
    setValidationError(null);
    setValidationResult(null);
    try {
      const result = await routesRepository.validate({
        routeId,
        startDate: nextResearchDate(),
        stops: selected.poiIds.map((poiId, index) => ({
          poiId,
          day: index + 1,
          activityMinutes: ACTIVITY_MINUTES,
        })),
      });
      if (!mounted.current || requestId !== validationRequest.current || selected.id !== routeId) return;
      setValidationResult(result);
    } catch (error) {
      if (mounted.current && requestId === validationRequest.current) {
        setValidationError(apiErrorMessage(error));
      }
    } finally {
      if (mounted.current && requestId === validationRequest.current) setValidating(false);
    }
  }, [selected, validating]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('research.title')} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StateBox loading={loading} error={routesError} empty={!routes.length} emptyText={t('research.noRoutes')}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <SafetyNotice
              title={t('research.prototypeTitle')}
              messages={[t('research.prototypeNotice')]}
              tone="warning"
            />

            <View style={styles.assistantPanel}>
              <View style={styles.panelHeading}>
                <View style={styles.aiIcon}>
                  <Ionicons name="sparkles" size={20} color={colors.white} />
                </View>
                <View style={styles.panelCopy}>
                  <Text style={styles.panelTitle}>{t('research.assistantTitle')}</Text>
                  <Text style={styles.panelSubtitle}>{t('research.assistantSubtitle')}</Text>
                </View>
              </View>

              {contextRouteId ? (
                <View style={styles.contextRow}>
                  <Ionicons name="location-outline" size={15} color={colors.brand} />
                  <Text style={styles.contextText}>
                    {t('research.usingContext')}: {selected?.name || contextRouteId}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('research.clearContext')}
                    onPress={() => setContextRouteId(null)}
                    hitSlop={10}
                  >
                    <Ionicons name="close-circle" size={18} color={colors.inkSoft} />
                  </Pressable>
                </View>
              ) : null}

              {!messages.length ? (
                <>
                  <Text style={styles.starterTitle}>{t('research.tryPrompt')}</Text>
                  <StarterPrompts prompts={starterPrompts} onSelect={sendMessage} disabled={asking} />
                </>
              ) : (
                <View style={styles.messages}>
                  {messages.map((message) => (
                    <AssistantMessage key={message.id} message={message} labels={labels} />
                  ))}
                </View>
              )}

              {assistantError ? (
                <View style={styles.errorBox} accessibilityLiveRegion="assertive">
                  <Text style={styles.errorText}>{assistantError}</Text>
                </View>
              ) : null}

              <View style={styles.composer}>
                <AppInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder={t('research.placeholder')}
                  multiline
                  maxLength={2000}
                  style={styles.inputField}
                  inputStyle={styles.input}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('research.send')}
                  accessibilityState={{ disabled: !question.trim() || asking, busy: asking }}
                  disabled={!question.trim() || asking}
                  onPress={() => sendMessage()}
                  style={({ pressed }) => [styles.send, (!question.trim() || asking) && styles.sendDisabled, pressed && styles.pressed]}
                >
                  {asking ? <ActivityIndicator size="small" color={colors.white} /> : <Ionicons name="arrow-up" size={20} color={colors.white} />}
                </Pressable>
              </View>
              <Text style={styles.sessionNote}>{t('research.sessionHistory')}</Text>
            </View>

            <View style={styles.sectionHeading}>
              <View style={styles.sectionCopy}>
                <Text style={styles.sectionTitle}>{t('research.routesTitle')}</Text>
                <Text style={styles.sectionSubtitle}>{t('research.routesSubtitle')}</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routeRow}
            >
              {routes.map((route) => {
                const active = route.id === selected?.id;
                return (
                  <Pressable
                    key={route.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${route.name}, ${route.riskClass}`}
                    accessibilityState={{ selected: active }}
                    onPress={() => selectRoute(route, true)}
                    style={({ pressed }) => [styles.routeCard, active && styles.routeCardActive, pressed && styles.pressed]}
                  >
                    <View style={styles.routeCardTop}>
                      <Text style={styles.routeName}>{route.name}</Text>
                      <RiskBadge risk={route.riskClass} />
                    </View>
                    <Text style={styles.routeDescription} numberOfLines={2}>{route.description}</Text>
                    <Text style={styles.routeMeta}>
                      {route.recommendedDays.min}–{route.recommendedDays.max} {t('research.days')} · {route.poiIds.length} {t('research.stops')}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.itineraryCard}>
              {routeLoading ? (
                <View style={styles.routeLoading} accessibilityLiveRegion="polite">
                  <ActivityIndicator color={colors.brand} />
                  <Text style={styles.loadingText}>{t('research.loadingRoute')}</Text>
                </View>
              ) : (
                <ItineraryView route={selected} language={language} labels={itineraryLabels} />
              )}
              {routeError ? <Text style={styles.errorText}>{routeError}</Text> : null}
            </View>

            <View style={styles.validationCard}>
              <Text style={styles.sectionTitle}>{t('research.validatorTitle')}</Text>
              <Text style={styles.sectionSubtitle}>
                {t('research.validatorCopy')} {nextResearchDate()}.
              </Text>
              <SafetyNotice
                title={t('research.noAutoApprovalTitle')}
                messages={[t('research.noAutoApprovalCopy')]}
                tone="info"
              />
              <AppButton
                title={t('research.validate')}
                onPress={validateItinerary}
                loading={validating}
                disabled={!selected || selected.poiIds.length < 2}
              />
              {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}
              <ValidationSummary result={validationResult} labels={validationLabels} />
            </View>
          </ScrollView>
        </StateBox>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  fill: { flex: 1 },
  content: { width: '100%', maxWidth: 980, alignSelf: 'center', padding: spacing.lg, paddingBottom: 56, gap: spacing.lg },
  assistantPanel: { gap: 12, padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  panelHeading: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  aiIcon: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand },
  panelCopy: { flex: 1 },
  panelTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  panelSubtitle: { color: colors.inkSoft, fontSize: 12, lineHeight: 17, marginTop: 2 },
  contextRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: '#FFF1F2' },
  contextText: { flexShrink: 1, color: colors.brandDark, fontSize: 11, fontWeight: '700' },
  starterTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  messages: { gap: 1, paddingVertical: 3 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inputField: { flex: 1, marginBottom: 0 },
  input: { minHeight: 52, maxHeight: 130 },
  send: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand },
  sendDisabled: { opacity: 0.45 },
  sessionNote: { color: colors.inkSoft, fontSize: 10, lineHeight: 15 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  sectionCopy: { flex: 1 },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: '800' },
  sectionSubtitle: { color: colors.inkSoft, fontSize: 12, lineHeight: 18, marginTop: 3 },
  routeRow: { gap: 10, paddingRight: 18 },
  routeCard: { width: 250, minHeight: 122, gap: 8, padding: 13, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  routeCardActive: { borderColor: colors.brand, backgroundColor: '#FFF7F8' },
  routeCardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  routeName: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: '800' },
  routeDescription: { color: colors.inkSoft, fontSize: 12, lineHeight: 17 },
  routeMeta: { color: colors.ink, fontSize: 11, fontWeight: '600' },
  itineraryCard: { minHeight: 120, padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  routeLoading: { minHeight: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  loadingText: { color: colors.inkSoft, fontSize: 13 },
  validationCard: { gap: 12, padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  errorBox: { padding: 11, borderRadius: radius.md, backgroundColor: '#FEF2F2' },
  errorText: { color: '#B42318', fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.78 },
});
