import 'package:json_annotation/json_annotation.dart';

@JsonSerializable(createFactory: false, createToJson: false)
class AppUser {
  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    this.roles = const ['TRAVELER'],
    this.avatarUrl,
  });
  final String id;
  final String name;
  final String email;
  final List<String> roles;
  final String? avatarUrl;
  bool get isGuide => roles.contains('GUIDE');
  factory AppUser.fromJson(Map<String, dynamic> j) => AppUser(
    id: j['id']?.toString() ?? '',
    name: j['name']?.toString() ?? '',
    email: j['email']?.toString() ?? '',
    roles: (j['roles'] as List? ?? const []).map((e) => e.toString()).toList(),
    avatarUrl: j['avatarUrl']?.toString(),
  );
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'roles': roles,
    'avatarUrl': avatarUrl,
  };
}
