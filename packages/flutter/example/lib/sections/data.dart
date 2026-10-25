import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

typedef _Page = ({String page, int visits, double rate});

class DataDemo extends StatelessWidget {
  const DataDemo({super.key});

  @override
  Widget build(BuildContext context) {
    const gap = SizedBox(height: 40);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Wrap(
          spacing: 24,
          runSpacing: 16,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            TrcAvatar(name: 'Aurel Agbado', size: TrcAvatarSize.lg),
            TrcAvatar(name: 'Ama Mensah'),
            TrcAvatar(name: 'trc', size: TrcAvatarSize.sm),
            TrcAvatarGroup(
              avatars: [
                TrcAvatar(name: 'Ama Mensah'),
                TrcAvatar(name: 'Koffi Yao'),
                TrcAvatar(name: 'Efua Boateng'),
                TrcAvatar(name: 'Sena Dossou'),
                TrcAvatar(name: 'Kwame Asante'),
                TrcAvatar(name: 'Abla Kodjo'),
              ],
            ),
          ],
        ),
        const SizedBox(height: 24),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            const TrcTag('New', accent: true),
            const TrcTag('Design'),
            const TrcTag('Branding'),
            TrcTag('Remote', onRemove: () {}),
          ],
        ),
        gap,
        LayoutBuilder(
          builder: (context, constraints) {
            final columns = constraints.maxWidth >= 720 ? 3 : 1;
            final width = (constraints.maxWidth - 16 * (columns - 1)) / columns;
            return Wrap(
              spacing: 16,
              runSpacing: 16,
              children: [
                for (final stat in const [
                  TrcStat(
                    label: 'Revenue',
                    value: '€ 48,200',
                    change: '+12 %',
                    changeTone: TrcStatTone.positive,
                    description: 'vs last month',
                  ),
                  TrcStat(
                    label: 'Churn',
                    value: '2.4 %',
                    change: '+0.3 pt',
                    changeTone: TrcStatTone.negative,
                    description: 'vs last month',
                  ),
                  TrcStat(label: 'Active users', value: '12,840'),
                ])
                  SizedBox(
                    width: width,
                    child: TrcCard(child: stat),
                  ),
              ],
            );
          },
        ),
        gap,
        TrcTable<_Page>(
          caption: 'Most visited pages',
          initialSortColumn: 1,
          initialSortDirection: TrcSortDirection.descending,
          columns: [
            TrcTableColumn(
              header: 'Page',
              cell: (r) => r.page,
              sortValue: (r) => r.page,
            ),
            TrcTableColumn(
              header: 'Visits',
              cell: (r) => '${r.visits}',
              align: TrcColumnAlign.end,
              sortValue: (r) => r.visits,
            ),
            TrcTableColumn(
              header: 'Bounce rate',
              cell: (r) => '${r.rate} %',
              align: TrcColumnAlign.end,
              sortValue: (r) => r.rate,
            ),
          ],
          rows: const [
            (page: '/pricing', visits: 4210, rate: 31.2),
            (page: '/', visits: 12840, rate: 42.5),
            (page: '/docs/getting-started', visits: 2380, rate: 18.4),
            (page: '/blog/deep-black', visits: 960, rate: 55.1),
          ],
        ),
        gap,
        const Row(
          children: [
            TrcSkeleton(circle: true),
            SizedBox(width: 16),
            Expanded(child: TrcSkeleton(lines: 3, height: 12)),
          ],
        ),
        const SizedBox(height: 32),
        const Wrap(
          spacing: 24,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            TrcSpinner(size: TrcSpinnerSize.sm),
            TrcSpinner(),
            TrcSpinner(size: TrcSpinnerSize.lg),
          ],
        ),
        const SizedBox(height: 32),
        const TrcProgress(
          value: 64,
          label: 'Uploading photos',
          showValue: true,
        ),
        const SizedBox(height: 20),
        const TrcProgress(label: 'Syncing'),
        const TrcDivider(label: 'or'),
        const Wrap(
          spacing: 6,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            TrcText('Search with', size: TrcTextSize.sm),
            TrcKbd('⌘'),
            TrcKbd('K'),
          ],
        ),
        gap,
        const TrcCodeBlock(
          title: 'lib/main.dart',
          language: 'dart',
          code: '''import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

void main() => runApp(
  MaterialApp(
    theme: const TrcThemeData().toMaterialTheme(),
    home: const HomePage(),
  ),
);''',
        ),
        const SizedBox(height: 16),
        const TrcCodeBlock(code: 'flutter pub add trc_ui'),
      ],
    );
  }
}
