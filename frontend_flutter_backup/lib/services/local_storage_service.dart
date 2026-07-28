import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import '../models/auth_session.dart';

class LocalStorageService {
  static const tokensBox = 'tokens';
  static const prefsBox = 'preferences';
  static const cacheBox = 'cache';
  static Future<void> initialize() async {
    await Future.wait([
      Hive.openBox<String>(tokensBox),
      Hive.openBox<String>(prefsBox),
      Hive.openBox<String>(cacheBox),
    ]);
  }

  Box<String> get _tokens => Hive.box<String>(tokensBox);
  Box<String> get _prefs => Hive.box<String>(prefsBox);
  Box<String> get _cache => Hive.box<String>(cacheBox);
  Future<void> saveSession(AuthSession s) =>
      _tokens.put('session', jsonEncode(s.toJson()));
  AuthSession? readSession() {
    final raw = _tokens.get('session');
    if (raw == null) return null;
    try {
      return AuthSession.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  Future<void> clearSession() => _tokens.delete('session');
  Future<void> setPreference(String k, String v) => _prefs.put(k, v);
  String? preference(String k) => _prefs.get(k);
  Future<void> cache(String k, Object v) => _cache.put(k, jsonEncode(v));
  dynamic cached(String k) {
    final v = _cache.get(k);
    return v == null ? null : jsonDecode(v);
  }
}
