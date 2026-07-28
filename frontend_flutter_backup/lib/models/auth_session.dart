import 'package:freezed_annotation/freezed_annotation.dart';
import 'app_user.dart';

@freezed
class AuthSession {
  const AuthSession({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });
  final AppUser user;
  final String accessToken;
  final String refreshToken;
  factory AuthSession.fromJson(Map<String, dynamic> j) => AuthSession(
    user: AppUser.fromJson(j['user'] as Map<String, dynamic>),
    accessToken: j['accessToken'] as String,
    refreshToken: j['refreshToken'] as String,
  );
  Map<String, dynamic> toJson() => {
    'user': user.toJson(),
    'accessToken': accessToken,
    'refreshToken': refreshToken,
  };
}
