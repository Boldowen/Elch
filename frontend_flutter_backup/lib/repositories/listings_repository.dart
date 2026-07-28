import '../core/data/mock_data.dart' as mock;
import '../models/listing.dart';
import '../services/api_service.dart';
import '../services/local_storage_service.dart';

class ListingsRepository {
  ListingsRepository(this.api, this.storage);

  final ApiService api;
  final LocalStorageService storage;

  Future<List<Listing>> fetch({String? category}) async {
    final cacheKey = 'listings:${category ?? 'all'}';
    try {
      final response = await api.dio.get(
        '/listings',
        queryParameters: {
          if (category != null) 'category': category.toUpperCase(),
          'limit': 50,
        },
      );
      final data = response.data as Map<String, dynamic>;
      final items = (data['items'] as List)
          .map((item) => Listing.fromJson(item as Map<String, dynamic>))
          .toList();
      await storage.cache(
        cacheKey,
        items.map((item) => item.toJson()).toList(),
      );
      return items;
    } catch (_) {
      final cached = storage.cached(cacheKey);
      if (cached is List) {
        try {
          return cached
              .map(
                (item) =>
                    Listing.fromJson(Map<String, dynamic>.from(item as Map)),
              )
              .toList();
        } catch (_) {
          // Fall through to the bundled prototype data.
        }
      }
      return mock.listings;
    }
  }
}
