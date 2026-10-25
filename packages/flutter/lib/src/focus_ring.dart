import 'package:flutter/widgets.dart';

import 'theme.dart';

/// Draws the trc focus ring around [child] when [visible]: a 2 px gap in the
/// page color, then a 2 px accent line, following the given corner radius.
///
/// The ring is painted outside the child's box, so leave a few pixels of room
/// around it or it may be clipped by a parent.
class TrcFocusRing extends StatelessWidget {
  /// Wraps [child] with a ring shown when [visible].
  const TrcFocusRing({
    super.key,
    required this.visible,
    required this.child,
    this.borderRadius,
    this.circle = false,
    this.color,
  });

  /// Whether the ring shows.
  final bool visible;

  /// Corner radius of the child; the ring follows it at a distance.
  final BorderRadius? borderRadius;

  /// Draws a circle around a round child instead.
  final bool circle;

  /// Ring color; the accent by default.
  final Color? color;

  /// The element focused.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return CustomPaint(
      foregroundPainter: visible
          ? _RingPainter(
              color: color ?? theme.ring,
              radius: borderRadius ?? BorderRadius.zero,
              circle: circle,
            )
          : null,
      child: child,
    );
  }
}

class _RingPainter extends CustomPainter {
  _RingPainter({
    required this.color,
    required this.radius,
    required this.circle,
  });

  final Color color;
  final BorderRadius radius;
  final bool circle;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    // Centered on the 2 px line that starts 2 px out of the box.
    final rect = (Offset.zero & size).inflate(3);
    if (circle) {
      canvas.drawOval(rect, paint);
      return;
    }
    Radius grow(Radius r) => r == Radius.zero
        ? const Radius.circular(3)
        : Radius.elliptical(r.x + 3, r.y + 3);
    canvas.drawRRect(
      RRect.fromRectAndCorners(
        rect,
        topLeft: grow(radius.topLeft),
        topRight: grow(radius.topRight),
        bottomLeft: grow(radius.bottomLeft),
        bottomRight: grow(radius.bottomRight),
      ),
      paint,
    );
  }

  @override
  bool shouldRepaint(_RingPainter old) =>
      old.color != color || old.radius != radius || old.circle != circle;
}
