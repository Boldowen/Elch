import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, StateBox } from '../components/ui';
import { socialRepository } from '../repositories/socialRepository';
import { conversationsRepository } from '../repositories/conversationsRepository';
import { useAuth } from '../context/AuthContext';
import { useHideTabBarOnScroll } from '../navigation/useHideTabBarOnScroll';
import { apiErrorMessage } from '../services/api';
import { colors, radius, spacing } from '../theme';

const FEEDS = [
  { key: 'forYou', label: 'For you' },
  { key: 'following', label: 'Following' },
];

export default function CommunityScreen({ navigation }) {
  const { session } = useAuth();
  const onScroll = useHideTabBarOnScroll();
  const [activeFeed, setActiveFeed] = useState('forYou');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [composer, setComposer] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [followingUserId, setFollowingUserId] = useState(null);

  const visiblePosts = useMemo(
    () => activeFeed === 'following'
      ? posts.filter((post) => post.author.following)
      : posts,
    [activeFeed, posts],
  );

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

  const openComposer = () => {
    if (!session) {
      navigation.navigate('Auth', { mode: 'login' });
      return;
    }
    setComposerOpen(true);
  };

  const create = async () => {
    if (!composer.trim()) return;
    setPosting(true);
    try {
      await socialRepository.createPost({
        text: composer.trim(),
        location: 'Mongolia',
      });
      setComposer('');
      setComposerOpen(false);
      setActiveFeed('forYou');
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
        prev.map((item) =>
          item.id === post.id
            ? {
                ...item,
                liked: !item.liked,
                likeCount: item.liked ? item.likeCount - 1 : item.likeCount + 1,
              }
            : item,
        ),
      );
    } catch (e) {
      Alert.alert('Error', apiErrorMessage(e));
    }
  };

  const follow = async (author) => {
    if (!session) return navigation.navigate('Auth', { mode: 'login' });
    setFollowingUserId(author.id);
    try {
      const result = await socialRepository.toggleFollow(author.id);
      setPosts((prev) =>
        prev.map((post) =>
          post.author.id === author.id
            ? {
                ...post,
                author: { ...post.author, following: Boolean(result.following) },
              }
            : post,
        ),
      );
    } catch (e) {
      Alert.alert('Follow failed', apiErrorMessage(e));
    } finally {
      setFollowingUserId(null);
    }
  };

  const message = async (userId) => {
    if (!session) return navigation.navigate('Auth', { mode: 'login' });
    try {
      const id = await conversationsRepository.direct(userId);
      navigation.navigate('Chat', { id, title: 'Chat', peerId: userId });
    } catch (e) {
      Alert.alert('Error', apiErrorMessage(e));
    }
  };

  const feedHeader = (
    <View style={styles.tabs} accessibilityRole="tablist">
      {FEEDS.map((feed) => {
        const active = feed.key === activeFeed;
        return (
          <Pressable
            key={feed.key}
            onPress={() => setActiveFeed(feed.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={styles.tab}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {feed.label}
            </Text>
            <View style={[styles.tabIndicator, active && styles.tabIndicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Text style={styles.title}>Community</Text>
      {feedHeader}

      <StateBox loading={loading} error={error} empty={false}>
        <FlatList
          data={visiblePosts}
          keyExtractor={(post) => post.id}
          contentContainerStyle={styles.content}
          onScroll={onScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={36} color={colors.inkSoft} />
              <Text style={styles.emptyTitle}>
                {activeFeed === 'following' ? 'No posts from people you follow' : 'No posts yet'}
              </Text>
              {activeFeed === 'following' ? (
                <Text style={styles.emptyCopy}>Follow travelers to see their posts here.</Text>
              ) : null}
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
            />
          }
          renderItem={({ item }) => {
            const isOwnPost = session?.user?.id === item.author.id;
            return (
              <View style={styles.card}>
                <View style={styles.authorRow}>
                  <Image
                    source={item.author.avatarUrl || undefined}
                    style={styles.avatar}
                  />
                  <View style={styles.authorCopy}>
                    <Text style={styles.name}>{item.author.name}</Text>
                    <Text style={styles.meta}>
                      {item.location} · {item.timeLabel}
                    </Text>
                  </View>
                  {!isOwnPost ? (
                    <Pressable
                      onPress={() => follow(item.author)}
                      disabled={followingUserId === item.author.id}
                      style={[
                        styles.followButton,
                        item.author.following && styles.followingButton,
                      ]}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.followText,
                          item.author.following && styles.followingText,
                        ]}
                      >
                        {item.author.following ? 'Following' : 'Follow'}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
                <Text style={styles.postText}>{item.text}</Text>
                {item.imageUrl ? (
                  <Image source={item.imageUrl} style={styles.postImage} contentFit="cover" />
                ) : null}
                <View style={styles.actions}>
                  <Pressable onPress={() => like(item)} style={styles.actionButton}>
                    <Ionicons
                      name={item.liked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={item.liked ? colors.brand : colors.ink}
                    />
                    <Text style={styles.actionText}>{item.likeCount}</Text>
                  </Pressable>
                  {!isOwnPost ? (
                    <Pressable
                      onPress={() => message(item.author.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="chatbubble-outline" size={19} color={colors.ink} />
                      <Text style={styles.actionText}>Message</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          }}
        />
      </StateBox>

      <Pressable
        onPress={openComposer}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        accessibilityRole="button"
        accessibilityLabel="Create a new post"
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </Pressable>

      <Modal
        visible={composerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setComposerOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.backdrop} onPress={() => setComposerOpen(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Pressable onPress={() => setComposerOpen(false)} hitSlop={12}>
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>Create post</Text>
              <View style={styles.headerSpacer} />
            </View>
            <TextInput
              value={composer}
              onChangeText={setComposer}
              placeholder="Share a travel moment..."
              placeholderTextColor={colors.inkSoft}
              style={styles.composer}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            <AppButton
              title="Post"
              onPress={create}
              loading={posting}
              disabled={!composer.trim()}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: 10 },
  tabText: { color: colors.inkSoft, fontSize: 15, fontWeight: '600' },
  tabTextActive: { color: colors.ink },
  tabIndicator: { width: 0, height: 2, marginTop: 10, backgroundColor: colors.ink },
  tabIndicatorActive: { width: '100%' },
  content: { padding: spacing.lg, paddingBottom: 120 },
  card: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  authorRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondary },
  authorCopy: { flex: 1 },
  name: { fontWeight: '700', color: colors.ink },
  meta: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  followButton: {
    minWidth: 76,
    height: 34,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
  },
  followingButton: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  followText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  followingText: { color: colors.ink },
  postText: { marginTop: 12, fontSize: 15, lineHeight: 21, color: colors.ink },
  postImage: { marginTop: 12, width: '100%', height: 220, borderRadius: radius.lg, backgroundColor: colors.secondary },
  actions: { flexDirection: 'row', gap: 22, marginTop: 13 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36 },
  actionText: { fontWeight: '600', color: colors.ink, fontSize: 13 },
  empty: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 24 },
  emptyTitle: { color: colors.ink, fontSize: 16, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  emptyCopy: { color: colors.inkSoft, marginTop: 6, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 88,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: { opacity: 0.86, transform: [{ scale: 0.96 }] },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)' },
  sheet: {
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.white,
  },
  sheetHandle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: colors.ink },
  cancelLabel: { width: 60, color: colors.inkSoft, fontSize: 15 },
  headerSpacer: { width: 60 },
  composer: { minHeight: 140, marginVertical: 18, padding: 14, borderRadius: radius.md, backgroundColor: colors.secondary, color: colors.ink, fontSize: 16, lineHeight: 22 },
});
