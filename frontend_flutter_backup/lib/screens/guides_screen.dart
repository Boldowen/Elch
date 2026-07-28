import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/data/mock_data.dart';
import '../widgets/app_search_bar.dart';
import '../widgets/guide_card.dart';

class GuidesScreen extends StatefulWidget {
  const GuidesScreen({super.key});

  @override
  State<GuidesScreen> createState() => _GuidesScreenState();
}

class _GuidesScreenState extends State<GuidesScreen> {
  String location = 'All';
  String language = 'All';
  bool available = false;

  @override
  Widget build(BuildContext context) {
    final locations = <String>{
      'All',
      ...guides.map((guide) => guide.location.split(' / ').first),
    }.toList();
    final languages = <String>{
      'All',
      ...guides.expand((guide) => guide.languages),
    }.toList();
    final filtered = guides
        .where(
          (guide) =>
              (location == 'All' || guide.location.startsWith(location)) &&
              (language == 'All' || guide.languages.contains(language)) &&
              (!available || guide.availableToday),
        )
        .toList();

    return CustomScrollView(
      slivers: [
        SliverAppBar(
          pinned: true,
          expandedHeight: 224,
          toolbarHeight: 0,
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          flexibleSpace: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Guides',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 12),
                  const AppSearchBar(placeholder: 'Find local guides'),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _Drop(
                          value: location,
                          items: locations,
                          icon: Icons.location_on_outlined,
                          onChanged: (value) =>
                              setState(() => location = value),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _Drop(
                          value: language,
                          items: languages,
                          icon: Icons.translate,
                          onChanged: (value) =>
                              setState(() => language = value),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  FilterChip(
                    label: const Text('Available today'),
                    selected: available,
                    onSelected: (value) => setState(() => available = value),
                    selectedColor: AppColors.brand,
                    labelStyle: TextStyle(
                      color: available ? Colors.white : AppColors.ink,
                    ),
                    showCheckmark: false,
                    side: BorderSide(
                      color: available ? AppColors.brand : AppColors.border,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 110),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.successSoft,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.verified_user_outlined,
                      color: AppColors.success,
                    ),
                    SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Every guide is verified',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF065F46),
                            ),
                          ),
                          Text(
                            'Background checked and rated by real travellers.',
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFF047857),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                '${filtered.length} guides available',
                style: const TextStyle(color: AppColors.inkSoft),
              ),
              const SizedBox(height: 12),
              if (filtered.isEmpty)
                Container(
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Center(
                    child: Text(
                      'No guides match these filters yet.',
                      style: TextStyle(color: AppColors.inkSoft),
                    ),
                  ),
                )
              else
                for (final guide in filtered) ...[
                  GuideCard(
                    guide: guide,
                    onTap: () => context.push('/guide/${guide.id}'),
                  ),
                  const SizedBox(height: 14),
                ],
            ]),
          ),
        ),
      ],
    );
  }
}

class _Drop extends StatelessWidget {
  const _Drop({
    required this.value,
    required this.items,
    required this.icon,
    required this.onChanged,
  });

  final String value;
  final List<String> items;
  final IconData icon;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 42,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppColors.inkSoft),
          const SizedBox(width: 5),
          Expanded(
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: value,
                isExpanded: true,
                items: [
                  for (final item in items)
                    DropdownMenuItem<String>(
                      value: item,
                      child: Text(
                        item == 'All'
                            ? icon == Icons.translate
                                  ? 'Any language'
                                  : 'All locations'
                            : item,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.ink,
                        ),
                      ),
                    ),
                ],
                onChanged: (newValue) {
                  if (newValue != null) onChanged(newValue);
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
