import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class TypographyDemo extends StatelessWidget {
  const TypographyDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TrcHeading(
          'Welcome to *deep black.*',
          level: 1,
          size: TrcHeadingSize.display,
        ),
        SizedBox(height: 24),
        TrcText(
          'The words between asterisks take the accent color. Body text '
          'stays muted so that it never competes with the headings.',
          size: TrcTextSize.lg,
        ),
        SizedBox(height: 40),
        TrcHeading(
          'The reality in data',
          size: TrcHeadingSize.lg,
          accentLast: 2,
        ),
        SizedBox(height: 16),
        TrcHeading('A medium *heading*', size: TrcHeadingSize.md, level: 3),
        SizedBox(height: 12),
        TrcHeading('A small heading', size: TrcHeadingSize.sm, level: 4),
        SizedBox(height: 12),
        TrcText(
          'Subtle text, for details.',
          tone: TrcTextTone.subtle,
          size: TrcTextSize.sm,
        ),
        SizedBox(height: 32),
        Wrap(
          spacing: 40,
          runSpacing: 16,
          children: [
            TrcStepNumber(1),
            TrcStepNumber(2),
            TrcStepNumber(3, small: true),
          ],
        ),
      ],
    );
  }
}
