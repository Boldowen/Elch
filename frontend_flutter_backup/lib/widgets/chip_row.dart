import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class ChipRow extends StatelessWidget {
  const ChipRow({
    super.key,
    required this.items,
    this.activeIndex = 0,
    this.onChanged,
  });
  final List<String> items;
  final int activeIndex;
  final ValueChanged<int>? onChanged;
  @override
  Widget build(BuildContext context) => SizedBox(
    height: 38,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(width: 8),
      itemBuilder: (context, i) {
        final active = i == activeIndex;
        return ChoiceChip(
          label: Text(items[i]),
          selected: active,
          onSelected: (_) => onChanged?.call(i),
          showCheckmark: false,
          labelStyle: TextStyle(
            fontSize: 14,
            color: active ? Colors.white : AppColors.ink,
          ),
          selectedColor: AppColors.ink,
          backgroundColor: Colors.white,
          side: BorderSide(color: active ? AppColors.ink : AppColors.border),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(99),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 8),
        );
      },
    ),
  );
}

class AppTag extends StatelessWidget {
  const AppTag(this.label, {super.key});
  final String label;
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
    decoration: BoxDecoration(
      color: AppColors.secondary,
      borderRadius: BorderRadius.circular(99),
    ),
    child: Text(
      label,
      style: const TextStyle(fontSize: 13, color: AppColors.ink),
    ),
  );
}
