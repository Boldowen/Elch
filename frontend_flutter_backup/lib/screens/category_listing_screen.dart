import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../core/data/mock_data.dart';
import '../models/listing.dart';
import '../widgets/app_back_header.dart';
import '../widgets/app_search_bar.dart';
import '../widgets/chip_row.dart';
import '../widgets/listing_card.dart';
import '../widgets/network_image_view.dart';

class CategoryListingScreen extends StatefulWidget {
  const CategoryListingScreen({super.key, required this.categoryKey});

  final String categoryKey;

  @override
  State<CategoryListingScreen> createState() => _CategoryListingScreenState();
}

class _CategoryListingScreenState extends State<CategoryListingScreen> {
  final searchController = TextEditingController();
  bool map = false;
  int active = 0;
  String sort = 'Recommended';
  double maxPrice = 250;

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final title =
        <String, String>{
          'trending': 'Trending',
          'hotel': 'Hotel & Camp',
          'foods': 'Foods',
        }[widget.categoryKey] ??
        'Explore';

    final filters =
        <String, List<String>>{
          'trending': [
            'All',
            'Ger camps',
            'Homestay',
            'Horse riding',
            'Nature',
          ],
          'hotel': ['All', 'Lake view', 'Sauna', 'Boutique', 'Full board'],
          'foods': [
            'All',
            'Cooking class',
            'Food tour',
            'Vegetarian',
            '2 hours',
          ],
        }[widget.categoryKey] ??
        const ['All'];

    final query = searchController.text.trim().toLowerCase();
    final selectedFilter = filters[active].toLowerCase();
    final items = listings.where((listing) {
      final categoryMatches =
          widget.categoryKey == 'trending' ||
          listing.category == widget.categoryKey;
      final searchMatches =
          query.isEmpty ||
          listing.title.toLowerCase().contains(query) ||
          listing.location.toLowerCase().contains(query) ||
          listing.tags.any((tag) => tag.toLowerCase().contains(query));
      final chipMatches =
          active == 0 ||
          listing.tags.any(
            (tag) =>
                tag.toLowerCase().contains(selectedFilter.split(' ').first),
          ) ||
          listing.amenities.any(
            (amenity) => amenity.toLowerCase().contains(selectedFilter),
          );
      return categoryMatches &&
          searchMatches &&
          chipMatches &&
          listing.price <= maxPrice;
    }).toList();

    switch (sort) {
      case 'Price: low to high':
        items.sort((a, b) => a.price.compareTo(b.price));
        break;
      case 'Price: high to low':
        items.sort((a, b) => b.price.compareTo(a.price));
        break;
      case 'Top rated':
        items.sort((a, b) => b.rating.compareTo(a.rating));
        break;
    }

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            AppBackHeader(title: title, actions: false),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  AppSearchBar(
                    controller: searchController,
                    placeholder: 'Search ${title.toLowerCase()}...',
                    onChanged: (_) => setState(() {}),
                    onFilter: () => _filterSheet(context),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: ChipRow(
                          items: filters,
                          activeIndex: active,
                          onChanged: (index) => setState(() => active = index),
                        ),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton.icon(
                        onPressed: () => _sortSheet(context),
                        icon: const Icon(Icons.swap_vert, size: 16),
                        label: const Text('Sort'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.ink,
                          shape: const StadiumBorder(),
                          side: const BorderSide(color: AppColors.border),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        '${items.length} stays · Mongolia',
                        style: const TextStyle(
                          color: AppColors.inkSoft,
                          fontSize: 14,
                        ),
                      ),
                      const Spacer(),
                      FilledButton.icon(
                        onPressed: () => setState(() => map = !map),
                        icon: Icon(
                          map ? Icons.list : Icons.map_outlined,
                          size: 16,
                        ),
                        label: Text(map ? 'List' : 'Map'),
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.ink,
                          minimumSize: const Size(0, 34),
                          padding: const EdgeInsets.symmetric(horizontal: 14),
                          shape: const StadiumBorder(),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: items.isEmpty
                  ? const _NoResults()
                  : map
                  ? _MapView(items: items)
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                      itemCount: items.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 24),
                      itemBuilder: (context, index) {
                        final listing = items[index];
                        return ListingCard(
                          listing: listing,
                          onTap: () => context.push('/listing/${listing.id}'),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  void _sortSheet(BuildContext context) {
    const options = [
      'Recommended',
      'Top rated',
      'Price: low to high',
      'Price: high to low',
    ];
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Sort results',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 8),
              RadioGroup<String>(
                groupValue: sort,
                onChanged: (value) {
                  if (value == null) return;
                  setState(() => sort = value);
                  Navigator.pop(sheetContext);
                },
                child: Column(
                  children: [
                    for (final option in options)
                      RadioListTile<String>(
                        contentPadding: EdgeInsets.zero,
                        value: option,
                        activeColor: AppColors.brand,
                        title: Text(option),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _filterSheet(BuildContext context) {
    var draftMax = maxPrice;
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setSheetState) => SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Filters',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    const Text('Maximum price'),
                    const Spacer(),
                    Text(
                      '\$${draftMax.toStringAsFixed(0)}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                Slider(
                  value: draftMax,
                  min: 30,
                  max: 250,
                  divisions: 22,
                  activeColor: AppColors.brand,
                  onChanged: (value) => setSheetState(() => draftMax = value),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          setState(() {
                            maxPrice = 250;
                            active = 0;
                            searchController.clear();
                          });
                          Navigator.pop(sheetContext);
                        },
                        child: const Text('Clear all'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      flex: 2,
                      child: FilledButton(
                        onPressed: () {
                          setState(() => maxPrice = draftMax);
                          Navigator.pop(sheetContext);
                        },
                        child: const Text('Show results'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MapView extends StatelessWidget {
  const _MapView({required this.items});

  final List<Listing> items;

  @override
  Widget build(BuildContext context) {
    final pins = items.take(4).toList();
    return Stack(
      fit: StackFit.expand,
      children: [
        const NetworkImageView(url: AppImages.steppe),
        Container(color: Colors.black.withValues(alpha: .08)),
        for (var index = 0; index < pins.length; index++)
          Positioned(
            left: 38 + index * 68,
            top: index.isEven ? 90 : 235,
            child: ActionChip(
              onPressed: () => context.push('/listing/${pins[index].id}'),
              backgroundColor: AppColors.ink,
              side: BorderSide.none,
              label: Text(
                '\$${pins[index].price.toStringAsFixed(0)}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _NoResults extends StatelessWidget {
  const _NoResults();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.search_off, size: 44, color: AppColors.inkSoft),
            SizedBox(height: 10),
            Text(
              'No matching stays',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 4),
            Text(
              'Try another search or adjust your filters.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.inkSoft),
            ),
          ],
        ),
      ),
    );
  }
}
