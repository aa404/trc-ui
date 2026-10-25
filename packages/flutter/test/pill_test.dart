import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

Color labelColor(WidgetTester tester, String label) =>
    tester.widget<Text>(find.text(label)).style!.color!;

void main() {
  testWidgets('calls onPressed on tap and is announced as a button', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    var taps = 0;
    await pumpTrc(
      tester,
      TrcPillButton(label: 'Get started', onPressed: () => taps++),
    );
    await tester.tap(find.text('Get started'));
    await tester.pump(const Duration(seconds: 1));
    expect(taps, 1);
    expect(
      tester.getSemantics(find.byType(TrcPillButton)),
      matchesSemantics(
        label: 'Get started',
        isButton: true,
        hasEnabledState: true,
        isEnabled: true,
        isFocusable: true,
        hasTapAction: true,
        hasFocusAction: true,
      ),
    );
    handle.dispose();
  });

  testWidgets('is disabled without onPressed and while loading', (
    tester,
  ) async {
    var taps = 0;
    await pumpTrc(
      tester,
      Column(
        children: [
          const TrcPillButton(label: 'Disabled', onPressed: null),
          TrcPillButton(
            label: 'Saving',
            loading: true,
            onPressed: () => taps++,
          ),
        ],
      ),
    );
    await tester.tap(find.text('Saving'));
    await tester.pump();
    expect(taps, 0);
    expect(find.byType(TrcSpinningArc), findsOneWidget);
  });

  testWidgets('activates with the keyboard and shows the stretched state', (
    tester,
  ) async {
    useKeyboardFocus();
    var taps = 0;
    final node = FocusNode();
    addTearDown(node.dispose);
    await pumpTrc(
      tester,
      TrcPillButton(label: 'Go', focusNode: node, onPressed: () => taps++),
    );
    node.requestFocus();
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 600));
    expect(labelColor(tester, 'Go'), const TrcThemeData().onAccent);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pump();
    expect(taps, 2);
  });

  testWidgets('darkens the label after a delay on hover, lightens on leave', (
    tester,
  ) async {
    await pumpTrc(tester, TrcPillButton(label: 'Hover me', onPressed: () {}));
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await mouse.moveTo(tester.getCenter(find.byType(TrcPillButton)));
    await tester.pump(const Duration(milliseconds: 100));
    expect(labelColor(tester, 'Hover me'), const TrcThemeData().foreground);
    await tester.pump(const Duration(milliseconds: 100));
    await tester.pump(const Duration(milliseconds: 400));
    expect(labelColor(tester, 'Hover me'), const TrcThemeData().onAccent);
    await mouse.moveTo(const Offset(700, 800));
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pump(const Duration(milliseconds: 400));
    expect(labelColor(tester, 'Hover me'), const TrcThemeData().foreground);
  });

  testWidgets('cuts a long label instead of overflowing at 360 px', (
    tester,
  ) async {
    await pumpTrc(
      tester,
      Row(
        children: [
          Expanded(
            child: Align(
              alignment: Alignment.centerLeft,
              child: TrcPillButton(
                label: 'A very long label that cannot fit on a phone screen',
                onPressed: () {},
              ),
            ),
          ),
        ],
      ),
      width: 360,
    );
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(TrcPillButton)).width, lessThan(330));
  });

  testWidgets('sizes: 56 px, and 40 px when small', (tester) async {
    await pumpTrc(
      tester,
      Wrap(
        children: [
          TrcPillButton(label: 'Large', onPressed: () {}),
          TrcPillButton(
            label: 'Small',
            small: true,
            solid: true,
            onPressed: () {},
          ),
          TrcPillButton(
            label: 'Back',
            icon: const TrcIcon(TrcGlyph.arrowLeft),
            onPressed: () {},
          ),
        ],
      ),
    );
    expect(tester.getSize(find.byType(TrcPillButton).at(0)).height, 56);
    expect(tester.getSize(find.byType(TrcPillButton).at(1)).height, 40);
    expect(labelColor(tester, 'Small'), const TrcThemeData().background);
  });
}
