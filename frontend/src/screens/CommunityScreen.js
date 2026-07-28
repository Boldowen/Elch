import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, StateBox } from '../components/ui';
import { socialRepository } from '../repositories/socialRepository';
import { conversationsRepository } from '../repositories/conversationsRepository';
import { useAuth } from '../context/AuthContext';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

export default function CommunityScreen({ navigation }) {
  const { session } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [composer, setComposer] = useState('');
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await socialRepository.feed();
      setPosts(data);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!session) {
      navigation.navigate('Auth', { mode: 'login' });
      return;
    }
    if (!composer.trim()) return;
    setPosting(true);
    try {
      await socialRepository.createPost({
        text: composer.trim(),
        location: 'Mongolia',
      });
      setComposer('');
      await load();
    } catch (e) {
      Alert.alert('Post failed', apiErrorMessage(e));
    } finally {
      setPosting(false);
    }
  };

  const like = async (post) => {
    if (!session) return navigation.navigate('Auth', { mode: 'login' });
    try {
      await socialRepository.toggleLike(post.id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                liked: !p.liked,
                likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1,
              }
            : p,
        ),
      );
    } catch (e) {
      Alert.alert('Error', apiErrorMessage(e));
    }
  };

  const message = async (userId) => {
    if (!session) return navigation.navigate('Auth', { mode: 'login' });
    try {
      const id = await conversationsRepository.direct(userId);
      navigation.navigate('Chat', { id, title: 'Chat' });
    } catch (e) {
      Alert.alert('Error', apiErrorMessage(e));
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Community</Text>
      {session ? (
        <View style={styles.composer}>
          <TextInput
            value={composer}
            onChangeText={setComposer}
            placeholder="Share a travel moment..."
            placeholderTextColor={colors.inkSoft}
            style={styles.input}
            multiline
          />
          <AppButton title="Post" onPress={create} loading={posting} />
        </View>
      ) : null}
      <StateBox
        loading={loading}
        error={error}
        empty={!posts.length}
        emptyText="No posts yet. Be the first!"
      >
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
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
            <View style={styles.card}>
              <View style={styles.row}>
                <Image
                  source={item.author.avatarUrl || undefined}
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.author.name}</Text>
                  <Text style={styles.meta}>
                    {item.location} · {item.timeLabel}
                  </Text>
                </View>
              </View>
              <Text style={styles.text}>{item.text}</Text>
              {item.imageUrl ? (
                <Image source={item.imageUrl} style={styles.image} contentFit="cover" />
              ) : null}
              <View style={styles.actions}>
                <Pressable onPress={() => like(item)}>
                  <Text style={styles.action}>
                    {item.liked ? '♥' : '♡'} {item.likeCount}
                  </Text>
                </Pressable>
                <Pressable onPress={() => message(item.author.id)}>
                  <Text style={styles.action}>Message</Text>
                </Pressable>
              </View>
            </View>
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
  },
  composer: {
    padding: spacing.lg,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    minHeight: 70,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
    padding: 12,
    fontSize: 15,
    color: colors.ink,
  },
  card: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.secondary,
  },
  name: { fontWeight: '700', color: colors.ink },
  meta: { color: colors.inkSoft, fontSize: 12 },
  text: { marginTop: 10, fontSize: 15, lineHeight: 21, color: colors.ink },
  image: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.secondary,
  },
  actions: { flexDirection: 'row', gap: 18, marginTop: 12 },
  action: { fontWeight: '600', color: colors.ink },
});
