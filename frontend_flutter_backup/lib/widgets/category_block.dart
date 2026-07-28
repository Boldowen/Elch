import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import 'network_image_view.dart';

class CategoryBlock extends StatelessWidget {
  const CategoryBlock({
    super.key,
    required this.title,
    required this.subtitle,
    required this.count,
    required this.image,
    required this.chips,
    required this.right,
    required this.onTap,
  });
  final String title, subtitle, count, image;
  final List<String> chips;
  final bool right;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: ClipRRect(
      borderRadius: BorderRadius.only(
        topLeft: Radius.circular(right ? 16 : 72),
        bottomLeft: Radius.circular(right ? 16 : 72),
        topRight: Radius.circular(right ? 72 : 16),
        bottomRight: Radius.circular(right ? 72 : 16),
      ),
      child: SizedBox(
        height: 144,
        child: Stack(
          fit: StackFit.expand,
          children: [
            NetworkImageView(url: image),
            const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Color(0x19000000), Color(0xB3000000)],
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(
                right ? 20 : 96,
                16,
                right ? 88 : 20,
                16,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Wrap(
                    spacing: 6,
                    children: chips
                        .map(
                          (e) => Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 9,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: .2),
                              borderRadius: BorderRadius.circular(99),
                            ),
                            child: Text(
                              e,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                              ),
                            ),
                          ),
                        )
                        .toList(),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: .82),
                    ),
                  ),
                  Text(
                    count,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withValues(alpha: .62),
                    ),
                  ),
                ],
              ),
            ),
            Positioned(
              right: right ? 20 : null,
              left: right ? null : 20,
              top: 48,
              child: Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(
                  color: AppColors.brand,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: Color(0x40000000), blurRadius: 10),
                  ],
                ),
                child: Icon(
                  right ? Icons.arrow_forward : Icons.arrow_back,
                  color: Colors.white,
                  size: 23,
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
