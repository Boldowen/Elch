import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class BrandMark extends StatelessWidget {
  const BrandMark({super.key, this.dark = false});
  final bool dark;
  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: dark ? AppColors.introAccent : AppColors.brand,
          borderRadius: BorderRadius.circular(9),
        ),
        child: const Icon(
          Icons.explore_outlined,
          color: Colors.white,
          size: 19,
        ),
      ),
      const SizedBox(width: 8),
      RichText(
        text: TextSpan(
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            letterSpacing: -.4,
            color: dark ? Colors.white : AppColors.ink,
          ),
          children: [
            const TextSpan(text: 'Ven'),
            TextSpan(
              text: 'Tour',
              style: TextStyle(
                color: dark ? AppColors.introAccent : AppColors.brand,
              ),
            ),
          ],
        ),
      ),
    ],
  );
}
