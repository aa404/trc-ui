import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trc_ui/trc_ui.dart';

import 'helpers.dart';

TrcFile file(String name, String type, [int size = 1000]) =>
    TrcFile(name: name, size: size, mimeType: type);

void main() {
  group('file helpers', () {
    test('formats sizes', () {
      expect(formatBytes(820), '820 B');
      expect(formatBytes(14540), '14 KB');
      expect(formatBytes((3.5 * 1024 * 1024).round()), '3.5 MB');
    });

    test('matches accept lists by extension, family and exact type', () {
      expect(acceptsFile(file('a.PNG', 'image/png'), 'image/*'), isTrue);
      expect(
        acceptsFile(file('a.pdf', 'application/pdf'), '.pdf,image/*'),
        isTrue,
      );
      expect(
        acceptsFile(file('a.zip', 'application/zip'), '.pdf,image/*'),
        isFalse,
      );
      expect(acceptsFile(file('a.txt', 'text/plain'), 'text/plain'), isTrue);
    });

    test('rejects by type, then size, then count', () {
      final result = validateFiles(
        [
          file('a.png', 'image/png'),
          file('b.zip', 'application/zip'),
          file('c.png', 'image/png', 9000),
          file('d.png', 'image/png'),
        ],
        accept: 'image/*',
        maxSize: 5000,
        maxFiles: 1,
      );
      expect(result.accepted.map((f) => f.name), ['a.png']);
      expect(result.rejected.map((r) => '${r.file.name}:${r.reason.name}'), [
        'b.zip:type',
        'c.png:size',
        'd.png:count',
      ]);
    });
  });

  testWidgets('TrcFileField shows the chosen file, then a count', (
    tester,
  ) async {
    var pick = [file('cv.pdf', 'application/pdf')];
    List<TrcFile>? changed;
    await pumpTrc(
      tester,
      TrcField(
        label: 'Resume',
        child: TrcFileField(
          onPick: () async => pick,
          onChanged: (f) => changed = f,
          countLabel: '{count} fichiers',
        ),
      ),
    );
    expect(find.text('No file chosen'), findsOneWidget);
    await tester.tap(find.byType(TrcFileField));
    await tester.pump();
    expect(find.text('cv.pdf'), findsOneWidget);
    expect(changed, hasLength(1));
    pick = [file('a.png', 'image/png'), file('b.png', 'image/png')];
    await tester.tap(find.byType(TrcFileField));
    await tester.pump();
    expect(find.text('2 fichiers'), findsOneWidget);
  });

  testWidgets('TrcDropzone lists, removes and announces rejections', (
    tester,
  ) async {
    final handle = tester.ensureSemantics();
    final key = GlobalKey<TrcDropzoneState>();
    List<TrcFile>? latest;
    await pumpTrc(
      tester,
      TrcDropzone(
        key: key,
        accept: 'image/*',
        maxSize: 5000,
        hint: 'PNG or JPG',
        onPick: () async => [file('a.png', 'image/png', 2048)],
        onChanged: (f) => latest = f,
        rejectionLabels: const {
          TrcFileRejectionReason.type: '{name} : type refusé',
        },
      ),
    );
    expect(find.bySemanticsLabel('Drop files here or browse'), findsOneWidget);
    await tester.tap(find.byType(TrcDropzone));
    await tester.pump();
    expect(find.text('a.png'), findsOneWidget);
    expect(find.text('2.0 KB'), findsOneWidget);

    key.currentState!.add([
      file('ok.png', 'image/png'),
      file('doc.zip', 'application/zip'),
      file('big.png', 'image/png', 9000),
    ]);
    await tester.pump();
    expect(find.text('doc.zip : type refusé'), findsOneWidget);
    expect(find.text('big.png'), findsNothing);
    expect(latest!.map((f) => f.name), ['a.png', 'ok.png']);

    await tester.tap(find.bySemanticsLabel('Remove a.png'));
    await tester.pump();
    expect(find.text('a.png'), findsNothing);
    expect(latest!.map((f) => f.name), ['ok.png']);
    handle.dispose();
  });
}
