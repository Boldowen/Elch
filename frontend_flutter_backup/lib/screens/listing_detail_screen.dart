import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../core/data/mock_data.dart';
import '../models/listing.dart';
import '../widgets/app_back_header.dart';
import '../widgets/network_image_view.dart';

class ListingDetailScreen extends StatefulWidget {
  const ListingDetailScreen({super.key, required this.id});

  final String id;

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  int active = 0;

  @override
  Widget build(BuildContext context) {
    final found = listings.where((listing) => listing.id == widget.id);
    final listing = found.isEmpty ? listings.first : found.first;

    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 322,
                pinned: false,
                automaticallyImplyLeading: false,
                backgroundColor: Colors.transparent,
                flexibleSpace: FlexibleSpaceBar(
                  background: _Gallery(
                    listing: listing,
                    active: active,
                    onChanged: (index) => setState(() => active = index),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 112),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    Text(
                      listing.title,
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w600,
                        letterSpacing: -.3,
                      ),
                    ),
                    const SizedBox(height: 7),
                    Wrap(
                      spacing: 14,
                      runSpacing: 4,
                      children: [
                        _Meta(
                          Icons.star,
                          '${listing.rating} (${listing.reviews} reviews)',
                        ),
                        _Meta(Icons.location_on_outlined, listing.location),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Text(
                      listing.description,
                      style: const TextStyle(
                        fontSize: 15,
                        height: 1.55,
                        color: Color(0xCC222222),
                      ),
                    ),
                    const SizedBox(height: 26),
                    const Text(
                      "What's included",
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      childAspectRatio: 4.6,
                      children: [
                        for (final amenity in listing.amenities)
                          Row(
                            children: [
                              Icon(
                                amenity.toLowerCase().contains('wi-fi')
                                    ? Icons.wifi
                                    : Icons.check,
                                size: 17,
                                color: AppColors.inkSoft,
                              ),
                              const SizedBox(width: 8),
                              Flexible(
                                child: Text(
                                  amenity,
                                  style: const TextStyle(fontSize: 14),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    _HostCard(listing: listing),
                    const SizedBox(height: 26),
                    const Text(
                      "Where you'll be",
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 10),
                    AspectRatio(
                      aspectRatio: 16 / 9,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            const NetworkImageView(url: AppImages.riverField),
                            Center(
                              child: Container(
                                width: 38,
                                height: 38,
                                decoration: const BoxDecoration(
                                  color: AppColors.brand,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black26,
                                      blurRadius: 8,
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.location_on,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${listing.location}, Mongolia',
                      style: const TextStyle(
                        color: AppColors.inkSoft,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 26),
                    const Text(
                      'Recommended guides nearby',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const Text(
                      'Verified locals who know this area well',
                      style: TextStyle(color: AppColors.inkSoft, fontSize: 14),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 172,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: 3,
                        separatorBuilder: (_, _) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          final guide = guides[index];
                          return InkWell(
                            onTap: () => context.push('/guide/${guide.id}'),
                            child: Container(
                              width: 142,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                border: Border.all(color: AppColors.border),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CircleAvatar(
                                    radius: 39,
                                    backgroundImage: NetworkImage(guide.photo),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Flexible(
                                        child: Text(
                                          guide.name.split(' ').first,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                      const Icon(
                                        Icons.verified,
                                        color: AppColors.brand,
                                        size: 14,
                                      ),
                                    ],
                                  ),
                                  Text(
                                    '★ ${guide.rating} · '
                                    '\$${guide.price.toStringAsFixed(0)}/day',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: AppColors.inkSoft,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ]),
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: _BookingBar(
              listing: listing,
              onReserve: () => _reserve(context, listing.title),
            ),
          ),
        ],
      ),
    );
  }

  void _reserve(BuildContext context, String title) {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: AppColors.success, size: 48),
            const SizedBox(height: 12),
            Text(
              'Ready to reserve?',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 6),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.inkSoft),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: () => Navigator.pop(sheetContext),
                child: const Text('Continue to booking'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Gallery extends StatelessWidget {
  const _Gallery({
    required this.listing,
    required this.active,
    required this.onChanged,
  });

  final Listing listing;
  final int active;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        NetworkImageView(url: listing.images[active]),
        const Positioned(
          top: 36,
          left: 0,
          right: 0,
          child: AppBackHeader(transparent: true),
        ),
        Positioned(
          bottom: 16,
          left: 0,
          right: 0,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var index = 0; index < listing.images.length; index++)
                GestureDetector(
                  onTap: () => onChanged(index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 160),
                    height: 7,
                    width: index == active ? 20 : 7,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(
                        alpha: index == active ? 1 : .65,
                      ),
                      borderRadius: BorderRadius.circular(9),
                    ),
                  ),
                ),
            ],
          ),
        ),
        Positioned(
          bottom: 14,
          right: 16,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.black54,
              borderRadius: BorderRadius.circular(99),
            ),
            child: Text(
              '${active + 1}/${listing.images.length}',
              style: const TextStyle(color: Colors.white, fontSize: 11),
            ),
          ),
        ),
      ],
    );
  }
}

class _HostCard extends StatelessWidget {
  const _HostCard({required this.listing});

  final Listing listing;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundImage: NetworkImage(listing.hostPhoto),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Hosted by ${listing.hostName}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                if (listing.superhost)
                  const Row(
                    children: [
                      Icon(Icons.verified, color: AppColors.brand, size: 16),
                      SizedBox(width: 4),
                      Text(
                        'Superhost · Verified',
                        style: TextStyle(
                          color: AppColors.inkSoft,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BookingBar extends StatelessWidget {
  const _BookingBar({required this.listing, required this.onReserve});

  final Listing listing;
  final VoidCallback onReserve;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 12),
        decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: AppColors.border)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: '\$${listing.price.toStringAsFixed(0)}',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        TextSpan(
                          text: ' / ${listing.priceUnit}',
                          style: const TextStyle(color: AppColors.inkSoft),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    listing.dates,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.inkSoft,
                    ),
                  ),
                ],
              ),
            ),
            FilledButton(
              onPressed: onReserve,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.brand,
                padding: const EdgeInsets.symmetric(
                  horizontal: 30,
                  vertical: 15,
                ),
                shape: const StadiumBorder(),
              ),
              child: const Text(
                'Reserve',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Meta extends StatelessWidget {
  const _Meta(this.icon, this.label);

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 15, color: AppColors.ink),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 14, color: AppColors.inkSoft),
        ),
      ],
    );
  }
}
