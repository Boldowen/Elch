import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/data/mock_data.dart';
import '../widgets/app_back_header.dart';
import '../widgets/chip_row.dart';
import '../widgets/network_image_view.dart';

class GuideDetailScreen extends StatelessWidget {
  const GuideDetailScreen({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context) {
    final matches = guides.where((x) => x.id == id);
    final g = matches.isEmpty ? guides.first : matches.first;
    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 286,
                automaticallyImplyLeading: false,
                backgroundColor: Colors.white,
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      NetworkImageView(url: g.photo),
                      const DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Colors.transparent, Color(0xAA000000)],
                          ),
                        ),
                      ),
                      const Positioned(
                        top: 36,
                        left: 0,
                        right: 0,
                        child: AppBackHeader(transparent: true),
                      ),
                      Positioned(
                        left: 20,
                        bottom: 17,
                        right: 20,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Flexible(
                                  child: Text(
                                    g.name,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 24,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 5),
                                const Icon(
                                  Icons.verified,
                                  color: AppColors.brand,
                                  size: 21,
                                ),
                              ],
                            ),
                            Text(
                              g.location,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: .86),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 110),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.border),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: _Stat(
                              '★ ${g.rating}',
                              '${g.reviews} reviews',
                            ),
                          ),
                          const SizedBox(height: 38, child: VerticalDivider()),
                          Expanded(
                            child: _Stat('${g.experience} yrs', 'experience'),
                          ),
                          const SizedBox(height: 38, child: VerticalDivider()),
                          Expanded(
                            child: _Stat(
                              '\$${g.price.toStringAsFixed(0)}',
                              'per day',
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 7,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.successSoft,
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.verified_user_outlined,
                              color: AppColors.success,
                              size: 16,
                            ),
                            SizedBox(width: 5),
                            Text(
                              'Verified · Background checked',
                              style: TextStyle(
                                color: Color(0xFF047857),
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'About',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 7),
                    Text(
                      g.bio,
                      style: const TextStyle(
                        fontSize: 15,
                        height: 1.55,
                        color: Color(0xCC222222),
                      ),
                    ),
                    const SizedBox(height: 22),
                    const Row(
                      children: [
                        Icon(
                          Icons.language,
                          size: 16,
                          color: AppColors.inkSoft,
                        ),
                        SizedBox(width: 6),
                        Text(
                          'Languages',
                          style: TextStyle(
                            color: AppColors.inkSoft,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 7,
                      runSpacing: 7,
                      children: g.languages.map((x) => AppTag(x)).toList(),
                    ),
                    const SizedBox(height: 20),
                    const Row(
                      children: [
                        Icon(
                          Icons.workspace_premium_outlined,
                          size: 16,
                          color: AppColors.inkSoft,
                        ),
                        SizedBox(width: 6),
                        Text(
                          'Specialties',
                          style: TextStyle(
                            color: AppColors.inkSoft,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 7,
                      runSpacing: 7,
                      children: g.specialties.map((x) => AppTag(x)).toList(),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Tour packages',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ...g.packages.map(
                      (p) => Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppColors.border),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    p.title,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  Text(
                                    '${p.days} days',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: AppColors.inkSoft,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Text(
                              '\$${p.price.toStringAsFixed(0)}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Row(
                      children: [
                        Icon(Icons.calendar_month_outlined, size: 17),
                        SizedBox(width: 6),
                        Text(
                          'Availability this week',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(7, (i) {
                        final open = i != 2 && i != 5;
                        return Column(
                          children: [
                            Text(
                              ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.inkSoft,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Container(
                              width: 36,
                              height: 36,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: open
                                    ? AppColors.successSoft
                                    : AppColors.secondary,
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                '${i + 2}',
                                style: TextStyle(
                                  color: open
                                      ? const Color(0xFF047857)
                                      : AppColors.inkSoft,
                                  decoration: open
                                      ? null
                                      : TextDecoration.lineThrough,
                                ),
                              ),
                            ),
                          ],
                        );
                      }),
                    ),
                    const SizedBox(height: 26),
                    const Text(
                      'Reviews',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 10),
                    ...const [
                      (
                        'Emma L.',
                        'Incredible knowledge of the region and so warm. Made our trip unforgettable.',
                      ),
                      (
                        'Kenji T.',
                        'Flexible, safe and full of stories. Highly recommend for first-timers.',
                      ),
                    ].map(
                      (r) => Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: const BoxDecoration(
                          border: Border.fromBorderSide(
                            BorderSide(color: AppColors.border),
                          ),
                          borderRadius: BorderRadius.all(Radius.circular(16)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  r.$1,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const Spacer(),
                                const Text(
                                  '★★★★★',
                                  style: TextStyle(fontSize: 11),
                                ),
                              ],
                            ),
                            const SizedBox(height: 5),
                            Text(
                              r.$2,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xCC222222),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ]),
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: SafeArea(
              top: false,
              child: Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(top: BorderSide(color: AppColors.border)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => context.push('/chat/c1'),
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(0, 50),
                          foregroundColor: AppColors.ink,
                          side: const BorderSide(color: AppColors.border),
                          shape: const StadiumBorder(),
                        ),
                        child: const Text(
                          'Message',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: FilledButton(
                        onPressed: () => _book(context),
                        style: FilledButton.styleFrom(
                          minimumSize: const Size(0, 50),
                          backgroundColor: AppColors.brand,
                          shape: const StadiumBorder(),
                        ),
                        child: const Text(
                          'Book guide',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _book(BuildContext context) => showDialog(
    context: context,
    builder: (_) => AlertDialog(
      title: const Text('Book this guide'),
      content: const Text(
        'Select dates and package in the booking flow. Your guide will confirm through Inbox.',
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Continue'),
        ),
      ],
    ),
  );
}

class _Stat extends StatelessWidget {
  const _Stat(this.value, this.label);
  final String value, label;
  @override
  Widget build(BuildContext context) => Column(
    children: [
      Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
      Text(
        label,
        style: const TextStyle(fontSize: 12, color: AppColors.inkSoft),
      ),
    ],
  );
}
