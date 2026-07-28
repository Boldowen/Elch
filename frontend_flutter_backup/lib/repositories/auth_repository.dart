import '../models/auth_session.dart';
import '../models/app_user.dart';
import '../services/api_service.dart';
import '../services/local_storage_service.dart';

class AuthRepository {
  AuthRepository(this.api, this.storage);
  final ApiService api;
  final LocalStorageService storage;
  Future<AuthSession> register({
    required String name,
    required String email,
    required String password,
    required String role,
  }) async {
    final r = await api.dio.post(
      '/auth/register',
      data: {
        'name': name,
        'email': email,
        'password': password,
        'role': role.toUpperCase(),
      },
    );
    final s = AuthSession.fromJson(r.data as Map<String, dynamic>);
    await storage.saveSession(s);
    return s;
  }

  Future<AuthSession> login({
    required String email,
    required String password,
  }) async {
    final r = await api.dio.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    final s = AuthSession.fromJson(r.data as Map<String, dynamic>);
    await storage.saveSession(s);
    return s;
  }

  Future<AuthSession> demoOauth(
    String provider, {
    String role = 'TRAVELER',
  }) async {
    final s = AuthSession(
      user: AppUser(
        id: 'demo-$provider',
        name: provider == 'google' ? 'Google User' : 'Apple User',
        email: 'you@${provider == 'google' ? 'gmail.com' : 'icloud.com'}',
        roles: [role == 'GUIDE' ? 'TRAVELER' : role],
      ),
      accessToken: 'demo-access',
      refreshToken: 'demo-refresh',
    );
    await storage.saveSession(s);
    return s;
  }

  Future<void> logout() async {
    final s = storage.readSession();
    if (s != null && !s.refreshToken.startsWith('demo')) {
      try {
        await api.dio.post(
          '/auth/logout',
          data: {'refreshToken': s.refreshToken},
        );
      } catch (_) {}
    }
    await storage.clearSession();
  }
}
