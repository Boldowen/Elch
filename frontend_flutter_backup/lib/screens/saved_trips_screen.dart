import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../core/data/mock_data.dart';
import '../widgets/app_back_header.dart';
import '../widgets/network_image_view.dart';

class SavedTripsScreen extends StatelessWidget {
  const SavedTripsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final saved = listings.take(4).toList();
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AppBackHeader(title: 'Saved Trips', actions: false),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: saved.length + 1,
                separatorBuilder: (_, _) => const SizedBox(height: 12),
                itemBuilder: (_, i) {
                  if (i == 0) {
                    return Text(
                      '${saved.length} places saved',
                      style: const TextStyle(color: AppColors.inkSoft),
                    );
                  }
                  final l = saved[i - 1];
                  return InkWell(
                    onTap: () => context.push('/listing/${l.id}'),
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.border),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          SizedBox.square(
                            dimension: 96,
                            child: NetworkImageView(
                              url: l.images.first,
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  l.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  l.location,
                                  style: const TextStyle(
                                    color: AppColors.inkSoft,
                                    fontSize: 14,
                                  ),
                                ),
                                Text(
                                  '★ ${l.rating} · ${l.dates}',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: AppColors.inkSoft,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text.rich(
                                  TextSpan(
                                    children: [
                                      TextSpan(
                                        text: '\$${l.price.toStringAsFixed(0)}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      TextSpan(
                                        text: ' / ${l.priceUnit}',
                                        style: const TextStyle(
                                          color: AppColors.inkSoft,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
