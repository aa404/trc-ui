import 'package:flutter/widgets.dart';

import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// Placeholder shape while content loads, with a slow shimmer (still when
/// the platform reduces motion). Hidden from screen readers: announce the
/// loading state elsewhere, for instance with a [TrcSpinner].
class TrcSkeleton extends StatefulWidget {
  /// A placeholder block.
  const TrcSkeleton({
    super.key,
    this.width,
    this.height = 16,
    this.circle = false,
    this.lines = 1,
  });

  /// Width; the available width when null.
  final double? width;

  /// Height of the block or of each line.
  final double height;

  /// Round, for an avatar ([width] is the diameter, 40 by default).
  final bool circle;

  /// Several lines of text, the last one shorter.
  final int lines;

  @override
  State<TrcSkeleton> createState() => _TrcSkeletonState();
}

class _TrcSkeletonState extends State<TrcSkeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1600),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (trcReduceMotion(context)) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget _block(double? width, double height, BorderRadius radius) {
    final theme = TrcTheme.of(context);
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        // A lighter band travels from right to left, like the CSS gradient.
        final t = Curves.easeInOut.transform(_controller.value);
        final center = 1.5 - 3 * t;
        return Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            borderRadius: radius,
            gradient: LinearGradient(
              begin: Alignment(center - 1, 0),
              end: Alignment(center + 1, 0),
              colors: [theme.surface, theme.surfaceAlt, theme.surface],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final Widget child;
    if (widget.circle) {
      final d = widget.width ?? 40;
      child = _block(d, d, BorderRadius.circular(d / 2));
    } else if (widget.lines > 1) {
      child = SizedBox(
        width: widget.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < widget.lines; i++) ...[
              if (i > 0) const SizedBox(height: 10),
              FractionallySizedBox(
                widthFactor: i == widget.lines - 1 ? 0.6 : 1,
                child: _block(null, widget.height, BorderRadius.circular(8)),
              ),
            ],
          ],
        ),
      );
    } else {
      child = _block(widget.width, widget.height, BorderRadius.circular(8));
    }
    return ExcludeSemantics(child: child);
  }
}

/// Size of a [TrcSpinner].
enum TrcSpinnerSize {
  /// 16 px.
  sm,

  /// 24 px.
  md,

  /// 40 px.
  lg,
}

/// Accent arc turning while something loads, announced to screen readers.
class TrcSpinner extends StatelessWidget {
  /// A spinner.
  const TrcSpinner({
    super.key,
    this.size = TrcSpinnerSize.md,
    this.label = 'Loading',
  });

  /// Size.
  final TrcSpinnerSize size;

  /// Announced to screen readers.
  final String label;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Semantics(
      label: label,
      liveRegion: true,
      container: true,
      child: TrcSpinningArc(
        size: switch (size) {
          TrcSpinnerSize.sm => 16,
          TrcSpinnerSize.md => 24,
          TrcSpinnerSize.lg => 40,
        },
        color: theme.accent,
        trackColor: const Color(0x1FFFFFFF),
      ),
    );
  }
}

/// Progress bar filled with the accent; indeterminate (a segment travelling
/// along the track) without a [value].
class TrcProgress extends StatefulWidget {
  /// A progress bar.
  const TrcProgress({
    super.key,
    this.value,
    this.max = 100,
    this.label,
    this.semanticLabel,
    this.showValue = false,
    this.formatValue,
  });

  /// Progress from 0 to [max]; null while the total is unknown.
  final double? value;

  /// Value of a full bar.
  final double max;

  /// Visible label above the bar, also its accessible name.
  final String? label;

  /// Accessible name when there is no visible label.
  final String? semanticLabel;

  /// Shows the formatted value above the bar.
  final bool showValue;

  /// Formats the value; a rounded percentage ("45 %") by default.
  final String Function(double value, double max)? formatValue;

  @override
  State<TrcProgress> createState() => _TrcProgressState();
}

