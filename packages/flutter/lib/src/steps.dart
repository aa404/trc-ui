import 'package:flutter/widgets.dart';

import 'theme.dart';

/// One step of [TrcSteps].
@immutable
class TrcStep {
  /// A step titled [title].
  const TrcStep({required this.title, this.description});

  /// Title of the step.
  final String title;

  /// Detail under the title.
  final String? description;
}

/// Vertical timeline of steps in a real order: large thin numbers in the
/// accent, joined by a hairline. With [current], the earlier steps fade as
/// complete, the current one is announced and the upcoming ones dim.
class TrcSteps extends StatelessWidget {
  /// A timeline of [items].
  const TrcSteps({
    super.key,
    required this.items,
    this.current,
    this.currentLabel = 'Current step',
  });

  /// The steps.
  final List<TrcStep> items;

  /// Index of the step in progress (from 0); a plain list when null.
  final int? current;

  /// Read after the title of the current step.
  final String currentLabel;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < items.length; i++)
          _row(theme, i, i == items.length - 1),
      ],
    );
  }

  Widget _row(TrcThemeData theme, int i, bool last) {
    final c = current;
    final complete = c != null && i < c;
    final isCurrent = c != null && i == c;
    final upcoming = c != null && i > c;
    final item = items[i];
    return Semantics(
      container: true,
      hint: isCurrent ? currentLabel : null,
      child: Stack(
        children: [
          if (!last)
            PositionedDirectional(
              top: 48,
              bottom: 8,
              start: 27.5,
              width: 1,
              child: ColoredBox(
                color: complete
                    ? theme.accent.withValues(alpha: 0.5)
                    : theme.borderStrong,
              ),
            ),
          Padding(
            padding: EdgeInsets.only(bottom: last ? 0 : 36),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: 56,
                  child: ExcludeSemantics(
                    child: Opacity(
                      opacity: complete ? 0.55 : 1,
                      child: Text(
                        (i + 1).toString().padLeft(2, '0'),
                        textAlign: TextAlign.center,
                        style: theme
                            .text(
                              size: 40,
                              weight: FontWeight.w300,
                              height: 1,
                              letterSpacing: -0.025,
                              color: upcoming
                                  ? theme.foregroundFaint
                                  : theme.accent,
                            )
                            .copyWith(
                              fontFeatures: const [
                                FontFeature.tabularFigures(),
                              ],
                            ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title,
                          style: theme.text(
                            size: 18,
                            height: 1.35,
                            color: upcoming
                                ? theme.foregroundSubtle
                                : theme.foreground,
                          ),
                        ),
                        if (item.description != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 6),
                            child: Text(
                              item.description!,
                              style: theme.text(
                                height: 1.65,
                                color: theme.foregroundMuted,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
