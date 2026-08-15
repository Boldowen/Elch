import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput } from '../ui';
import { colors, radius } from '../../theme';

export default function AssessmentQuestionCard({ question, value, onChange, transcriptConsent, onToggleConsent, labels, maxLength, disabled }) {
  if (!question) return null;
  const isMultipleChoice = question.questionType === 'MULTIPLE_CHOICE';
  const isSpeaking = question.questionType === 'SPEAKING_TASK';
  const hasOptions = isMultipleChoice && question.options.length > 0;
  const characterLimit = maxLength || (isSpeaking ? 12000 : question.questionType === 'SHORT_ANSWER' ? 2000 : 12000);

  return (
    <View style={styles.root}>
      <View style={styles.metaRow}>
        <Text style={styles.type}>{labels.type(question.questionType)}</Text>
        <Text style={styles.difficulty}>{labels.difficulty(question.difficulty)}</Text>
      </View>
      <Text style={styles.category}>{labels.category(question.category)}</Text>
      <Text style={styles.prompt}>{question.prompt}</Text>

      {isSpeaking ? (
        <View style={styles.transcriptNotice}>
          <Ionicons name="mic-off-outline" size={19} color="#2563EB" />
          <Text style={styles.transcriptNoticeText}>{labels.transcriptOnly}</Text>
        </View>
      ) : null}

      {hasOptions ? (
        <View style={styles.options} accessibilityRole="radiogroup">
          {question.options.map((option) => {
            const active = value === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: active, disabled: Boolean(disabled) }}
                disabled={disabled}
                onPress={() => onChange(option.value)}
                style={({ pressed }) => [styles.option, active && styles.optionActive, disabled && styles.disabled, pressed && styles.pressed]}
              >
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <AppInput
          label={isMultipleChoice ? labels.optionLabel : isSpeaking ? labels.transcriptLabel : labels.answerLabel}
          value={value}
          onChangeText={onChange}
          placeholder={isMultipleChoice ? labels.optionPlaceholder : isSpeaking ? labels.transcriptPlaceholder : labels.answerPlaceholder}
          multiline={!isMultipleChoice}
          maxLength={characterLimit}
          autoCapitalize="sentences"
          editable={!disabled}
          style={styles.inputField}
          inputStyle={!isMultipleChoice ? styles.longInput : undefined}
        />
      )}

      {!isMultipleChoice ? <Text style={styles.count}>{value.length} / {characterLimit}</Text> : null}

      {isSpeaking ? (
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: transcriptConsent, disabled: Boolean(disabled) }}
          disabled={disabled}
          onPress={onToggleConsent}
          style={({ pressed }) => [styles.consent, disabled && styles.disabled, pressed && styles.pressed]}
        >
          <Ionicons
            name={transcriptConsent ? 'checkbox' : 'square-outline'}
            size={22}
            color={transcriptConsent ? colors.brand : colors.inkSoft}
          />
          <Text style={styles.consentText}>{labels.transcriptConsent}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12, padding: 16, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 7 },
  type: { color: colors.brandDark, fontSize: 11, fontWeight: '800', paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: '#FFF1F2' },
  difficulty: { color: colors.inkSoft, fontSize: 11, fontWeight: '700' },
  category: { color: colors.inkSoft, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.35 },
  prompt: { color: colors.ink, fontSize: 17, lineHeight: 25, fontWeight: '700' },
  transcriptNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 11, borderRadius: radius.md, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' },
  transcriptNoticeText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  options: { gap: 9 },
  option: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.white },
  optionActive: { borderColor: colors.brand, backgroundColor: '#FFF7F8' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.inkSoft, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brand },
  optionText: { flex: 1, color: colors.ink, fontSize: 14, lineHeight: 20 },
  optionTextActive: { fontWeight: '700' },
  inputField: { marginBottom: 0 },
  longInput: { minHeight: 150 },
  count: { alignSelf: 'flex-end', color: colors.inkSoft, fontSize: 10, marginTop: -8 },
  consent: { minHeight: 48, flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 11, borderRadius: radius.md, backgroundColor: colors.secondary },
  consentText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 18 },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.75 },
});
