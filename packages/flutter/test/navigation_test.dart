import 'dart:ui' show CheckedState, Tristate;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

void main() {
  group('paginationRange', () {
    test('shows every page when they fit', () {
      expect(paginationRange(3, 7), [1, 2, 3, 4, 5, 6, 7]);
    });

    test('keeps a constant number of entries around the current page', () {
      expect(paginationRange(1, 20), [1, 2, 3, 4, 5, null, 20]);
      expect(paginationRange(4, 20), [1, 2, 3, 4, 5, null, 20]);
      expect(paginationRange(5, 20), [1, null, 4, 5, 6, null, 20]);
      expect(paginationRange(16, 20), [1, null, 15, 16, 17, null, 20]);
      expect(paginationRange(17, 20), [1, null, 16, 17, 18, 19, 20]);
      expect(paginationRange(20, 20), [1, null, 16, 17, 18, 19, 20]);
      for (var page = 1; page <= 20; page++) {
        expect(paginationRange(page, 20), hasLength(7));
      }
    });

    test('widens with more siblings', () {
      expect(paginationRange(10, 20, siblings: 2), [
        1,
        null,
        8,
        9,
        10,
        11,
        12,
        null,
        20,
      ]);
    });
  });

  group('TrcPagination', () {
    testWidgets('marks the current page and changes page', (tester) async {
      final handle = tester.ensureSemantics();
      final pages = <int>[];
      await pumpTrc(
        tester,
        TrcPagination(page: 5, total: 20, onChanged: pages.add),
      );
      expect(
        tester.getSemantics(find.bySemanticsLabel('Page 5')),
        matchesSemantics(
          label: 'Page 5',
          isButton: true,
          isSelected: true,
          hasSelectedState: true,
          hasEnabledState: true,
          isEnabled: true,
          isFocusable: true,
          hasTapAction: true,
          hasFocusAction: true,
        ),
      );
      await tester.tap(find.text('6'));
      await tester.tap(find.bySemanticsLabel('Previous'));
      expect(pages, [6, 4]);
      handle.dispose();
    });

    testWidgets('translates labels and renders nothing for one page', (
      tester,
    ) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(
        tester,
        TrcPagination(
          page: 1,
          total: 3,
          onChanged: (_) {},
          pageLabel: 'Aller à la page {page}',
          previousLabel: 'Précédent',
        ),
      );
      expect(find.bySemanticsLabel('Aller à la page 2'), findsOneWidget);
      final previous = tester.getSemantics(find.bySemanticsLabel('Précédent'));
      expect(previous.flagsCollection.isEnabled, isNot(Tristate.isTrue));
      await pumpTrc(
        tester,
        TrcPagination(page: 1, total: 1, onChanged: (_) {}),
      );
      expect(find.text('1'), findsNothing);
      handle.dispose();
    });

    testWidgets('stays on one line at 320 px', (tester) async {
      await pumpTrc(
        tester,
        TrcPagination(page: 10, total: 120, onChanged: (_) {}),
        width: 320,
      );
      expect(tester.takeException(), isNull);
      expect(
        tester.getSize(find.byType(TrcPagination)).width,
        lessThanOrEqualTo(288),
      );
    });
  });

  group('TrcTabs', () {
    final items = [
      const TrcTabItem(value: 'a', label: 'Overview', content: Text('Panel A')),
      const TrcTabItem(
        value: 'b',
        label: 'Billing',
        content: Text('Panel B'),
        disabled: true,
      ),
      const TrcTabItem(value: 'c', label: 'Team', content: Text('Panel C')),
    ];

    testWidgets('shows the selected panel and switches on tap', (tester) async {
      await pumpTrc(tester, TrcTabs<String>(items: items));
      expect(find.text('Panel A'), findsOneWidget);
      await tester.tap(find.text('Billing'));
      await tester.pump();
      expect(find.text('Panel A'), findsOneWidget);
      await tester.tap(find.text('Team'));
      await tester.pumpAndSettle();
      expect(find.text('Panel C'), findsOneWidget);
    });

    testWidgets('arrows select automatically and skip disabled tabs', (
      tester,
    ) async {
      useKeyboardFocus();
      final changes = <String>[];
      await pumpTrc(
        tester,
        TrcTabs<String>(items: items, onChanged: changes.add),
      );
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.pumpAndSettle();
      expect(changes, ['c']);
      expect(find.text('Panel C'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.home);
      await tester.pumpAndSettle();
      expect(changes, ['c', 'a']);
    });

    testWidgets('manual activation selects with Enter only', (tester) async {
      useKeyboardFocus();
      final changes = <String>[];
      await pumpTrc(
        tester,
        TrcTabs<String>(
          items: items,
          onChanged: changes.add,
          manualActivation: true,
        ),
      );
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.sendKeyEvent(LogicalKeyboardKey.end);
      await tester.pump();
      expect(changes, isEmpty);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pump();
      expect(changes, ['c']);
    });
  });

  testWidgets('TrcSegmentedControl is a radio group moved by arrows', (
    tester,
  ) async {
    useKeyboardFocus();
    final handle = tester.ensureSemantics();
    var value = 'month';
    await pumpTrc(
      tester,
      StatefulBuilder(
        builder: (context, setState) => TrcSegmentedControl<String>(
          semanticLabel: 'Billing period',
          value: value,
          onChanged: (v) => setState(() => value = v),
          options: const [
            TrcSegment(value: 'month', label: 'Monthly'),
            TrcSegment(value: 'year', label: 'Yearly'),
          ],
        ),
      ),
    );
    final node = tester.getSemantics(find.bySemanticsLabel('Monthly'));
    expect(node.flagsCollection.isInMutuallyExclusiveGroup, isTrue);
    expect(node.flagsCollection.isChecked, CheckedState.isTrue);
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    expect(value, 'year');
    await tester.tap(find.text('Monthly'));
    await tester.pump();
    expect(value, 'month');
    handle.dispose();
  });

  group('TrcAccordion', () {
    final items = [
      const TrcAccordionItem(
        value: 1,
        title: 'Shipping',
        content: Text('Two days.'),
      ),
      const TrcAccordionItem(
        value: 2,
        title: 'Returns',
        content: Text('Thirty days.'),
      ),
      const TrcAccordionItem(
        value: 3,
        title: 'Warranty',
        content: Text('Two years.'),
      ),
    ];

    testWidgets('single: opening one closes the other', (tester) async {
      final handle = tester.ensureSemantics();
      await pumpTrc(tester, TrcAccordion<int>(items: items));
      expect(find.text('Two days.'), findsNothing);
      await tester.tap(find.text('Shipping'));
      await tester.pumpAndSettle();
      expect(find.text('Two days.'), findsOneWidget);
      final node = tester.getSemantics(find.bySemanticsLabel('Shipping'));
      expect(node.flagsCollection.isExpanded, Tristate.isTrue);
      await tester.tap(find.text('Returns'));
      await tester.pumpAndSettle();
      expect(find.text('Two days.'), findsNothing);
      expect(find.text('Thirty days.'), findsOneWidget);
      handle.dispose();
    });

    testWidgets('multiple, with arrows between titles', (tester) async {
      useKeyboardFocus();
      final changes = <List<int>>[];
      await pumpTrc(
        tester,
        TrcAccordion<int>(
          items: items,
          multiple: true,
          initialValue: const [1],
          onChanged: changes.add,
        ),
      );
      await tester.sendKeyEvent(LogicalKeyboardKey.tab);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(changes.last, [1, 2]);
      await tester.sendKeyEvent(LogicalKeyboardKey.end);
      await tester.sendKeyEvent(LogicalKeyboardKey.space);
      await tester.pumpAndSettle();
      expect(changes.last, [1, 2, 3]);
    });
  });

  testWidgets('TrcBreadcrumbs links every item but the current page', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    var home = 0;
    await pumpTrc(
      tester,
      TrcBreadcrumbs(
        items: [
          TrcBreadcrumb(label: 'Home', onTap: () => home++),
          TrcBreadcrumb(label: 'Docs', onTap: () {}),
          const TrcBreadcrumb(label: 'Pagination'),
        ],
      ),
    );
    expect(
      tester.getSemantics(find.bySemanticsLabel('Home')).flagsCollection.isLink,
      isTrue,
    );
    expect(find.text('/'), findsNWidgets(2));
    await tester.tap(find.text('Home'));
    expect(home, 1);
    handle.dispose();
  });

  testWidgets('TrcLanguageSwitcher marks the current language', (tester) async {
    final handle = tester.ensureSemantics();
    String? chosen;
    await pumpTrc(
      tester,
      TrcLanguageSwitcher(
        value: 'en',
        onChanged: (c) => chosen = c,
        languages: const [
          TrcLanguage(code: 'en', name: 'English'),
          TrcLanguage(code: 'fr', name: 'Français'),
        ],
      ),
    );
    expect(find.text('FR'), findsOneWidget);
    expect(
      tester
          .getSemantics(find.bySemanticsLabel('English'))
          .flagsCollection
          .isSelected,
      Tristate.isTrue,
    );
    await tester.tap(find.text('FR'));
    expect(chosen, 'fr');
    handle.dispose();
  });

  testWidgets('TrcSteps numbers the steps and marks the current one', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    await pumpTrc(
      tester,
      const TrcSteps(
        current: 1,
        items: [
          TrcStep(title: 'Create an account', description: 'One minute.'),
          TrcStep(title: 'Add your team'),
          TrcStep(title: 'Publish'),
        ],
      ),
      width: 360,
    );
    expect(find.text('02'), findsOneWidget);
    final current = tester.getSemantics(
      find
          .ancestor(
            of: find.text('Add your team'),
            matching: find.byType(Semantics),
          )
          .first,
    );
    expect(current.hint, 'Current step');
    expect(tester.takeException(), isNull);
    handle.dispose();
  });
}
