import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, ScreenHeader, StateBox } from '../components/ui';
import AssessmentQuestionCard from '../components/guide-research/AssessmentQuestionCard';
import AssessmentResultCard from '../components/guide-research/AssessmentResultCard';
import { guideAssessmentsRepository } from '../repositories/guideAssessmentsRepository';
import { apiErrorMessage } from '../services/api';
import { useT } from '../localization';
import { colors, radius, spacing } from '../theme';

function existingAnswer(response) {
  if (!response) return '';
  if (response.responsePayload && response.responsePayload.option !== undefined) {
    return String(response.responsePayload.option);
  }
  return response.responseText || '';
}

function responsePayload(question, value) {
  return question.questionType === 'MULTIPLE_CHOICE'
    ? { questionId: question.id, responsePayload: { option: value } }
    : { questionId: question.id, responseText: value };
}

function readable(value) {
  const text = String(value || '').replaceAll('_', ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function AssessmentSessionScreen({ navigation, route }) {
  const { attemptId } = route.params;
  const { t } = useT();
  const [attempt, setAttempt] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transcriptConsent, setTranscriptConsent] = useState(false);
  const [languageEstimate, setLanguageEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const mounted = useRef(true);
  const requestId = useRef(0);
  const saveLock = useRef(false);
  const submitLock = useRef(false);
  const evaluateLock = useRef(false);

  const typeLabels = useMemo(() => ({
    LANGUAGE: t('assessment.language'),
    GENERAL_KNOWLEDGE: t('assessment.knowledge'),
    GUIDE_SKILL: t('assessment.guideSkill'),
    ROUTE_COMPETENCY: t('assessment.route'),
    FIRST_AID_THEORY: t('assessment.firstAid'),
    SAFETY_SCENARIO: t('assessment.safety'),
  }), [t]);

  const statusLabels = useMemo(() => ({
    NOT_STARTED: t('assessment.statusNotStarted'),
    IN_PROGRESS: t('assessment.statusInProgress'),
    SUBMITTED: t('assessment.statusSubmitted'),
    AI_SCORED: t('assessment.statusAiScored'),
    HUMAN_REVIEWED: t('assessment.statusHumanReviewed'),
    COMPLETED: t('assessment.statusCompleted'),
    CANCELLED: t('assessment.statusCancelled'),
  }), [t]);

  const questionLabels = useMemo(() => ({
    type: (value) => ({
      MULTIPLE_CHOICE: t('assessment.questionMultipleChoice'),
      SHORT_ANSWER: t('assessment.questionShort'),
      OPEN_EXPLANATION: t('assessment.questionOpen'),
      SCENARIO: t('assessment.questionScenario'),
      SPEAKING_TASK: t('assessment.questionSpeaking'),
    })[value] || readable(value),
    difficulty: (value) => ({
      BASIC: t('assessment.difficultyBasic'),
      INTERMEDIATE: t('assessment.difficultyIntermediate'),
      ADVANCED: t('assessment.difficultyAdvanced'),
    })[value] || readable(value),
    category: readable,
    transcriptOnly: t('assessment.transcriptOnly'),
    optionLabel: t('assessment.optionLabel'),
    optionPlaceholder: t('assessment.optionPlaceholder'),
    transcriptLabel: t('assessment.transcriptLabel'),
    transcriptPlaceholder: t('assessment.transcriptPlaceholder'),
    answerLabel: t('assessment.answerLabel'),
    answerPlaceholder: t('assessment.answerPlaceholder'),
    transcriptConsent: t('assessment.transcriptConsent'),
  }), [t]);

  const resultLabels = useMemo(() => ({
    resultTitle: t('assessment.resultTitle'),
    assessmentType: (value) => typeLabels[value] || readable(value),
    status: (value) => statusLabels[value] || readable(value),
    aiLanguageEstimate: t('assessment.aiLanguageEstimate'),
    languageNotOfficial: t('assessment.languageNotOfficial'),
    firstAidTheoryOnly: t('assessment.firstAidTheoryOnly'),
    resultPrescreenOnly: t('assessment.resultPrescreenOnly'),
    platformScore: t('assessment.platformScore'),
    aiScore: t('assessment.aiScore'),
    humanScore: t('assessment.humanScore'),
    passed: t('assessment.passed'),
    notPassed: t('assessment.notPassed'),
    pendingReview: t('assessment.pendingReview'),
    confidence: t('assessment.confidence'),
    dimension: (value) => ({
      fluency: t('assessment.fluency'),
      grammar: t('assessment.grammar'),
      vocabulary: t('assessment.vocabulary'),
      interaction: t('assessment.interaction'),
      clarity: t('assessment.clarity'),
    })[value] || readable(value),
    humanLanguageReview: t('assessment.humanLanguageReview'),
    humanVerifiedCefr: t('assessment.humanVerifiedCefr'),
    transcriptConsent: t('assessment.transcriptConsent'),
    evaluateLanguage: t('assessment.evaluateLanguage'),
    backToDashboard: t('assessment.backToDashboard'),
  }), [statusLabels, t, typeLabels]);

  const hydrate = useCallback((nextAttempt) => {
    const responses = new Map(nextAttempt.responses.map((response) => [response.questionId, response]));
    const nextDrafts = Object.fromEntries(nextAttempt.questions.map((question) => [
      question.id,
      existingAnswer(responses.get(question.id)),
    ]));
    const firstUnanswered = nextAttempt.questions.findIndex((question) => !String(nextDrafts[question.id] || '').trim());
    setAttempt(nextAttempt);
    setDrafts(nextDrafts);
    setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : Math.max(0, nextAttempt.questions.length - 1));
  }, []);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const nextAttempt = await guideAssessmentsRepository.attempt(attemptId);
      if (mounted.current && currentRequest === requestId.current) hydrate(nextAttempt);
    } catch (nextError) {
      if (mounted.current && currentRequest === requestId.current) setError(apiErrorMessage(nextError));
    } finally {
      if (mounted.current && currentRequest === requestId.current) setLoading(false);
    }
  }, [attemptId, hydrate]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => {
      mounted.current = false;
      requestId.current += 1;
    };
  }, [load]);

  const currentQuestion = attempt?.questions[currentIndex] || null;
  const currentValue = currentQuestion ? String(drafts[currentQuestion.id] || '') : '';
  const speakingQuestionCount = attempt?.questions.filter((question) => question.questionType === 'SPEAKING_TASK').length || 1;
  const speakingAnswerLimit = Math.min(12000, Math.floor(19000 / speakingQuestionCount));
  const allAnswered = Boolean(attempt?.questions.length) && attempt.questions.every((question) =>
    String(drafts[question.id] || '').trim().length > 0,
  );

  const validateQuestion = (question) => {
    if (!question || !String(drafts[question.id] || '').trim()) {
      setInputError(t('assessment.answerRequired'));
      return false;
    }
    if (question.questionType === 'SPEAKING_TASK' && !transcriptConsent) {
      setInputError(t('assessment.consentRequired'));
      return false;
    }
    setInputError(null);
    return true;
  };

  const persistQuestion = (question) => guideAssessmentsRepository.saveResponse(
    attempt.id,
    responsePayload(question, String(drafts[question.id] || '').trim()),
  );

  const nextQuestion = async () => {
    if (saveLock.current || !validateQuestion(currentQuestion)) return;
    saveLock.current = true;
    setSaving(true);
    setError(null);
    try {
      await persistQuestion(currentQuestion);
      if (mounted.current) setCurrentIndex((index) => Math.min(attempt.questions.length - 1, index + 1));
    } catch (nextError) {
      if (mounted.current) setError(apiErrorMessage(nextError));
    } finally {
      saveLock.current = false;
      if (mounted.current) setSaving(false);
    }
  };

  const combinedTranscript = () => attempt.questions
    .filter((question) => question.questionType === 'SPEAKING_TASK')
    .map((question) => String(drafts[question.id] || '').trim())
    .join('\n\n');

  const evaluateLanguage = async () => {
    if (evaluateLock.current || !attempt || attempt.assessmentType !== 'LANGUAGE') return;
    if (!transcriptConsent) {
      setError(t('assessment.consentRequired'));
      return;
    }
    const transcript = combinedTranscript();
    if (!transcript.trim()) {
      setError(t('assessment.transcriptRequired'));
      return;
    }
    if (transcript.length > 20000) {
      setError(t('assessment.transcriptTooLong'));
      return;
    }
    evaluateLock.current = true;
    setEvaluating(true);
    setError(null);
    try {
      const estimate = await guideAssessmentsRepository.evaluateLanguage(attempt.id, {
        language: attempt.language || attempt.questions[0]?.language || 'en',
        consentToAiProcessing: transcriptConsent,
      });
      if (!mounted.current) return;
      setLanguageEstimate(estimate);
      const refreshed = await guideAssessmentsRepository.attempt(attempt.id);
      if (mounted.current) hydrate(refreshed);
    } catch (nextError) {
      if (mounted.current) setError(apiErrorMessage(nextError));
    } finally {
      evaluateLock.current = false;
      if (mounted.current) setEvaluating(false);
    }
  };

  const submit = async () => {
    if (submitLock.current || !attempt || attempt.status !== 'IN_PROGRESS') return;
    if (!allAnswered) {
      setInputError(t('assessment.answerEveryQuestion'));
      return;
    }
    if (attempt.questions.some((question) => question.questionType === 'SPEAKING_TASK') && !transcriptConsent) {
      setInputError(t('assessment.consentRequired'));
      return;
    }
    if (attempt.assessmentType === 'LANGUAGE' && combinedTranscript().length > 20000) {
      setInputError(t('assessment.transcriptTooLong'));
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    setInputError(null);
    setError(null);
    try {
      await Promise.all(attempt.questions.map(persistQuestion));
      const submitted = await guideAssessmentsRepository.submit(attempt.id);
      if (!mounted.current) return;
      setAttempt((current) => ({ ...current, ...submitted, questions: current.questions, responses: current.responses }));
      if (attempt.assessmentType === 'LANGUAGE') {
        const estimate = await guideAssessmentsRepository.evaluateLanguage(attempt.id, {
          language: attempt.language || attempt.questions[0]?.language || 'en',
          consentToAiProcessing: transcriptConsent,
        });
        if (mounted.current) setLanguageEstimate(estimate);
      }
      const refreshed = await guideAssessmentsRepository.attempt(attempt.id);
      if (mounted.current) hydrate(refreshed);
    } catch (nextError) {
      if (!mounted.current) return;
      setError(apiErrorMessage(nextError));
      try {
        // Reconcile ambiguous network failures before the user can retry a
        // submit that may already have committed on the server.
        const refreshed = await guideAssessmentsRepository.attempt(attempt.id);
        if (mounted.current) hydrate(refreshed);
      } catch {
        // Preserve the last locally known state and the original error.
      }
    } finally {
      submitLock.current = false;
      if (mounted.current) setSubmitting(false);
    }
  };

  const completed = attempt && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'NOT_STARTED';
  const progress = attempt?.questions.length ? `${(currentIndex + 1) / attempt.questions.length * 100}%` : '0%';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader title={t('assessment.sessionTitle')} onBack={() => navigation.goBack()} />
      <StateBox loading={loading} error={error && !attempt} empty={attempt && !completed && !attempt.questions.length} emptyText={t('assessment.noQuestions')}>
        {attempt ? (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {error ? <Text style={styles.inputError} accessibilityLiveRegion="assertive">{error}</Text> : null}
            {completed ? (
              <AssessmentResultCard
                attempt={attempt}
                languageEstimate={languageEstimate}
                labels={resultLabels}
                evaluating={evaluating}
                transcriptConsent={transcriptConsent}
                onToggleConsent={() => {
                  setTranscriptConsent((current) => !current);
                  setError(null);
                }}
                onEvaluateLanguage={evaluateLanguage}
                onDone={() => navigation.goBack()}
              />
            ) : (
              <>
                <View style={styles.heading}>
                  <Text style={styles.eyebrow}>{typeLabels[attempt.assessmentType] || readable(attempt.assessmentType)}</Text>
                  <Text style={styles.headingTitle}>{t('assessment.question')} {currentIndex + 1} / {attempt.questions.length}</Text>
                  <View style={styles.track}><View style={[styles.progress, { width: progress }]} /></View>
                  <Text style={styles.protected}>{t('assessment.answerKeysProtected')}</Text>
                </View>

                {attempt.assessmentType === 'FIRST_AID_THEORY' ? (
                  <View style={styles.firstAidNotice}>
                    <Ionicons name="medkit-outline" size={19} color="#B42318" />
                    <Text style={styles.firstAidText}>{t('assessment.firstAidTheoryOnly')}</Text>
                  </View>
                ) : null}

                <AssessmentQuestionCard
                  question={currentQuestion}
                  value={currentValue}
                  onChange={(value) => {
                    setDrafts((current) => ({ ...current, [currentQuestion.id]: value }));
                    setInputError(null);
                  }}
                  transcriptConsent={transcriptConsent}
                  onToggleConsent={() => {
                    setTranscriptConsent((current) => !current);
                    setInputError(null);
                  }}
                  labels={questionLabels}
                  maxLength={currentQuestion.questionType === 'SPEAKING_TASK' ? speakingAnswerLimit : undefined}
                  disabled={saving || submitting || evaluating}
                />

                {inputError ? <Text style={styles.inputError} accessibilityLiveRegion="assertive">{inputError}</Text> : null}
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('assessment.previous')}
                    disabled={currentIndex === 0 || saving || submitting}
                    onPress={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                    style={({ pressed }) => [styles.previous, currentIndex === 0 && styles.disabled, pressed && styles.pressed]}
                  >
                    <Ionicons name="arrow-back" size={18} color={colors.ink} />
                    <Text style={styles.previousText}>{t('assessment.previous')}</Text>
                  </Pressable>
                  {currentIndex < attempt.questions.length - 1 ? (
                    <AppButton title={t('assessment.saveNext')} onPress={nextQuestion} loading={saving} disabled={submitting} style={styles.primaryAction} />
                  ) : (
                    <AppButton title={t('assessment.submit')} onPress={submit} loading={submitting} disabled={saving || !allAnswered} style={styles.primaryAction} />
                  )}
                </View>
              </>
            )}
          </ScrollView>
        ) : null}
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { width: '100%', maxWidth: 820, alignSelf: 'center', padding: spacing.lg, paddingBottom: 52, gap: 14 },
  heading: { gap: 8 },
  eyebrow: { color: colors.brand, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.45 },
  headingTitle: { color: colors.ink, fontSize: 21, fontWeight: '800' },
  track: { height: 7, overflow: 'hidden', borderRadius: radius.pill, backgroundColor: colors.secondary },
  progress: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.brand },
  protected: { color: colors.inkSoft, fontSize: 10, lineHeight: 15 },
  firstAidNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: radius.md, backgroundColor: '#FEF2F2' },
  firstAidText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  inputError: { color: '#B42318', fontSize: 12, lineHeight: 18, padding: 10, borderRadius: radius.sm, backgroundColor: '#FEF2F2', overflow: 'hidden' },
  actions: { flexDirection: 'row', gap: 10 },
  previous: { minWidth: 118, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.white },
  previousText: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  primaryAction: { flex: 1 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
});
