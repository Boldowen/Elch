import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../core/data/mock_data.dart';
import '../providers/app_providers.dart';

class GuideDashboardScreen extends ConsumerStatefulWidget {
  const GuideDashboardScreen({super.key});

  @override
  ConsumerState<GuideDashboardScreen> createState() =>
      _GuideDashboardScreenState();
}

class _GuideDashboardScreenState extends ConsumerState<GuideDashboardScreen> {
  bool available = true;
  final days = <String>{'Mon', 'Wed', 'Fri', 'Sat'};
  final requests =
      <
        ({
          String name,
          String tour,
          String date,
          int guests,
          int amount,
          String photo,
        })
      >[
        (
          name: 'Emma Lewis',
          tour: 'Terelj sunset horse ride',
          date: 'Aug 12',
          guests: 2,
          amount: 260,
          photo: AppImages.guide2,
        ),
        (
          name: 'Kenji Tanaka',
          tour: 'Steppe & eagles',
          date: 'Sep 4',
          guests: 3,
          amount: 700,
          photo: AppImages.guide5,
        ),
      ];

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authControllerProvider).session?.user;
    final firstName = (user?.name ?? 'Bat-Erdene').split(' ').first;
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              pinned: true,
              backgroundColor: Colors.white,
              surfaceTintColor: Colors.white,
              title: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundImage: NetworkImage(
                      user?.avatarUrl ?? AppImages.guide3,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Guide workspace',
                          style: TextStyle(
                            color: AppColors.inkSoft,
                            fontSize: 12,
                          ),
                        ),
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                firstName,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  color: AppColors.ink,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            const SizedBox(width: 4),
                            const Icon(
                              Icons.verified,
                              color: AppColors.brand,
                              size: 16,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              actions: [
                TextButton(
                  onPressed: () => context.go('/explore'),
                  child: const Text('Traveler mode'),
                ),
                const SizedBox(width: 8),
              ],
            ),
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 36),
              sliver: SliverList.list(
                children: [
                  _Availability(
                    available: available,
                    onChanged: (value) => setState(() => available = value),
                  ),
                  const SizedBox(height: 14),
                  const Row(
                    children: [
                      Expanded(
                        child: _Stat(value: '4.96', label: 'Rating'),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: _Stat(value: '#12', label: 'Rank'),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: _Stat(value: '47', label: 'Trips'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _RankCard(onTap: () => context.push('/guide-ranking')),
                  const SizedBox(height: 26),
                  const _SectionTitle('Booking requests'),
                  const SizedBox(height: 10),
                  if (requests.isEmpty)
                    const _EmptyRequests()
                  else
                    for (final entry in requests.indexed)
                      _RequestCard(
                        request: entry.$2,
                        onResolve: () =>
                            setState(() => requests.removeAt(entry.$1)),
                      ),
                  const SizedBox(height: 20),
                  _SectionTitle(
                    'Guide inbox',
                    action: TextButton(
                      onPressed: () => context.push('/inbox'),
                      child: const Text('See all'),
                    ),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Column(
                      children: [
                        for (final entry in conversations.take(2).indexed) ...[
                          ListTile(
                            onTap: () => context.push('/chat/${entry.$2.id}'),
                            leading: CircleAvatar(
                              backgroundImage: NetworkImage(entry.$2.photo),
                            ),
                            title: Text(entry.$2.guide),
                            subtitle: Text(
                              entry.$2.last,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            trailing: entry.$2.unread > 0
                                ? CircleAvatar(
                                    radius: 10,
                                    backgroundColor: AppColors.brand,
                                    child: Text(
                                      '${entry.$2.unread}',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                      ),
                                    ),
                                  )
                                : Text(
                                    entry.$2.time,
                                    style: const TextStyle(
                                      color: AppColors.inkSoft,
                                      fontSize: 11,
                                    ),
                                  ),
                          ),
                          if (entry.$1 == 0)
                            const Divider(height: 1, indent: 72),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 26),
                  const _SectionTitle('Availability'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (final day in const [
                        'Mon',
                        'Tue',
                        'Wed',
                        'Thu',
                        'Fri',
                        'Sat',
                        'Sun',
                      ])
                        FilterChip(
                          label: Text(day),
                          selected: days.contains(day),
                          showCheckmark: false,
                          selectedColor: AppColors.brand,
                          labelStyle: TextStyle(
                            color: days.contains(day)
                                ? Colors.white
                                : AppColors.ink,
                          ),
                          onSelected: (selected) => setState(
                            () => selected ? days.add(day) : days.remove(day),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 26),
                  const _SectionTitle('Profile & performance'),
                  const SizedBox(height: 10),
                  _ActionTile(
                    icon: Icons.edit_outlined,
                    title: 'Edit guide profile',
                    subtitle: 'Photo, bio, expertise and pricing',
                    onTap: () => context.push('/guide-profile-edit'),
                  ),
                  const SizedBox(height: 10),
                  _ActionTile(
                    icon: Icons.leaderboard_outlined,
                    title: 'Ranking & achievements',
                    subtitle: 'See points, levels and leaderboard',
                    onTap: () => context.push('/guide-ranking'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Availability extends StatelessWidget {
  const _Availability({required this.available, required this.onChanged});
  final bool available;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppColors.ink,
      borderRadius: BorderRadius.circular(20),
    ),
    child: Row(
      children: [
        Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: .1),
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(Icons.travel_explore, color: Colors.white),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                available ? 'Available for requests' : 'Currently offline',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                available
                    ? 'Travelers can contact you today'
                    : 'Your profile stays visible',
                style: TextStyle(
                  color: Colors.white.withValues(alpha: .65),
                  fontSize: 13,
                ),
              ),
            ],
          ),
        ),
        Switch(
          value: available,
          onChanged: onChanged,
          activeThumbColor: AppColors.brand,
        ),
      ],
    ),
  );
}

class _Stat extends StatelessWidget {
  const _Stat({required this.value, required this.label});
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(13),
    decoration: BoxDecoration(
      border: Border.all(color: AppColors.border),
      borderRadius: BorderRadius.circular(16),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
        ),
        Text(
          label,
          style: const TextStyle(color: AppColors.inkSoft, fontSize: 12),
        ),
      ],
    ),
  );
}

class _RankCard extends StatelessWidget {
  const _RankCard({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
    color: AppColors.warningSoft,
    borderRadius: BorderRadius.circular(18),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.workspace_premium, color: AppColors.warning),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Gold local guide',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
                Icon(Icons.chevron_right),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: const LinearProgressIndicator(
                value: .72,
                minHeight: 7,
                color: AppColors.warning,
                backgroundColor: Color(0xFFFFE8BA),
              ),
            ),
            const SizedBox(height: 7),
            const Text(
              '280 more points to reach Platinum',
              style: TextStyle(color: AppColors.inkSoft, fontSize: 12),
            ),
          ],
        ),
      ),
    ),
  );
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.title, {this.action});
  final String title;
  final Widget? action;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(
        child: Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
      ?action,
    ],
  );
}

