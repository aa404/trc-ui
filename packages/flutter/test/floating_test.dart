import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  group('TrcMenu', () {
    late List<String> chosen;
    late FocusNode trigger;

    Widget menu() => TrcMenu(
      items: [
        TrcMenuItem(
          label: 'Edit',
          hint: '⌘E',
          onSelected: () => chosen.add('edit'),
        ),
        TrcMenuItem(label: 'Duplicate', onSelected: () => chosen.add('dup')),
        const TrcMenuItem(label: 'Archive', disabled: true),
        const TrcMenuSeparator(),
        TrcMenuItem(
          label: 'Delete',
          danger: true,
          onSelected: () => chosen.add('delete'),
        ),
      ],
      builder: (context, toggle, open) => TrcPillButton(
        label: 'Actions',
        small: true,
        focusNode: trigger,
        onPressed: toggle,
      ),
    );

    setUp(() => chosen = []);

    testWidgets('opens on tap and chooses an item', (tester) async {
      trigger = FocusNode();
      addTearDown(trigger.dispose);
      await pumpTrc(tester, menu());
      await tester.tap(find.text('Actions'));
      await tester.pumpAndSettle();
      expect(find.text('⌘E'), findsOneWidget);
      await tester.tap(find.text('Archive'));
      await tester.pumpAndSettle();
      expect(chosen, isEmpty);
      await tester.tap(find.text('Duplicate'));
      await tester.pumpAndSettle();
      expect(chosen, ['dup']);
      expect(find.text('Duplicate'), findsNothing);
    });

    testWidgets('keyboard: arrows skip disabled items, typeahead, Escape', (
      tester,
    ) async {
      useKeyboardFocus();
      trigger = FocusNode();
      addTearDown(trigger.dispose);
      await pumpTrc(tester, menu());
      trigger.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.pumpAndSettle();
      expect(find.text('Edit'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(chosen, ['delete']);
      expect(trigger.hasFocus, isTrue);

      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.keyD);
      await tester.sendKeyEvent(LogicalKeyboardKey.space);
      await tester.pumpAndSettle();
      expect(chosen, ['delete', 'dup']);

      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Edit'), findsNothing);
      expect(trigger.hasFocus, isTrue);
    });

    testWidgets('closes on a press outside', (tester) async {
      trigger = FocusNode();
      addTearDown(trigger.dispose);
      await pumpTrc(tester, menu());
      await tester.tap(find.text('Actions'));
      await tester.pumpAndSettle();
      await tester.tapAt(const Offset(700, 800));
      await tester.pumpAndSettle();
      expect(find.text('Edit'), findsNothing);
    });
  });

  testWidgets('TrcPopover opens, names its panel and closes on Escape', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      TrcPopover(
        title: 'Share',
        builder: (context, toggle, open) =>
            TrcPillButton(label: 'Share', small: true, onPressed: toggle),
        child: const Text('Anyone with the link can view.'),
      ),
    );
    await tester.tap(find.byType(TrcPillButton));
    await tester.pumpAndSettle();
    expect(find.text('Anyone with the link can view.'), findsOneWidget);
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('Anyone with the link can view.'), findsNothing);
    handle.dispose();
  });

  testWidgets('TrcPopover can be controlled', (tester) async {
    final changes = <bool>[];
    await pumpTrc(
      tester,
      TrcPopover(
        open: true,
        onOpenChange: changes.add,
        builder: (context, toggle, open) =>
            TrcPillButton(label: 'Info', onPressed: toggle),
        child: const Text('Details'),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Details'), findsOneWidget);
    await tester.tap(find.text('Info'));
    expect(changes, [false]);
  });

  testWidgets('TrcTooltip shows on hover after the delay and describes', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      TrcTooltip(
        message: 'Copy the link',
        child: TrcIconButton(
          glyph: TrcGlyph.copy,
          label: 'Copy',
          onPressed: () {},
        ),
      ),
    );
    expect(
      tester.getSemantics(find.byType(TrcIconButton)).tooltip,
      'Copy the link',
    );
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await mouse.moveTo(tester.getCenter(find.byType(TrcIconButton)));
    await tester.pump(const Duration(milliseconds: 100));
    expect(find.text('Copy the link'), findsNothing);
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pumpAndSettle();
    expect(find.text('Copy the link'), findsOneWidget);
    await mouse.moveTo(const Offset(700, 800));
    await tester.pump(const Duration(milliseconds: 150));
    await tester.pumpAndSettle();
    expect(find.text('Copy the link'), findsNothing);
    handle.dispose();
  });
}
