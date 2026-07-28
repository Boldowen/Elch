import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/data/mock_data.dart' as mock;
import '../models/trip.dart';
import '../providers/app_providers.dart';

class InboxScreen extends ConsumerStatefulWidget {
  const InboxScreen({super.key});

  @override
  ConsumerState<InboxScreen> createState() => _InboxScreenState();
}

class _InboxScreenState extends ConsumerState<InboxScreen> {
  List<Conversation> items = [...mock.conversations];
  bool refreshing = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _refresh());
  }

  Future<void> _refresh() async {
    final userId = ref.read(authControllerProvider).session?.user.id;
    if (userId == null) return;
    setState(() => refreshing = true);
    try {
      final remote = await ref
          .read(conversationsRepositoryProvider)
          .list(userId);
      if (mounted && remote.isNotEmpty) setState(() => items = remote);
    } catch (_) {
      // Keep the demo inbox available when the API is offline.
    } finally {
      if (mounted) setState(() => refreshing = false);
    }
  }

  @override
  Widget build(BuildContext context) => RefreshIndicator(
    onRefresh: _refresh,
    child: CustomScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      slivers: [
        SliverAppBar(
          pinned: true,
          expandedHeight: 64,
          toolbarHeight: 0,
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          flexibleSpace: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  Text(
                    'Inbox',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  if (refreshing) ...[
                    const SizedBox(width: 12),
                    const SizedBox.square(
                      dimension: 15,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.only(top: 6, bottom: 110),
          sliver: SliverList.separated(
            itemCount: items.length,
            separatorBuilder: (_, _) => const Divider(height: 1, indent: 84),
            itemBuilder: (context, index) {
              final conversation = items[index];
              return InkWell(
                onTap: () => context.push(
                  Uri(
                    path: '/chat/${conversation.id}',
                    queryParameters: {
                      'name': conversation.guide,
                      'avatar': conversation.photo,
                    },
                  ).toString(),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundImage: NetworkImage(conversation.photo),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    conversation.guide,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                Text(
                                  conversation.time,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.inkSoft,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    conversation.last,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: conversation.unread > 0
                                          ? AppColors.ink
                                          : AppColors.inkSoft,
                                    ),
                                  ),
                                ),
                                if (conversation.unread > 0)
                                  CircleAvatar(
                                    radius: 10,
                                    backgroundColor: AppColors.brand,
                                    child: Text(
                                      '${conversation.unread}',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 11,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    ),
  );
}
