import 'package:flutter/material.dart';

import '../core/constants/app_colors.dart';
import '../widgets/app_back_header.dart';

class AccountSettingsScreen extends StatefulWidget {
  const AccountSettingsScreen({super.key});

  @override
  State<AccountSettingsScreen> createState() => _AccountSettingsScreenState();
}

class _AccountSettingsScreenState extends State<AccountSettingsScreen> {
  bool push = true;
  bool email = true;
  String lang = 'EN';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AppBackHeader(title: 'Account Settings', actions: false),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const Text(
                    'Personal information',
                    style: TextStyle(color: AppColors.inkSoft, fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Column(
                      children: [
                        _SettingRow(
                          icon: Icons.person_outline,
                          label: 'Full name',
                          value: 'VenTour Traveler',
                        ),
                        Divider(height: 1, indent: 54),
                        _SettingRow(
                          icon: Icons.mail_outline,
                          label: 'Email',
                          value: 'traveler@ventour.mn',
                        ),
                        Divider(height: 1, indent: 54),
                        _SettingRow(
                          icon: Icons.phone_outlined,
                          label: 'Phone',
                          value: '+976 8811 2233',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 22),
                  const Text(
                    'Preferences',
                    style: TextStyle(color: AppColors.inkSoft, fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        SwitchListTile(
                          value: push,
                          onChanged: (value) => setState(() => push = value),
                          secondary: const Icon(
                            Icons.notifications_outlined,
                            color: AppColors.inkSoft,
                          ),
                          title: const Text('Push notifications'),
                          activeThumbColor: AppColors.brand,
                        ),
                        const Divider(height: 1, indent: 54),
                        SwitchListTile(
                          value: email,
                          onChanged: (value) => setState(() => email = value),
                          secondary: const Icon(
                            Icons.mail_outline,
                            color: AppColors.inkSoft,
                          ),
                          title: const Text('Email updates'),
                          activeThumbColor: AppColors.brand,
                        ),
                        const Divider(height: 1, indent: 54),
                        ListTile(
                          leading: const Icon(
                            Icons.language,
                            color: AppColors.inkSoft,
                          ),
                          title: const Text('Language'),
                          trailing: SegmentedButton<String>(
                            segments: const [
                              ButtonSegment<String>(
                                value: 'EN',
                                label: Text('English'),
                              ),
                              ButtonSegment<String>(
                                value: 'MN',
                                label: Text('Монгол'),
                              ),
                            ],
                            selected: {lang},
                            onSelectionChanged: (selection) {
                              setState(() => lang = selection.first);
                            },
                            style: ButtonStyle(
                              visualDensity: VisualDensity.compact,
                              backgroundColor:
                                  WidgetStateProperty.resolveWith<Color?>(
                                    (states) =>
                                        states.contains(WidgetState.selected)
                                        ? Colors.white
                                        : AppColors.secondary,
                                  ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.successSoft,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Row(
                      children: [
                        Icon(
                          Icons.verified_user_outlined,
                          color: AppColors.success,
                        ),
                        SizedBox(width: 9),
                        Expanded(
                          child: Text(
                            'Your account is verified and secure.',
                            style: TextStyle(
                              color: Color(0xFF065F46),
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ],
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

class _SettingRow extends StatelessWidget {
  const _SettingRow({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.inkSoft),
      title: Text(label),
      subtitle: Text(value, style: const TextStyle(color: AppColors.inkSoft)),
      trailing: const Icon(Icons.chevron_right, color: AppColors.inkSoft),
    );
  }
}
