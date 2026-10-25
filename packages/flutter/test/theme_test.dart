import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

void main() {
  group('TrcThemeData', () {
    test('has the deep black tokens by default', () {
      const theme = TrcThemeData();
      expect(theme.background, const Color(0xFF0B0C0F));
      expect(theme.surface, const Color(0xFF151618));
      expect(theme.accent, const Color(0xFF08C8D8));
      expect(theme.onAccent, const Color(0xFF0B0C0F));
      expect(theme.radius, 16);
      expect(theme.fontFamily, 'packages/trc_ui/Montserrat');
    });

    test('derives the soft accent and the ring from the accent', () {
      final theme = const TrcThemeData().copyWith(
        accent: const Color(0xFFD41367),
      );
      expect(theme.ring, const Color(0xFFD41367));
      expect(theme.accentSoft.a, closeTo(0.12, 0.001));
      expect(theme.accentSoft.r, closeTo(theme.accent.r, 0.001));
    });

    test('text styles use the font and an em based letter spacing', () {
      final style = const TrcThemeData().text(size: 20);
      expect(style.fontFamily, 'packages/trc_ui/Montserrat');
      expect(style.letterSpacing, closeTo(-0.2, 1e-9));
    });

    test('lerps colors', () {
      const a = TrcThemeData();
      final b = a.copyWith(accent: const Color(0xFF000000));
      expect(a.lerp(b, 1).accent, const Color(0xFF000000));
      expect(a.lerp(null, 0.5), a);
    });

    test('builds a dark Material theme that carries the tokens', () {
      const tokens = TrcThemeData();
      final material = tokens.toMaterialTheme();
      expect(material.brightness, Brightness.dark);
      expect(material.colorScheme.primary, tokens.accent);
      expect(material.scaffoldBackgroundColor, tokens.background);
      expect(material.extension<TrcThemeData>(), tokens);
    });
  });

  group('TrcTheme.of', () {
    testWidgets('reads a TrcTheme, then the Material extension, then defaults', (
      tester,
    ) async {
      late TrcThemeData found;
      Widget probe() => Builder(
        builder: (context) {
          found = TrcTheme.of(context);
          return const SizedBox();
        },
      );

      await tester.pumpWidget(probe());
      expect(found, const TrcThemeData());

      final pink = const TrcThemeData().copyWith(
        accent: const Color(0xFFD41367),
      );
      await tester.pumpWidget(
        Theme(data: pink.toMaterialTheme(), child: probe()),
      );
      expect(found.accent, const Color(0xFFD41367));

      final green = pink.copyWith(accent: const Color(0xFF00FF00));
      await tester.pumpWidget(
        Theme(
          data: pink.toMaterialTheme(),
          child: TrcTheme(data: green, child: probe()),
        ),
      );
      expect(found.accent, const Color(0xFF00FF00));
    });
  });

  test('fillLabel fills placeholders and keeps unknown ones', () {
    expect(fillLabel('{count} de plus', {'count': 3}), '3 de plus');
    expect(fillLabel('{a} {b}', {'a': 1}), '1 {b}');
  });

  testWidgets('TrcIcon is decorative unless labelled', (tester) async {
    await tester.pumpWidget(
      const Directionality(
        textDirection: TextDirection.ltr,
        child: Row(
          children: [
            TrcIcon(TrcGlyph.check),
            TrcIcon(TrcGlyph.close, semanticLabel: 'Close'),
          ],
        ),
      ),
    );
    expect(find.bySemanticsLabel('Close'), findsOneWidget);
  });
}
