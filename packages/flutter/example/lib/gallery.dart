import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

import 'sections/advanced_forms.dart';
import 'sections/bottom_nav.dart';
import 'sections/data.dart';
import 'sections/forms.dart';
import 'sections/navigation.dart';
import 'sections/overlays.dart';
import 'sections/pill.dart';
import 'sections/surfaces.dart';
import 'sections/tokens.dart';
import 'sections/typography.dart';

/// One block of the gallery.
class GallerySection {
  const GallerySection(this.id, this.title, this.builder);

  /// Used in `?section=` to show this block alone.
  final String id;
  final String title;
  final WidgetBuilder builder;
}

final sections = <GallerySection>[
  GallerySection('tokens', 'Tokens', (_) => const TokensDemo()),
  GallerySection('typography', 'Typography', (_) => const TypographyDemo()),
  GallerySection('pill', 'Pill buttons', (_) => const PillDemo()),
  GallerySection('surfaces', 'Surfaces', (_) => const SurfacesDemo()),
  GallerySection('forms', 'Forms', (_) => const FormsDemo()),
  GallerySection(
    'advanced-forms',
    'More form controls',
    (_) => const AdvancedFormsDemo(),
  ),
  GallerySection(
    'overlays',
    'Overlays and feedback',
    (_) => const OverlaysDemo(),
  ),
  GallerySection('navigation', 'Navigation', (_) => const NavigationDemo()),
  GallerySection('data', 'Data display', (_) => const DataDemo()),
  GallerySection(
    'bottom-nav',
    'Bottom navigation',
    (_) => const BottomNavDemo(),
  ),
];

const _accents = {
  'Cyan': Color(0xFF08C8D8),
  'Magenta': Color(0xFFD41367),
  'Lime': Color(0xFFB4E033),
  'Amber': Color(0xFFF5A623),
};

class GalleryPage extends StatefulWidget {
  const GalleryPage({
    super.key,
    required this.accent,
    required this.onAccentChange,
    this.only,
  });

  final Color accent;
  final ValueChanged<Color> onAccentChange;

  /// Id of the only section to show, if any.
  final String? only;

  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  final _scroll = ScrollController();
  final _keys = {for (final s in sections) s.id: GlobalKey()};

  @override
  void dispose() {
    _scroll.dispose();
    super.dispose();
  }

  void _goTo(String id) {
    final context = _keys[id]?.currentContext;
    if (context == null) return;
    Scrollable.ensureVisible(
      context,
      duration: const Duration(milliseconds: 600),
      curve: TrcTheme.of(this.context).ease,
      alignmentPolicy: ScrollPositionAlignmentPolicy.explicit,
    );
  }

  @override
  Widget build(BuildContext context) {
    final only = widget.only;
    final shown = only == null || only == 'chrome'
        ? sections
        : sections.where((s) => s.id == only).toList();
    final chrome = only == null || only == 'chrome';
    TrcNavItem nav(String label, String id) =>
        TrcNavItem(label: label, onTap: () => _goTo(id));

    return Scaffold(
      body: Stack(
        children: [
          ListView(
            controller: _scroll,
            padding: EdgeInsets.only(bottom: 32, top: chrome ? 0 : 32),
            children: [
              if (chrome) ...[
                TrcPageHero(
                  title: 'Flutter widgets in *deep black*',
                  description:
                      'Near-black backgrounds, graphite cards, thin headings, one '
                      'accent color and pill buttons whose dot stretches on hover.',
                  meta: const Text('trc_ui · every widget on one page'),
                  actions: [
                    TrcPillButton(
                      label: 'See the components',
                      solid: true,
                      onPressed: () => _goTo('pill'),
                    ),
                    TrcPillButton(
                      label: 'Forms',
                      onPressed: () => _goTo('forms'),
                    ),
                  ],
                ),
                const SizedBox(height: 48),
              ],
              for (final section in shown)
                Padding(
                  key: _keys[section.id],
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 56),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1040),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          TrcHeading(section.title, size: TrcHeadingSize.md),
                          const SizedBox(height: 24),
                          section.builder(context),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
          if (chrome)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: TrcHeader(
                controller: _scroll,
                logo: Text(
                  'trc ui',
                  style: TrcTheme.of(
                    context,
                  ).text(size: 20, letterSpacing: -0.03),
                ),
                onLogoTap: () => _scroll.animateTo(
                  0,
                  duration: const Duration(milliseconds: 600),
                  curve: TrcTheme.of(context).ease,
                ),
                nav: [
                  TrcNavItem(
                    label: 'Overview',
                    active: true,
                    onTap: () => _goTo('tokens'),
                  ),
                  TrcNavItem(
                    label: 'Components',
                    children: [
                      nav('Pill buttons', 'pill'),
                      nav('Surfaces', 'surfaces'),
                      nav('Forms', 'forms'),
                      nav('Overlays', 'overlays'),
                      nav('Navigation', 'navigation'),
                      nav('Data display', 'data'),
                    ],
                  ),
                  nav('Typography', 'typography'),
                ],
                actions: [
                  TrcMenu(
                    align: TrcAlign.end,
                    items: [
                      for (final entry in _accents.entries)
                        TrcMenuItem(
                          label: entry.key,
                          hint: entry.value == widget.accent ? 'Current' : null,
                          onSelected: () => widget.onAccentChange(entry.value),
                        ),
                    ],
                    builder: (context, toggle, open) => TrcPillButton(
                      label: 'Accent',
                      small: true,
                      onPressed: toggle,
                    ),
                  ),
                ],
              ),
            ),
          if (chrome)
            PositionedDirectional(
              end: 24,
              bottom: 24,
              child: TrcBackToTop(controller: _scroll),
            ),
        ],
      ),
    );
  }
}
