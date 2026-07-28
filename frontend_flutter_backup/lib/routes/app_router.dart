import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_durations.dart';
import '../providers/app_providers.dart';
import '../screens/account_settings_screen.dart';
import '../screens/auth_screen.dart';
import '../screens/category_listing_screen.dart';
import '../screens/chat_screen.dart';
import '../screens/community_screen.dart';
import '../screens/explore_screen.dart';
import '../screens/guide_dashboard_screen.dart';
import '../screens/guide_detail_screen.dart';
import '../screens/guide_profile_edit_screen.dart';
import '../screens/guide_ranking_screen.dart';
import '../screens/guide_registration_screen.dart';
import '../screens/guides_screen.dart';
import '../screens/help_center_screen.dart';
import '../screens/inbox_screen.dart';
import '../screens/listing_detail_screen.dart';
import '../screens/payment_methods_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/saved_trips_screen.dart';
import '../screens/trips_screen.dart';
import '../screens/welcome_screen.dart';
import '../widgets/app_bottom_nav.dart';
import '../widgets/language_selector.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final session = ref.watch(authControllerProvider.select((s) => s.session));
  return GoRouter(
    initialLocation: session == null ? '/welcome' : '/explore',
    routes: [
      ShellRoute(
        builder: (_, _, child) => _GlobalChrome(child: child),
        routes: [
          GoRoute(
            path: '/welcome',
            pageBuilder: (_, s) => _fade(s, const WelcomeScreen()),
          ),
          GoRoute(
            path: '/auth',
            pageBuilder: (_, s) => _slide(
              s,
              AuthScreen(initialMode: s.uri.queryParameters['mode'] ?? 'login'),
              const Offset(0, 1),
            ),
          ),
          ShellRoute(
            builder: (context, state, child) =>
                AppBottomNav(location: state.uri.path, child: child),
            routes: [
              GoRoute(
                path: '/explore',
                pageBuilder: (_, s) => _fade(s, const ExploreScreen()),
              ),
              GoRoute(
                path: '/community',
                pageBuilder: (_, s) => _fade(s, const CommunityScreen()),
              ),
              GoRoute(
                path: '/trips',
                pageBuilder: (_, s) => _fade(s, const TripsScreen()),
              ),
              GoRoute(
                path: '/inbox',
                pageBuilder: (_, s) => _fade(s, const InboxScreen()),
              ),
              GoRoute(
                path: '/profile',
                pageBuilder: (_, s) => _fade(s, const ProfileScreen()),
              ),
            ],
          ),
          GoRoute(
            path: '/category/:key',
            pageBuilder: (_, s) => _slide(
              s,
              CategoryListingScreen(
                categoryKey: s.pathParameters['key'] ?? 'trending',
              ),
              const Offset(1, 0),
            ),
          ),
          GoRoute(
            path: '/listing/:id',
            pageBuilder: (_, s) => _slide(
              s,
              ListingDetailScreen(id: s.pathParameters['id'] ?? 'l1'),
              const Offset(1, 0),
            ),
          ),
          GoRoute(
            path: '/guide-directory',
            pageBuilder: (_, s) =>
                _slide(s, const GuidesScreen(), const Offset(1, 0)),
          ),
          GoRoute(
            path: '/guide/:id',
            pageBuilder: (_, s) => _slide(
              s,
              GuideDetailScreen(id: s.pathParameters['id'] ?? 'g1'),
              const Offset(1, 0),
            ),
          ),
          GoRoute(
            path: '/chat/:id',
            pageBuilder: (_, s) => _slide(
              s,
              ChatScreen(
                id: s.pathParameters['id'] ?? 'c1',
                peerName: s.uri.queryParameters['name'],
                peerAvatar: s.uri.queryParameters['avatar'],
              ),
              const Offset(0, 1),
            ),
          ),
          GoRoute(
            path: '/account-settings',
            pageBuilder: (_, s) =>
                _slide(s, const AccountSettingsScreen(), const Offset(1, 0)),
          ),
          GoRoute(
            path: '/saved-trips',
            pageBuilder: (_, s) =>
                _slide(s, const SavedTripsScreen(), const Offset(1, 0)),
          ),
          GoRoute(
            path: '/payment-methods',
            pageBuilder: (_, s) =>
                _slide(s, const PaymentMethodsScreen(), const Offset(1, 0)),
          ),
          GoRoute(
            path: '/help-center',
            pageBuilder: (_, s) =>
                _slide(s, const HelpCenterScreen(), const Offset(1, 0)),
          ),
          GoRoute(
            path: '/guide-registration',
            pageBuilder: (_, s) =>
                _slide(s, const GuideRegistrationScreen(), const Offset(0, 1)),
          ),
          GoRoute(
            path: '/guide-dashboard',
            pageBuilder: (_, s) => _fade(s, const GuideDashboardScreen()),
          ),
          GoRoute(
            path: '/guide-profile-edit',
            pageBuilder: (_, s) =>
                _slide(s, const GuideProfileEditScreen(), const Offset(1, 0)),
          ),
          GoRoute(
            path: '/guide-ranking',
            pageBuilder: (_, s) =>
                _slide(s, const GuideRankingScreen(), const Offset(1, 0)),
          ),
        ],
      ),
    ],
  );
});

class _GlobalChrome extends StatelessWidget {
  const _GlobalChrome({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => Stack(
    children: [
      child,
      const Positioned(
        top: 8,
        right: 12,
        child: SafeArea(child: LanguageSelector()),
      ),
    ],
  );
}

CustomTransitionPage<void> _slide(
  GoRouterState state,
  Widget child,
  Offset begin,
) => CustomTransitionPage<void>(
  key: state.pageKey,
  child: child,
  transitionDuration: AppDurations.routeForward,
  reverseTransitionDuration: AppDurations.routeReverse,
  transitionsBuilder: (_, animation, secondary, child) => SlideTransition(
    position: Tween(
      begin: begin,
      end: Offset.zero,
    ).chain(CurveTween(curve: AppDurations.curve)).animate(animation),
    child: FadeTransition(opacity: animation, child: child),
  ),
);
CustomTransitionPage<void> _fade(GoRouterState state, Widget child) =>
    CustomTransitionPage<void>(
      key: state.pageKey,
      child: child,
      transitionDuration: AppDurations.standard,
      transitionsBuilder: (_, a, _, c) => FadeTransition(opacity: a, child: c),
    );
