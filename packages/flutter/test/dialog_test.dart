import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  testWidgets('showTrcDialog opens a named modal and returns a value', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    Future<String?>? result;
    await pumpTrc(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Delete',
          onPressed: () => result = showTrcDialog<String>(
            context: context,
            title: 'Delete the project?',
            description: 'This cannot be undone.',
            child: const Text('Every file goes with it.'),
            actions: [
              Builder(
                builder: (context) => TrcPillButton(
                  label: 'Delete',
                  solid: true,
                  onPressed: () => Navigator.pop(context, 'deleted'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
    await tester.tap(find.byType(TrcPillButton));
    await tester.pumpAndSettle();
    expect(find.text('Delete the project?'), findsOneWidget);
    expect(find.bySemanticsLabel('Delete the project?'), findsWidgets);
    await tester.tap(find.byType(TrcPillButton).last);
    await tester.pumpAndSettle();
    expect(await result, 'deleted');
    expect(find.text('Delete the project?'), findsNothing);
    handle.dispose();
  });

  testWidgets('Escape and the close button close the dialog', (tester) async {
    await pumpTrc(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Open',
          onPressed: () => showTrcDialog<void>(
            context: context,
            title: 'Settings',
            closeLabel: 'Fermer',
          ),
        ),
      ),
    );
    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('Settings'), findsNothing);

    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();
    await tester.tap(find.bySemanticsLabel('Fermer'));
    await tester.pumpAndSettle();
    expect(find.text('Settings'), findsNothing);
  });

  testWidgets('a long dialog scrolls at 360 px without overflow', (
    tester,
  ) async {
    await pumpTrc(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Open',
          onPressed: () => showTrcDialog<void>(
            context: context,
            title: 'A rather long title for a narrow phone screen',
            child: Text('Long text. ' * 300),
            actions: [
              TrcPillButton(label: 'Cancel', onPressed: () {}),
              TrcPillButton(label: 'Confirm', solid: true, onPressed: () {}),
            ],
          ),
        ),
      ),
      width: 360,
      height: 640,
    );
    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });

  testWidgets('showTrcDrawer slides a panel from the chosen side', (
    tester,
  ) async {
    await pumpTrc(
      tester,
      Builder(
        builder: (context) => TrcPillButton(
          label: 'Filters',
          onPressed: () => showTrcDrawer<void>(
            context: context,
            title: 'Filters',
            side: TrcDrawerSide.start,
            child: const Text('Options'),
            actions: [TrcPillButton(label: 'Apply', onPressed: () {})],
          ),
        ),
      ),
      width: 1000,
    );
    await tester.tap(find.text('Filters'));
    await tester.pumpAndSettle();
    final panel = tester.getRect(
      find
          .descendant(
            of: find.byType(TrcDrawer),
            matching: find.byType(Container),
          )
          .first,
    );
    expect(panel.left, 0);
    expect(panel.width, 380);
    await tester.tapAt(const Offset(900, 400));
    await tester.pumpAndSettle();
    expect(find.text('Options'), findsNothing);
  });
}
