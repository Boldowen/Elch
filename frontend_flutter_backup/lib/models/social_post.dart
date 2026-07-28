class SocialAuthor {
  const SocialAuthor({
    required this.id,
    required this.name,
    required this.avatarUrl,
    required this.home,
    this.followsYou = false,
  });

  final String id;
  final String name;
  final String avatarUrl;
  final String home;
  final bool followsYou;

  factory SocialAuthor.fromJson(Map<String, dynamic> json) {
    return SocialAuthor(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Traveler',
      avatarUrl: json['avatarUrl']?.toString() ?? '',
      home: json['home']?.toString() ?? json['location']?.toString() ?? '',
      followsYou: json['followsYou'] == true,
    );
  }
}

class SocialComment {
  const SocialComment({
    required this.id,
    required this.author,
    required this.text,
    required this.timeLabel,
  });

  final String id;
  final SocialAuthor author;
  final String text;
  final String timeLabel;

  factory SocialComment.fromJson(Map<String, dynamic> json) {
    return SocialComment(
      id: json['id']?.toString() ?? '',
      author: SocialAuthor.fromJson(
        (json['author'] as Map?)?.cast<String, dynamic>() ?? const {},
      ),
      text: json['text']?.toString() ?? '',
      timeLabel: json['timeLabel']?.toString() ?? 'now',
    );
  }
}

class SocialPost {
  const SocialPost({
    required this.id,
    required this.author,
    required this.text,
    required this.location,
    required this.timeLabel,
    required this.likeCount,
    required this.comments,
    this.imageUrl,
    this.liked = false,
  });

  final String id;
  final SocialAuthor author;
  final String text;
  final String location;
  final String timeLabel;
  final String? imageUrl;
  final int likeCount;
  final bool liked;
  final List<SocialComment> comments;

  SocialPost copyWith({
    int? likeCount,
    bool? liked,
    List<SocialComment>? comments,
  }) {
    return SocialPost(
      id: id,
      author: author,
      text: text,
      location: location,
      timeLabel: timeLabel,
      imageUrl: imageUrl,
      likeCount: likeCount ?? this.likeCount,
      liked: liked ?? this.liked,
      comments: comments ?? this.comments,
    );
  }

  factory SocialPost.fromJson(Map<String, dynamic> json) {
    final images = json['images'] as List? ?? const [];
    return SocialPost(
      id: json['id']?.toString() ?? '',
      author: SocialAuthor.fromJson(
        (json['author'] as Map?)?.cast<String, dynamic>() ?? const {},
      ),
      text: json['text']?.toString() ?? '',
      location: json['location']?.toString() ?? '',
      timeLabel: json['timeLabel']?.toString() ?? 'now',
      imageUrl: images.isEmpty
          ? json['imageUrl']?.toString()
          : (images.first as Map?)?['url']?.toString(),
      likeCount:
          (json['_count'] as Map?)?['likes'] as int? ??
          json['likeCount'] as int? ??
          0,
      liked: json['liked'] == true,
      comments: (json['comments'] as List? ?? const [])
          .whereType<Map>()
          .map((item) => SocialComment.fromJson(item.cast<String, dynamic>()))
          .toList(),
    );
  }
}
