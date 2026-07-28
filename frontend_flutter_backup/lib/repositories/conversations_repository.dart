import '../core/constants/app_images.dart';
import '../models/trip.dart';
import '../services/api_service.dart';

class ConversationsRepository {
  ConversationsRepository(this.api);

  final ApiService api;

  Future<List<Conversation>> list(String currentUserId) async {
    final response = await api.dio.get<dynamic>('/conversations');
    return (response.data as List? ?? const []).whereType<Map>().map((raw) {
      final json = raw.cast<String, dynamic>();
      final participants = json['participants'] as List? ?? const [];
      Map<String, dynamic>? peer;
      for (final participant in participants.whereType<Map>()) {
        final user = (participant['user'] as Map?)?.cast<String, dynamic>();
        if (user != null && user['id']?.toString() != currentUserId) {
          peer = user;
          break;
        }
      }
      final latest =
          (json['messages'] as List? ?? const []).firstOrNull as Map?;
      return Conversation(
        id: json['id']?.toString() ?? '',
        guide: peer?['name']?.toString() ?? 'Traveler',
        photo: peer?['avatarUrl']?.toString() ?? AppImages.guide3,
        last:
            latest?['body']?.toString() ??
            (latest?['mediaUrl'] == null ? 'Start a conversation' : 'Photo'),
        time: _timeLabel(json['updatedAt']?.toString()),
      );
    }).toList();
  }

  Future<List<ChatMessage>> messages({
    required String conversationId,
    required String currentUserId,
  }) async {
    final response = await api.dio.get<dynamic>(
      '/conversations/$conversationId/messages',
    );
    return (response.data as List? ?? const []).whereType<Map>().map((raw) {
      final json = raw.cast<String, dynamic>();
      final sentAt = DateTime.tryParse(json['sentAt']?.toString() ?? '');
      return ChatMessage(
        id: json['id']?.toString() ?? '',
        me: json['senderId']?.toString() == currentUserId,
        time: sentAt == null
            ? ''
            : '${sentAt.toLocal().hour.toString().padLeft(2, '0')}:'
                  '${sentAt.toLocal().minute.toString().padLeft(2, '0')}',
        text: json['body']?.toString(),
        image: json['mediaUrl']?.toString(),
      );
    }).toList();
  }

  Future<void> send({
    required String conversationId,
    String? text,
    String? imageUrl,
  }) => api.dio.post<void>(
    '/conversations/$conversationId/messages',
    data: {
      'type': imageUrl == null ? 'TEXT' : 'IMAGE',
      if (text != null && text.isNotEmpty) 'body': text,
      'mediaUrl': ?imageUrl,
    },
  );

  static String _timeLabel(String? value) {
    final date = DateTime.tryParse(value ?? '')?.toLocal();
    if (date == null) return '';
    final age = DateTime.now().difference(date);
    if (age.inMinutes < 1) return 'Now';
    if (age.inHours < 1) return '${age.inMinutes}m';
    if (age.inDays < 1) return '${age.inHours}h';
    return '${date.month}/${date.day}';
  }
}
