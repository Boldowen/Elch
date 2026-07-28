import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../models/listing.dart';
import 'network_image_view.dart';

class ListingCard extends StatefulWidget {
  const ListingCard({super.key, required this.listing, required this.onTap});
  final Listing listing;
  final VoidCallback onTap;
  @override
  State<ListingCard> createState() => _ListingCardState();
}

class _ListingCardState extends State<ListingCard> {
  int active = 0;
  bool liked = false;
  @override
  Widget build(BuildContext context) {
    final l = widget.listing;
    return GestureDetector(
      onTap: widget.onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AspectRatio(
            aspectRatio: 4 / 3,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  NetworkImageView(url: l.images[active]),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Material(
                      color: Colors.black.withValues(alpha: .25),
                      shape: const CircleBorder(),
                      child: InkWell(
                        onTap: () {
                          setState(() => liked = !liked);
                        },
                        customBorder: const CircleBorder(),
                        child: SizedBox.square(
                          dimension: 36,
                          child: Icon(
                            liked ? Icons.favorite : Icons.favorite_border,
                            color: liked ? AppColors.brand : Colors.white,
                            size: 21,
                          ),
                        ),
                      ),
                    ),
                  ),
                  if (l.tags.isNotEmpty)
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: .92),
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: Text(
                          l.tags.first,
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.ink,
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    bottom: 12,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        l.images.length,
                        (i) => GestureDetector(
                          onTap: () {
                            setState(() => active = i);
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 160),
                            width: i == active ? 16 : 6,
                            height: 6,
                            margin: const EdgeInsets.symmetric(horizontal: 3),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(
                                alpha: i == active ? 1 : .6,
                              ),
                              borderRadius: BorderRadius.circular(99),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  l.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    color: AppColors.ink,
                  ),
                ),
              ),
              const Icon(Icons.star, size: 15, color: AppColors.ink),
              const SizedBox(width: 3),
              Text(
                l.rating.toStringAsFixed(2),
                style: const TextStyle(fontSize: 14, color: AppColors.ink),
              ),
            ],
          ),
          Text(
            l.location,
            style: const TextStyle(fontSize: 14, color: AppColors.inkSoft),
          ),
          Text(
            l.dates,
            style: const TextStyle(fontSize: 14, color: AppColors.inkSoft),
          ),
          const SizedBox(height: 3),
          Text.rich(
            TextSpan(
              style: const TextStyle(color: AppColors.ink),
              children: [
                TextSpan(
                  text: '\$${l.price.toStringAsFixed(0)}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                TextSpan(
                  text: ' / ${l.priceUnit}',
                  style: const TextStyle(color: AppColors.inkSoft),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
