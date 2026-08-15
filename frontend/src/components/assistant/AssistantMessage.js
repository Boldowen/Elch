import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';
import SafetyNotice from './SafetyNotice';
import SourceList from './SourceList';
import ToolResultCard from './ToolResultCard';

function TextList({ title, items = [], accent = false }) {
  if (!items.length) return null;
  return (
    <View style={styles.list}>
      <Text style={styles.listTitle}>{title}</Text>
      {items.map((item, index) => (
        <Text key={`${item}-${index}`} style={[styles.listItem, accent && styles.verified]}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

export default function AssistantMessage({ message, labels }) {
  const mine = message.role === 'user';
  const response = message.response;
  const warnings = [
    ...(response?.warnings || []),
    ...(response?.requiresHumanEscalation ? [labels.humanReview] : []),
  ];

  return (
    <View style={[styles.row, mine ? styles.mineRow : styles.assistantRow]}>
      <View style={[styles.bubble, mine ? styles.mine : styles.assistant]}>
        {message.pending ? (
          <View style={styles.pending} accessibilityLiveRegion="polite">
            <ActivityIndicator size="small" color={colors.brand} />
            <Text style={styles.pendingText}>{labels.thinking}</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.text, mine && styles.mineText]}>{message.text}</Text>
            {response?.confidence != null ? (
              <Text style={styles.meta}>
                {labels.confidence} {Math.round(response.confidence * 100)}%
              </Text>
            ) : null}
            <SafetyNotice title={labels.safety} messages={warnings} tone="danger" />
            <SafetyNotice title={labels.limitations} messages={response?.limitations || []} tone="warning" />
            <TextList title={labels.verifiedFacts} items={response?.verifiedFacts || []} accent />
            <TextList title={labels.recommendations} items={response?.recommendations || []} />
            <ToolResultCard route={response?.route} tools={response?.suggestedTools || []} title={labels.routeContext} />
            <SourceList
              sources={response?.citations || []}
              title={labels.sources}
              verifiedLabel={labels.verified}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: '100%', marginBottom: 10 },
  mineRow: { alignItems: 'flex-end' },
  assistantRow: { alignItems: 'flex-start' },
  bubble: { maxWidth: '92%', borderRadius: radius.lg, padding: 13, gap: 9 },
  mine: { backgroundColor: colors.brand, borderBottomRightRadius: 5 },
  assistant: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 5,
  },
  text: { color: colors.ink, fontSize: 14, lineHeight: 21 },
  mineText: { color: colors.white },
  meta: { color: colors.inkSoft, fontSize: 11, fontWeight: '600' },
  pending: { flexDirection: 'row', alignItems: 'center', gap: 9, minWidth: 120 },
  pendingText: { color: colors.inkSoft, fontSize: 13 },
  list: { gap: 4 },
  listTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  listItem: { color: colors.ink, fontSize: 12, lineHeight: 18 },
  verified: { color: colors.success },
});
