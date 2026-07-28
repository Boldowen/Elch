import 'package:flutter/material.dart';

import '../core/constants/app_colors.dart';

class AppBackHeader extends StatefulWidget {
  const AppBackHeader({
    super.key,
    this.title,
    this.transparent = false,
    this.actions = true,
    this.initialFavorite = false,
    this.onFavoriteChanged,
    this.onShare,
  });

  final String? title;
  final bool transparent;
  final bool actions;
  final bool initialFavorite;
  final ValueChanged<bool>? onFavoriteChanged;
  final VoidCallback? onShare;

  @override
  State<AppBackHeader> createState() => _AppBackHeaderState();
}

class _AppBackHeaderState extends State<AppBackHeader> {
  late bool favorite;

  @override
  void initState() {
    super.initState();
    favorite = widget.initialFavorite;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          _circle(
            icon: Icons.chevron_left,
            onTap: () => Navigator.of(context).maybePop(),
          ),
          if (widget.title != null)
            Expanded(
              child: Text(
                widget.title!,
                textAlign: TextAlign.center,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                ),
              ),
            )
          else
            const Spacer(),
          if (widget.actions) ...[
            _circle(
              icon: Icons.ios_share_outlined,
              onTap: widget.onShare ?? _showShareSheet,
            ),
            const SizedBox(width: 8),
            _circle(
              icon: favorite ? Icons.favorite : Icons.favorite_border,
              iconColor: favorite ? AppColors.brand : AppColors.ink,
              onTap: () {
                setState(() => favorite = !favorite);
                widget.onFavoriteChanged?.call(favorite);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    duration: const Duration(milliseconds: 900),
                    content: Text(
                      favorite
                          ? 'Saved to your trips'
                          : 'Removed from saved trips',
                    ),
                  ),
                );
              },
            ),
          ] else
            const SizedBox(width: 36),
        ],
      ),
    );
  }

  Widget _circle({
    required IconData icon,
    required VoidCallback onTap,
    Color iconColor = AppColors.ink,
  }) {
    return Material(
      color: widget.transparent
          ? Colors.white.withValues(alpha: .92)
          : AppColors.secondary,
      borderRadius: BorderRadius.circular(99),
      elevation: widget.transparent ? 1 : 0,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(99),
        child: SizedBox.square(
          dimension: 36,
          child: Icon(icon, size: 20, color: iconColor),
        ),
      ),
    );
  }

  void _showShareSheet() {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      builder: (sheetContext) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Share with friends',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 14),
              for (final item in const [
                (Icons.link, 'Copy link'),
                (Icons.message_outlined, 'Send in a message'),
                (Icons.more_horiz, 'More options'),
              ])
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: AppColors.secondary,
                    child: Icon(item.$1, color: AppColors.ink),
                  ),
                  title: Text(item.$2),
                  onTap: () {
                    Navigator.pop(sheetContext);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${item.$2} selected')),
                    );
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }
}