class _RequestCard extends StatelessWidget {
  const _RequestCard({required this.request, required this.onResolve});
  final ({
    String name,
    String tour,
    String date,
    int guests,
    int amount,
    String photo,
  })
  request;
  final VoidCallback onResolve;

  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 10),
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      border: Border.all(color: AppColors.border),
      borderRadius: BorderRadius.circular(18),
    ),
    child: Column(
      children: [
        Row(
          children: [
            CircleAvatar(backgroundImage: NetworkImage(request.photo)),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    request.name,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  Text(
                    request.tour,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.inkSoft,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '\$${request.amount}',
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: Text(
                '${request.date} · ${request.guests} guests',
                style: const TextStyle(color: AppColors.inkSoft, fontSize: 12),
              ),
            ),
            TextButton(onPressed: onResolve, child: const Text('Decline')),
            const SizedBox(width: 4),
            FilledButton(
              onPressed: onResolve,
              style: FilledButton.styleFrom(backgroundColor: AppColors.brand),
              child: const Text('Accept'),
            ),
          ],
        ),
      ],
    ),
  );
}

class _EmptyRequests extends StatelessWidget {
  const _EmptyRequests();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(24),
    decoration: BoxDecoration(
      border: Border.all(color: AppColors.border),
      borderRadius: BorderRadius.circular(18),
    ),
    child: const Center(
      child: Text(
        'No pending requests',
        style: TextStyle(color: AppColors.inkSoft),
      ),
    ),
  );
}

class _ActionTile extends StatelessWidget {
  const _ActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => ListTile(
    onTap: onTap,
    shape: RoundedRectangleBorder(
      side: const BorderSide(color: AppColors.border),
      borderRadius: BorderRadius.circular(16),
    ),
    leading: CircleAvatar(
      backgroundColor: AppColors.secondary,
      child: Icon(icon, color: AppColors.ink, size: 19),
    ),
    title: Text(title),
    subtitle: Text(subtitle),
    trailing: const Icon(Icons.chevron_right),
  );
}
