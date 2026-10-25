import 'dart:async';

import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// The signature pill button: a thin border and a round accent dot holding an
/// arrow. On hover or keyboard focus the dot stretches to fill the pill, under
/// the border, and the label turns dark once the fill is underneath.
///
/// On touch screens there is no hover: a press stretches the dot briefly.
class TrcPillButton extends StatefulWidget {
  /// A pill showing [label].
  const TrcPillButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.solid = false,
    this.small = false,
    this.icon,
    this.loading = false,
    this.loadingLabel = 'Loading',
    this.focusNode,
    this.autofocus = false,
    this.semanticLabel,
  });

  /// Text of the button, on one line (cut with an ellipsis when too long).
  final String label;

  /// Called on tap, Enter or Space; the pill is disabled when null.
  final VoidCallback? onPressed;

  /// White background: the main action of a screen.
  final bool solid;

  /// Compact version (40 px high instead of 56): toolbars, headers.
  final bool small;

  /// Replaces the arrow in the dot, for instance a left arrow for "Back":
  /// `TrcIcon(TrcGlyph.arrowLeft)`. Keep it a single line icon.
  final Widget? icon;

  /// Replaces the icon with a spinner and disables the button.
  final bool loading;

  /// Announced to screen readers while [loading].
  final String loadingLabel;

  /// Optional focus node.
  final FocusNode? focusNode;

  /// Takes the focus when first built.
  final bool autofocus;

  /// Accessible name, when it should differ from [label].
  final String? semanticLabel;

  @override
  State<TrcPillButton> createState() => _TrcPillButtonState();
}

class _TrcPillButtonState extends State<TrcPillButton>
    with TickerProviderStateMixin {
  late final AnimationController _fill = AnimationController(vsync: this);
  late final AnimationController _label = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 300),
  );
  Timer? _labelDelay;
  Timer? _release;
  bool _active = false;

  bool get _enabled => widget.onPressed != null && !widget.loading;

  void _update(TrcInteractionState state) {
    final active = state.hovered || state.focused || state.pressed;
    if (active == _active) {
      if (active) _release?.cancel();
      return;
    }
    if (active) {
      _release?.cancel();
      _setActive(true, immediateLabel: state.focused);
    } else if (!state.hovered && !state.focused) {
      // After a tap, leave the stretch on screen a moment before it shrinks.
      _release?.cancel();
      _release = Timer(
        const Duration(milliseconds: 250),
        () => _setActive(false),
      );
    }
  }

  void _setActive(bool value, {bool immediateLabel = false}) {
    if (!mounted) return;
    _active = value;
    final theme = TrcTheme.of(context);
    final reduce = trcReduceMotion(context);
    _fill.duration = reduce ? Duration.zero : theme.duration;
    _labelDelay?.cancel();
    if (value) {
      _fill.animateTo(1, curve: theme.ease);
      // The label darkens once the fill is underneath, 150 ms later…
      if (immediateLabel || reduce) {
        _label.value = 1;
      } else {
        _labelDelay = Timer(
          const Duration(milliseconds: 150),
          () => _label.forward(),
        );
      }
    } else {
      // … and lightens right away on leave.
      _fill.animateBack(0, curve: theme.ease);
      if (reduce) {
        _label.value = 0;
      } else {
        _label.reverse();
      }
    }
  }

  @override
  void didUpdateWidget(TrcPillButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_enabled && _active) {
      _release?.cancel();
      _setActive(false);
    }
  }

  @override
  void dispose() {
    _labelDelay?.cancel();
    _release?.cancel();
    _fill.dispose();
    _label.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final small = widget.small;
    final height = small ? 40.0 : 56.0;
    final inset = small ? 4.0 : 6.0;
    final dot = height - 2 - inset * 2;
    final gap = small ? 10.0 : 14.0;
    final endPadding = small ? 16.0 : 24.0;
    final labelColor = widget.solid ? theme.background : theme.foreground;

    final Widget icon = widget.loading
        ? TrcSpinningArc(size: small ? 16 : 18, color: theme.onAccent)
        : IconTheme(
            data: IconThemeData(color: theme.onAccent, size: small ? 16 : 18),
            child: widget.icon ?? const TrcIcon(TrcGlyph.arrowRight),
          );

    Widget content(double? maxWidth) {
      final text = AnimatedBuilder(
        animation: _label,
        builder: (context, _) => Text(
          widget.label,
          maxLines: 1,
          softWrap: false,
          overflow: TextOverflow.ellipsis,
          style: theme.text(
            size: small ? 14 : 15,
            weight: FontWeight.w500,
            height: 1.2,
            color: Color.lerp(labelColor, theme.onAccent, _label.value),
          ),
        ),
      );
      return Padding(
        padding: EdgeInsets.fromLTRB(1 + inset, 0, 1 + endPadding, 0),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox.square(
              dimension: dot,
              child: Center(child: icon),
            ),
            SizedBox(width: gap),
            if (maxWidth == null || maxWidth.isInfinite)
              text
            else
              Flexible(child: text),
          ],
        ),
      );
    }

    return MergeSemantics(
      child: Semantics(
        button: true,
        enabled: _enabled,
        label: widget.loading ? widget.loadingLabel : widget.semanticLabel,
        excludeSemantics: widget.semanticLabel != null,
        child: TrcTappable(
          enabled: _enabled,
          onTap: widget.onPressed,
          focusNode: widget.focusNode,
          autofocus: widget.autofocus,
          onStateChange: _update,
          builder: (context, state) {
            return TrcFocusRing(
              visible: state.focused,
              borderRadius: BorderRadius.circular(height / 2),
              child: Opacity(
                opacity: _enabled || widget.loading ? 1 : 0.6,
                child: CustomPaint(
                  painter: _PillPainter(
                    progress: _fill,
                    inset: 1 + inset,
                    dot: dot,
                    fill: theme.accent,
                    background: widget.solid
                        ? const Color(0xFFFFFFFF)
                        : const Color(0x00000000),
                    border: widget.solid
                        ? const Color(0xFFFFFFFF)
                        : theme.borderPill,
                  ),
                  child: SizedBox(
                    height: height,
                    child: LayoutBuilder(
                      builder: (context, constraints) =>
                          content(constraints.maxWidth),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

/// Paints the pill: its background and border, and the accent fill that
/// grows from the round dot to the whole inner width.
class _PillPainter extends CustomPainter {
  _PillPainter({
    required this.progress,
    required this.inset,
    required this.dot,
    required this.fill,
    required this.background,
    required this.border,
  }) : super(repaint: progress);

  final Animation<double> progress;
  final double inset;
  final double dot;
  final Color fill;
  final Color background;
  final Color border;

  @override
  void paint(Canvas canvas, Size size) {
    final outer = RRect.fromRectAndRadius(
      Offset.zero & size,
      Radius.circular(size.height / 2),
    );
    if (background.a > 0) canvas.drawRRect(outer, Paint()..color = background);
    final full = size.width - inset * 2;
    final width = dot + (full - dot) * progress.value;
    canvas.drawRRect(
      RRect.fromLTRBR(
        inset,
        inset,
        inset + width,
        size.height - inset,
        Radius.circular(dot / 2),
      ),
      Paint()..color = fill,
    );
    canvas.drawRRect(
      outer.deflate(0.5),
      Paint()
        ..color = border
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1,
    );
  }

  @override
  bool shouldRepaint(_PillPainter old) =>
      old.inset != inset ||
      old.dot != dot ||
      old.fill != fill ||
      old.background != background ||
      old.border != border;
}
