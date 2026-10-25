import 'dart:math' as math;

import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// Maximum width of a [TrcContainer].
enum TrcContainerSize {
  /// 768 px: reading width.
  narrow,

  /// 1280 px: text and grids.
  normal,

  /// 1600 px: full-width cards.
  wide,
}

/// Centered maximum width, with side gutters that grow with the screen:
/// 16 px on phones, 24 px on tablets, 40 px beyond.
class TrcContainer extends StatelessWidget {
  /// Centers [child] within the maximum width of [size].
  const TrcContainer({
    super.key,
    required this.child,
    this.size = TrcContainerSize.normal,
  });

  /// Maximum width.
  final TrcContainerSize size;

  /// The content.
  final Widget child;

  /// Side gutter at a screen [width].
  static double gutterFor(double width) => width >= TrcBreakpoints.lg
      ? 40
      : width >= TrcBreakpoints.sm
      ? 24
      : 16;

  @override
  Widget build(BuildContext context) {
    final gutter = gutterFor(MediaQuery.sizeOf(context).width);
    final maxWidth = switch (size) {
      TrcContainerSize.narrow => 768.0,
      TrcContainerSize.normal => 1280.0,
      TrcContainerSize.wide => 1600.0,
    };
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: gutter),
          child: child,
        ),
      ),
    );
  }
}

/// Vertical spacing of a [TrcSection].
enum TrcSectionSpacing {
  /// No spacing.
  none,

  /// 48 px above and below.
  sm,

  /// 72 px, 96 px from tablets.
  md,

  /// 96 px, 128 px from tablets.
  lg,
}

/// Vertical block of a page. With [inset], it becomes a large rounded
/// graphite card a few pixels from the screen edges (the "magazine" effect),
/// for banners, calls to action and heroes.
class TrcSection extends StatelessWidget {
  /// A section holding [child].
  const TrcSection({
    super.key,
    required this.child,
    this.spacing = TrcSectionSpacing.md,
    this.inset = false,
  });

  /// Vertical spacing.
  final TrcSectionSpacing spacing;

  /// Card inset from the screen edges.
  final bool inset;

  /// The content, usually a [TrcContainer].
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final tablet = width >= TrcBreakpoints.md;
    final vertical = switch (spacing) {
      TrcSectionSpacing.none => 0.0,
      TrcSectionSpacing.sm => 48.0,
      TrcSectionSpacing.md => tablet ? 96.0 : 72.0,
      TrcSectionSpacing.lg => tablet ? 128.0 : 96.0,
    };
    final content = Padding(
      padding: EdgeInsets.symmetric(vertical: vertical),
      child: child,
    );
    if (!inset) return content;
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: width >= TrcBreakpoints.sm ? 16 : 8,
      ),
      child: Align(
        alignment: Alignment.topCenter,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1600),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(theme.radius),
            child: ColoredBox(color: theme.surface, child: content),
          ),
        ),
      ),
    );
  }
}

/// Background of a [TrcCard].
enum TrcCardTone {
  /// Graphite surface.
  normal,

  /// A slightly lighter grey, to tell two side-by-side blocks apart.
  alt,
}

/// Inner padding of a [TrcCard].
enum TrcCardPadding {
  /// No padding.
  none,

  /// 20 px.
  sm,

  /// 28 px.
  md,

  /// 32 px, 40 px from small tablets.
  lg,
}

/// Graphite card with rounded corners and no shadow: depth comes from shades
/// of grey.
///
/// With [onTap] it becomes a button that lightens on hover. A [watermark]
/// (usually a large line icon) sits half out of the top right corner, almost
/// invisible, and takes the accent when the card is hovered.
class TrcCard extends StatefulWidget {
  /// A card holding [child].
  const TrcCard({
    super.key,
    required this.child,
    this.tone = TrcCardTone.normal,
    this.padding = TrcCardPadding.md,
    this.onTap,
    this.watermark,
    this.semanticLabel,
    this.focusNode,
  });

  /// The content.
  final Widget child;

  /// Background.
  final TrcCardTone tone;

  /// Inner padding.
  final TrcCardPadding padding;

  /// Makes the whole card a button.
  final VoidCallback? onTap;

  /// Decorative watermark: drawn 160 px wide, thin and faint. A [TrcIcon] is
  /// kept to a 1.25 px stroke; other icons take the size and color from the
  /// [IconTheme].
  final Widget? watermark;

  /// Accessible name of an interactive card; its texts by default.
  final String? semanticLabel;

  /// Optional focus node of an interactive card.
  final FocusNode? focusNode;

  @override
  State<TrcCard> createState() => _TrcCardState();
}

class _TrcCardState extends State<TrcCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final pad = switch (widget.padding) {
      TrcCardPadding.none => 0.0,
      TrcCardPadding.sm => 20.0,
      TrcCardPadding.md => 28.0,
      TrcCardPadding.lg => width >= TrcBreakpoints.sm ? 40.0 : 32.0,
    };
    final interactive = widget.onTap != null;
    final radius = BorderRadius.circular(theme.radius);

    Widget card(TrcInteractionState state) {
      final lit = interactive && state.hovered;
      final alt = widget.tone == TrcCardTone.alt;
      final background = lit
          ? (alt
                ? Color.lerp(theme.surfaceAlt, const Color(0xFFFFFFFF), 0.08)!
                : theme.surfaceRaised)
          : (alt ? theme.surfaceAlt : theme.surface);
      final awake = _hovered || state.focused;
      final duration = trcMotion(context, const Duration(milliseconds: 600));

      Widget content = Padding(
        padding: EdgeInsets.all(pad),
        child: widget.child,
      );
      if (widget.watermark != null) {
        content = Stack(
          clipBehavior: Clip.hardEdge,
          children: [
            Positioned(
              top: -28,
              right: -28,
              width: 160,
              height: 160,
              child: ExcludeSemantics(
                child: AnimatedOpacity(
                  opacity: awake ? 0.18 : 0.05,
                  duration: duration,
                  curve: theme.easeOut,
                  child: TweenAnimationBuilder<double>(
                    tween: Tween(end: awake ? 1 : 0),
                    duration: duration,
                    curve: theme.easeOut,
                    builder: (context, t, child) => Transform.rotate(
                      angle: -6 * math.pi / 180 * t,
                      child: Transform.scale(
                        scale: 1 + 0.04 * t,
                        child: IconTheme(
                          data: IconThemeData(
                            size: 160,
                            color: Color.lerp(
                              theme.foreground,
                              theme.accent,
                              t,
                            ),
                          ),
                          child: child!,
                        ),
                      ),
                    ),
                    child: TrcIconStroke(width: 1.25, child: widget.watermark!),
                  ),
                ),
              ),
            ),
            content,
          ],
        );
      }

      return TrcFocusRing(
        visible: state.focused,
        borderRadius: radius,
        child: AnimatedContainer(
          duration: trcMotion(context, const Duration(milliseconds: 300)),
          curve: Curves.ease,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
            color: background,
            borderRadius: radius,
            border: Border.all(color: lit ? theme.borderStrong : theme.border),
          ),
          child: content,
        ),
      );
    }

    final hoverable = MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: interactive
          ? Semantics(
              button: true,
              label: widget.semanticLabel,
              child: TrcTappable(
                onTap: widget.onTap,
                focusNode: widget.focusNode,
                builder: (context, state) => card(state),
              ),
            )
          : card(const TrcInteractionState()),
    );
    return interactive ? MergeSemantics(child: hoverable) : hoverable;
  }
}
