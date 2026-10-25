import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

typedef Row3 = ({String name, int visits, String city});

void main() {
  test('avatarInitials takes up to two initials', () {
    expect(avatarInitials('Aurel Agbado'), 'AA');
    expect(avatarInitials('  ama   kofi mensah '), 'AM');
    expect(avatarInitials('trc'), 'T');
    expect(avatarInitials(''), '');
  });

  testWidgets('TrcAvatar shows initials, named for screen readers', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(tester, const TrcAvatar(name: 'Ama Mensah'));
    expect(find.text('AM'), findsOneWidget);
    expect(find.bySemanticsLabel('Ama Mensah'), findsOneWidget);
    handle.dispose();
  });

  testWidgets('TrcAvatarGroup sums up the rest with a template', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      const TrcAvatarGroup(
        max: 2,
        moreLabel: '{count} de plus',
        avatars: [
          TrcAvatar(name: 'Ama'),
          TrcAvatar(name: 'Koffi'),
          TrcAvatar(name: 'Yao'),
          TrcAvatar(name: 'Efua'),
        ],
      ),
    );
    expect(find.text('+2'), findsOneWidget);
    expect(find.bySemanticsLabel('2 de plus'), findsOneWidget);
    expect(find.text('Y'), findsNothing);
    handle.dispose();
  });

  testWidgets('TrcTag removes with a named button', (tester) async {
    final handle = tester.ensureSemantics();
    var removed = false;
    await pumpTrc(
      tester,
      TrcTag('Design', accent: true, onRemove: () => removed = true),
    );
    await tester.tap(find.bySemanticsLabel('Remove Design'));
    expect(removed, isTrue);
    handle.dispose();
  });

  testWidgets('TrcStat colors its change', (tester) async {
    await pumpTrc(
      tester,
      const TrcStat(
        label: 'Revenue',
        value: '€ 48,200',
        change: '+12 %',
        changeTone: TrcStatTone.positive,
        description: 'vs last month',
      ),
    );
    final change = tester.widget<Text>(find.text('+12 %'));
    expect(change.style!.color, const TrcThemeData().accent);
  });

  group('TrcTable', () {
    final rows = <Row3>[
      (name: 'Cotonou', visits: 320, city: 'BJ'),
      (name: 'Accra', visits: 1200, city: 'GH'),
      (name: 'Lomé', visits: 45, city: 'TG'),
    ];
    final columns = [
      TrcTableColumn<Row3>(
        header: 'City',
        cell: (r) => r.name,
        sortValue: (r) => r.name,
      ),
      TrcTableColumn<Row3>(
        header: 'Visits',
        cell: (r) => r.visits,
        align: TrcColumnAlign.end,
        sortValue: (r) => r.visits,
      ),
      TrcTableColumn<Row3>(header: 'Code', cell: (r) => r.city),
    ];

    testWidgets('sorts by a column and announces the order', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(
        tester,
        TrcTable<Row3>(caption: 'Visits by city', columns: columns, rows: rows),
      );
      double y(String text) => tester.getTopLeft(find.text(text)).dy;
      expect(y('Cotonou'), lessThan(y('Accra')));
      await tester.tap(find.text('Visits'));
      await tester.pumpAndSettle();
      expect(y('Lomé'), lessThan(y('Cotonou')));
      expect(
        tester.getSemantics(find.bySemanticsLabel('Visits')).value,
        'sorted ascending',
      );
      await tester.tap(find.text('Visits'));
      await tester.pumpAndSettle();
      expect(y('Accra'), lessThan(y('Cotonou')));
      expect(find.bySemanticsLabel('Visits by city'), findsOneWidget);
      handle.dispose();
    });

    testWidgets('scrolls sideways at 320 px and shows an empty text', (
      tester,
    ) async {
      await pumpTrc(
        tester,
        Column(
          children: [
            TrcTable<Row3>(caption: 'Visits', columns: columns, rows: rows),
            TrcTable<Row3>(
              caption: 'Nothing',
              columns: columns,
              rows: const [],
              emptyText: 'No visits yet',
            ),
          ],
        ),
        width: 320,
      );
      expect(tester.takeException(), isNull);
      expect(find.text('No visits yet'), findsOneWidget);
    });
  });
}
