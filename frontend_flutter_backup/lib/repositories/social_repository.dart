import '../models/social_post.dart';
import '../services/api_service.dart';

class SocialRepository {
  SocialRepository(this.api);

  final ApiService api;

  Future<List<SocialPost>> feed() async {
    final response = await api.dio.get('/social/feed');
    return (response.data as List? ?? const [])
        .whereType<Map>()
        .map((item) => SocialPost.fromJson(item.cast<String, dynamic>()))
        .toList();
  }

  Future<void> createPost({
    required String text,
    required String location,
    String? imageUrl,
  }) {
    return api.dio.post<void>(
      '/social/posts',
      data: {
        'text': text,
        'location': location,
        if (imageUrl != null) 'imageUrls': [imageUrl],
      },
    );
  }

  Future<void> toggleLike(String postId) =>
      api.dio.post<void>('/social/posts/$postId/like');

  Future<void> addComment(String postId, String text) => api.dio.post<void>(
    '/social/posts/$postId/comments',
    data: {'text': text},
  );

  Future<void> toggleFollow(String userId) =>
      api.dio.post<void>('/social/users/$userId/follow');

  Future<String> openDirectConversation(String userId) async {
    final response = await api.dio.post<dynamic>(
      '/conversations/direct/$userId',
    );
    final data = (response.data as Map).cast<String, dynamic>();
    return data['id']?.toString() ?? userId;
  }
}
