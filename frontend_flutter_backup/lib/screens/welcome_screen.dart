import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/constants/app_colors.dart';
import '../providers/app_providers.dart';
import '../widgets/brand_mark.dart';

class WelcomeScreen extends ConsumerStatefulWidget {
  const WelcomeScreen({super.key});
  @override
  ConsumerState<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends ConsumerState<WelcomeScreen> {
  void _select(PendingRole role) {
    ref.read(authControllerProvider.notifier).selectRole(role);
    context.go(
      '/auth?mode=${role == PendingRole.traveler ? 'register' : 'login'}&role=${role.name}',
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.introBackground,
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 18, 24, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const BrandMark(dark: true),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Center(child: _InteractiveGlobe()),
                  const SizedBox(height: 22),
                  const Text(
                    'Explore the world\nwith local eyes',
                    style: TextStyle(
                      fontSize: 28,
                      height: 1.15,
                      fontWeight: FontWeight.w600,
                      letterSpacing: -.6,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Discover authentic places and travel with trusted local guides.',
                    style: TextStyle(
                      fontSize: 15,
                      height: 1.45,
                      color: Colors.white.withValues(alpha: .6),
                    ),
                  ),
                ],
              ),
            ),
            Row(
              children: [
                Expanded(
                  child: _RoleCard(
                    icon: Icons.explore_outlined,
                    title: 'Travel',
                    subtitle: 'Find stays, experiences and local guides',
                    accent: true,
                    onTap: () => _select(PendingRole.traveler),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _RoleCard(
                    icon: Icons.map_outlined,
                    title: 'Be a guide',
                    subtitle: 'Share your culture and earn with VenTour',
                    accent: false,
                    onTap: () => _select(PendingRole.guide),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

class _RoleCard extends StatelessWidget {
  const _RoleCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.accent,
    required this.onTap,
  });
  final IconData icon;
  final String title, subtitle;
  final bool accent;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Material(
    color: accent ? AppColors.introAccent : AppColors.introPanel,
    borderRadius: BorderRadius.circular(24),
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        height: 194,
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          border: accent
              ? null
              : Border.all(color: Colors.white.withValues(alpha: .12)),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: accent ? .20 : .10),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: Colors.white, size: 22),
            ),
            const SizedBox(height: 13),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 7),
            Expanded(
              child: Text(
                subtitle,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: accent ? .84 : .55),
                  fontSize: 13,
                  height: 1.35,
                ),
              ),
            ),
            Row(
              children: [
                Text(
                  'Continue',
                  style: TextStyle(
                    color: accent ? Colors.white : AppColors.introAccent,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 4),
                Icon(
                  Icons.arrow_forward,
                  size: 15,
                  color: accent ? Colors.white : AppColors.introAccent,
                ),
              ],
            ),
          ],
        ),
      ),
    ),
  );
}

class _InteractiveGlobe extends StatefulWidget {
  const _InteractiveGlobe();

  @override
  State<_InteractiveGlobe> createState() => _InteractiveGlobeState();
}

class _InteractiveGlobeState extends State<_InteractiveGlobe>
    with SingleTickerProviderStateMixin {
  late final AnimationController controller;
  double centerLongitude = 103;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 42),
    )..repeat();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  void _pauseRotation(DragStartDetails details) {
    centerLongitude = (centerLongitude + controller.value * 360) % 360;
    controller
      ..stop()
      ..reset();
  }

  void _drag(DragUpdateDetails details) {
    setState(() {
      centerLongitude = (centerLongitude - details.delta.dx * .75 + 360) % 360;
    });
  }

  void _resumeRotation(DragEndDetails details) => controller.repeat();

  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Interactive world globe with Mongolia highlighted',
    child: GestureDetector(
      onHorizontalDragStart: _pauseRotation,
      onHorizontalDragUpdate: _drag,
      onHorizontalDragEnd: _resumeRotation,
      child: AnimatedBuilder(
        animation: controller,
        builder: (context, child) => CustomPaint(
          size: const Size(244, 244),
          painter: _GlobePainter(
            centerLongitude: centerLongitude + controller.value * 360,
          ),
        ),
      ),
    ),
  );
}

class _GlobePainter extends CustomPainter {
  const _GlobePainter({required this.centerLongitude});

  final double centerLongitude;

