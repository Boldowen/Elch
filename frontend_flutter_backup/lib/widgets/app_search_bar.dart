import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class AppSearchBar extends StatelessWidget {
  const AppSearchBar({
    super.key,
    required this.placeholder,
    this.onFilter,
    this.controller,
    this.onChanged,
  });
  final String placeholder;
  final VoidCallback? onFilter;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(
        child: Container(
          height: 46,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(99),
            border: Border.all(color: AppColors.border),
            boxShadow: const [
              BoxShadow(
                color: Color(0x0A000000),
                blurRadius: 8,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: TextField(
            controller: controller,
            onChanged: onChanged,
            decoration: InputDecoration(
              prefixIcon: const Icon(
                Icons.search,
                size: 20,
                color: AppColors.inkSoft,
              ),
              hintText: placeholder,
              hintStyle: const TextStyle(
                fontSize: 14,
                color: AppColors.inkSoft,
              ),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              filled: false,
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
          ),
        ),
      ),
      if (onFilter != null) ...[
        const SizedBox(width: 8),
        Material(
          color: Colors.white,
          elevation: 1,
          shadowColor: Colors.black12,
          borderRadius: BorderRadius.circular(99),
          child: InkWell(
            onTap: onFilter,
            borderRadius: BorderRadius.circular(99),
            child: Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border),
                borderRadius: BorderRadius.circular(99),
              ),
              child: const Icon(Icons.tune, size: 19, color: AppColors.ink),
            ),
          ),
        ),
      ],
    ],
  );
}
