import 'dart:ui' show Tristate;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  group('TrcDates', () {
    test('adds months without overflowing', () {
      expect(
        TrcDates.toIsoDate(TrcDates.addMonths(DateTime(2026, 1, 31), 1)),
        '2026-02-28',
      );
      expect(
        TrcDates.toIsoDate(TrcDates.addMonths(DateTime(2024, 1, 31), 1)),
        '2024-02-29',
      );
      expect(
        TrcDates.toIsoDate(TrcDates.addMonths(DateTime(2026, 3, 12), -12)),
        '2025-03-12',
      );
    });

    test('starts the grid on the requested weekday', () {
      // 1 March 2026 is a Sunday.
      final march12 = DateTime(2026, 3, 12);
      expect(TrcDates.toIsoDate(TrcDates.gridStart(march12, 1)), '2026-02-23');
      expect(TrcDates.toIsoDate(TrcDates.gridStart(march12, 0)), '2026-03-01');
    });

    test('compares days only', () {
      expect(
        TrcDates.sameDay(DateTime(2026, 3, 12, 9), DateTime(2026, 3, 12, 23)),
        isTrue,
      );
      expect(
        TrcDates.isBefore(DateTime(2026, 3, 12, 23), DateTime(2026, 3, 13)),
        isTrue,
      );
      expect(
        TrcDates.isBefore(DateTime(2026, 3, 12, 23), DateTime(2026, 3, 12)),
        isFalse,
      );
    });
  });

  group('TrcDatePicker', () {
    Widget picker({
      DateTime? initial,
      DateTime? min,
      DateTime? max,
      ValueChanged<DateTime>? onPicked,
    }) {
      var value = initial;
      return StatefulBuilder(
        builder: (context, setState) => TrcField(
          label: 'Arrival',
          hint: 'Check-in from 3 pm',
          child: TrcDatePicker(
            value: value,
            weekStartsOn: 1,
            min: min,
            max: max,
            today: DateTime(2026, 3, 10),
            onChanged: (d) {
              setState(() => value = d);
              onPicked?.call(d);
            },
          ),
        ),
      );
    }

    testWidgets('is a labelled button showing the date', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(tester, picker(initial: DateTime(2026, 3, 12)));
      expect(find.text('Mar 12, 2026'), findsOneWidget);
      final node = tester.getSemantics(find.bySemanticsLabel('Arrival'));
      expect(node.value, 'Mar 12, 2026');
      expect(node.hint, 'Check-in from 3 pm');
      handle.dispose();
    });

    testWidgets('opens on the chosen month; moves with the keyboard', (
      tester,
    ) async {
      DateTime? picked;
      await pumpTrc(
        tester,
        picker(initial: DateTime(2026, 3, 12), onPicked: (d) => picked = d),
      );
      await tester.tap(find.text('Mar 12, 2026'));
      await tester.pumpAndSettle();
      expect(find.text('March 2026'), findsOneWidget);
      expect(find.text('Mon'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.end);
      await tester.sendKeyEvent(LogicalKeyboardKey.pageDown);
      await tester.pump();
      expect(find.text('April 2026'), findsOneWidget);
      await tester.sendKeyDownEvent(LogicalKeyboardKey.shiftLeft);
      await tester.sendKeyEvent(LogicalKeyboardKey.pageUp);
      await tester.sendKeyUpEvent(LogicalKeyboardKey.shiftLeft);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(picked, DateTime(2025, 4, 22));
      expect(find.text('Apr 22, 2025'), findsOneWidget);
    });

    testWidgets('changes month with the buttons and closes with Escape', (
      tester,
    ) async {
      await pumpTrc(tester, picker(initial: DateTime(2026, 3, 12)));
      await tester.tap(find.text('Mar 12, 2026'));
      await tester.pumpAndSettle();
      await tester.tap(find.bySemanticsLabel('Next month'));
      await tester.pump();
      expect(find.text('April 2026'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('April 2026'), findsNothing);
    });

    testWidgets('days out of range are disabled; a tap chooses', (
      tester,
    ) async {
      final handle = tester.ensureSemantics();
      DateTime? picked;
      await pumpTrc(
        tester,
        picker(
          min: DateTime(2026, 3, 10),
          max: DateTime(2026, 3, 20),
          onPicked: (d) => picked = d,
        ),
      );
      expect(find.text('Choose a date'), findsOneWidget);
      await tester.tap(find.text('Choose a date'));
      await tester.pumpAndSettle();
      final ninth = tester.getSemantics(
        find.bySemanticsLabel('Monday, March 9, 2026'),
      );
      expect(ninth.flagsCollection.isEnabled, isNot(Tristate.isTrue));
      await tester.tap(find.bySemanticsLabel('Saturday, March 14, 2026'));
      await tester.pumpAndSettle();
      expect(picked, DateTime(2026, 3, 14));
      handle.dispose();
    });

    testWidgets('the calendar fits a 320 px screen', (tester) async {
      await pumpTrc(tester, picker(initial: DateTime(2026, 3, 12)), width: 320);
      await tester.tap(find.text('Mar 12, 2026'));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
    });
  });
}
