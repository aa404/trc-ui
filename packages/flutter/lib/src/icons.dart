import 'dart:math' as math;

import 'package:flutter/widgets.dart';

/// The few line icons used by the trc widgets, drawn on a 24 unit grid with
/// round caps, like the SVG icons of the React library.
enum TrcGlyph {
  /// Arrow to the right: the dot of the pill.
  arrowRight,

  /// Arrow to the left: "Back".
  arrowLeft,

  /// Arrow up.
  arrowUp,

  /// Chevron down: selects, accordions.
  chevronDown,

  /// Chevron to the left: previous month.
  chevronLeft,

  /// Chevron to the right: next month.
  chevronRight,

  /// Check mark.
  check,

  /// Cross: close buttons.
  close,

  /// Three lines: menu button.
  menu,

  /// Calendar.
  calendar,

  /// Two sheets: copy button.
  copy,
}

/// Lets [TrcIcon]s below use a fixed stroke width in logical pixels whatever
/// their size, like `vector-effect: non-scaling-stroke`. The card watermark
/// uses it to keep a very large icon thin.
class TrcIconStroke extends InheritedWidget {
  /// Sets the stroke [width] of the icons in [child].
  const TrcIconStroke({super.key, required this.width, required super.child});

  /// Stroke width in logical pixels.
  final double width;

  /// The closest stroke width, if any.
  static double? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TrcIconStroke>()?.width;

  @override
  bool updateShouldNotify(TrcIconStroke oldWidget) => width != oldWidget.width;
}

/// A line icon from [TrcGlyph]. Its size and color come from the closest
/// [IconTheme] unless given.
class TrcIcon extends StatelessWidget {
  /// Draws [glyph].
  const TrcIcon(
    this.glyph, {
    super.key,
    this.size,
    this.color,
    this.strokeWidth,
    this.semanticLabel,
  });

  /// The icon drawn.
  final TrcGlyph glyph;

  /// Width and height; the [IconTheme] size (24 by default) when null.
  final double? size;

  /// Stroke color; the [IconTheme] color when null.
  final Color? color;

  /// Stroke width in grid units (the icon is 24 units wide): 2 by default.
  final double? strokeWidth;

  /// Read by screen readers; the icon is decorative without it.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final theme = IconTheme.of(context);
    final s = size ?? theme.size ?? 24;
    final fixed = TrcIconStroke.maybeOf(context);
    final stroke = strokeWidth != null
        ? strokeWidth! * s / 24
        : fixed ?? 2 * s / 24;
    final icon = SizedBox.square(
      dimension: s,
      child: CustomPaint(
        painter: _GlyphPainter(
          glyph,
          color ?? theme.color ?? const Color(0xFFFFFFFF),
          stroke,
        ),
      ),
    );
    if (semanticLabel == null) return ExcludeSemantics(child: icon);
    return Semantics(label: semanticLabel, image: true, child: icon);
  }
}

class _GlyphPainter extends CustomPainter {
  _GlyphPainter(this.glyph, this.color, this.stroke);

  final TrcGlyph glyph;
  final Color color;
  final double stroke;

