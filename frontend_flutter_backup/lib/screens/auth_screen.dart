import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/constants/app_colors.dart';
import '../providers/app_providers.dart';
import '../widgets/app_button.dart';
import '../widgets/brand_mark.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key, required this.initialMode});

  final String initialMode;

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();

  bool _hide = true;
  late String mode;

  @override
  void initState() {
    super.initState();
    mode = widget.initialMode;
  }

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_form.currentState!.validate()) return;

    if (mode == 'forgot') {
      await Future<void>.delayed(const Duration(milliseconds: 350));
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Password reset link sent.')),
      );
      setState(() => mode = 'login');
      return;
    }

    final notifier = ref.read(authControllerProvider.notifier);
    final ok = mode == 'register'
        ? await notifier.register(
            _name.text.trim(),
            _email.text.trim(),
            _password.text,
          )
        : await notifier.login(_email.text.trim(), _password.text);

    if (ok && mounted) _finish();
  }

  void _finish() {
    final state = ref.read(authControllerProvider);
    if (state.pendingRole == PendingRole.guide) {
      context.go(
        state.session?.user.isGuide == true
            ? '/guide-dashboard'
            : '/guide-registration',
      );
    } else {
      context.go('/explore');
    }
  }

  Future<void> _oauth(String provider) async {
    final ok = await ref.read(authControllerProvider.notifier).oauth(provider);
    if (ok && mounted) _finish();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authControllerProvider);
    final role = state.pendingRole;
    final isRegister = mode == 'register';
    final isForgot = mode == 'forgot';

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 18, 24, 30),
          children: [
            Row(
              children: [
                IconButton(
                  onPressed: () => context.go('/welcome'),
                  icon: const Icon(Icons.chevron_left),
                ),
                const Spacer(),
                const BrandMark(),
                const Spacer(),
                const SizedBox(width: 48),
              ],
            ),
            const SizedBox(height: 34),
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                role == PendingRole.guide
                    ? Icons.map_outlined
                    : Icons.explore_outlined,
                color: AppColors.brand,
              ),
            ),
            const SizedBox(height: 18),
            Text(
              isForgot
                  ? 'Reset your password'
                  : isRegister
                  ? 'Create your account'
                  : 'Welcome back',
              style: Theme.of(context).textTheme.headlineLarge,
            ),
            const SizedBox(height: 8),
            Text(
              isForgot
                  ? 'Enter your email and we’ll send a secure reset link.'
                  : isRegister
                  ? 'Join VenTour as a ${role.name}.'
                  : 'Log in to continue your VenTour journey.',
              style: const TextStyle(color: AppColors.inkSoft, fontSize: 15),
            ),
            const SizedBox(height: 26),
            Form(
              key: _form,
              child: Column(
                children: [
                  if (isRegister) ...[
                    TextFormField(
                      controller: _name,
                      textInputAction: TextInputAction.next,
                      decoration: const InputDecoration(
                        labelText: 'Full name',
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                      validator: (value) => (value ?? '').trim().length < 2
                          ? 'Enter your full name'
                          : null,
                    ),
                    const SizedBox(height: 12),
                  ],
                  TextFormField(
                    controller: _email,
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(
                      labelText: 'Email address',
                      prefixIcon: Icon(Icons.mail_outline),
                    ),
                    validator: (value) => !(value ?? '').contains('@')
                        ? 'Enter a valid email'
                        : null,
                  ),
                  if (!isForgot) ...[
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _password,
                      obscureText: _hide,
                      onFieldSubmitted: (_) => _submit(),
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(
                          onPressed: () => setState(() => _hide = !_hide),
                          icon: Icon(
                            _hide
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined,
                          ),
                        ),
                      ),
                      validator: (value) => (value ?? '').length < 8
                          ? 'Use at least 8 characters'
                          : null,
                    ),
                  ],
                  if (!isRegister && !isForgot)
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () => setState(() => mode = 'forgot'),
                        child: const Text('Forgot password?'),
                      ),
                    ),
                  if (state.error != null)
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF1F2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        state.error!,
                        style: const TextStyle(
                          color: AppColors.brandDark,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  AppButton(
                    label: isForgot
                        ? 'Send reset link'
                        : isRegister
                        ? 'Create account'
                        : 'Log in',
                    loading: state.loading,
                    onPressed: _submit,
                    icon: isForgot ? Icons.send_outlined : Icons.arrow_forward,
                  ),
                ],
              ),
            ),
            if (!isForgot) ...[
              const SizedBox(height: 22),
              const Row(
                children: [
                  Expanded(child: Divider()),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      'or continue with',
                      style: TextStyle(color: AppColors.inkSoft, fontSize: 12),
                    ),
                  ),
                  Expanded(child: Divider()),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _Social(
                      label: 'Google',
                      icon: Icons.g_mobiledata,
                      onTap: () => _oauth('Google'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _Social(
                      label: 'Apple',
                      icon: Icons.apple,
                      onTap: () => _oauth('Apple'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 22),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    isRegister
                        ? 'Already have an account? '
                        : 'New to VenTour? ',
                    style: const TextStyle(color: AppColors.inkSoft),
                  ),
                  GestureDetector(
                    onTap: () => setState(
                      () => mode = isRegister ? 'login' : 'register',
                    ),
                    child: Text(
                      isRegister ? 'Log in' : 'Create account',
                      style: const TextStyle(
                        color: AppColors.brand,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ],
            if (isForgot)
              TextButton(
                onPressed: () => setState(() => mode = 'login'),
                child: const Text('Back to login'),
              ),
          ],
        ),
      ),
    );
  }
}

class _Social extends StatelessWidget {
  const _Social({required this.label, required this.icon, required this.onTap});

  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 24),
      label: Text(label),
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.ink,
        minimumSize: const Size.fromHeight(50),
        side: const BorderSide(color: AppColors.border),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
    );
  }
}
