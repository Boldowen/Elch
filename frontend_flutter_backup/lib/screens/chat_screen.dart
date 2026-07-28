import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../core/data/mock_data.dart';
import '../models/trip.dart';
import '../providers/app_providers.dart';
import '../widgets/network_image_view.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({
    super.key,
    required this.id,
    this.peerName,
    this.peerAvatar,
  });
  final String id;
  final String? peerName, peerAvatar;
  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final input = TextEditingController();
  final scroll = ScrollController();
  late List<ChatMessage> messages;
  bool typing = false, emoji = false, images = false, loadingRemote = false;
  Timer? readTimer, replyTimer;
  @override
  void initState() {
    super.initState();
    messages = _isRemote ? [] : [...initialChatMessages];
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _bottom();
      _loadRemote();
    });
  }

  bool get _isRemote => RegExp(
    r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-'
    r'[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
  ).hasMatch(widget.id);

  Future<void> _loadRemote() async {
    final userId = ref.read(authControllerProvider).session?.user.id;
    if (!_isRemote || userId == null) return;
    setState(() => loadingRemote = true);
    try {
      final remote = await ref
          .read(conversationsRepositoryProvider)
          .messages(conversationId: widget.id, currentUserId: userId);
      if (!mounted) return;
      setState(() => messages = remote);
      WidgetsBinding.instance.addPostFrameCallback((_) => _bottom());
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not load this conversation.')),
      );
    } finally {
      if (mounted) setState(() => loadingRemote = false);
    }
  }

  @override
  void dispose() {
    input.dispose();
    scroll.dispose();
    readTimer?.cancel();
    replyTimer?.cancel();
    super.dispose();
  }

  void _bottom() => scroll.hasClients
      ? scroll.animateTo(
          scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 260),
          curve: Curves.easeOut,
        )
      : null;
  void _send({String? image}) {
    final text = input.text.trim();
    if (text.isEmpty && image == null) return;
    setState(() {
      messages.add(
        ChatMessage(
          id: DateTime.now().microsecondsSinceEpoch.toString(),
          me: true,
          time: TimeOfDay.now().format(context),
          text: image == null ? text : null,
          image: image,
          read: false,
        ),
      );
      input.clear();
      emoji = false;
      images = false;
    });
    if (_isRemote) {
      unawaited(
        ref
            .read(conversationsRepositoryProvider)
            .send(conversationId: widget.id, text: text, imageUrl: image)
            .catchError((Object _) {
              if (!mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Message was not sent. Tap send to retry.'),
                ),
              );
            }),
      );
    }
    WidgetsBinding.instance.addPostFrameCallback((_) => _bottom());
    readTimer = Timer(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      setState(() {
        messages = messages
            .map((m) => m.me ? m.copyWith(read: true) : m)
            .toList();
        typing = !_isRemote;
      });
      _bottom();
    });
    if (_isRemote) return;
    replyTimer = Timer(const Duration(milliseconds: 2400), () {
      if (!mounted) return;
      setState(() {
        typing = false;
        messages.add(
          ChatMessage(
            id: 'r${DateTime.now().microsecondsSinceEpoch}',
            me: false,
            text: "Sounds great! I'll get everything ready for you. 🎉",
            time: TimeOfDay.now().format(context),
          ),
        );
      });
      _bottom();
    });
  }

  @override
  Widget build(BuildContext context) {
    final matches = conversations.where((c) => c.id == widget.id);
    final c = matches.isEmpty ? conversations.first : matches.first;
    final peerName = widget.peerName ?? c.guide;
    final peerPhoto = widget.peerAvatar ?? c.photo;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(4, 7, 12, 8),
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.maybePop(context),
                    icon: const Icon(Icons.chevron_left),
                  ),
                  CircleAvatar(
                    radius: 19,
                    backgroundImage: NetworkImage(peerPhoto),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        peerName,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      Text(
                        typing ? 'typing…' : 'Active now',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.success,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: Container(
                color: AppColors.secondary.withValues(alpha: .45),
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  controller: scroll,
                  children: [
                    if (loadingRemote)
                      const LinearProgressIndicator(minHeight: 2),
                    if (matches.isNotEmpty) ...[
                      _BookingCard(),
                      const SizedBox(height: 14),
                    ],
                    ...messages.map((m) => _bubble(m)),
                    if (typing)
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: _Typing(),
                      ),
                  ],
                ),
              ),
            ),
            if (emoji)
              _Emoji(
                onTap: (e) {
                  input.text += e;
                  input.selection = TextSelection.collapsed(
                    offset: input.text.length,
                  );
                  setState(() {});
                },
              ),
            if (images) _Images(onTap: (s) => _send(image: s)),
            Container(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 14),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: Row(
                children: [
                  _Round(
                    icon: Icons.image_outlined,
                    active: images,
                    onTap: () => setState(() {
                      images = !images;
                      emoji = false;
                    }),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 13),
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: BorderRadius.circular(99),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: input,
                              onSubmitted: (_) => _send(),
                              decoration: const InputDecoration(
                                hintText: 'Message...',
                                border: InputBorder.none,
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                filled: false,
                                contentPadding: EdgeInsets.symmetric(
                                  vertical: 11,
                                ),
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () => setState(() {
                              emoji = !emoji;
                              images = false;
                            }),
                            icon: const Icon(
                              Icons.sentiment_satisfied_alt_outlined,
                              size: 20,
                              color: AppColors.inkSoft,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  _Round(icon: Icons.send, active: true, onTap: () => _send()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _bubble(ChatMessage m) => Align(
    alignment: m.me ? Alignment.centerRight : Alignment.centerLeft,
    child: Container(
      constraints: const BoxConstraints(maxWidth: 285),
      margin: const EdgeInsets.only(bottom: 10),
      padding: m.image != null
          ? const EdgeInsets.all(4)
          : const EdgeInsets.fromLTRB(14, 10, 11, 7),
      decoration: BoxDecoration(
        color: m.me ? AppColors.brand : Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: m.me
            ? null
            : const [BoxShadow(color: Color(0x08000000), blurRadius: 6)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (m.image != null)
            SizedBox(
              width: 220,
              height: 160,
              child: NetworkImageView(
                url: m.image!,
                borderRadius: BorderRadius.circular(14),
              ),
            )
          else
            Text(
              m.text ?? '',
              style: TextStyle(
                color: m.me ? Colors.white : AppColors.ink,
                fontSize: 14,
                height: 1.35,
              ),
            ),
          const SizedBox(height: 3),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                m.time,
                style: TextStyle(
                  fontSize: 10,
                  color: m.me ? Colors.white70 : AppColors.inkSoft,
                ),
              ),
              if (m.me) ...[
                const SizedBox(width: 3),
                Icon(
                  m.read ? Icons.done_all : Icons.done,
                  size: 13,
                  color: Colors.white70,
                ),
              ],
            ],
          ),
        ],
      ),
    ),
  );
}

class _BookingCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Center(
    child: Container(
      width: 310,
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        children: [
          SizedBox(
            width: 58,
            height: 58,
            child: NetworkImageView(
              url: AppImages.gerYellow,
              borderRadius: BorderRadius.all(Radius.circular(12)),
            ),
          ),
          SizedBox(width: 11),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Terelj horse riding',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                ),
                Row(
                  children: [
                    Icon(
                      Icons.calendar_month_outlined,
                      size: 13,
                      color: AppColors.inkSoft,
                    ),
                    SizedBox(width: 4),
                    Text(
                      'Aug 12 – 17',
                      style: TextStyle(fontSize: 12, color: AppColors.inkSoft),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Text(
                  'Booking confirmed',
                  style: TextStyle(fontSize: 11, color: AppColors.success),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

class _Typing extends StatelessWidget {
  const _Typing();
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 10),
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
    ),
    child: const Text(
      '•••',
      style: TextStyle(color: AppColors.inkSoft, letterSpacing: 3),
    ),
  );
}

class _Round extends StatelessWidget {
  const _Round({required this.icon, required this.active, required this.onTap});
  final IconData icon;
  final bool active;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Material(
    color: active ? AppColors.brand : AppColors.secondary,
    shape: const CircleBorder(),
    child: InkWell(
      onTap: onTap,
      customBorder: const CircleBorder(),
      child: SizedBox.square(
        dimension: 40,
        child: Icon(
          icon,
          size: 18,
          color: active ? Colors.white : AppColors.ink,
        ),
      ),
    ),
  );
}

class _Emoji extends StatelessWidget {
  const _Emoji({required this.onTap});
  final ValueChanged<String> onTap;
  @override
  Widget build(BuildContext context) {
    const values = [
      '😀',
      '😍',
      '👍',
      '🙏',
      '🎉',
      '🐎',
      '🏔️',
      '🔥',
      '😂',
      '❤️',
      '🌄',
      '🐫',
      '🍲',
      '👌',
      '✨',
      '😅',
    ];
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: const BoxDecoration(
        border: Border(top: BorderSide(color: AppColors.border)),
      ),
      child: Wrap(
        alignment: WrapAlignment.spaceAround,
        children: values
            .map(
              (e) => InkWell(
                onTap: () => onTap(e),
                child: Padding(
                  padding: const EdgeInsets.all(7),
                  child: Text(e, style: const TextStyle(fontSize: 22)),
                ),
              ),
            )
            .toList(),
      ),
    );
  }
}

class _Images extends StatelessWidget {
  const _Images({required this.onTap});
  final ValueChanged<String> onTap;
  @override
  Widget build(BuildContext context) {
    const values = [
      AppImages.gerYellow,
      AppImages.lakeReflect,
      AppImages.camelDesert,
      AppImages.horses,
    ];
    return SizedBox(
      height: 102,
      child: ListView.separated(
        padding: const EdgeInsets.all(10),
        scrollDirection: Axis.horizontal,
        itemCount: values.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (_, i) => InkWell(
          onTap: () => onTap(values[i]),
          child: SizedBox.square(
            dimension: 80,
            child: NetworkImageView(
              url: values[i],
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
    );
  }
}
