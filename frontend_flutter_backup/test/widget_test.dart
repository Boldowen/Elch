import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ventour/app.dart';
import 'package:ventour/models/auth_session.dart';
import 'package:ventour/providers/app_providers.dart';
import 'package:ventour/services/local_storage_service.dart';

void main() {
  testWidgets('app renders global language selector inside router overlay', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(393, 873);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          localStorageProvider.overrideWithValue(_FakeLocalStorageService()),
        ],
        child: const VenTourApp(),
      ),
    );

    expect(tester.takeException(), isNull);
    expect(find.text('Explore the world\nwith local eyes'), findsOneWidget);
    expect(find.text('Travel'), findsOneWidget);
    expect(find.text('Be a guide'), findsOneWidget);
    expect(find.text('EN'), findsOneWidget);

    await tester.tap(find.text('EN'));
    await tester.pump(const Duration(milliseconds: 500));

    expect(tester.takeException(), isNull);
    expect(find.text('English'), findsOneWidget);
    expect(find.text('Монгол'), findsOneWidget);
  });
}

class _FakeLocalStorageService extends LocalStorageService {
  @override
  AuthSession? readSession() => null;

  @override
  String? preference(String key) => null;
}
