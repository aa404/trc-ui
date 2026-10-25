import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

BoxDecoration cardDecoration(WidgetTester tester) =>
    tester
            .widget<AnimatedContainer>(
              find.descendant(
                of: find.byType(TrcCard),
                matching: find.byType(AnimatedContainer),
              ),
            )
            .decoration!
        as BoxDecoration;

void main() {
  const tokens = TrcThemeData();

  testWidgets('a card is graphite, the alt tone lighter', (tester) async {
    await pumpTrc(tester, const TrcCard(child: Text('Card')));
    expect(cardDecoration(tester).color, tokens.surface);
    await pumpTrc(
      tester,
      const TrcCard(tone: TrcCardTone.alt, child: Text('Card')),
    );
    expect(cardDecoration(tester).color, tokens.surfaceAlt);
  });

  testWidgets('an interactive card is a button that lightens on hover', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    var taps = 0;
    await pumpTrc(
      tester,
      TrcCard(onTap: () => taps++, child: const Text('Open the guide')),
    );
    expect(
      tester.getSemantics(find.byType(TrcCard)),
      matchesSemantics(
        label: 'Open the guide',
        isButton: true,
        isFocusable: true,
        hasTapAction: true,
        hasFocusAction: true,
      ),
    );
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await mouse.moveTo(tester.getCenter(find.byType(TrcCard)));
    await tester.pumpAndSettle();
    expect(cardDecoration(tester).color, tokens.surfaceRaised);
    await tester.tap(find.byType(TrcCard));
    expect(taps, 1);
    handle.dispose();
  });

  testWidgets('the watermark wakes up with the accent on hover', (
    tester,
  ) async {
    await pumpTrc(
      tester,
      const TrcCard(
        watermark: TrcIcon(TrcGlyph.calendar),
        child: SizedBox(height: 120, child: Text('Events')),
      ),
    );
    double opacity() =>
        tester.widget<AnimatedOpacity>(find.byType(AnimatedOpacity)).opacity;
    expect(opacity(), 0.05);
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await mouse.moveTo(tester.getCenter(find.byType(TrcCard)));
    await tester.pumpAndSettle();
    expect(opacity(), 0.18);
    expect(tester.getSize(find.byType(TrcIcon)), const Size(160, 160));
  });

  testWidgets('container gutters and widths follow the screen', (tester) async {
    expect(TrcContainer.gutterFor(360), 16);
    expect(TrcContainer.gutterFor(700), 24);
    expect(TrcContainer.gutterFor(1200), 40);
    await pumpTrc(
      tester,
      const TrcContainer(
        size: TrcContainerSize.narrow,
        child: SizedBox(width: double.infinity, height: 10),
      ),
      width: 1400,
    );
    expect(tester.getSize(find.byType(SizedBox).last).width, 768 - 80);
  });

  testWidgets('an inset section is a rounded graphite card', (tester) async {
    await pumpTrc(
      tester,
      const TrcSection(
        inset: true,
        spacing: TrcSectionSpacing.sm,
        child: Text('Banner'),
      ),
      width: 360,
    );
    expect(find.byType(ClipRRect), findsOneWidget);
    expect(tester.getSize(find.byType(ColoredBox).last).height, 48 * 2 + 20);
    expect(tester.takeException(), isNull);
  });
}
