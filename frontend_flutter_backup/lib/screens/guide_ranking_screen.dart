import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../core/data/mock_data.dart';
import '../providers/app_providers.dart';
import '../repositories/guides_repository.dart';
import '../widgets/app_back_header.dart';

class GuideRankingScreen extends ConsumerStatefulWidget {
  const GuideRankingScreen({super.key});

  @override
  ConsumerState<GuideRankingScreen> createState() => _GuideRankingScreenState();
}

class _GuideRankingScreenState extends ConsumerState<GuideRankingScreen> {
  late List<GuideRankingEntry> ranked;

  @override
  void initState() {
    super.initState();
    final sorted = [...guides]..sort((a, b) => b.rating.compareTo(a.rating));
    ranked = [
      for (final entry in sorted.indexed)
        GuideRankingEntry(
          userId: entry.$2.id,
          name: entry.$2.name,
          photo: entry.$2.photo,
          location: entry.$2.location,
          rating: entry.$2.rating,
          reviewCount: entry.$2.reviews,
          rankPoints: 3200 - entry.$1 * 180,
          completedTrips: entry.$2.reviews ~/ 4,
        ),
    ];
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    try {
      final remote = await ref.read(guidesRepositoryProvider).ranking();
      if (mounted && remote.isNotEmpty) setState(() => ranked = remote);
    } catch (_) {
      // Keep the local leaderboard available while offline.
    }
  }

  @override
  Widget build(BuildContext context) {
    final userId = ref.watch(authControllerProvider).session?.user.id;
    final ownIndex = ranked.indexWhere((entry) => entry.userId == userId);
    final own = ownIndex < 0 ? null : ranked[ownIndex];
    final points = own?.rankPoints ?? 2720;
    final level = points >= 3500
        ? 'Platinum'
        : points >= 2000
        ? 'Gold'
        : points >= 1000
        ? 'Silver'
        : 'Bronze';
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AppBackHeader(title: 'Guide ranking', actions: false),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 28),
                children: [
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppColors.ink,
                      borderRadius: BorderRadius.circular(22),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Your standing',
                          style: TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              ownIndex < 0
                                  ? 'Build your first rank'
                                  : '#${ownIndex + 1} in Mongolia',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const Spacer(),
                            const Icon(
                              Icons.workspace_premium,
                              color: Color(0xFFFFC65C),
                              size: 34,
                            ),
                          ],
                        ),
                        const SizedBox(height: 15),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: (points % 1000) / 1000,
                            minHeight: 8,
                            color: const Color(0xFFFFC65C),
                            backgroundColor: Colors.white12,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '$points points · $level level',
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Text(
                      'Ranking rewards verified profiles, quick responses, '
                      'completed trips, strong reviews and safe guiding. '
                      'Cancellations and unresolved reports reduce points.',
                      style: TextStyle(color: AppColors.inkSoft, height: 1.4),
                    ),
                  ),
                  const SizedBox(height: 26),
                  const Text(
                    'Top local guides',
                    style: TextStyle(fontSize: 19, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 10),
                  for (final entry in ranked.indexed)
                    Container(
                      margin: const EdgeInsets.only(bottom: 9),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: entry.$2.userId == userId
                            ? AppColors.successSoft
                            : Colors.white,
                        border: Border.all(color: AppColors.border),
                        borderRadius: BorderRadius.circular(17),
                      ),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 30,
                            child: Text(
                              '#${entry.$1 + 1}',
                              style: TextStyle(
                                color: entry.$1 < 3
                                    ? AppColors.warning
                                    : AppColors.inkSoft,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          CircleAvatar(
                            radius: 23,
                            backgroundImage: NetworkImage(
                              entry.$2.photo.isEmpty
                                  ? AppImages.guide3
                                  : entry.$2.photo,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  entry.$2.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  '${entry.$2.location} · '
                                  '${entry.$2.completedTrips} trips · '
                                  '${entry.$2.rankPoints} pts',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: AppColors.inkSoft,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.star,
                            color: AppColors.warning,
                            size: 16,
                          ),
                          Text(
                            entry.$2.rating.toStringAsFixed(2),
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
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