  static const continents = <List<Offset>>[
    // Asia and Europe
    [
      Offset(-10, 36),
      Offset(3, 44),
      Offset(18, 60),
      Offset(42, 70),
      Offset(68, 77),
      Offset(98, 77),
      Offset(132, 68),
      Offset(165, 62),
      Offset(177, 50),
      Offset(154, 43),
      Offset(142, 34),
      Offset(122, 24),
      Offset(111, 6),
      Offset(94, 8),
      Offset(79, 20),
      Offset(61, 25),
      Offset(45, 38),
      Offset(29, 36),
      Offset(15, 42),
      Offset(-10, 36),
    ],
    // Africa
    [
      Offset(-17, 35),
      Offset(8, 37),
      Offset(32, 31),
      Offset(51, 12),
      Offset(43, -12),
      Offset(31, -34),
      Offset(14, -35),
      Offset(1, -20),
      Offset(-10, 4),
      Offset(-17, 22),
      Offset(-17, 35),
    ],
    // North America
    [
      Offset(-168, 70),
      Offset(-140, 72),
      Offset(-120, 58),
      Offset(-96, 50),
      Offset(-82, 25),
      Offset(-102, 17),
      Offset(-117, 32),
      Offset(-130, 48),
      Offset(-153, 57),
      Offset(-168, 70),
    ],
    // South America
    [
      Offset(-81, 12),
      Offset(-55, 9),
      Offset(-35, -7),
      Offset(-47, -29),
      Offset(-66, -55),
      Offset(-75, -38),
      Offset(-81, -8),
      Offset(-81, 12),
    ],
    // Australia
    [
      Offset(112, -12),
      Offset(132, -10),
      Offset(153, -25),
      Offset(146, -42),
      Offset(122, -38),
      Offset(112, -24),
      Offset(112, -12),
    ],
    // Greenland
    [
      Offset(-73, 82),
      Offset(-21, 81),
      Offset(-18, 61),
      Offset(-45, 59),
      Offset(-64, 69),
      Offset(-73, 82),
    ],
  ];

  static const mongolia = [
    Offset(87.7, 49.2),
    Offset(96, 52.1),
    Offset(108, 49.8),
    Offset(119.9, 50),
    Offset(116, 45.2),
    Offset(105, 41.6),
    Offset(96, 42.4),
    Offset(87.7, 49.2),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.shortestSide * .43;
    final glow = Paint()
      ..color = AppColors.introAccent.withValues(alpha: .16)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 28);
    canvas.drawCircle(center, radius + 8, glow);

    canvas.drawCircle(center, radius, Paint()..color = const Color(0xFF111F2B));
    canvas.save();
    canvas.clipPath(
      Path()..addOval(Rect.fromCircle(center: center, radius: radius)),
    );

    final grid = Paint()
      ..color = Colors.white.withValues(alpha: .12)
      ..style = PaintingStyle.stroke
      ..strokeWidth = .8;
    for (final scale in const [.34, .67]) {
      canvas.drawOval(
        Rect.fromCenter(
          center: center,
          width: radius * 2 * scale,
          height: radius * 2,
        ),
        grid,
      );
      canvas.drawOval(
        Rect.fromCenter(
          center: center,
          width: radius * 2,
          height: radius * 2 * scale,
        ),
        grid,
      );
    }

    final land = Paint()
      ..color = const Color(0xFF3B6159)
      ..style = PaintingStyle.fill;
    final coast = Paint()
      ..color = const Color(0xFF80A98D).withValues(alpha: .72)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    for (final continent in continents) {
      final path = _projectPolygon(continent, center, radius);
      if (path != null) {
        canvas
          ..drawPath(path, land)
          ..drawPath(path, coast);
      }
    }

    final mongoliaPath = _projectPolygon(mongolia, center, radius);
    if (mongoliaPath != null) {
      canvas.drawPath(mongoliaPath, Paint()..color = AppColors.introAccent);
      final pin = _project(const Offset(103.8, 46.8), center, radius);
      if (pin != null) {
        canvas.drawCircle(
          pin,
          7,
          Paint()..color = AppColors.introAccent.withValues(alpha: .28),
        );
        canvas.drawCircle(pin, 2.8, Paint()..color = Colors.white);
        final label = TextPainter(
          text: const TextSpan(
            text: 'MONGOLIA',
            style: TextStyle(
              color: Colors.white,
              fontSize: 8,
              fontWeight: FontWeight.w700,
              letterSpacing: .8,
            ),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        label.paint(canvas, pin + const Offset(8, -13));
      }
    }
    canvas.restore();

    canvas.drawCircle(
      center,
      radius,
      Paint()
        ..color = AppColors.introAccent.withValues(alpha: .8)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5,
    );
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius - 10),
      -.9,
      1.75,
      false,
      Paint()
        ..color = Colors.white.withValues(alpha: .09)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 10,
    );
  }

  Offset? _project(Offset lonLat, Offset center, double radius) {
    final lat = lonLat.dy * math.pi / 180;
    final delta = (lonLat.dx - centerLongitude) * math.pi / 180;
    final depth = math.cos(lat) * math.cos(delta);
    if (depth < .02) return null;
    return Offset(
      center.dx + radius * math.cos(lat) * math.sin(delta),
      center.dy - radius * math.sin(lat),
    );
  }

  Path? _projectPolygon(List<Offset> points, Offset center, double radius) {
    final projected = points
        .map((point) => _project(point, center, radius))
        .toList();
    if (projected.whereType<Offset>().length < 3) return null;
    final path = Path();
    var started = false;
    for (final point in projected) {
      if (point == null) {
        started = false;
      } else if (!started) {
        path.moveTo(point.dx, point.dy);
        started = true;
      } else {
        path.lineTo(point.dx, point.dy);
      }
    }
    path.close();
    return path;
  }

  @override
  bool shouldRepaint(covariant _GlobePainter oldDelegate) =>
      oldDelegate.centerLongitude != centerLongitude;
}
