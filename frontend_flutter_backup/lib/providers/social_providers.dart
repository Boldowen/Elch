import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/constants/app_images.dart';
import '../models/social_post.dart';
import '../repositories/social_repository.dart';
import 'app_providers.dart';

final socialRepositoryProvider = Provider(
  (ref) => SocialRepository(ref.watch(apiServiceProvider)),
);

class SocialFeedState {
  const SocialFeedState({
    required this.posts,
    required this.following,
    this.refreshing = false,
  });

  final List<SocialPost> posts;
  final Set<String> following;
  final bool refreshing;

  SocialFeedState copyWith({
    List<SocialPost>? posts,
    Set<String>? following,
    bool? refreshing,
  }) {
    return SocialFeedState(
      posts: posts ?? this.posts,
      following: following ?? this.following,
      refreshing: refreshing ?? this.refreshing,
    );
  }
}

class SocialFeedController extends Notifier<SocialFeedState> {
  late final SocialRepository _repository;

  @override
  SocialFeedState build() {
    _repository = ref.read(socialRepositoryProvider);
    return SocialFeedState(posts: _seedPosts, following: {'traveler-2'});
  }

  Future<void> refresh() async {
    state = state.copyWith(refreshing: true);
    try {
      final remote = await _repository.feed();
      if (remote.isNotEmpty) state = state.copyWith(posts: remote);
    } catch (_) {
      // The curated local feed keeps the community usable while offline.
    } finally {
      state = state.copyWith(refreshing: false);
    }
  }

  void toggleLike(String postId) {
    state = state.copyWith(
      posts: [
        for (final post in state.posts)
          if (post.id == postId)
            post.copyWith(
              liked: !post.liked,
              likeCount: post.likeCount + (post.liked ? -1 : 1),
            )
          else
            post,
      ],
    );
    unawaited(_repository.toggleLike(postId).catchError((_) {}));
  }

  void toggleFollow(String userId) {
    final following = {...state.following};
    following.contains(userId)
        ? following.remove(userId)
        : following.add(userId);
    state = state.copyWith(following: following);
    unawaited(_repository.toggleFollow(userId).catchError((_) {}));
  }

  void addComment({
    required String postId,
    required String text,
    required SocialAuthor author,
  }) {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;
    final comment = SocialComment(
      id: 'local-comment-${DateTime.now().microsecondsSinceEpoch}',
      author: author,
      text: trimmed,
      timeLabel: 'now',
    );
    state = state.copyWith(
      posts: [
        for (final post in state.posts)
          if (post.id == postId)
            post.copyWith(comments: [...post.comments, comment])
          else
            post,
      ],
    );
    unawaited(_repository.addComment(postId, trimmed).catchError((_) {}));
  }

  void createPost({
    required SocialAuthor author,
    required String text,
    required String location,
    String? imageUrl,
  }) {
    final trimmed = text.trim();
    if (trimmed.isEmpty && imageUrl == null) return;
    final post = SocialPost(
      id: 'local-post-${DateTime.now().microsecondsSinceEpoch}',
      author: author,
      text: trimmed,
      location: location.trim().isEmpty ? author.home : location.trim(),
      timeLabel: 'now',
      imageUrl: imageUrl,
      likeCount: 0,
      comments: const [],
    );
    state = state.copyWith(posts: [post, ...state.posts]);
    unawaited(
      _repository
          .createPost(text: trimmed, location: location, imageUrl: imageUrl)
          .catchError((_) {}),
    );
  }
}

final socialFeedProvider =
    NotifierProvider<SocialFeedController, SocialFeedState>(
      SocialFeedController.new,
    );

const communityPeople = <SocialAuthor>[
  SocialAuthor(
    id: 'traveler-1',
    name: 'Mia Chen',
    avatarUrl: AppImages.guide2,
    home: 'Singapore',
    followsYou: true,
  ),
  SocialAuthor(
    id: 'traveler-2',
    name: 'Noah Williams',
    avatarUrl: AppImages.guide1,
    home: 'New Zealand',
  ),
  SocialAuthor(
    id: 'traveler-3',
    name: 'Ariunaa B.',
    avatarUrl: AppImages.guide4,
    home: 'Mongolia',
    followsYou: true,
  ),
  SocialAuthor(
    id: 'traveler-4',
    name: 'Lena Hoffmann',
    avatarUrl: AppImages.guide5,
    home: 'Germany',
  ),
];

final _seedPosts = <SocialPost>[
  SocialPost(
    id: 'post-1',
    author: communityPeople[0],
    text:
        'Three quiet mornings at Lake Khuvsgul. The family who hosted us '
        'shared milk tea, trail advice and the best sunrise spot.',
    location: 'Lake Khuvsgul, Mongolia',
    timeLabel: '18 min',
    imageUrl: AppImages.lakeReflect,
    likeCount: 128,
    comments: [
      SocialComment(
        id: 'comment-1',
        author: communityPeople[2],
        text: 'That northern light is unreal. Safe travels!',
        timeLabel: '8 min',
      ),
    ],
  ),
  SocialPost(
    id: 'post-2',
    author: communityPeople[1],
    text:
        'Looking for two travel buddies for a five-day Gobi loop in early '
        'September. Slow pace, photography and local camps.',
    location: 'Ömnögovi, Mongolia',
    timeLabel: '1 h',
    imageUrl: AppImages.camelDesert,
    likeCount: 74,
    comments: const [],
  ),
  SocialPost(
    id: 'post-3',
    author: communityPeople[2],
    text:
        'A reminder from a local: leave gates exactly as you found them and '
        'always ask before photographing a family or their home.',
    location: 'Orkhon Valley, Mongolia',
    timeLabel: '3 h',
    imageUrl: AppImages.steppe,
    likeCount: 203,
    comments: [
      SocialComment(
        id: 'comment-2',
        author: communityPeople[3],
        text: 'Thank you — this is the advice travelers need.',
        timeLabel: '2 h',
      ),
    ],
  ),
];
