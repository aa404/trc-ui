import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

import 'sections/pill.dart';
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
];

class GalleryPage extends StatelessWidget {
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
  Widget build(BuildContext context) {
    final shown = only == null
        ? sections
        : sections.where((s) => s.id == only).toList();
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
          children: [
            for (final section in shown)
              Padding(
                padding: const EdgeInsets.only(bottom: 56),
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
      ),
    );
  }
}
