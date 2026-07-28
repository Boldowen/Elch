import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../providers/app_providers.dart';
import '../widgets/app_back_header.dart';
import '../widgets/app_button.dart';

class GuideProfileEditScreen extends ConsumerStatefulWidget {
  const GuideProfileEditScreen({super.key});

  @override
  ConsumerState<GuideProfileEditScreen> createState() =>
      _GuideProfileEditScreenState();
}

class _GuideProfileEditScreenState
    extends ConsumerState<GuideProfileEditScreen> {
  final name = TextEditingController(text: 'Bat-Erdene Dorj');
  final location = TextEditingController(text: 'Terelj / Töv');
  final bio = TextEditingController(
    text:
        'Local horse-riding guide creating safe, personal journeys through '
        'Terelj and the central Mongolian steppe.',
  );
  final price = TextEditingController(text: '72');
  final specialties = <String>{'Horse riding', 'Terelj', 'Photography'};
  String country = 'Mongolia';
  bool saving = false;

  @override
  void initState() {
    super.initState();
    name.text =
        ref.read(authControllerProvider).session?.user.name ?? name.text;
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    try {
      final profile = await ref.read(guidesRepositoryProvider).mine();
      if (!mounted) return;
      final user = (profile['user'] as Map?)?.cast<String, dynamic>();
      final remoteExpertise = (profile['expertise'] as List? ?? const [])
          .map((item) => item.toString())
          .toSet();
      setState(() {
        name.text = user?['name']?.toString() ?? name.text;
        country = profile['country']?.toString() ?? country;
        location.text = profile['city']?.toString() ?? location.text;
        bio.text = profile['bio']?.toString() ?? bio.text;
        price.text = profile['price']?.toString() ?? price.text;
        if (remoteExpertise.isNotEmpty) {
          specialties
            ..clear()
            ..addAll(remoteExpertise);
        }
      });
    } catch (_) {
      // Keep the current local values available if the API is offline.
    }
  }

  @override
  void dispose() {
    name.dispose();
    location.dispose();
    bio.dispose();
    price.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (name.text.trim().length < 2 ||
        location.text.trim().isEmpty ||
        bio.text.trim().length < 40 ||
        specialties.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Add a name, location, 40-character bio and specialty.',
          ),
        ),
      );
      return;
    }
    setState(() => saving = true);
    try {
      await ref
          .read(guidesRepositoryProvider)
          .updateProfile(
            name: name.text.trim(),
            country: country,
            city: location.text.trim(),
            bio: bio.text.trim(),
            expertise: specialties.toList(),
            price: price.text.trim().isEmpty ? null : price.text.trim(),
          );
      if (!mounted) return;
      ref.read(authControllerProvider.notifier).updateName(name.text.trim());
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Guide profile updated')));
      context.pop();
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not save the guide profile.')),
      );
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Column(
        children: [
          const AppBackHeader(title: 'Edit guide profile', actions: false),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
              children: [
                const Center(
                  child: Stack(
                    alignment: Alignment.bottomRight,
                    children: [
                      CircleAvatar(
                        radius: 52,
                        backgroundImage: NetworkImage(AppImages.guide3),
                      ),
                      CircleAvatar(
                        radius: 17,
                        backgroundColor: AppColors.brand,
                        child: Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                          size: 17,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                _Field(label: 'Public name', controller: name),
                _Field(label: 'Guide location', controller: location),
                _Field(label: 'Introduction', controller: bio, maxLines: 5),
                _Field(
                  label: 'Daily price',
                  controller: price,
                  keyboardType: TextInputType.number,
                  prefixText: '\$ ',
                ),
                const Text(
                  'Specialties',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 9),
                Wrap(
                  spacing: 7,
                  runSpacing: 7,
                  children: [
                    for (final item in const [
                      'Horse riding',
                      'Terelj',
                      'Photography',
                      'History',
                      'Food',
                      'Hiking',
                    ])
                      FilterChip(
                        label: Text(item),
                        selected: specialties.contains(item),
                        showCheckmark: false,
                        selectedColor: AppColors.brand,
                        labelStyle: TextStyle(
                          color: specialties.contains(item)
                              ? Colors.white
                              : AppColors.ink,
                        ),
                        onSelected: (selected) => setState(
                          () => selected
                              ? specialties.add(item)
                              : specialties.remove(item),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 28),
                AppButton(
                  label: 'Save changes',
                  loading: saving,
                  onPressed: _save,
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

class _Field extends StatelessWidget {
  const _Field({
    required this.label,
    required this.controller,
    this.maxLines = 1,
    this.keyboardType,
    this.prefixText,
  });
  final String label;
  final TextEditingController controller;
  final int maxLines;
  final TextInputType? keyboardType;
  final String? prefixText;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 18),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          keyboardType: keyboardType,
          decoration: InputDecoration(prefixText: prefixText),
        ),
      ],
    ),
  );
}
