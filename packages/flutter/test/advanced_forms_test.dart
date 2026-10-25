import 'dart:ui' show CheckedState;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  group('TrcRadioGroup', () {
    testWidgets('chooses with a tap and the arrows, announces the question', (
      tester,
    ) async {
      useKeyboardFocus();
      final handle = tester.ensureSemantics();
      String? plan;
      await pumpTrc(
        tester,
        StatefulBuilder(
          builder: (context, setState) => TrcRadioGroup<String>(
            label: 'Plan',
            hint: 'You can change it later.',
            value: plan,
            onChanged: (v) => setState(() => plan = v),
            options: const [
              TrcRadioOption(value: 'free', label: 'Free'),
              TrcRadioOption(value: 'team', label: 'Team', disabled: true),
              TrcRadioOption(
                value: 'pro',
                label: 'Pro',
                description: 'For agencies.',
              ),
            ],
          ),
        ),
      );
      final group = tester.getSemantics(find.byType(TrcRadioGroup<String>));
      expect(group.label, 'Plan');
      expect(group.hint, 'You can change it later.');
      await tester.tap(find.text('Free'));
      await tester.pump();
      expect(plan, 'free');
      final free = tester.getSemantics(find.text('Free'));
      expect(free.flagsCollection.isChecked, CheckedState.isTrue);
      expect(free.flagsCollection.isInMutuallyExclusiveGroup, isTrue);
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.pump();
      expect(plan, 'pro');
      handle.dispose();
    });

    testWidgets('an error marks the group', (tester) async {
      await pumpTrc(
        tester,
        TrcRadioGroup<int>(
          label: 'Size',
          error: 'Choose a size.',
          horizontal: true,
          value: null,
          onChanged: (_) {},
          options: const [
            TrcRadioOption(value: 1, label: 'Small'),
            TrcRadioOption(value: 2, label: 'Large'),
          ],
        ),
        width: 360,
      );
      final message = tester.widget<Text>(find.text('Choose a size.'));
      expect(message.style!.color, const TrcThemeData().danger);
    });
  });

  testWidgets('TrcPasswordField shows and hides the password', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      const TrcField(label: 'Password', child: TrcPasswordField()),
    );
    TextField field() => tester.widget<TextField>(find.byType(TextField));
    expect(field().obscureText, isTrue);
    expect(find.bySemanticsLabel('Show password'), findsOneWidget);
    await tester.tap(find.text('Show'));
    await tester.pump();
    expect(field().obscureText, isFalse);
    expect(find.text('Hide'), findsOneWidget);
    expect(field().autofillHints, [AutofillHints.password]);
    handle.dispose();
  });

  group('TrcPinInput', () {
    testWidgets('typing moves forward and completes', (tester) async {
      String? done;
      final changes = <String>[];
      await pumpTrc(
        tester,
        TrcPinInput(
          length: 4,
          onChanged: changes.add,
          onCompleted: (v) => done = v,
        ),
      );
      final boxes = find.byType(TextField);
      expect(boxes, findsNWidgets(4));
      await tester.enterText(boxes.at(0), '1');
      await tester.enterText(boxes.at(1), 'x');
      await tester.enterText(boxes.at(1), '2');
      await tester.enterText(boxes.at(2), '3');
      await tester.enterText(boxes.at(3), '4');
      expect(changes.last, '1234');
      expect(done, '1234');
    });

    testWidgets('a pasted code fills every box', (tester) async {
      String? done;
      await pumpTrc(tester, TrcPinInput(onCompleted: (v) => done = v));
      await tester.enterText(find.byType(TextField).first, '12 34-56');
      await tester.pump();
      expect(done, '123456');
      expect(find.text('6'), findsOneWidget);
    });

    testWidgets('Backspace on an empty box clears the previous one', (
      tester,
    ) async {
      final changes = <String>[];
      await pumpTrc(
        tester,
        TrcPinInput(length: 4, initialValue: '12', onChanged: changes.add),
      );
      await tester.tap(find.byType(TextField).at(2));
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.backspace);
      await tester.pump();
      expect(changes.last, '1');
    });

    testWidgets('labels each box from a template; fits 360 px', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(
        tester,
        const TrcPinInput(length: 6, charLabel: 'Chiffre {index} sur {length}'),
        width: 360,
      );
      expect(find.bySemanticsLabel(RegExp('Chiffre 1 sur 6')), findsOneWidget);
      expect(tester.takeException(), isNull);
      final first = tester.widget<TextField>(find.byType(TextField).first);
      expect(first.autofillHints, [AutofillHints.oneTimeCode]);
      handle.dispose();
    });
  });
}
