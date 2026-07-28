import 'dart:async';

import 'package:dio/dio.dart';

import '../core/config/app_config.dart';
import '../models/auth_session.dart';
import 'local_storage_service.dart';

class ApiService {
  ApiService(this.storage) {
    dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 12),
        receiveTimeout: const Duration(seconds: 18),
        headers: {'Accept': 'application/json'},
      ),
    );
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final session = storage.readSession();
          if (session != null) {
            options.headers['Authorization'] = 'Bearer ${session.accessToken}';
          }
          handler.next(options);
        },
        onError: _handleError,
      ),
    );
  }

  final LocalStorageService storage;
  late final Dio dio;
  bool _refreshing = false;
  final _waiters = <Completer<void>>[];

  Future<void> _handleError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    if (_isTransient(error)) {
      final request = error.requestOptions;
      final retryCount = request.extra['networkRetries'] as int? ?? 0;
      if (retryCount < 2) {
        request.extra['networkRetries'] = retryCount + 1;
        await Future<void>.delayed(
          Duration(milliseconds: 350 * (retryCount + 1)),
        );
        try {
          handler.resolve(await dio.fetch(request));
          return;
        } catch (_) {
          // Continue to the normal error path after retry exhaustion.
        }
      }
    }

    if (error.response?.statusCode != 401 ||
        error.requestOptions.extra['retried'] == true) {
      handler.next(error);
      return;
    }

    try {
      await _refresh();
      final request = error.requestOptions;
      request.extra['retried'] = true;
      final session = storage.readSession();
      request.headers['Authorization'] = 'Bearer ${session?.accessToken}';
      handler.resolve(await dio.fetch(request));
    } catch (_) {
      await storage.clearSession();
      handler.next(error);
    }
  }

  bool _isTransient(DioException error) {
    final status = error.response?.statusCode ?? 0;
    return error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.connectionError ||
        status == 408 ||
        status == 429 ||
        status >= 500;
  }

  Future<void> _refresh() async {
    if (_refreshing) {
      final completer = Completer<void>();
      _waiters.add(completer);
      return completer.future;
    }

    _refreshing = true;
    try {
      final session = storage.readSession();
      if (session == null) throw StateError('No session');
      final cleanClient = Dio(BaseOptions(baseUrl: AppConfig.apiBaseUrl));
      final response = await cleanClient.post(
        '/auth/refresh',
        data: {'refreshToken': session.refreshToken},
      );
      final next = AuthSession.fromJson(response.data as Map<String, dynamic>);
      await storage.saveSession(next);
      for (final waiter in _waiters) {
        waiter.complete();
      }
    } catch (error) {
      for (final waiter in _waiters) {
        waiter.completeError(error);
      }
      rethrow;
    } finally {
      _waiters.clear();
      _refreshing = false;
    }
  }
}
