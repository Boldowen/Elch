import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../core/constants/app_images.dart';
import '../providers/app_providers.dart';
import '../widgets/app_back_header.dart';
import '../widgets/app_button.dart';

class GuideRegistrationScreen extends ConsumerStatefulWidget {
  const GuideRegistrationScreen({super.key});

  @override
  ConsumerState<GuideRegistrationScreen> createState() =>
      _GuideRegistrationScreenState();
}

class _GuideRegistrationScreenState
    extends ConsumerState<GuideRegistrationScreen> {
  final name = TextEditingController();
  final country = TextEditingController(text: 'Mongolia');
  final city = TextEditingController();
  final bio = TextEditingController();
  final price = TextEditingController();
  final referenceContact = TextEditingController();

  final languages = <String>{'Mongolian', 'English'};
  final expertise = <String>{};
  final days = <String>{'Mon', 'Wed', 'Fri', 'Sat'};

  String photo = AppImages.guide3;
  int experience = 1;
  int step = 0;
  bool verified = false;
  bool backgroundConsent = false;
  bool codeOfConductAccepted = false;
  bool submitting = false;
  final assessmentAnswers = List<int?>.filled(5, null);

  static const allLanguages = [
    'Mongolian',
    'English',
    'Russian',
    'German',
    'French',
    'Japanese',
    'Korean',
    'Chinese',
  ];
  static const allExpertise = [
    'Gobi desert',
    'Horse riding',
    'Photography',
    'Hiking',
    'History',
    'Food',
    'City',
    'Eagle hunting',
  ];
  static const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  static const assessment = <({String question, List<String> options, int correct})>[
    (
      question:
          'A traveler wants to enter a family ger without asking. What do you do?',
      options: [
        'Let them decide',
        'Ask the host first and explain local etiquette',
        'Take a photo instead',
      ],
      correct: 1,
    ),
    (
      question:
          'Weather makes the planned route unsafe. What is the best response?',
      options: [
        'Continue to avoid disappointment',
        'Cancel without explanation',
        'Explain the risk and offer a safer alternative',
      ],
      correct: 2,
    ),
    (
      question: 'Which information must remain private?',
      options: [
        'Traveler contact and identity details',
        'Public attraction opening hours',
        'Published trail conditions',
      ],
      correct: 0,
    ),
    (
      question: 'A traveler is injured during a hike. What comes first?',
      options: [
        'Finish the itinerary',
        'Secure the area, assess them and contact help',
        'Post an update to the group',
      ],
      correct: 1,
    ),
    (
      question: 'How should prices and extra costs be handled?',
      options: [
        'Agree clearly before the trip',
        'Add them after the trip',
        'Only discuss them if asked',
      ],
      correct: 0,
    ),
  ];

  @override
  void dispose() {
    name.dispose();
    country.dispose();
    city.dispose();
    bio.dispose();
    price.dispose();
    referenceContact.dispose();
    super.dispose();
  }

  bool get profileValid =>
      name.text.trim().length >= 2 &&
      country.text.trim().isNotEmpty &&
      city.text.trim().isNotEmpty;

  bool get expertiseValid =>
      languages.isNotEmpty &&
      experience >= 1 &&
      expertise.length >= 2 &&
      bio.text.trim().length >= 80;

  int get assessmentScore {
    var correct = 0;
    for (var index = 0; index < assessment.length; index++) {
      if (assessmentAnswers[index] == assessment[index].correct) correct++;
    }
    return (correct / assessment.length * 100).round();
  }

  bool get assessmentValid =>
      assessmentAnswers.every((answer) => answer != null) &&
      assessmentScore >= 80;

  bool get verificationValid =>
      verified &&
      backgroundConsent &&
      codeOfConductAccepted &&
      referenceContact.text.trim().length >= 6;

  void _next() {
    final invalidCurrentStep =
        (step == 0 && !profileValid) ||
        (step == 1 && !expertiseValid) ||
        (step == 2 && !assessmentValid) ||
        (step == 3 && !verificationValid);
    if (invalidCurrentStep) {
      setState(() {});
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Complete this stage and pass the assessment before continuing.',
          ),
        ),
      );
      return;
    }
    setState(() => step += 1);
  }

  Future<void> _submit() async {
    setState(() => submitting = true);
    try {
      final normalizedPrice = price.text.trim().isEmpty
          ? null
          : price.text.trim();
      await ref
          .read(guidesRepositoryProvider)
          .apply(
            country: country.text.trim(),
            city: city.text.trim(),
            bio: bio.text.trim(),
            experienceYears: experience,
            languages: languages.toList(),
            expertise: expertise.toList(),
            availability: days.toList(),
            price: normalizedPrice,
            verified: verified,
            assessmentScore: assessmentScore,
            referenceContact: referenceContact.text.trim(),
            codeOfConductAccepted: codeOfConductAccepted,
          );
      ref.read(authControllerProvider.notifier).becomeGuide();
      if (!mounted) return;
      context.go('/guide-dashboard');
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Could not submit the application: '
            '${error.toString().replaceFirst('DioException [bad response]: ', '')}',
          ),
        ),
      );
    } finally {
      if (mounted) setState(() => submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AppBackHeader(title: 'Guide Application', actions: false),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  for (var index = 0; index < 5; index++)
                    Expanded(
                      child: Container(
                        height: 4,
                        margin: EdgeInsets.only(right: index == 4 ? 0 : 6),
                        decoration: BoxDecoration(
                          color: index <= step
                              ? AppColors.brand
                              : AppColors.secondary,
                          borderRadius: BorderRadius.circular(9),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 260),
                child: ListView(
                  key: ValueKey(step),
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                  children: switch (step) {
                    0 => _profileStep(context),
                    1 => _expertiseStep(context),
                    2 => _assessmentStep(context),
                    3 => _verificationStep(context),
                    _ => _reviewStep(context),
                  },
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: Row(
                children: [
                  if (step > 0) ...[
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => setState(() => step -= 1),
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(0, 52),
                          foregroundColor: AppColors.ink,
                          side: const BorderSide(color: AppColors.border),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: const Text('Back'),
                      ),
                    ),
                    const SizedBox(width: 10),
                  ],
                  Expanded(
                    flex: 2,
                    child: AppButton(
                      label: step == 4 ? 'Submit application' : 'Continue',
                      loading: submitting,
                      onPressed: step == 4 ? _submit : _next,
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

  List<Widget> _profileStep(BuildContext context) {
    return [
      Text(
        'Tell us about yourself',
        style: Theme.of(context).textTheme.headlineMedium,
      ),
      const SizedBox(height: 6),
      const Text(
        'Create a trusted profile that travelers can understand at a glance.',
        style: TextStyle(color: AppColors.inkSoft),
      ),
      const SizedBox(height: 24),
      _section(
        'Profile photo',
        'Choose a preset or upload your own.',
        Wrap(
          spacing: 10,
          children: [
            for (final image in AppImages.valuesForGuides.take(4))
              GestureDetector(
                onTap: () => setState(() => photo = image),
                child: Container(
                  width: 58,
                  height: 58,
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: photo == image
                          ? AppColors.brand
                          : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: CircleAvatar(backgroundImage: NetworkImage(image)),
                ),
              ),
          ],
        ),
      ),
      _section(
        'Full name',
        null,
        TextField(
          controller: name,
          onChanged: (_) => setState(() {}),
          decoration: const InputDecoration(hintText: 'e.g. Bat-Erdene Dorj'),
        ),
      ),
      _section(
        'Location',
        null,
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: country,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(hintText: 'Country'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextField(
                controller: city,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(hintText: 'City'),
              ),
            ),
          ],
        ),
      ),
      if (!profileValid)
        const _Notice('Full name, country and city are required.'),
    ];
  }

  List<Widget> _expertiseStep(BuildContext context) {
    return [
      Text(
        'Experience & expertise',
        style: Theme.of(context).textTheme.headlineMedium,
      ),
      const SizedBox(height: 6),
      const Text(
        'This information helps travelers find the right local expert.',
        style: TextStyle(color: AppColors.inkSoft),
      ),
      const SizedBox(height: 24),
      _section(
        'Languages spoken',
        'Select all you speak.',
        Wrap(
          spacing: 7,
          runSpacing: 7,
          children: [
            for (final language in allLanguages)
              FilterChip(
                label: Text(language),
                selected: languages.contains(language),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      languages.add(language);
                    } else {
                      languages.remove(language);
                    }
                  });
                },
                showCheckmark: false,
                selectedColor: AppColors.ink,
                labelStyle: TextStyle(
                  color: languages.contains(language)
                      ? Colors.white
                      : AppColors.ink,
                ),
              ),
          ],
        ),
      ),
      _section(
        'Years of experience',
        null,
        Row(
          children: [
            IconButton.filledTonal(
              onPressed: () {
                setState(() {
                  if (experience > 0) experience--;
                });
              },
              icon: const Icon(Icons.remove),
            ),
            Container(
              width: 82,
              alignment: Alignment.center,
              child: Text(
                '$experience years',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            IconButton.filled(
              onPressed: () => setState(() => experience += 1),
              icon: const Icon(Icons.add),
            ),
          ],
        ),
      ),
      _section(
        'Areas of expertise',
        'Pick at least two.',
        Wrap(
          spacing: 7,
          runSpacing: 7,
          children: [
            for (final item in allExpertise)
              FilterChip(
                label: Text(item),
                selected: expertise.contains(item),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      expertise.add(item);
                    } else {
                      expertise.remove(item);
                    }
                  });
                },
                showCheckmark: false,
                selectedColor: AppColors.brand,
                labelStyle: TextStyle(
                  color: expertise.contains(item)
                      ? Colors.white
                      : AppColors.ink,
                ),
              ),
          ],
        ),
      ),
      _section(
        'Short introduction',
        'At least 80 characters.',
        TextField(
          controller: bio,
          onChanged: (_) => setState(() {}),
          maxLines: 5,
          decoration: InputDecoration(
            hintText:
                'Tell travelers about yourself, your region and what makes '
                'your tours special...',
            helperText: '${bio.text.trim().length}/80 characters',
          ),
        ),
      ),
      _section(
        'Availability schedule',
        'Which days can you guide?',
        Wrap(
          spacing: 7,
          runSpacing: 7,
          children: [
            for (final day in allDays)
              FilterChip(
                label: Text(day),
                selected: days.contains(day),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      days.add(day);
                    } else {
                      days.remove(day);
                    }
                  });
                },
                showCheckmark: false,
                selectedColor: AppColors.brand,
                labelStyle: TextStyle(
                  color: days.contains(day) ? Colors.white : AppColors.ink,
                ),
              ),
          ],
        ),
      ),
      _section(
        'Pricing',
        'Optional — you can set this later.',
        TextField(
          controller: price,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            prefixText: '\$ ',
            hintText: '65 per day',
          ),
        ),
      ),
      if (!expertiseValid)
        const _Notice(
          'Add one language, 1+ year experience, two specialties and an '
          '80-character introduction.',
        ),
    ];
  }

  List<Widget> _assessmentStep(BuildContext context) {
    final answered = assessmentAnswers.whereType<int>().length;
    return [
      Text(
        'Safety & local knowledge',
        style: Theme.of(context).textTheme.headlineMedium,
      ),
      const SizedBox(height: 6),
      const Text(
        'Pass this short assessment with at least 80%. You can change an '
        'answer before continuing.',
        style: TextStyle(color: AppColors.inkSoft),
      ),
      const SizedBox(height: 18),
      Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.secondary,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            const Icon(Icons.fact_check_outlined, color: AppColors.brand),
            const SizedBox(width: 10),
            Expanded(child: Text('$answered of ${assessment.length} answered')),
            Text(
              '$assessmentScore%',
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
      const SizedBox(height: 18),
      for (final entry in assessment.indexed)
        Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.border),
            borderRadius: BorderRadius.circular(18),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${entry.$1 + 1}. ${entry.$2.question}',
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  height: 1.35,
                ),
              ),
              const SizedBox(height: 12),
              RadioGroup<int>(
                groupValue: assessmentAnswers[entry.$1],
                onChanged: (value) =>
                    setState(() => assessmentAnswers[entry.$1] = value),
                child: Column(
                  children: [
                    for (final option in entry.$2.options.indexed)
                      RadioListTile<int>(
                        contentPadding: EdgeInsets.zero,
                        dense: true,
                        title: Text(
                          option.$2,
                          style: const TextStyle(fontSize: 14),
                        ),
                        value: option.$1,
                        activeColor: AppColors.brand,
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      if (answered == assessment.length && !assessmentValid)
        const _Notice(
          'Your score is below 80%. Review the safety-first answers and try again.',
        ),
    ];
  }

  List<Widget> _verificationStep(BuildContext context) {
    return [
      Text(
        'Trust & verification',
        style: Theme.of(context).textTheme.headlineMedium,
      ),
      const SizedBox(height: 6),
      const Text(
        'These checks protect both travelers and local guides.',
        style: TextStyle(color: AppColors.inkSoft),
      ),
      const SizedBox(height: 22),
      _section(
        'Identity document',
        'A government-issued ID is required for guide approval.',
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: Text(
            verified ? 'Document ready for review' : 'Upload identity document',
          ),
          subtitle: const Text('Stored securely and never shown publicly.'),
          value: verified,
          onChanged: (value) => setState(() => verified = value),
          activeThumbColor: AppColors.brand,
        ),
      ),
      _section(
        'Reference contact',
        'Add a phone number or email for a professional or community reference.',
        TextField(
          controller: referenceContact,
          onChanged: (_) => setState(() {}),
          keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(
            hintText: 'reference@example.com or +976…',
          ),
        ),
      ),
      CheckboxListTile(
        contentPadding: EdgeInsets.zero,
        value: backgroundConsent,
        activeColor: AppColors.brand,
        onChanged: (value) =>
            setState(() => backgroundConsent = value ?? false),
        title: const Text('I consent to identity and reference checks'),
        subtitle: const Text('Required before accepting paid guide bookings.'),
      ),
      CheckboxListTile(
        contentPadding: EdgeInsets.zero,
        value: codeOfConductAccepted,
        activeColor: AppColors.brand,
        onChanged: (value) =>
            setState(() => codeOfConductAccepted = value ?? false),
        title: const Text('I accept the VenTour guide code of conduct'),
        subtitle: const Text(
          'Respect, transparent pricing, traveler privacy and safety come first.',
        ),
      ),
      const SizedBox(height: 10),
      if (!verificationValid)
        const _Notice(
          'Upload ID, add a valid reference and accept both verification agreements.',
        ),
    ];
  }

  List<Widget> _reviewStep(BuildContext context) {
    return [
      Text(
        'Review your application',
        style: Theme.of(context).textTheme.headlineMedium,
      ),
      const SizedBox(height: 6),
      const Text(
        'Check your details before submitting for verification.',
        style: TextStyle(color: AppColors.inkSoft),
      ),
      const SizedBox(height: 22),
      Center(
        child: CircleAvatar(radius: 48, backgroundImage: NetworkImage(photo)),
      ),
      const SizedBox(height: 12),
      Center(
        child: Text(
          name.text.trim(),
          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
        ),
      ),
      Center(
        child: Text(
          '${city.text.trim()}, ${country.text.trim()}',
          style: const TextStyle(color: AppColors.inkSoft),
        ),
      ),
      const SizedBox(height: 22),
      _ReviewRow(Icons.language, 'Languages', languages.join(', ')),
      _ReviewRow(
        Icons.workspace_premium_outlined,
        'Expertise',
        expertise.join(', '),
      ),
      _ReviewRow(Icons.schedule, 'Experience', '$experience years'),
      _ReviewRow(
        Icons.calendar_month_outlined,
        'Availability',
        days.join(', '),
      ),
      _ReviewRow(
        Icons.verified_user_outlined,
        'Verification',
        verified ? 'Document uploaded' : 'Not added',
      ),
      _ReviewRow(
        Icons.fact_check_outlined,
        'Assessment',
        '$assessmentScore% · Passed',
      ),
      _ReviewRow(
        Icons.contact_phone_outlined,
        'Reference',
        referenceContact.text.trim(),
      ),
      const SizedBox(height: 16),
      Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.successSoft,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.check_circle_outline, color: AppColors.success),
            SizedBox(width: 9),
            Expanded(
              child: Text(
                'Your profile meets the guide requirements. Your verified '
                'guide workspace will be activated after submission.',
                style: TextStyle(color: Color(0xFF065F46), height: 1.4),
              ),
            ),
          ],
        ),
      ),
    ];
  }

  Widget _section(String title, String? hint, Widget child) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          if (hint != null) ...[
            const SizedBox(height: 3),
            Text(
              hint,
              style: const TextStyle(color: AppColors.inkSoft, fontSize: 13),
            ),
          ],
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

class _Notice extends StatelessWidget {
  const _Notice(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.warningSoft,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: AppColors.warning, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(color: Color(0xFF92400E), fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}

class _ReviewRow extends StatelessWidget {
  const _ReviewRow(this.icon, this.label, this.value);

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: AppColors.inkSoft),
          const SizedBox(width: 10),
          SizedBox(
            width: 90,
            child: Text(
              label,
              style: const TextStyle(color: AppColors.inkSoft),
            ),
          ),
          Expanded(
            child: Text(
              value.isEmpty ? 'Not provided' : value,
              textAlign: TextAlign.right,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }
}
