import 'package:flutter/animation.dart';

abstract final class AppDurations {
  static const quick = Duration(milliseconds: 160);
  static const standard = Duration(milliseconds: 260);
  static const routeForward = Duration(milliseconds: 340);
  static const routeReverse = Duration(milliseconds: 280);
  static const imageFade = Duration(milliseconds: 180);
  static const curve = Curves.easeOutCubic;
}
