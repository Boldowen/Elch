import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_images.dart';
import '../core/data/mock_data.dart';
import '../widgets/app_search_bar.dart';
import '../widgets/category_block.dart';
import '../widgets/chip_row.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  int tab = 0;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          pinned: true,
          expandedHeight: 160,
          toolbarHeight: 0,
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          flexibleSpace: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Explore',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 10),
                  AppSearchBar(
                    placeholder: 'Search places, camps, guides...',
                    onFilter: () => _filterSheet(context),
                  ),
                  const SizedBox(height: 10),
                  ChipRow(
                    items: categoryTabs,
                    activeIndex: tab,
                    onChanged: (index) {
                      setState(() => tab = index);
                      if (categoryTabs[index] == 'Guides') {
                        context.push('/guide-directory');
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 110),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              CategoryBlock(
                title: 'Trending',
                subtitle: 'Most-loved stays this season',
                count: '128 places',
                image: AppImages.hills,
                chips: const ['Ger camps', 'Horse riding'],
                right: true,
                onTap: () => context.push('/category/trending'),
              ),
              const SizedBox(height: 14),
              CategoryBlock(
                title: 'Hotel & Camp',
                subtitle: 'Lodges, camps & boutique stays',
                count: '212 places',
                image: AppImages.lakeReflect,
                chips: const ['Lake view', 'Sauna'],
                right: false,
                onTap: () => context.push('/category/hotel'),
              ),
              const SizedBox(height: 14),
              CategoryBlock(
                title: 'Foods',
                subtitle: 'Taste real Mongolian flavours',
                count: '64 experiences',
                image: AppImages.foodBowls,
                chips: const ['Cooking', 'Food tours'],
                right: true,
                onTap: () => context.push('/category/foods'),
              ),
              const SizedBox(height: 14),
              CategoryBlock(
                title: 'Local Guides',
                subtitle: 'Verified experts who know Mongolia',
                count: '${guides.length} guides',
                image: AppImages.guide3,
                chips: const ['Verified', 'Local experts'],
                right: false,
                onTap: () => context.push('/guide-directory'),
              ),
            ]),
          ),
        ),
      ],
    );
  }

  void _filterSheet(BuildContext context) {
    var price = const RangeValues(20, 160);
    final selected = <String>{'Stay'};
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Filters', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 18),
              Row(
                children: [
                  const Text('Price range'),
                  const Spacer(),
                  Text(
                    '\$${price.start.toStringAsFixed(0)} – '
                    '\$${price.end.toStringAsFixed(0)}',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              RangeSlider(
                values: price,
                min: 0,
                max: 250,
                divisions: 25,
                activeColor: const Color(0xFFFF385C),
                onChanged: (value) => setSheetState(() => price = value),
              ),
              const Text('Experience type'),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  for (final type in const ['Stay', 'Food', 'Guide', 'Nature'])
                    FilterChip(
                      label: Text(type),
                      selected: selected.contains(type),
                      onSelected: (enabled) {
                        setSheetState(() {
                          if (enabled) {
                            selected.add(type);
                          } else {
                            selected.remove(type);
                          }
                        });
                      },
                      showCheckmark: false,
                    ),
                ],
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        setSheetState(() {
                          price = const RangeValues(0, 250);
                          selected.clear();
                        });
                      },
                      child: const Text('Clear'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    flex: 2,
                    child: FilledButton(
                      onPressed: () {
                        Navigator.pop(sheetContext);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              '${selected.isEmpty ? 'All' : selected.join(', ')} '
                              '· \$${price.start.toStringAsFixed(0)}–'
                              '\$${price.end.toStringAsFixed(0)}',
                            ),
                          ),
                        );
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
    );
  }
}
