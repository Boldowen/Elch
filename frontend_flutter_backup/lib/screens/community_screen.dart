import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../models/social_post.dart';
import '../providers/app_providers.dart';
import '../providers/social_providers.dart';
import '../widgets/network_image_view.dart';

class CommunityScreen extends ConsumerStatefulWidget {
  const CommunityScreen({super.key});

  @override
  ConsumerState<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends ConsumerState<CommunityScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(socialFeedProvider.notifier).refresh();
    });
  }

  SocialAuthor get _me {
    final user = ref.read(authControllerProvider).session?.user;
    return SocialAuthor(
      id: user?.id ?? 'me',
      name: user?.name ?? 'VenTour Traveler',
      avatarUrl: user?.avatarUrl ?? AppImages.guide3,
      home: 'Mongolia',
    );
  }

  @override
  Widget build(BuildContext context) {
    final feed = ref.watch(socialFeedProvider);
    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F8),
      body: RefreshIndicator(
        onRefresh: ref.read(socialFeedProvider.notifier).refresh,
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverAppBar(
              pinned: true,
              expandedHeight: 92,
              toolbarHeight: 0,
              backgroundColor: Colors.white,
              surfaceTintColor: Colors.white,
              flexibleSpace: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 130, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Community',
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                      const SizedBox(height: 3),
                      const Text(
                        'Stories, tips and travel buddies',
                        style: TextStyle(
                          color: AppColors.inkSoft,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                child: _ComposerPrompt(author: _me, onTap: _openComposer),
              ),
            ),
            SliverToBoxAdapter(
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.only(bottom: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        children: [
                          Text(
                            'Travelers to know',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                          Spacer(),
                          Text(
                            'Build your travel circle',
                            style: TextStyle(
                              color: AppColors.inkSoft,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 122,
                      child: ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        scrollDirection: Axis.horizontal,
                        itemCount: communityPeople.length,
                        separatorBuilder: (_, _) => const SizedBox(width: 10),
                        itemBuilder: (context, index) {
                          final person = communityPeople[index];
                          final following = feed.following.contains(person.id);
                          return _PersonCard(
                            person: person,
                            following: following,
                            onFollow: () => ref
                                .read(socialFeedProvider.notifier)
                                .toggleFollow(person.id),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (feed.refreshing)
              const SliverToBoxAdapter(
                child: LinearProgressIndicator(minHeight: 2),
              ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(0, 10, 0, 110),
              sliver: SliverList.separated(
                itemCount: feed.posts.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final post = feed.posts[index];
                  return _PostCard(
                    post: post,
                    following: feed.following.contains(post.author.id),
                    onLike: () => ref
                        .read(socialFeedProvider.notifier)
                        .toggleLike(post.id),
                    onFollow: () => ref
                        .read(socialFeedProvider.notifier)
                        .toggleFollow(post.author.id),
                    onComment: () => _openComments(post),
                    onMessage: () => _openChat(post.author),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _openComposer,
        backgroundColor: AppColors.brand,
        foregroundColor: Colors.white,
        child: const Icon(Icons.edit_outlined),
      ),
    );
  }

  Future<void> _openChat(SocialAuthor author) async {
    var conversationId = author.id;
    try {
      conversationId = await ref
          .read(socialRepositoryProvider)
          .openDirectConversation(author.id);
    } catch (_) {
      // Demo travelers use local ids; the chat remains available offline.
    }
    if (!mounted) return;
    context.push(
      Uri(
        path: '/chat/$conversationId',
        queryParameters: {'name': author.name, 'avatar': author.avatarUrl},
      ).toString(),
    );
  }

  Future<void> _openComposer() async {
    final text = TextEditingController();
    final location = TextEditingController(text: 'Mongolia');
    String? imageUrl;
    final result =
        await showModalBottomSheet<
          ({String text, String location, String? image})
        >(
          context: context,
          isScrollControlled: true,
          showDragHandle: true,
          builder: (sheetContext) => StatefulBuilder(
            builder: (context, setSheetState) {
              final canPost = text.text.trim().isNotEmpty || imageUrl != null;
              return Padding(
                padding: EdgeInsets.fromLTRB(
                  20,
                  0,
                  20,
                  MediaQuery.viewInsetsOf(context).bottom + 20,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Share with travelers',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Post a story, local tip or travel-buddy plan.',
                      style: TextStyle(color: AppColors.inkSoft),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: text,
                      autofocus: true,
                      minLines: 3,
                      maxLines: 6,
                      onChanged: (_) => setSheetState(() {}),
                      decoration: const InputDecoration(
                        hintText:
                            'What would you like other travelers to know?',
                        alignLabelWithHint: true,
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: location,
                      decoration: const InputDecoration(
                        prefixIcon: Icon(Icons.location_on_outlined),
                        labelText: 'Location',
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Add a travel photo',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 9),
                    SizedBox(
                      height: 76,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        children: [
                          for (final image in const [
                            AppImages.steppe,
                            AppImages.lakeReflect,
                            AppImages.camelDesert,
                            AppImages.city,
                          ]) ...[
                            GestureDetector(
                              onTap: () => setSheetState(
                                () =>
                                    imageUrl = imageUrl == image ? null : image,
                              ),
                              child: Container(
                                width: 94,
                                margin: const EdgeInsets.only(right: 9),
                                padding: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(
                                    color: imageUrl == image
                                        ? AppColors.brand
                                        : Colors.transparent,
                                    width: 2,
                                  ),
                                ),
                                child: NetworkImageView(
                                  url: image,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    FilledButton.icon(
                      onPressed: canPost
                          ? () => Navigator.pop(sheetContext, (
                              text: text.text,
                              location: location.text,
                              image: imageUrl,
                            ))
                          : null,
                      icon: const Icon(Icons.send_outlined),
                      label: const Text('Publish post'),
                      style: FilledButton.styleFrom(
                        minimumSize: const Size.fromHeight(52),
                        backgroundColor: AppColors.brand,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        );
    text.dispose();
    location.dispose();
    if (result == null || !mounted) return;
    ref
        .read(socialFeedProvider.notifier)
        .createPost(
          author: _me,
          text: result.text,
          location: result.location,
          imageUrl: result.image,
        );
  }

  Future<void> _openComments(SocialPost initialPost) async {
    final input = TextEditingController();
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (sheetContext) => Consumer(
        builder: (context, ref, _) {
          final post = ref
              .watch(socialFeedProvider)
              .posts
              .firstWhere((item) => item.id == initialPost.id);
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.viewInsetsOf(context).bottom,
            ),
            child: SizedBox(
              height: MediaQuery.sizeOf(context).height * .72,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 12),
                    child: Row(
                      children: [
                        Text(
                          '${post.comments.length} comments',
                          style: Theme.of(context).textTheme.titleLarge,
                        ),
                        const Spacer(),
                        IconButton(
                          onPressed: () => Navigator.pop(sheetContext),
                          icon: const Icon(Icons.close),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(
                    child: post.comments.isEmpty
                        ? const Center(
                            child: Text(
                              'Start a helpful conversation.',
                              style: TextStyle(color: AppColors.inkSoft),
                            ),
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: post.comments.length,
                            separatorBuilder: (_, _) =>
                                const SizedBox(height: 16),
                            itemBuilder: (context, index) =>
                                _CommentTile(post.comments[index]),
                          ),
                  ),
                  SafeArea(
                    top: false,
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 10, 10, 12),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundImage: NetworkImage(_me.avatarUrl),
                          ),
                          const SizedBox(width: 9),
                          Expanded(
                            child: TextField(
                              controller: input,
                              textInputAction: TextInputAction.send,
                              onSubmitted: (value) {
                                ref
                                    .read(socialFeedProvider.notifier)
                                    .addComment(
                                      postId: post.id,
                                      text: value,
                                      author: _me,
                                    );
                                input.clear();
                              },
                              decoration: const InputDecoration(
                                hintText: 'Write a comment...',
                                contentPadding: EdgeInsets.symmetric(
                                  horizontal: 14,
                                  vertical: 10,
                                ),
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              ref
                                  .read(socialFeedProvider.notifier)
                                  .addComment(
                                    postId: post.id,
                                    text: input.text,
                                    author: _me,
                                  );
                              input.clear();
                            },
                            icon: const Icon(
                              Icons.send,
                              color: AppColors.brand,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
    input.dispose();
  }
}

class _ComposerPrompt extends StatelessWidget {
  const _ComposerPrompt({required this.author, required this.onTap});

  final SocialAuthor author;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      CircleAvatar(radius: 22, backgroundImage: NetworkImage(author.avatarUrl)),
      const SizedBox(width: 10),
      Expanded(
        child: OutlinedButton(
          onPressed: onTap,
          style: OutlinedButton.styleFrom(
            alignment: Alignment.centerLeft,
            foregroundColor: AppColors.inkSoft,
            minimumSize: const Size.fromHeight(46),
            side: const BorderSide(color: AppColors.border),
            shape: const StadiumBorder(),
          ),
          child: const Text('Share a trip, photo or local tip...'),
        ),
      ),
      const SizedBox(width: 4),
      IconButton(
        onPressed: onTap,
        tooltip: 'Add photo',
        icon: const Icon(Icons.add_photo_alternate_outlined),
      ),
    ],
  );
}

class _PersonCard extends StatelessWidget {
  const _PersonCard({
    required this.person,
    required this.following,
    required this.onFollow,
  });

  final SocialAuthor person;
  final bool following;
  final VoidCallback onFollow;

  @override
  Widget build(BuildContext context) {
    final friends = following && person.followsYou;
    return Container(
      width: 126,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F7F8),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 22,
            backgroundImage: NetworkImage(person.avatarUrl),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  person.name.split(' ').first,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  person.home,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.inkSoft,
                  ),
                ),
                const Spacer(),
                SizedBox(
                  height: 30,
                  child: FilledButton(
                    onPressed: onFollow,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 9),
                      backgroundColor: following
                          ? AppColors.secondary
                          : AppColors.ink,
                      foregroundColor: following ? AppColors.ink : Colors.white,
                      textStyle: const TextStyle(fontSize: 11),
                    ),
                    child: Text(
                      friends
                          ? 'Friends'
                          : following
                          ? 'Following'
                          : 'Follow',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PostCard extends StatelessWidget {
  const _PostCard({
    required this.post,
    required this.following,
    required this.onLike,
    required this.onFollow,
    required this.onComment,
    required this.onMessage,
  });

  final SocialPost post;
  final bool following;
  final VoidCallback onLike;
  final VoidCallback onFollow;
  final VoidCallback onComment;
  final VoidCallback onMessage;

  @override
  Widget build(BuildContext context) {
    final friends = following && post.author.followsYou;
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 23,
                backgroundImage: NetworkImage(post.author.avatarUrl),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            post.author.name,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ),
                        if (friends) ...[
                          const SizedBox(width: 5),
                          const Icon(
                            Icons.people_alt_outlined,
                            size: 15,
                            color: AppColors.brand,
                          ),
                        ],
                      ],
                    ),
                    Text(
                      '${post.location} · ${post.timeLabel}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.inkSoft,
                      ),
                    ),
                  ],
                ),
              ),
              TextButton(
                onPressed: onFollow,
                child: Text(
                  friends
                      ? 'Friends'
                      : following
                      ? 'Following'
                      : 'Follow',
                ),
              ),
            ],
          ),
          if (post.text.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(post.text, style: const TextStyle(fontSize: 15, height: 1.45)),
          ],
          if (post.imageUrl != null) ...[
            const SizedBox(height: 12),
            AspectRatio(
              aspectRatio: 4 / 3,
              child: NetworkImageView(
                url: post.imageUrl!,
                borderRadius: BorderRadius.circular(18),
              ),
            ),
          ],
          const SizedBox(height: 8),
          Row(
            children: [
              _Action(
                icon: post.liked ? Icons.favorite : Icons.favorite_border,
                label: '${post.likeCount}',
                color: post.liked ? AppColors.brand : AppColors.inkSoft,
                onTap: onLike,
              ),
              _Action(
                icon: Icons.chat_bubble_outline,
                label: '${post.comments.length}',
                onTap: onComment,
              ),
              _Action(
                icon: Icons.send_outlined,
                label: 'Message',
                onTap: onMessage,
              ),
              const Spacer(),
              IconButton(
                onPressed: () {},
                tooltip: 'Save post',
                icon: const Icon(
                  Icons.bookmark_border,
                  color: AppColors.inkSoft,
                ),
              ),
            ],
          ),
          if (post.comments.isNotEmpty) ...[
            const Divider(height: 18),
            _CommentTile(post.comments.last, compact: true),
            if (post.comments.length > 1)
              TextButton(
                onPressed: onComment,
                child: Text('View all ${post.comments.length} comments'),
              ),
          ],
        ],
      ),
    );
  }
}

class _Action extends StatelessWidget {
  const _Action({
    required this.icon,
    required this.label,
    required this.onTap,
    this.color = AppColors.inkSoft,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color color;

  @override
  Widget build(BuildContext context) => TextButton.icon(
    onPressed: onTap,
    style: TextButton.styleFrom(
      foregroundColor: color,
      padding: const EdgeInsets.symmetric(horizontal: 9),
    ),
    icon: Icon(icon, size: 20),
    label: Text(label),
  );
}

class _CommentTile extends StatelessWidget {
  const _CommentTile(this.comment, {this.compact = false});

  final SocialComment comment;
  final bool compact;

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      CircleAvatar(
        radius: compact ? 15 : 18,
        backgroundImage: NetworkImage(comment.author.avatarUrl),
      ),
      const SizedBox(width: 9),
      Expanded(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
          decoration: BoxDecoration(
            color: const Color(0xFFF4F4F5),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      comment.author.name,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Text(
                    comment.timeLabel,
                    style: const TextStyle(
                      color: AppColors.inkSoft,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 2),
              Text(comment.text, style: const TextStyle(fontSize: 13)),
            ],
          ),
        ),
      ),
    ],
  );
}
