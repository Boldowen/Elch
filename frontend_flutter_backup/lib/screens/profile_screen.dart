import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../providers/app_providers.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).session?.user;
    final rows = <(IconData, String, String)>[
      (Icons.settings_outlined, 'Account settings', '/account-settings'),
      (Icons.luggage_outlined, 'Saved trips', '/saved-trips'),
      (Icons.credit_card_outlined, 'Payment methods', '/payment-methods'),
      (Icons.help_outline, 'Help center', '/help-center'),
    ];
    return CustomScrollView(
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
              child: Text(
                'Profile',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
          sliver: SliverList.list(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 34,
                      backgroundImage: NetworkImage(
                        user?.avatarUrl ?? AppImages.guide5,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.name ?? 'VenTour Traveler',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          Text(
                            user?.email ?? 'traveler@ventour.mn',
                            style: const TextStyle(
                              color: AppColors.inkSoft,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 5),
                          const Row(
                            children: [
                              Icon(
                                Icons.verified,
                                color: AppColors.brand,
                                size: 16,
                              ),
                              SizedBox(width: 4),
                              Text(
                                'Identity verified',
                                style: TextStyle(
                                  color: AppColors.inkSoft,
                                  fontSize: 12,
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
              const SizedBox(height: 14),
              if (user?.isGuide == true) ...[
                Material(
                  color: AppColors.ink,
                  borderRadius: BorderRadius.circular(18),
                  child: InkWell(
                    onTap: () => context.push('/guide-dashboard'),
                    borderRadius: BorderRadius.circular(18),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          const CircleAvatar(
                            backgroundColor: AppColors.brand,
                            child: Icon(
                              Icons.map_outlined,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Open guide workspace',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                Text(
                                  'Requests, inbox, profile and ranking',
                                  style: TextStyle(
                                    color: Colors.white60,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            Icons.chevron_right,
                            color: Colors.white.withValues(alpha: .7),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
              ],
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    for (final entry in rows.indexed) ...[
                      ListTile(
                        onTap: () => context.push(entry.$2.$3),
                        leading: Icon(entry.$2.$1, color: AppColors.inkSoft),
                        title: Text(entry.$2.$2),
                        trailing: const Icon(
                          Icons.chevron_right,
                          color: AppColors.inkSoft,
                        ),
                      ),
                      if (entry.$1 < rows.length - 1)
                        const Divider(height: 1, indent: 56),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const ListTile(
                  leading: Icon(Icons.language, color: AppColors.inkSoft),
                  title: Text('Language'),
                  subtitle: Text(
                    'English',
                    style: TextStyle(color: AppColors.inkSoft),
                  ),
                  trailing: Icon(Icons.chevron_right, color: AppColors.inkSoft),
                ),
              ),
              const SizedBox(height: 14),
              OutlinedButton.icon(
                onPressed: () async {
                  await ref.read(authControllerProvider.notifier).logout();
                  if (context.mounted) context.go('/welcome');
                },
                icon: const Icon(Icons.logout),
                label: const Text('Log out'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.brand,
                  minimumSize: const Size.fromHeight(52),
                  side: const BorderSide(color: AppColors.brand),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
