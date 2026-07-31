import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader, StateBox } from '../components/ui';
import { conversationsRepository } from '../repositories/conversationsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';
import { trustSafetyRepository } from '../repositories/trustSafetyRepository';

export default function ChatScreen({ navigation, route }) {
  const { id, title, peerId } = route.params;
  const { session } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [muted, setMuted] = useState(Boolean(route.params?.muted));

  const load = useCallback(async () => {
    if (!session) return;
    try {
      setError(null);
      const data = await conversationsRepository.messages(id, session.user.id);
      setMessages(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id, session]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await conversationsRepository.send(id, { text: text.trim() });
      setText('');
      await load();
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScreenHeader title={title || 'Chat'} onBack={() => navigation.goBack()} />
      <View style={styles.safetyActions}>
        <Pressable onPress={async () => { const next = !muted; await conversationsRepository.mute(id, next); setMuted(next); }}><Text style={styles.safetyText}>{muted ? 'Unmute' : 'Mute'}</Text></Pressable>
        {peerId ? <Pressable onPress={() => Alert.alert('Report user?', 'A safety report will be sent to ELCH.', [{ text: 'Cancel' }, { text: 'Report', style: 'destructive', onPress: async () => { await trustSafetyRepository.report({ reason: 'HARASSMENT', targetType: 'USER', targetId: peerId, details: 'Reported from conversation' }); Alert.alert('Report sent'); } }])}><Text style={styles.safetyText}>Report</Text></Pressable> : null}
        {peerId ? <Pressable onPress={() => Alert.alert('Block user?', 'Messaging and social interactions will stop.', [{ text: 'Cancel' }, { text: 'Block', style: 'destructive', onPress: async () => { await trustSafetyRepository.block(peerId); navigation.goBack(); } }])}><Text style={styles.dangerText}>Block</Text></Pressable> : null}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <StateBox loading={loading} error={error}>
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: spacing.lg, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.me ? styles.me : styles.them,
                ]}
              >
                {item.text ? (
                  <Text style={[styles.msg, item.me && { color: '#fff' }]}>
                    {item.text}
                  </Text>
                ) : null}
                <Text style={[styles.time, item.me && { color: 'rgba(255,255,255,0.7)' }]}>
                  {item.time}
                </Text>
              </View>
            )}
          />
        </StateBox>
        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={colors.inkSoft}
            style={styles.input}
          />
          <Pressable onPress={send} style={styles.send}>
            <Text style={styles.sendText}>{sending ? '…' : 'Send'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: 8,
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: colors.brand,
  },
  them: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
  },
  msg: { color: colors.ink, fontSize: 15, lineHeight: 20 },
  time: { fontSize: 11, color: colors.inkSoft, marginTop: 4 },
  composer: {
    flexDirection: 'row',
    gap: 8,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    color: colors.ink,
  },
  send: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '700' },
  safetyActions: { minHeight: 44, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  safetyText: { color: colors.inkSoft, fontWeight: '600' },
  dangerText: { color: '#B42318', fontWeight: '700' },
});
