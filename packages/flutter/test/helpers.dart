import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

/// Pumps [child] inside a MaterialApp in the trc theme, at a given width.
Future<void> pumpTrc(
  WidgetTester tester,
  Widget child, {
  double width = 800,
  double height = 900,
  bool scroll = true,
  TrcThemeData tokens = const TrcThemeData(),
}) async {
  tester.view.physicalSize = Size(width, height);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    MaterialApp(
      theme: tokens.toMaterialTheme(),
      home: Scaffold(
        body: scroll
            ? SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: child,
              )
            : Padding(padding: const EdgeInsets.all(16), child: child),
      ),
    ),
  );
}

/// Switches the focus highlight to keyboard mode, like after a Tab press.
void useKeyboardFocus() {
  FocusManager.instance.highlightStrategy =
      FocusHighlightStrategy.alwaysTraditional;
  addTearDown(
    () => FocusManager.instance.highlightStrategy =
        FocusHighlightStrategy.automatic,
  );
}
