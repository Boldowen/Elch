import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/constants/app_colors.dart';
import '../providers/app_providers.dart';

class LanguageSelector extends ConsumerWidget {
  const LanguageSelector({super.key});
  static const labels = {
    AppLanguage.en: ('EN', 'English'),
    AppLanguage.mn: ('MN', 'Монгол'),
    AppLanguage.ru: ('RU', 'Русский'),
    AppLanguage.ko: ('KO', '한국어'),
    AppLanguage.ja: ('JA', '日本語'),
    AppLanguage.zh: ('ZH', '中文'),
    AppLanguage.de: ('DE', 'Deutsch'),
  };
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lang = ref.watch(languageProvider);
    return Material(
      color: Colors.transparent,
      child: PopupMenuButton<AppLanguage>(
        tooltip: 'Select language',
        onSelected: (v) => ref.read(languageProvider.notifier).set(v),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        itemBuilder: (_) => AppLanguage.values
            .map(
              (l) => PopupMenuItem(
                value: l,
                child: Row(
                  children: [
                    SizedBox(
                      width: 28,
                      child: Text(
                        labels[l]!.$1,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.inkSoft,
                        ),
                      ),
                    ),
                    Expanded(child: Text(labels[l]!.$2)),
                    if (l == lang)
                      const Icon(Icons.check, color: AppColors.brand, size: 18),
                  ],
                ),
              ),
            )
            .toList(),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: .93),
            borderRadius: BorderRadius.circular(99),
            border: Border.all(color: AppColors.border),
            boxShadow: const [
              BoxShadow(color: Color(0x16000000), blurRadius: 6),
            ],
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.language, size: 17, color: AppColors.ink),
              const SizedBox(width: 4),
              Text(
                labels[lang]!.$1,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                ),
              ),
              const Icon(
                Icons.keyboard_arrow_down,
                size: 15,
                color: AppColors.inkSoft,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
