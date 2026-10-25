import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

/// Gallery entry: opens the bottom navigation screen.
class BottomNavDemo extends StatelessWidget {
  const BottomNavDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional.centerStart,
      child: TrcPillButton(
        label: 'Open the bottom navigation screen',
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const BottomNavScreen()),
        ),
      ),
    );
  }
}

/// A phone-like screen whose content scrolls behind the bar, so that the
/// glass background shows its blur.
class BottomNavScreen extends StatefulWidget {
  const BottomNavScreen({super.key});

  @override
  State<BottomNavScreen> createState() => _BottomNavScreenState();
}

class _BottomNavScreenState extends State<BottomNavScreen> {
  int _index = 0;
  TrcBottomNavStyle _style = TrcBottomNavStyle.floating;
  TrcBottomNavLabels _labels = TrcBottomNavLabels.always;
  bool _glass = true;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Scaffold(
      extendBody: true,
      body: SafeArea(
        bottom: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 120),
          children: [
            Row(
              children: [
                if (Navigator.of(context).canPop())
                  Padding(
                    padding: const EdgeInsetsDirectional.only(end: 12),
                    child: TrcPillButton(
                      label: 'Back',
                      small: true,
                      icon: const TrcIcon(TrcGlyph.arrowLeft),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                const Expanded(
                  child: TrcHeading(
                    'Bottom *navigation*',
                    size: TrcHeadingSize.md,
                    level: 1,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            TrcSegmentedControl<TrcBottomNavStyle>(
              semanticLabel: 'Style',
              small: true,
              value: _style,
              onChanged: (v) => setState(() => _style = v),
              options: const [
                TrcSegment(
                  value: TrcBottomNavStyle.floating,
                  label: 'Floating',
                ),
                TrcSegment(value: TrcBottomNavStyle.bar, label: 'Bar'),
              ],
            ),
            const SizedBox(height: 12),
            TrcSegmentedControl<TrcBottomNavLabels>(
              semanticLabel: 'Labels',
              small: true,
              value: _labels,
              onChanged: (v) => setState(() => _labels = v),
              options: const [
                TrcSegment(value: TrcBottomNavLabels.always, label: 'Labels'),
                TrcSegment(
                  value: TrcBottomNavLabels.selected,
                  label: 'Selected',
                ),
                TrcSegment(value: TrcBottomNavLabels.never, label: 'Icons'),
              ],
            ),
            const SizedBox(height: 16),
            TrcSwitch(
              value: _glass,
              onChanged: (v) => setState(() => _glass = v),
              label: 'Glass',
              description: 'Scroll: the content shows through, blurred.',
            ),
            const SizedBox(height: 32),
            for (var i = 0; i < 8; i++) ...[
              _Story(index: i, accent: theme.accent),
              const SizedBox(height: 16),
            ],
          ],
        ),
      ),
      bottomNavigationBar: TrcBottomNav(
        currentIndex: _index,
        onTap: (i) => setState(() => _index = i),
        style: _style,
        labels: _labels,
        glass: _glass,
        items: const [
          TrcBottomNavItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          TrcBottomNavItem(icon: Icon(Icons.search_rounded), label: 'Search'),
          TrcBottomNavItem(
            icon: Icon(Icons.chat_bubble_outline_rounded),
            activeIcon: Icon(Icons.chat_bubble_rounded),
            label: 'Messages',
            badge: 3,
          ),
          TrcBottomNavItem(
            icon: Icon(Icons.notifications_none_rounded),
            activeIcon: Icon(Icons.notifications_rounded),
            label: 'Alerts',
            dot: true,
          ),
          TrcBottomNavItem(
            icon: Icon(Icons.person_outline_rounded),
            activeIcon: Icon(Icons.person_rounded),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class _Story extends StatelessWidget {
  const _Story({required this.index, required this.accent});

  final int index;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final titles = [
      'A studio in *Cotonou*',
      'Designing in *deep black*',
      'The pill that *stretches*',
      'Thin type, *one accent*',
    ];
    return TrcCard(
      padding: TrcCardPadding.none,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            height: 120,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: index.isEven
                    ? [accent, const Color(0xFF232428)]
                    : [const Color(0xFFD41367), accent.withValues(alpha: 0.4)],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const TrcTag('Story', accent: true),
                const SizedBox(height: 12),
                TrcHeading(
                  titles[index % titles.length],
                  size: TrcHeadingSize.sm,
                  level: 3,
                ),
                const SizedBox(height: 8),
                const TrcText(
                  'Graphite cards, thin headings and a single accent color.',
                  size: TrcTextSize.sm,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
