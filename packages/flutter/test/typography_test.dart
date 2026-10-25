import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  group('parseAccent', () {
    test('colors the words between asterisks', () {
      expect(parseAccent('How it *works*'), [
        (text: 'How it ', accent: false),
        (text: 'works', accent: true),
      ]);
    });

    test('colors the last words with accentLast', () {
      expect(parseAccent('The reality in data', accentLast: 2), [
        (text: 'The reality ', accent: false),
        (text: 'in data', accent: true),
      ]);
    });

    test('never colors the whole title', () {
      expect(parseAccent('Hello', accentLast: 3), [
        (text: 'Hello', accent: false),
      ]);
      expect(parseAccent('Two words', accentLast: 5).last, (
        text: 'words',
        accent: true,
      ));
    });
  });

  test('plainText removes the asterisks', () {
    expect(plainText('How it *works*'), 'How it works');
  });

  test('heading sizes follow the screen width within their bounds', () {
    expect(headingMetrics(TrcHeadingSize.display, 320).fontSize, 48);
    expect(headingMetrics(TrcHeadingSize.display, 2000).fontSize, 72);
    expect(
      headingMetrics(TrcHeadingSize.display, 1000).fontSize,
      closeTo(71.2, 1e-9),
    );
    expect(headingMetrics(TrcHeadingSize.md, 1000).fontSize, 24);
  });

  testWidgets('TrcHeading is a heading with the accent part colored', (
    tester,
  ) async {
    await pumpTrc(
      tester,
      const TrcHeading('Deep *black*', level: 1, size: TrcHeadingSize.display),
    );
    final semantics = tester.getSemantics(find.byType(TrcHeading));
    expect(semantics.label, 'Deep black');
    expect(semantics.flagsCollection.isHeader, isTrue);
    expect(semantics.headingLevel, 1);

    final rich = tester.widget<RichText>(find.byType(RichText));
    final spans = (rich.text as TextSpan).children!.first as TextSpan;
    final accent = spans.children!.last as TextSpan;
    expect(accent.text, 'black');
    expect(accent.style!.color, const TrcThemeData().accent);
  });

  testWidgets('TrcText is muted by default', (tester) async {
    await pumpTrc(tester, const TrcText('Body text.'));
    final text = tester.widget<Text>(find.text('Body text.'));
    expect(text.style!.color, const TrcThemeData().foregroundMuted);
    expect(text.style!.fontSize, 16);
  });

  testWidgets('TrcStepNumber pads to two digits and is hidden', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(tester, const TrcStepNumber(3));
    expect(find.text('03'), findsOneWidget);
    expect(find.bySemanticsLabel('03'), findsNothing);
    handle.dispose();
  });

  testWidgets('TrcEnter shows its child at the end of the entrance', (
    tester,
  ) async {
    await pumpTrc(
      tester,
      const TrcEnter(delay: Duration(milliseconds: 100), child: Text('Hi')),
    );
    expect(tester.widget<Opacity>(find.byType(Opacity)).opacity, 0);
    await tester.pumpAndSettle();
    await tester.pump(const Duration(seconds: 1));
    await tester.pumpAndSettle();
    expect(tester.widget<Opacity>(find.byType(Opacity)).opacity, 1);
  });
}
