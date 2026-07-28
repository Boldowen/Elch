import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_icons.dart';

class AppBottomNav extends StatelessWidget {
  const AppBottomNav({super.key, required this.child, required this.location});

  final Widget child;
  final String location;

  static const paths = [
    '/explore',
    '/community',
    '/trips',
    '/inbox',
    '/profile',
  ];

  @override
  Widget build(BuildContext context) {
    var index = paths.indexWhere((path) => location.startsWith(path));
    if (index < 0) index = 0;
    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        height: 72,
        selectedIndex: index,
        onDestinationSelected: (next) => context.go(paths[next]),
        indicatorColor: AppColors.secondary,
        backgroundColor: Colors.white,
        shadowColor: Colors.black12,
        elevation: 4,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: const [
          NavigationDestination(
            icon: Icon(AppIcons.explore),
            selectedIcon: Icon(
              AppIcons.exploreSelected,
              color: AppColors.brand,
            ),
            label: 'Explore',
          ),
          NavigationDestination(
            icon: Icon(AppIcons.community),
            selectedIcon: Icon(
              AppIcons.communitySelected,
              color: AppColors.brand,
            ),
            label: 'Community',
          ),
          NavigationDestination(
            icon: Icon(AppIcons.trips),
            selectedIcon: Icon(AppIcons.tripsSelected, color: AppColors.brand),
            label: 'Trips',
          ),
          NavigationDestination(
            icon: Icon(AppIcons.inbox),
            selectedIcon: Icon(AppIcons.inboxSelected, color: AppColors.brand),
            label: 'Inbox',
          ),
          NavigationDestination(
            icon: Icon(AppIcons.profile),
            selectedIcon: Icon(
              AppIcons.profileSelected,
              color: AppColors.brand,
            ),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
