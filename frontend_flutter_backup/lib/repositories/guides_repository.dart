import '../services/api_service.dart';

class GuideRankingEntry {
  const GuideRankingEntry({
    required this.userId,
    required this.name,
    required this.photo,
    required this.location,
    required this.rating,
    required this.reviewCount,
    required this.rankPoints,
    required this.completedTrips,
  });

  final String userId;
  final String name;
  final String photo;
  final String location;
  final double rating;
  final int reviewCount;
  final int rankPoints;
  final int completedTrips;
}

class GuidesRepository {
  GuidesRepository(this.api);

  final ApiService api;

  Future<List<GuideRankingEntry>> ranking() async {
    final response = await api.dio.get<dynamic>('/guides/ranking');
    return (response.data as List? ?? const []).whereType<Map>().map((raw) {
      final profile = raw.cast<String, dynamic>();
      final user =
          (profile['user'] as Map?)?.cast<String, dynamic>() ?? const {};
      return GuideRankingEntry(
        userId: user['id']?.toString() ?? profile['userId']?.toString() ?? '',
        name: user['name']?.toString() ?? 'Local guide',
        photo: user['avatarUrl']?.toString() ?? '',
        location: '${profile['city'] ?? ''}, ${profile['country'] ?? ''}',
        rating: double.tryParse(profile['rating']?.toString() ?? '') ?? 0,
        reviewCount: profile['reviewCount'] as int? ?? 0,
        rankPoints: profile['rankPoints'] as int? ?? 0,
        completedTrips: profile['completedTrips'] as int? ?? 0,
      );
    }).toList();
  }

  Future<Map<String, dynamic>> mine() async {
    final response = await api.dio.get<dynamic>('/guides/me');
    return (response.data as Map).cast<String, dynamic>();
  }

  Future<void> updateProfile({
    required String name,
    required String country,
    required String city,
    required String bio,
    required List<String> expertise,
    required String? price,
  }) => api.dio.patch<void>(
    '/guides/me',
    data: {
      'name': name,
      'country': country,
      'city': city,
      'bio': bio,
      'expertise': expertise,
      'pricingType': price == null ? 'NONE' : 'HOURLY',
      'price': ?price,
    },
  );

  Future<void> apply({
    required String country,
    required String city,
    required String bio,
    required int experienceYears,
    required List<String> languages,
    required List<String> expertise,
    required List<String> availability,
    required String? price,
    required bool verified,
    required int assessmentScore,
    required String referenceContact,
    required bool codeOfConductAccepted,
  }) async {
    await api.dio.post(
      '/guides/apply',
      data: {
        'country': country,
        'city': city,
        'bio': bio,
        'experienceYears': experienceYears,
        'languages': {
          for (final language in languages)
            language: language == 'Mongolian' ? 'Native' : 'Fluent',
        },
        'expertise': expertise,
        'availability': availability,
        'pricingType': price == null ? 'NONE' : 'HOURLY',
        'price': ?price,
        'verified': verified,
        'assessmentScore': assessmentScore,
        'referenceContact': referenceContact,
        'codeOfConductAccepted': codeOfConductAccepted,
      },
    );
  }
}