class _TrcProgressState extends State<TrcProgress>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  );

  void _sync() {
    final run = widget.value == null && !trcReduceMotion(context);
    if (run && !_controller.isAnimating) {
      _controller.repeat();
    } else if (!run) {
      _controller.stop();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _sync();
  }

  @override
  void didUpdateWidget(TrcProgress oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final value = widget.value;
    final determinate = value != null;
    final clamped = determinate ? value.clamp(0, widget.max).toDouble() : 0.0;
    final text = determinate
        ? (widget.formatValue ?? (v, m) => '${(v / m * 100).round()} %')(
            clamped,
            widget.max,
          )
        : null;
    final reduce = trcReduceMotion(context);

    final track = ClipRRect(
      borderRadius: BorderRadius.circular(999),
      child: SizedBox(
        height: 6,
        child: ColoredBox(
          color: const Color(0x1AFFFFFF),
          child: LayoutBuilder(
            builder: (context, constraints) {
              final width = constraints.maxWidth;
              if (determinate) {
                return Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: AnimatedContainer(
                    duration: trcMotion(
                      context,
                      const Duration(milliseconds: 400),
                    ),
                    curve: theme.easeOut,
                    width: width * clamped / widget.max,
                    decoration: BoxDecoration(
                      color: theme.accent,
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                );
              }
              if (reduce) {
                return ColoredBox(color: theme.accent.withValues(alpha: 0.4));
              }
              return AnimatedBuilder(
                animation: _controller,
                builder: (context, _) {
                  final t = theme.ease.transform(_controller.value);
                  final segment = width * 0.35;
                  return Stack(
                    children: [
                      PositionedDirectional(
                        start: -segment + (width + segment) * t,
                        top: 0,
                        bottom: 0,
                        width: segment,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            color: theme.accent,
                            borderRadius: BorderRadius.circular(999),
                          ),
                        ),
                      ),
                    ],
                  );
                },
              );
            },
          ),
        ),
      ),
    );

    return Semantics(
      container: true,
      label: widget.label ?? widget.semanticLabel,
      value: text,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          if (widget.label != null || (widget.showValue && text != null)) ...[
            ExcludeSemantics(
              child: Row(
                children: [
                  if (widget.label != null)
                    Expanded(
                      child: Text(widget.label!, style: theme.text(size: 14)),
                    )
                  else
                    const Spacer(),
                  if (widget.showValue && text != null)
                    Padding(
                      padding: const EdgeInsetsDirectional.only(start: 16),
                      child: Text(
                        text,
                        style: theme
                            .text(size: 14, color: theme.foregroundSubtle)
                            .copyWith(
                              fontFeatures: const [
                                FontFeature.tabularFigures(),
                              ],
                            ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 8),
          ],
          track,
        ],
      ),
    );
  }
}

/// A key of the keyboard, for shortcuts: `TrcKbd('⌘')`, `TrcKbd('K')`.
class TrcKbd extends StatelessWidget {
  /// A key reading [label].
  const TrcKbd(this.label, {super.key});

  /// Text of the key.
  final String label;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Container(
      constraints: const BoxConstraints(minWidth: 22, minHeight: 22),
      padding: const EdgeInsets.symmetric(horizontal: 6),
      decoration: BoxDecoration(
        color: theme.surface,
        borderRadius: BorderRadius.circular(6),
        border: Border(
          top: BorderSide(color: theme.borderStrong),
          left: BorderSide(color: theme.borderStrong),
          right: BorderSide(color: theme.borderStrong),
          bottom: BorderSide(color: theme.borderStrong, width: 2),
        ),
      ),
      child: Center(
        widthFactor: 1,
        heightFactor: 1,
        child: Text(
          label,
          style: theme.mono(size: 12, color: theme.foregroundMuted, height: 1),
        ),
      ),
    );
  }
}

/// Hairline between groups of content, optionally with a word in the
/// middle ("or"), or vertical between inline items.
class TrcDivider extends StatelessWidget {
  /// A horizontal divider.
  const TrcDivider({super.key, this.label, this.spacing = 24})
    : vertical = false;

  /// A vertical divider, as tall as its parent allows (16 px at least).
  const TrcDivider.vertical({super.key})
    : label = null,
      spacing = 0,
      vertical = true;

  /// Word in the middle of the line.
  final String? label;

  /// Space above and below.
  final double spacing;

  /// Whether the divider is vertical.
  final bool vertical;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    if (vertical) {
      return Container(
        width: 1,
        constraints: const BoxConstraints(minHeight: 16),
        color: theme.borderStrong,
      );
    }
    final line = Container(height: 1, color: theme.border);
    if (label == null) {
      return Padding(
        padding: EdgeInsets.symmetric(vertical: spacing),
        child: line,
      );
    }
    return Padding(
      padding: EdgeInsets.symmetric(vertical: spacing),
      child: Row(
        children: [
          Expanded(child: line),
          const SizedBox(width: 16),
          Text(
            label!,
            style: theme.text(size: 13, color: theme.foregroundSubtle),
          ),
          const SizedBox(width: 16),
          Expanded(child: line),
        ],
      ),
    );
  }
}
