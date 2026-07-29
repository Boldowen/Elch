import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StateBox } from '../components/ui';
import { conversationsRepository } from '../repositories/conversationsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, spacing } from '../theme';

export default function InboxScreen({ navigation }) {
  const { session } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!session) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await conversationsRepository.list(session.user.id);
      setItems(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      setLoading(true);
      load();
    });
    return unsub;
  }, [navigation, load]);

  if (!session) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Log in to view messages.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Inbox</Text>
      <StateBox
        loading={loading}
        error={error}
        empty={!items.length}
        emptyText="No conversations yet."
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
            />
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                navigation.navigate('Chat', {
                  id: item.id,
                  title: item.guide,
                  peerId: item.peerId,
                  muted: item.muted,
                })
              }
            >
              <Image source={item.photo || undefined} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <View style={styles.top}>
                  <Text style={styles.name}>{item.guide}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.last} numberOfLines={1}>
                  {item.last}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </StateBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    marginBottom: 8,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.inkSoft },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondary,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontWeight: '700', color: colors.ink, fontSize: 15 },
  time: { color: colors.inkSoft, fontSize: 12 },
  last: { color: colors.inkSoft, marginTop: 3, fontSize: 13 },
});
