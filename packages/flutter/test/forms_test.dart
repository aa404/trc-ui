import 'dart:ui' show Tristate;

import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  group('TrcField and TrcTextField', () {
    testWidgets('the control takes the label, hint and required state', (
      tester,
    ) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(
        tester,
        const TrcField(
          label: 'Email',
          hint: 'We never share it.',
          required: true,
          child: TrcTextField(placeholder: 'you@example.com'),
        ),
      );
      expect(find.text('Email *'), findsOneWidget);
      final node = tester.getSemantics(find.byType(TextField));
      expect(node.label, contains('Email'));
      expect(node.hint, contains('We never share it.'));
      expect(node.flagsCollection.isTextField, isTrue);
      handle.dispose();
    });

    testWidgets('an error replaces the hint and marks the control invalid', (
      tester,
    ) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(
        tester,
        const TrcField(
          label: 'Email',
          hint: 'We never share it.',
          error: 'Enter a valid email.',
          child: TrcTextField(),
        ),
      );
      expect(find.text('We never share it.'), findsNothing);
      final message = tester.widget<Text>(find.text('Enter a valid email.'));
      expect(message.style!.color, const TrcThemeData().danger);
      final node = tester.getSemantics(find.byType(TextField));
      expect(node.validationResult, SemanticsValidationResult.invalid);
      handle.dispose();
    });

    testWidgets('tapping the label focuses the control; typing works', (
      tester,
    ) async {
      String? typed;
      await pumpTrc(
        tester,
        TrcField(
          label: 'Name',
          child: TrcTextField(onChanged: (v) => typed = v),
        ),
      );
      await tester.tap(find.text('Name'));
      await tester.pump();
      final field = tester.widget<TextField>(find.byType(TextField));
      expect(field.focusNode!.hasFocus, isTrue);
      await tester.enterText(find.byType(TextField), 'Ama');
      expect(typed, 'Ama');
    });

    testWidgets('a text area grows from its rows', (tester) async {
      await pumpTrc(tester, const TrcTextArea(semanticLabel: 'Message'));
      final field = tester.widget<TextField>(find.byType(TextField));
      expect(field.minLines, 4);
      expect(tester.getSize(find.byType(TrcTextArea)).height, greaterThan(96));
    });
  });

  group('TrcSelect', () {
    final options = [
      const TrcSelectOption(value: 'bj', label: 'Benin'),
      const TrcSelectOption(value: 'gh', label: 'Ghana', disabled: true),
      const TrcSelectOption(value: 'tg', label: 'Togo'),
    ];

    testWidgets('opens a list and chooses an option', (tester) async {
      String? chosen;
      await pumpTrc(
        tester,
        StatefulBuilder(
          builder: (context, setState) => TrcField(
            label: 'Country',
            child: TrcSelect<String>(
              options: options,
              value: chosen,
              placeholder: 'Choose a country',
              onChanged: (v) => setState(() => chosen = v),
            ),
          ),
        ),
      );
      expect(find.text('Choose a country'), findsOneWidget);
      await tester.tap(find.byType(TrcSelect<String>));
      await tester.pumpAndSettle();
      expect(find.text('Togo'), findsOneWidget);
      await tester.tap(find.text('Ghana'));
      await tester.pumpAndSettle();
      expect(chosen, isNull);
      await tester.tap(find.text('Togo'));
      await tester.pumpAndSettle();
      expect(chosen, 'tg');
      expect(find.text('Benin'), findsNothing);
    });

    testWidgets('works with the keyboard and skips disabled options', (
      tester,
    ) async {
      useKeyboardFocus();
      String? chosen = 'bj';
      final node = FocusNode();
      addTearDown(node.dispose);
      await pumpTrc(
        tester,
        StatefulBuilder(
          builder: (context, setState) => TrcSelect<String>(
            options: options,
            value: chosen,
            focusNode: node,
            semanticLabel: 'Country',
            onChanged: (v) => setState(() => chosen = v),
          ),
        ),
      );
      node.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.pumpAndSettle();
      expect(find.text('Togo'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(chosen, 'tg');
      await tester.sendKeyEvent(LogicalKeyboardKey.space);
      await tester.pumpAndSettle();
      expect(find.text('Benin'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(find.text('Benin'), findsNothing);
      expect(node.hasFocus, isTrue);
    });
  });

  group('TrcCheckbox and TrcSwitch', () {
    testWidgets('the whole block toggles and the state is announced', (
      tester,
    ) async {
      final handle = tester.ensureSemantics();
      var accepted = false;
      var notify = true;
      await pumpTrc(
        tester,
        StatefulBuilder(
          builder: (context, setState) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TrcCheckbox(
                value: accepted,
                label: 'I accept the terms',
                description: 'You can read them at any time.',
                onChanged: (v) => setState(() => accepted = v),
              ),
              TrcSwitch(
                value: notify,
                label: 'Notifications',
                onChanged: (v) => setState(() => notify = v),
              ),
            ],
          ),
        ),
      );
      await tester.tap(find.text('You can read them at any time.'));
      await tester.pumpAndSettle();
      expect(accepted, isTrue);
      expect(
        tester.getSemantics(find.byType(TrcCheckbox)),
        matchesSemantics(
          label: 'I accept the terms\nYou can read them at any time.',
          hasCheckedState: true,
          isChecked: true,
          hasEnabledState: true,
          isEnabled: true,
          isFocusable: true,
          hasTapAction: true,
          hasFocusAction: true,
        ),
      );
      await tester.tap(find.text('Notifications'));
      await tester.pumpAndSettle();
      expect(notify, isFalse);
      final node = tester.getSemantics(find.byType(TrcSwitch));
      expect(node.flagsCollection.isToggled, Tristate.isFalse);
      handle.dispose();
    });

    testWidgets('long labels wrap at 360 px', (tester) async {
      await pumpTrc(
        tester,
        TrcCheckbox(
          value: false,
          onChanged: (_) {},
          label:
              'Send me the occasional newsletter with product news and events',
          description: 'One email a month at most, and you can leave anytime.',
        ),
        width: 360,
      );
      expect(tester.takeException(), isNull);
    });
  });
}
