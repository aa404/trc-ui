import 'dart:ui' show Tristate;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/src/foundation.dart' show TrcTappable;
import 'package:trc_ui/trc_ui.dart';

const _items = [
  TrcBottomNavItem(icon: TrcIcon(TrcGlyph.menu), label: 'Home'),
  TrcBottomNavItem(icon: TrcIcon(TrcGlyph.calendar), label: 'Agenda'),
  TrcBottomNavItem(icon: TrcIcon(TrcGlyph.copy), label: 'Messages', badge: 3),
  TrcBottomNavItem(icon: TrcIcon(TrcGlyph.check), label: 'Tasks', dot: true),
  TrcBottomNavItem(icon: TrcIcon(TrcGlyph.arrowUp), label: 'Profile'),
];

Future<List<int>> pumpNav(
  WidgetTester tester, {
  double width = 400,
  TrcBottomNavStyle style = TrcBottomNavStyle.floating,
  TrcBottomNavLabels labels = TrcBottomNavLabels.always,
  bool glass = false,
  List<TrcBottomNavItem> items = _items,
  Widget? center,
  double textScale = 1,
}) async {
  tester.view.physicalSize = Size(width, 800);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  final taps = <int>[];
  var index = 0;
  await tester.pumpWidget(
    MaterialApp(
      theme: const TrcThemeData().toMaterialTheme(),
      home: MediaQuery(
        data: MediaQueryData(
          size: Size(width, 800),
          textScaler: TextScaler.linear(textScale),
        ),
        child: StatefulBuilder(
          builder: (context, setState) => Scaffold(
            extendBody: true,
            body: ListView(
              children: [for (var i = 0; i < 30; i++) Text('Row $i')],
            ),
            bottomNavigationBar: TrcBottomNav(
              items: items,
              currentIndex: index,
              style: style,
              labels: labels,
              glass: glass,
              centerAction: center,
              onTap: (i) {
                taps.add(i);
                setState(() => index = i);
              },
            ),
          ),
        ),
      ),
    ),
  );
  return taps;
}

void main() {
  testWidgets('floating and bar variants render and change on tap', (
    tester,
  ) async {
    for (final style in TrcBottomNavStyle.values) {
      final taps = await pumpNav(tester, style: style);
      expect(find.text('Agenda'), findsOneWidget);
      await tester.tap(find.text('Agenda'));
      await tester.pumpAndSettle();
      expect(taps, [1]);
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the selected item is announced, with its badge', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpNav(tester);
    final home = tester.getSemantics(find.bySemanticsLabel('Home'));
    expect(home.flagsCollection.isSelected, Tristate.isTrue);
    expect(home.flagsCollection.isButton, isTrue);
    final messages = tester.getSemantics(find.bySemanticsLabel('Messages'));
    expect(messages.flagsCollection.isSelected, Tristate.isFalse);
    expect(messages.value, '3 new');
    expect(find.text('3'), findsOneWidget);
    expect(tester.getSemantics(find.bySemanticsLabel('Tasks')).value, 'New');
    expect(find.bySemanticsLabel('Navigation'), findsOneWidget);
    handle.dispose();
  });

  testWidgets('hidden labels stay in the semantics', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpNav(tester, labels: TrcBottomNavLabels.never);
    expect(find.text('Agenda'), findsNothing);
    expect(find.bySemanticsLabel('Agenda'), findsOneWidget);
    await pumpNav(tester, labels: TrcBottomNavLabels.selected);
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Agenda'), findsNothing);
    expect(find.bySemanticsLabel('Agenda'), findsOneWidget);
    handle.dispose();
  });

  testWidgets('glass blurs what scrolls behind', (tester) async {
    await pumpNav(tester, glass: true);
    expect(find.byType(BackdropFilter), findsOneWidget);
    await pumpNav(tester);
    expect(find.byType(BackdropFilter), findsNothing);
  });

  testWidgets('five items, a center action and large text fit 320 px', (
    tester,
  ) async {
    await pumpNav(
      tester,
      width: 320,
      textScale: 2,
      center: SizedBox.square(
        dimension: 44,
        child: TrcIconButton(
          glyph: TrcGlyph.close,
          label: 'New',
          onPressed: () {},
        ),
      ),
    );
    expect(tester.takeException(), isNull);
    for (final item in _items) {
      final size = tester.getSize(
        find
            .ancestor(
              of: find.text(item.label),
              matching: find.byType(TrcTappable),
            )
            .first,
      );
      expect(size.height, greaterThanOrEqualTo(48));
    }
  });

  testWidgets('arrows move the focus, Enter opens', (tester) async {
    FocusManager.instance.highlightStrategy =
        FocusHighlightStrategy.alwaysTraditional;
    addTearDown(
      () => FocusManager.instance.highlightStrategy =
          FocusHighlightStrategy.automatic,
    );
    final taps = await pumpNav(tester);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(taps, [2]);
    await tester.sendKeyEvent(LogicalKeyboardKey.end);
    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(taps, [2, 4]);
  });

  testWidgets('the indicator slides to the new item', (tester) async {
    await pumpNav(tester, items: _items.take(2).toList());
    Rect indicator() => tester.getRect(
      find
          .descendant(
            of: find.byType(TrcBottomNav),
            matching: find.byWidgetPredicate(
              (w) =>
                  w is DecoratedBox &&
                  w.decoration is BoxDecoration &&
                  (w.decoration as BoxDecoration).color ==
                      const TrcThemeData().accent,
            ),
          )
          .first,
    );
    final before = indicator();
    await tester.tap(find.text('Agenda'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    final during = indicator();
    expect(during.width, greaterThan(before.width));
    await tester.pumpAndSettle();
    final after = indicator();
    expect(after.width, before.width);
    expect(after.left, greaterThan(before.left));
  });
}
