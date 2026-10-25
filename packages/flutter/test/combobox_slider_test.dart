import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  test('normalizeForSearch ignores case and accents', () {
    expect(normalizeForSearch('Bénin'), 'benin');
    expect(normalizeForSearch("CÔTE D'IVOIRE"), "cote d'ivoire");
    expect(normalizeForSearch('Straße Œuvre'), 'strasse oeuvre');
    expect(normalizeForSearch('é'), 'e');
  });

  group('TrcCombobox', () {
    const options = [
      TrcComboboxOption(value: 'bj', label: 'Bénin'),
      TrcComboboxOption(value: 'bf', label: 'Burkina Faso'),
      TrcComboboxOption(value: 'ci', label: "Côte d'Ivoire"),
      TrcComboboxOption(value: 'gh', label: 'Ghana', disabled: true),
    ];

    Widget box(ValueChanged<String> onChanged, [String? value]) =>
        StatefulBuilder(
          builder: (context, setState) => TrcField(
            label: 'Country',
            child: TrcCombobox<String>(
              options: options,
              value: value,
              placeholder: 'Search a country',
              onChanged: (v) {
                setState(() => value = v);
                onChanged(v);
              },
            ),
          ),
        );

    testWidgets('filters without accents and chooses with Enter', (
      tester,
    ) async {
      String? chosen;
      await pumpTrc(tester, box((v) => chosen = v));
      await tester.enterText(find.byType(TextField), 'cote');
      await tester.pumpAndSettle();
      expect(find.text('Burkina Faso'), findsNothing);
      expect(find.text("Côte d'Ivoire"), findsNWidgets(1));
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(chosen, 'ci');
      expect(
        tester.widget<TextField>(find.byType(TextField)).controller!.text,
        "Côte d'Ivoire",
      );
    });

    testWidgets('arrows move the active option; empty text when nothing', (
      tester,
    ) async {
      String? chosen;
      await pumpTrc(tester, box((v) => chosen = v));
      await tester.tap(find.byType(TextField));
      await tester.pumpAndSettle();
      expect(find.text('Burkina Faso'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(chosen, 'bf');
      await tester.enterText(find.byType(TextField), 'zzz');
      await tester.pumpAndSettle();
      expect(find.text('No results'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('No results'), findsNothing);
      expect(
        tester.widget<TextField>(find.byType(TextField)).controller!.text,
        'Burkina Faso',
      );
    });

    testWidgets('a tap on a suggestion chooses it', (tester) async {
      String? chosen;
      await pumpTrc(tester, box((v) => chosen = v));
      await tester.enterText(find.byType(TextField), 'b');
      await tester.pumpAndSettle();
      await tester.tap(find.text('Bénin'));
      await tester.pumpAndSettle();
      expect(chosen, 'bj');
    });
  });

  group('TrcSlider', () {
    testWidgets('moves with the keyboard and announces the value', (
      tester,
    ) async {
      useKeyboardFocus();
      final handle = tester.ensureSemantics();
      var value = 40.0;
      await pumpTrc(
        tester,
        StatefulBuilder(
          builder: (context, setState) => TrcField(
            label: 'Budget',
            child: TrcSlider(
              value: value,
              step: 5,
              showValue: true,
              formatValue: (v) => '€ ${v.round()}',
              onChanged: (v) => setState(() => value = v),
            ),
          ),
        ),
      );
      final node = tester.getSemantics(find.bySemanticsLabel('Budget'));
      expect(node.label, 'Budget');
      expect(node.value, '€ 40');
      expect(node.increasedValue, '€ 45');
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.pump();
      expect(value, 45);
      await tester.sendKeyEvent(LogicalKeyboardKey.pageUp);
      await tester.pump();
      expect(value, 55);
      await tester.sendKeyEvent(LogicalKeyboardKey.end);
      await tester.pump();
      expect(value, 100);
      expect(find.text('€ 100'), findsOneWidget);
      handle.dispose();
    });

    testWidgets('a tap sets the value, snapped to the step', (tester) async {
      var value = 0.0;
      await pumpTrc(
        tester,
        SizedBox(
          width: 220,
          child: StatefulBuilder(
            builder: (context, setState) => TrcSlider(
              value: value,
              step: 10,
              semanticLabel: 'Volume',
              onChanged: (v) => setState(() => value = v),
            ),
          ),
        ),
      );
      final rect = tester.getRect(find.byType(TrcSlider));
      await tester.tapAt(Offset(rect.left + 10 + 200 * 0.52, rect.center.dy));
      await tester.pump();
      expect(value, 50);
    });
  });
}
