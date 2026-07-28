import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../widgets/app_back_header.dart';

class HelpCenterScreen extends StatefulWidget {
  const HelpCenterScreen({super.key});

  @override
  State<HelpCenterScreen> createState() => _HelpCenterScreenState();
}

class _HelpCenterScreenState extends State<HelpCenterScreen> {
  final search = TextEditingController();

  static const faqs = <Faq>[
    Faq(
      'How do I book a local guide?',
      "Open a guide's profile, choose a tour package or dates, then tap "
          "Book guide. You'll receive a confirmation in your Inbox once the "
          'guide accepts.',
    ),
    Faq(
      'Can I cancel or change a reservation?',
      'Go to Trips, open the booking and choose Manage. Free cancellation '
          'applies up to 48 hours before your start date on most stays.',
    ),
    Faq(
      'Are all guides verified?',
      'Every guide is identity-verified and background checked before '
          'appearing in VenTour, and shows real traveller reviews.',
    ),
    Faq(
      'What payment methods are accepted?',
      'We accept Visa, Mastercard and most major cards. You can manage cards '
          'under Profile → Payment methods.',
    ),
    Faq(
      'Is VenTour available offline?',
      'Your saved trips and guide contacts are cached for offline access once '
          'opened, so you can reach them without signal on the steppe.',
    ),
  ];

  @override
  void dispose() {
    search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = search.text.trim().toLowerCase();
    final visible = faqs
        .where(
          (faq) =>
              query.isEmpty ||
              faq.question.toLowerCase().contains(query) ||
              faq.answer.toLowerCase().contains(query),
        )
        .toList();

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AppBackHeader(title: 'Help Center', actions: false),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  TextField(
                    controller: search,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: 'Search help articles...',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: query.isEmpty
                          ? null
                          : IconButton(
                              onPressed: () {
                                search.clear();
                                setState(() {});
                              },
                              icon: const Icon(Icons.close),
                            ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(99),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Frequently asked',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
                  ),
                  if (visible.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 36),
                      child: Column(
                        children: [
                          Icon(
                            Icons.search_off,
                            size: 40,
                            color: AppColors.inkSoft,
                          ),
                          SizedBox(height: 8),
                          Text(
                            'No help articles found',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    )
                  else
                    for (final faq in visible)
                      ExpansionTile(
                        tilePadding: EdgeInsets.zero,
                        title: Text(
                          faq.question,
                          style: const TextStyle(fontSize: 15),
                        ),
                        childrenPadding: const EdgeInsets.only(bottom: 14),
                        children: [
                          Text(
                            faq.answer,
                            style: const TextStyle(
                              color: AppColors.inkSoft,
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                  const SizedBox(height: 20),
                  const Text(
                    'Still need help?',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _Help(
                          icon: Icons.chat_bubble_outline,
                          label: 'Live chat',
                          onTap: () => context.push('/chat/c1'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _Help(
                          icon: Icons.phone_outlined,
                          label: 'Call support',
                          onTap: () => _callDialog(context),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _callDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('VenTour support'),
        content: const Text(
          'Support is available every day from 08:00 to 22:00.\n\n'
          '+976 7700 2026',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Close'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Calling VenTour support…')),
              );
            },
            child: const Text('Call'),
          ),
        ],
      ),
    );
  }
}

class Faq {
  const Faq(this.question, this.answer);

  final String question;
  final String answer;
}

class _Help extends StatelessWidget {
  const _Help({required this.icon, required this.label, required this.onTap});

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.brand.withValues(alpha: .1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.brand, size: 20),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}
