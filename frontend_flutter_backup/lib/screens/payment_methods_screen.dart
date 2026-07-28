import 'package:flutter/material.dart';

import '../core/constants/app_colors.dart';
import '../widgets/app_back_header.dart';

class PaymentMethodsScreen extends StatefulWidget {
  const PaymentMethodsScreen({super.key});

  @override
  State<PaymentMethodsScreen> createState() => _PaymentMethodsScreenState();
}

class _PaymentMethodsScreenState extends State<PaymentMethodsScreen> {
  final cards = <PaymentCard>[
    const PaymentCard(brand: 'Visa', last4: '4242', exp: '08/27'),
    const PaymentCard(brand: 'Mastercard', last4: '5518', exp: '11/26'),
  ];
  int selected = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AppBackHeader(title: 'Payment Methods', actions: false),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  for (var index = 0; index < cards.length; index++) ...[
                    _PaymentCardView(
                      card: cards[index],
                      selected: selected == index,
                      dark: index != 0,
                      onTap: () => setState(() => selected = index),
                    ),
                    const SizedBox(height: 12),
                  ],
                  if (cards.length > 1)
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          cards.removeAt(selected);
                          selected = 0;
                        });
                      },
                      icon: const Icon(Icons.delete_outline),
                      label: const Text('Remove selected card'),
                      style: TextButton.styleFrom(foregroundColor: Colors.red),
                    ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () {
                      setState(() {
                        cards.add(
                          const PaymentCard(
                            brand: 'New Card',
                            last4: '0000',
                            exp: '01/30',
                          ),
                        );
                      });
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add payment method'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.ink,
                      minimumSize: const Size.fromHeight(58),
                      side: const BorderSide(color: AppColors.border),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class PaymentCard {
  const PaymentCard({
    required this.brand,
    required this.last4,
    required this.exp,
  });

  final String brand;
  final String last4;
  final String exp;
}

class _PaymentCardView extends StatelessWidget {
  const _PaymentCardView({
    required this.card,
    required this.selected,
    required this.dark,
    required this.onTap,
  });

  final PaymentCard card;
  final bool selected;
  final bool dark;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = dark
        ? const [Color(0xFF404040), Color(0xFF171717)]
        : const [Color(0xFF6366F1), Color(0xFF2563EB)];
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 170,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: colors),
          borderRadius: BorderRadius.circular(18),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 10,
              offset: Offset(0, 5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.credit_card, color: Colors.white, size: 27),
                const Spacer(),
                if (selected)
                  Container(
                    width: 25,
                    height: 25,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .23),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.check,
                      color: Colors.white,
                      size: 15,
                    ),
                  ),
              ],
            ),
            const Spacer(),
            Text(
              '•••• •••• •••• ${card.last4}',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 17,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(card.brand, style: const TextStyle(color: Colors.white70)),
                const Spacer(),
                Text(
                  'Exp ${card.exp}',
                  style: const TextStyle(color: Colors.white70),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
