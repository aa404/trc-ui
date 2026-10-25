import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

Future<void> pumpPage(
  WidgetTester tester,
  Widget page, {
  double width = 1280,
}) async {
  tester.view.physicalSize = Size(width, 900);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    MaterialApp(theme: const TrcThemeData().toMaterialTheme(), home: page),
  );
}

void main() {
  Widget page(ScrollController controller, List<String> taps) => Scaffold(
    body: Stack(
      children: [
        ListView(
          controller: controller,
          children: [
            const TrcPageHero(
              title: 'Pricing for every team',
              description: 'Start free, upgrade when you grow.',
            ),
            const SizedBox(height: 2000),
          ],
        ),
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: TrcHeader(
            controller: controller,
            logo: const Text('trc'),
            logoLabel: 'trc home',
            nav: [
              TrcNavItem(
                label: 'Product',
                active: true,
                onTap: () => taps.add('product'),
              ),
              TrcNavItem(
                label: 'Resources',
                children: [
                  TrcNavItem(label: 'Blog', onTap: () => taps.add('blog')),
                ],
              ),
            ],
            cta: 'Sign up',
            onCta: () => taps.add('cta'),
          ),
        ),
        Positioned(
          right: 16,
          bottom: 16,
          child: TrcBackToTop(controller: controller),
        ),
      ],
    ),
  );

  testWidgets('the header turns graphite once the page scrolls', (
    tester,
  ) async {
    final controller = ScrollController();
    addTearDown(controller.dispose);
    final taps = <String>[];
    await pumpPage(tester, page(controller, taps));
    await tester.pumpAndSettle();
    BackdropFilter filter() => tester.widget(find.byType(BackdropFilter));
    expect(filter().enabled, isFalse);
    controller.jumpTo(400);
    await tester.pumpAndSettle();
    expect(filter().enabled, isTrue);
  });

  testWidgets('large screens show the navigation, the dropdown and the CTA', (
    tester,
  ) async {
    final controller = ScrollController();
    addTearDown(controller.dispose);
    final taps = <String>[];
    await pumpPage(tester, page(controller, taps));
    await tester.pumpAndSettle();
    expect(find.bySemanticsLabel('Menu'), findsNothing);
    await tester.tap(find.text('Product'));
    await tester.tap(find.text('Resources'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Blog'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Sign up'));
    await tester.pump(const Duration(seconds: 1));
    expect(taps, ['product', 'blog', 'cta']);
  });

  testWidgets('phones get a menu button opening a side panel', (tester) async {
    final controller = ScrollController();
    addTearDown(controller.dispose);
    final taps = <String>[];
    await pumpPage(tester, page(controller, taps), width: 360);
    await tester.pumpAndSettle();
    expect(find.text('Product'), findsNothing);
    await tester.tap(find.bySemanticsLabel('Menu'));
    await tester.pumpAndSettle();
    expect(find.text('Blog'), findsOneWidget);
    await tester.tap(find.text('Blog'));
    await tester.pumpAndSettle();
    expect(taps, ['blog']);
    expect(tester.takeException(), isNull);
  });

  testWidgets('the page hero is a level 1 heading with an accent ending', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    final controller = ScrollController();
    addTearDown(controller.dispose);
    await pumpPage(tester, page(controller, []), width: 360);
    // The hero texts enter one after another.
    await tester.pump(const Duration(seconds: 1));
    await tester.pumpAndSettle();
    final node = tester.getSemantics(
      find.bySemanticsLabel('Pricing for every team'),
    );
    expect(node.headingLevel, 1);
    final rich = tester.widget<RichText>(
      find.descendant(
        of: find.byType(TrcAccentText),
        matching: find.byType(RichText),
      ),
    );
    final parts =
        ((rich.text as TextSpan).children!.first as TextSpan).children!;
    expect((parts.last as TextSpan).text, 'every team');
    handle.dispose();
  });

  testWidgets('back to top appears after scrolling and brings the page back', (
    tester,
  ) async {
    final controller = ScrollController();
    addTearDown(controller.dispose);
    await pumpPage(tester, page(controller, []));
    await tester.pumpAndSettle();
    expect(find.bySemanticsLabel('Back to top'), findsNothing);
    controller.jumpTo(1200);
    await tester.pumpAndSettle();
    await tester.tap(find.bySemanticsLabel('Back to top'));
    await tester.pumpAndSettle();
    expect(controller.offset, 0);
  });
}