  @override
  void paint(Canvas canvas, Size size) {
    final k = size.width / 24;
    canvas.save();
    canvas.scale(k);
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke / k
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..isAntiAlias = true;
    canvas.drawPath(_glyphPath(glyph), paint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_GlyphPainter old) =>
      old.glyph != glyph || old.color != color || old.stroke != stroke;
}

/// Path of [glyph] on the 24 unit grid.
Path _glyphPath(TrcGlyph glyph) {
  final p = Path();
  void line(List<double> points) {
    p.moveTo(points[0], points[1]);
    for (var i = 2; i < points.length; i += 2) {
      p.lineTo(points[i], points[i + 1]);
    }
  }

  switch (glyph) {
    case TrcGlyph.arrowRight:
      line([5, 12, 19, 12]);
      line([13, 6, 19, 12, 13, 18]);
    case TrcGlyph.arrowLeft:
      line([19, 12, 5, 12]);
      line([11, 18, 5, 12, 11, 6]);
    case TrcGlyph.arrowUp:
      line([12, 19, 12, 5]);
      line([6, 11, 12, 5, 18, 11]);
    case TrcGlyph.chevronDown:
      line([6, 9, 12, 15, 18, 9]);
    case TrcGlyph.chevronLeft:
      line([15, 6, 9, 12, 15, 18]);
    case TrcGlyph.chevronRight:
      line([9, 6, 15, 12, 9, 18]);
    case TrcGlyph.check:
      line([20, 6, 9, 17, 4, 12]);
    case TrcGlyph.close:
      line([18, 6, 6, 18]);
      line([6, 6, 18, 18]);
    case TrcGlyph.menu:
      line([4, 7, 20, 7]);
      line([4, 12, 20, 12]);
      line([4, 17, 20, 17]);
    case TrcGlyph.calendar:
      p.addRRect(RRect.fromLTRBR(3, 5, 21, 21, const Radius.circular(3)));
      line([3, 10, 21, 10]);
      line([8, 3, 8, 7]);
      line([16, 3, 16, 7]);
    case TrcGlyph.copy:
      p.addRRect(RRect.fromLTRBR(9, 9, 21, 21, const Radius.circular(2.5)));
      p.moveTo(5, 15);
      p.lineTo(4.5, 15);
      p.arcToPoint(const Offset(3, 13.5), radius: const Radius.circular(1.5));
      p.lineTo(3, 4.5);
      p.arcToPoint(const Offset(4.5, 3), radius: const Radius.circular(1.5));
      p.lineTo(13.5, 3);
      p.arcToPoint(const Offset(15, 4.5), radius: const Radius.circular(1.5));
      p.lineTo(15, 5);
  }
  return p;
}

/// The accent arc turning while something loads (the loading pill, the
/// spinner). Turns once every 0.8 s; still when the platform reduces motion.
class TrcSpinningArc extends StatefulWidget {
  /// Draws a spinning arc.
  const TrcSpinningArc({
    super.key,
    this.size = 24,
    this.color,
    this.trackColor,
    this.strokeWidth = 2.5,
    this.sweep = math.pi / 2,
  });

  /// Width and height.
  final double size;

  /// Arc color; the [IconTheme] color when null.
  final Color? color;

  /// Full circle drawn under the arc; none when null.
  final Color? trackColor;

  /// Stroke width in grid units (24 per icon).
  final double strokeWidth;

  /// Length of the arc, in radians.
  final double sweep;

  @override
  State<TrcSpinningArc> createState() => _TrcSpinningArcState();
}

class _TrcSpinningArcState extends State<TrcSpinningArc>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 800),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final reduce = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    if (reduce) {
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

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? IconTheme.of(context).color!;
    return ExcludeSemantics(
      child: RotationTransition(
        turns: _controller,
        child: CustomPaint(
          size: Size.square(widget.size),
          painter: _ArcPainter(
            color: color,
            track: widget.trackColor,
            stroke: widget.strokeWidth * widget.size / 24,
            sweep: widget.sweep,
          ),
        ),
      ),
    );
  }
}

class _ArcPainter extends CustomPainter {
  _ArcPainter({
    required this.color,
    required this.track,
    required this.stroke,
    required this.sweep,
  });

  final Color color;
  final Color? track;
  final double stroke;
  final double sweep;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final circle = rect.deflate(size.width * 2 / 24 + 0.0);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round;
    if (track != null) {
      canvas.drawOval(circle, paint..color = track!);
    }
    canvas.drawArc(circle, -math.pi / 2, sweep, false, paint..color = color);
  }

  @override
  bool shouldRepaint(_ArcPainter old) =>
      old.color != color ||
      old.track != track ||
      old.stroke != stroke ||
      old.sweep != sweep;
}
