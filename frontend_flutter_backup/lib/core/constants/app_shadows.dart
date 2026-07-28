import 'package:flutter/material.dart';

abstract final class AppShadows {
  static const subtle = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 2)),
  ];

  static const card = [
    BoxShadow(color: Color(0x12000000), blurRadius: 12, offset: Offset(0, 5)),
  ];
}
