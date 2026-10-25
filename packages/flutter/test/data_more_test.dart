import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  testWidgets('TrcSkeleton is hidden from screen readers', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      const Column(
        children: [
          TrcSkeleton(circle: true),
          TrcSkeleton(lines: 3),
          Text('Loaded'),
        ],
      ),
    );
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.byType(TrcSkeleton), findsNWidgets(2));
    expect(tester.getSemantics(find.text('Loaded')).label, 'Loaded');
    handle.dispose();
  });

  testWidgets('TrcSpinner announces its label', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(tester, const TrcSpinner(label: 'Chargement'));
    expect(find.bySemanticsLabel('Chargement'), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 400));
    handle.dispose();
  });

  testWidgets('TrcProgress shows and announces its value', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      const Column(
        children: [
          TrcProgress(value: 45, label: 'Upload', showValue: true),
          TrcProgress(semanticLabel: 'Syncing'),
        ],
      ),
    );
    await tester.pump(const Duration(milliseconds: 500));
    expect(find.text('45 %'), findsOneWidget);
    expect(tester.getSemantics(find.bySemanticsLabel('Upload')).value, '45 %');
    expect(find.bySemanticsLabel('Syncing'), findsOneWidget);
    handle.dispose();
  });

  testWidgets('reduced motion stops the indeterminate bar', (tester) async {
    tester.view.physicalSize = const Size(800, 600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(
      const MaterialApp(
        home: MediaQuery(
          data: MediaQueryData(disableAnimations: true),
          child: Scaffold(body: TrcProgress(semanticLabel: 'Syncing')),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.binding.hasScheduledFrame, isFalse);
  });

  testWidgets('TrcKbd and TrcDivider render', (tester) async {
    await pumpTrc(
      tester,
      const Column(
        children: [
          Row(children: [TrcKbd('⌘'), SizedBox(width: 4), TrcKbd('K')]),
          TrcDivider(label: 'or'),
          TrcDivider(),
          SizedBox(height: 20, child: TrcDivider.vertical()),
        ],
      ),
    );
    expect(find.text('or'), findsOneWidget);
    expect(find.text('K'), findsOneWidget);
  });

  testWidgets(
    'TrcCodeBlock copies the code and turns the button into a check',
    (tester) async {
      final handle = tester.ensureSemantics();
      String? copied;
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
        SystemChannels.platform,
        (call) async {
          if (call.method == 'Clipboard.setData') {
            copied =
                (call.arguments as Map<Object?, Object?>)['text'] as String?;
          }
          return null;
        },
      );
      addTearDown(
        () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
          SystemChannels.platform,
          null,
        ),
      );
      await pumpTrc(
        tester,
        const TrcCodeBlock(
          code: "import 'package:trc_ui/trc_ui.dart';",
          title: 'lib/main.dart',
          language: 'dart',
        ),
        width: 360,
      );
      expect(find.text('DART'), findsOneWidget);
      await tester.tap(find.bySemanticsLabel('Copy code'));
      await tester.pump();
      expect(copied, "import 'package:trc_ui/trc_ui.dart';");
      final icon = tester.widget<TrcIcon>(find.byType(TrcIcon));
      expect(icon.glyph, TrcGlyph.check);
      await tester.pump(const Duration(seconds: 2));
      expect(tester.widget<TrcIcon>(find.byType(TrcIcon)).glyph, TrcGlyph.copy);
      expect(tester.takeException(), isNull);
      handle.dispose();
    },
  );
}
