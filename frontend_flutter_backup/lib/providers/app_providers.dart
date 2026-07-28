import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/auth_session.dart';
import '../models/app_user.dart';
import '../repositories/auth_repository.dart';
import '../repositories/conversations_repository.dart';
import '../repositories/listings_repository.dart';
import '../repositories/guides_repository.dart';
import '../services/api_service.dart';
import '../services/local_storage_service.dart';

final localStorageProvider = Provider((ref) => LocalStorageService());
final apiServiceProvider = Provider(
  (ref) => ApiService(ref.watch(localStorageProvider)),
);
final authRepositoryProvider = Provider(
  (ref) => AuthRepository(
    ref.watch(apiServiceProvider),
    ref.watch(localStorageProvider),
  ),
);
final listingsRepositoryProvider = Provider(
  (ref) => ListingsRepository(
    ref.watch(apiServiceProvider),
    ref.watch(localStorageProvider),
  ),
);
final guidesRepositoryProvider = Provider(
  (ref) => GuidesRepository(ref.watch(apiServiceProvider)),
);
final conversationsRepositoryProvider = Provider(
  (ref) => ConversationsRepository(ref.watch(apiServiceProvider)),
);

enum PendingRole { traveler, guide }

class AuthState {
  const AuthState({
    this.session,
    this.loading = false,
    this.pendingRole = PendingRole.traveler,
    this.error,
  });
  final AuthSession? session;
  final bool loading;
  final PendingRole pendingRole;
  final String? error;
  AuthState copyWith({
    AuthSession? session,
    bool clearSession = false,
    bool? loading,
    PendingRole? pendingRole,
    String? error,
    bool clearError = false,
  }) => AuthState(
    session: clearSession ? null : session ?? this.session,
    loading: loading ?? this.loading,
    pendingRole: pendingRole ?? this.pendingRole,
    error: clearError ? null : error ?? this.error,
  );
}

class AuthController extends Notifier<AuthState> {
  late final AuthRepository _repo;
  @override
  AuthState build() {
    _repo = ref.read(authRepositoryProvider);
    return AuthState(session: ref.read(localStorageProvider).readSession());
  }

  void selectRole(PendingRole r) => state = state.copyWith(pendingRole: r);
  Future<bool> login(String email, String password) async =>
      _run(() => _repo.login(email: email, password: password));
  Future<bool> register(String name, String email, String password) async =>
      _run(
        () => _repo.register(
          name: name,
          email: email,
          password: password,
          role: state.pendingRole.name,
        ),
      );
  Future<bool> oauth(String provider) async => _run(
    () => _repo.demoOauth(provider, role: state.pendingRole.name.toUpperCase()),
  );
  Future<bool> _run(Future<AuthSession> Function() fn) async {
    state = state.copyWith(loading: true, clearError: true);
    try {
      final s = await fn();
      state = state.copyWith(session: s, loading: false);
      return true;
    } catch (e) {
      state = state.copyWith(
        loading: false,
        error: e.toString().replaceFirst('DioException [bad response]: ', ''),
      );
      return false;
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    state = state.copyWith(clearSession: true);
  }

  void becomeGuide() {
    final session = state.session;
    if (session == null) return;
    final guideSession = AuthSession(
      user: AppUser(
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        roles: {...session.user.roles, 'GUIDE'}.toList(),
        avatarUrl: session.user.avatarUrl,
      ),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    );
    state = state.copyWith(session: guideSession);
    unawaited(ref.read(localStorageProvider).saveSession(guideSession));
  }

  void updateName(String name) {
    final session = state.session;
    if (session == null) return;
    final updated = AuthSession(
      user: AppUser(
        id: session.user.id,
        name: name,
        email: session.user.email,
        roles: session.user.roles,
        avatarUrl: session.user.avatarUrl,
      ),
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    );
    state = state.copyWith(session: updated);
    unawaited(ref.read(localStorageProvider).saveSession(updated));
  }
}

final authControllerProvider = NotifierProvider<AuthController, AuthState>(
  AuthController.new,
);

enum AppLanguage { en, mn, ru, ko, ja, zh, de }

class LanguageController extends Notifier<AppLanguage> {
  @override
  AppLanguage build() {
    final v = ref.read(localStorageProvider).preference('language');
    for (final language in AppLanguage.values) {
      if (language.name == v) return language;
    }
    return AppLanguage.en;
  }

  Future<void> set(AppLanguage l) async {
    state = l;
    await ref.read(localStorageProvider).setPreference('language', l.name);
  }
}

final languageProvider = NotifierProvider<LanguageController, AppLanguage>(
  LanguageController.new,
);
