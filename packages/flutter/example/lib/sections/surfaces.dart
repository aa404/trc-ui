import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class SurfacesDemo extends StatelessWidget {
  const SurfacesDemo({super.key});

  @override
  Widget build(BuildContext context) {
    Widget body(String title, String text) => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TrcHeading(title, size: TrcHeadingSize.sm, level: 3),
        const SizedBox(height: 10),
        TrcText(text, size: TrcTextSize.sm),
      ],
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        LayoutBuilder(
          builder: (context, constraints) {
            final columns = constraints.maxWidth >= 720 ? 3 : 1;
            final width = (constraints.maxWidth - 16 * (columns - 1)) / columns;
            return Wrap(
              spacing: 16,
              runSpacing: 16,
              children: [
                SizedBox(
                  width: width,
                  child: TrcCard(
                    watermark: const TrcIcon(TrcGlyph.calendar),
                    child: body(
                      'Plan *ahead*',
                      'A watermark icon sits half out of the corner and wakes up on hover.',
                    ),
                  ),
                ),
                SizedBox(
                  width: width,
                  child: TrcCard(
                    onTap: () {},
                    child: body(
                      'Interactive',
                      'The whole card is a button: it lightens on hover.',
                    ),
                  ),
                ),
                SizedBox(
                  width: width,
                  child: TrcCard(
                    tone: TrcCardTone.alt,
                    child: body(
                      'Alt tone',
                      'A slightly lighter grey, to tell two blocks apart.',
                    ),
                  ),
                ),
              ],
            );
          },
        ),
        const SizedBox(height: 24),
        const TrcSection(
          inset: true,
          spacing: TrcSectionSpacing.sm,
          child: TrcContainer(
            size: TrcContainerSize.narrow,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TrcHeading('An inset *section*', size: TrcHeadingSize.lg),
                SizedBox(height: 12),
                TrcText('A large rounded card a few pixels from the edges.'),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
