import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'field.dart';
import 'focus_ring.dart';
import 'foundation.dart';
import 'theme.dart';

/// Range slider: a thin track filled with the accent up to a white thumb.
/// Keyboard: the arrows move by [step], Page Up and Page Down by a tenth of
/// the range, Home and End to the ends. Screen readers get the formatted
/// value and can increase or decrease it. Works inside a [TrcField].
class TrcSlider extends StatefulWidget {
  /// A slider at [value].
  const TrcSlider({
    super.key,
    required this.value,
    required this.onChanged,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.showValue = false,
    this.formatValue,
    this.invalid,
    this.semanticLabel,
    this.focusNode,
  }) : assert(max > min),
       assert(step > 0);

  /// Current value.
  final double value;

  /// Called with the new value; disabled when null.
  final ValueChanged<double>? onChanged;

  /// Lowest value.
  final double min;

  /// Highest value.
  final double max;

  /// Values snap to multiples of [step] from [min].
  final double step;

  /// Shows the value next to the slider.
  final bool showValue;

  /// Formats the shown and announced value: "€ 40", "75 %".
  final String Function(double value)? formatValue;

  /// Error state; follows the enclosing field when null.
  final bool? invalid;

  /// Accessible name outside a field.
  final String? semanticLabel;

  /// Optional focus node.
  final FocusNode? focusNode;

  @override
  State<TrcSlider> createState() => _TrcSliderState();
}

class _TrcSliderState extends State<TrcSlider> {
  bool _hovered = false;
  bool _focused = false;

  String _format(double v) {
    if (widget.formatValue != null) return widget.formatValue!(v);
    return v == v.roundToDouble() ? v.toInt().toString() : v.toStringAsFixed(1);
  }

  double _snap(double v) {
    final snapped =
        widget.min + ((v - widget.min) / widget.step).round() * widget.step;
    return snapped.clamp(widget.min, widget.max).toDouble();
  }

  void _set(double v) {
    final next = _snap(v);
    if (next != widget.value) widget.onChanged?.call(next);
  }

  void _fromPosition(double dx, double width) {
    final t = (dx / width).clamp(0.0, 1.0);
    final rtl = Directionality.of(context) == TextDirection.rtl;
    _set(widget.min + (rtl ? 1 - t : t) * (widget.max - widget.min));
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (widget.onChanged == null ||
        (event is! KeyDownEvent && event is! KeyRepeatEvent)) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    final rtl = Directionality.of(context) == TextDirection.rtl;
    final big = (widget.max - widget.min) / 10;
    final double? next;
    if (key == LogicalKeyboardKey.arrowUp ||
        key ==
            (rtl
                ? LogicalKeyboardKey.arrowLeft
                : LogicalKeyboardKey.arrowRight)) {
      next = widget.value + widget.step;
    } else if (key == LogicalKeyboardKey.arrowDown ||
        key ==
            (rtl
                ? LogicalKeyboardKey.arrowRight
                : LogicalKeyboardKey.arrowLeft)) {
      next = widget.value - widget.step;
    } else if (key == LogicalKeyboardKey.pageUp) {
      next = widget.value + big;
    } else if (key == LogicalKeyboardKey.pageDown) {
      next = widget.value - big;
    } else if (key == LogicalKeyboardKey.home) {
      next = widget.min;
    } else if (key == LogicalKeyboardKey.end) {
      next = widget.max;
    } else {
      next = null;
    }
    if (next == null) return KeyEventResult.ignored;
    _set(next);
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final field = TrcFieldScope.maybeOf(context);
    final invalid = widget.invalid ?? field?.invalid ?? false;
    final enabled = widget.onChanged != null;
    final value = widget.value.clamp(widget.min, widget.max).toDouble();
    final t = (value - widget.min) / (widget.max - widget.min);
    final fill = invalid ? theme.danger : theme.accent;
    final up = _snap(value + widget.step);
    final down = _snap(value - widget.step);

    final slider = Semantics(
      container: true,
      slider: true,
      enabled: enabled,
      label: field?.label ?? widget.semanticLabel,
      hint: field?.message,
      value: _format(value),
      increasedValue: _format(up),
      decreasedValue: _format(down),
      onIncrease: enabled ? () => _set(up) : null,
      onDecrease: enabled ? () => _set(down) : null,
      child: Focus(
        canRequestFocus: false,
        skipTraversal: true,
        onKeyEvent: _onKey,
        child: FocusableActionDetector(
          enabled: enabled,
          focusNode: widget.focusNode ?? field?.focusNode,
          mouseCursor: enabled
              ? SystemMouseCursors.click
              : SystemMouseCursors.forbidden,
          onShowFocusHighlight: (v) => setState(() => _focused = v),
          onShowHoverHighlight: (v) => setState(() => _hovered = v),
          child: KeyedSubtree(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final width = constraints.maxWidth;
                const thumb = 20.0;
                final track = width - thumb;
                final rtl = Directionality.of(context) == TextDirection.rtl;
                final x = (rtl ? 1 - t : t) * track;
                return GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  excludeFromSemantics: true,
                  onTapDown: enabled
                      ? (d) =>
                            _fromPosition(d.localPosition.dx - thumb / 2, track)
                      : null,
                  onHorizontalDragUpdate: enabled
                      ? (d) =>
                            _fromPosition(d.localPosition.dx - thumb / 2, track)
                      : null,
                  child: SizedBox(
                    height: 32,
                    width: width,
                    child: Stack(
                      clipBehavior: Clip.none,
                      alignment: Alignment.centerLeft,
                      children: [
                        Positioned(
                          left: thumb / 2,
                          right: thumb / 2,
                          child: Container(
                            height: 4,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(2),
                              color: const Color(0x24FFFFFF),
                            ),
                          ),
                        ),
                        Positioned(
                          left: rtl ? x + thumb / 2 : thumb / 2,
                          width: rtl ? track - x : x,
                          child: Container(
                            height: 4,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(2),
                              color: fill,
                            ),
                          ),
                        ),
                        Positioned(
                          left: x,
                          child: TrcFocusRing(
                            visible: _focused,
                            circle: true,
                            child: AnimatedScale(
                              scale: _hovered && enabled ? 1.1 : 1,
                              duration: trcMotion(
                                context,
                                const Duration(milliseconds: 200),
                              ),
                              curve: theme.easeOut,
                              child: Container(
                                width: thumb,
                                height: thumb,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: theme.foreground,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );

    return Opacity(
      opacity: enabled ? 1 : 0.5,
      child: Row(
        children: [
          Expanded(child: slider),
          if (widget.showValue) ...[
            const SizedBox(width: 16),
            ExcludeSemantics(
              child: ConstrainedBox(
                constraints: const BoxConstraints(minWidth: 28),
                child: Text(
                  _format(value),
                  textAlign: TextAlign.end,
                  style: theme.text().copyWith(
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
