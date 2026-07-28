import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../assets/asset_paths.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_durations.dart';

class NetworkImageView extends StatelessWidget {
  const NetworkImageView({
    super.key,
    required this.url,
    this.fit = BoxFit.cover,
    this.borderRadius,
  });

  final String url;
  final BoxFit fit;
  final BorderRadius? borderRadius;

  @override
  Widget build(BuildContext context) {
    final child = CachedNetworkImage(
      imageUrl: url,
      fit: fit,
      width: double.infinity,
      height: double.infinity,
      fadeInDuration: AppDurations.imageFade,
      placeholder: (_, _) => const ColoredBox(
        color: Color(0xFFF2F2F4),
        child: Center(
          child: SizedBox.square(
            dimension: 22,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: AppColors.brand,
            ),
          ),
        ),
      ),
      errorWidget: (_, _, _) =>
          Image.asset(AssetPaths.landscapePlaceholder, fit: fit),
    );
    return borderRadius == null
        ? child
        : ClipRRect(borderRadius: borderRadius!, child: child);
  }
}
