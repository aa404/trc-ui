import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

Future<void> pumpApp(
  WidgetTester tester,
  Widget home, {
  double width = 800,
}) async {
  tester.view.physicalSize = Size(width, 900);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    MaterialApp(
      theme: const TrcThemeData().toMaterialTheme(),
      builder: (context, child) => TrcToaster(child: child!),
      home: Scaffold(body: Center(child: home)),
    ),
  );
}

void main() {
  testWidgets('toasts show, announce and leave after their duration', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    await pumpApp(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Save',
          onPressed: () => TrcToast.success(
            context,
            'Saved',
            description: 'Your changes are online.',
          ),
        ),
      ),
    );
    await tester.tap(find.text('Save'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Saved'), findsOneWidget);
    final live = tester.getSemantics(
      find
          .ancestor(of: find.text('Saved'), matching: find.byType(Semantics))
          .first,
    );
    expect(live.flagsCollection.isLiveRegion, isTrue);
    await tester.pump(const Duration(seconds: 5));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Saved'), findsNothing);
    handle.dispose();
  });

  testWidgets('the action runs and dismisses; the close button dismisses', (
    tester,
  ) async {
    var undone = false;
    await pumpApp(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Delete',
          onPressed: () {
            TrcToast.show(
              context,
              'Deleted',
              duration: Duration.zero,
              action: TrcToastAction(
                label: 'Undo',
                onPressed: () => undone = true,
              ),
            );
            TrcToast.error(context, 'Network error', duration: Duration.zero);
          },
        ),
      ),
    );
    await tester.tap(find.text('Delete'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Undo'));
    await tester.pumpAndSettle();
    expect(undone, isTrue);
    expect(find.text('Deleted'), findsNothing);
    await tester.tap(find.byType(TrcIconButton));
    await tester.pumpAndSettle();
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Network error'), findsNothing);
  });

  testWidgets('timers pause while the pointer is over the toasts', (
    tester,
  ) async {
    await pumpApp(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Go',
          onPressed: () => TrcToast.show(context, 'Hello'),
        ),
      ),
    );
    await tester.tap(find.text('Go'));
    await tester.pumpAndSettle();
    final mouse = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await mouse.addPointer(location: Offset.zero);
    addTearDown(mouse.removePointer);
    await mouse.moveTo(tester.getCenter(find.text('Hello')));
    await tester.pump();
    await tester.pump(const Duration(seconds: 10));
    expect(find.text('Hello'), findsOneWidget);
    await mouse.moveTo(Offset.zero);
    await tester.pump();
    await tester.pump(const Duration(seconds: 6));
    await tester.pumpAndSettle();
    expect(find.text('Hello'), findsNothing);
  });

  testWidgets('toasts fit a 360 px screen', (tester) async {
    await pumpApp(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Go',
          onPressed: () => TrcToast.show(
            context,
            'A fairly long title for a toast on a phone',
            description: 'And a description that wraps on several lines.',
            action: TrcToastAction(label: 'Undo', onPressed: () {}),
          ),
        ),
      ),
      width: 360,
    );
    await tester.tap(find.text('Go'));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    TrcToaster.of(tester.element(find.text('Go'))).dismiss();
    await tester.pumpAndSettle();
  });

  testWidgets('TrcAlert has a thin colored edge', (tester) async {
    await pumpApp(
      tester,
      const SizedBox(
        width: 400,
        child: TrcAlert(
          title: 'Payment failed',
          tone: TrcAlertTone.error,
          live: true,
          child: Text('Check your card details.'),
        ),
      ),
    );
    final edge = tester.widget<ColoredBox>(
      find.descendant(
        of: find.byType(TrcAlert),
        matching: find.byType(ColoredBox),
      ),
    );
    expect(edge.color, const TrcThemeData().danger);
    expect(tester.getSize(find.byType(TrcAlert)).width, 400);
  });
}
