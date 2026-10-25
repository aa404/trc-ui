import 'dart:math' as math;

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'foundation.dart';
import 'theme.dart';

/// Preferred side of a floating element against its anchor. It flips to the
/// other side when there is not enough room.
enum TrcSide {
  /// Above the anchor.
  top,

  /// Below the anchor.
  bottom,
}

/// Horizontal alignment of a floating element against its anchor.
enum TrcAlign {
  /// Left edges aligned (right edges in right-to-left text).
  start,

  /// Centered on the anchor.
  center,

  /// Right edges aligned.
  end,
}

/// Why a floating element asks to close.
enum TrcDismissReason {
  /// A press outside the anchor and the panel.
  outside,

  /// The Escape key.
  escape,
}

const double _margin = 8;

/// Shows [panelBuilder] in the overlay, against [child], while [open].
///
/// The panel flips to the other side when there is no room, stays inside the
/// screen and follows scrolling. A press outside both, or Escape, calls
/// [onDismiss]. Internal building block of the menus, popovers, tooltips and
/// pickers.
class TrcAnchoredOverlay extends StatefulWidget {
  /// Anchors a panel to [child].
  const TrcAnchoredOverlay({
    super.key,
    required this.open,
    required this.child,
    required this.panelBuilder,
    this.side = TrcSide.bottom,
    this.align = TrcAlign.start,
    this.offset = 8,
    this.onDismiss,
    this.matchWidth = false,
    this.animate = true,
  });

  /// Whether the panel shows.
  final bool open;

  /// The anchor.
  final Widget child;

  /// Builds the panel.
  final WidgetBuilder panelBuilder;

  /// Preferred side.
  final TrcSide side;

  /// Horizontal alignment.
  final TrcAlign align;

  /// Distance between the anchor and the panel.
  final double offset;

  /// Called on a press outside or on Escape.
  final ValueChanged<TrcDismissReason>? onDismiss;

  /// Makes the panel exactly as wide as the anchor (listboxes).
  final bool matchWidth;

  /// Fades the panel in while it rises from its side.
  final bool animate;

  @override
  State<TrcAnchoredOverlay> createState() => _TrcAnchoredOverlayState();
}

class _TrcAnchoredOverlayState extends State<TrcAnchoredOverlay> {
  final _portal = OverlayPortalController();
  final _anchorKey = GlobalKey();
  final _group = Object();
  ScrollPosition? _scroll;

  @override
  void initState() {
    super.initState();
    // The portal stays attached; its child is empty while closed. Showing
    // it is not allowed during a build, hence after the first frame.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _portal.show();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final position = Scrollable.maybeOf(context)?.position;
    if (position != _scroll) {
      _scroll?.removeListener(_follow);
      _scroll = position?..addListener(_follow);
    }
  }

  void _follow() {
    if (widget.open && mounted) setState(() {});
  }

  @override
  void dispose() {
    _scroll?.removeListener(_follow);
    super.dispose();
  }

  /// The anchor's rectangle in the overlay's coordinates, from the last
  /// layout (read while building the panel).
  Rect? _anchorRect() {
    final box = _anchorKey.currentContext?.findRenderObject();
    if (box is! RenderBox || !box.hasSize || !box.attached) return null;
    final overlay = Overlay.maybeOf(context)?.context.findRenderObject();
    final transform = box.getTransformTo(overlay is RenderBox ? overlay : null);
    return MatrixUtils.transformRect(transform, Offset.zero & box.size);
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (widget.open &&
        event is KeyDownEvent &&
        event.logicalKey == LogicalKeyboardKey.escape &&
        widget.onDismiss != null) {
      widget.onDismiss!(TrcDismissReason.escape);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final textDirection = Directionality.maybeOf(context) ?? TextDirection.ltr;
    // Rebuilds, and so places the panel again, when the window resizes.
    MediaQuery.maybeSizeOf(context);
    return Focus(
      canRequestFocus: false,
      skipTraversal: true,
      onKeyEvent: _onKey,
      child: OverlayPortal(
        controller: _portal,
        overlayChildBuilder: (overlayContext) {
          if (!widget.open) return const SizedBox.shrink();
          Widget panel = TapRegion(
            groupId: _group,
            onTapOutside: (_) =>
                widget.onDismiss?.call(TrcDismissReason.outside),
            child: widget.panelBuilder(overlayContext),
          );
          if (widget.animate) {
            panel = _FloatingEntrance(side: widget.side, child: panel);
          }
          return CustomSingleChildLayout(
            delegate: _AnchorDelegate(
              anchor: _anchorRect(),
              side: widget.side,
              align: widget.align,
              offset: widget.offset,
              matchWidth: widget.matchWidth,
              textDirection: textDirection,
            ),
            child: panel,
          );
        },
        child: TapRegion(
          groupId: _group,
          child: KeyedSubtree(key: _anchorKey, child: widget.child),
        ),
      ),
    );
  }
}

class _AnchorDelegate extends SingleChildLayoutDelegate {
  _AnchorDelegate({
    required this.anchor,
    required this.side,
    required this.align,
    required this.offset,
    required this.matchWidth,
    required this.textDirection,
  });

  final Rect? anchor;
  final TrcSide side;
  final TrcAlign align;
  final double offset;
  final bool matchWidth;
  final TextDirection textDirection;

  Rect _anchorRect(Size overlay) {
    return anchor ?? Rect.fromLTWH(0, 0, overlay.width, 0);
  }

  @override
  BoxConstraints getConstraintsForChild(BoxConstraints constraints) {
    final size = constraints.biggest;
    final a = _anchorRect(size);
    final below = size.height - a.bottom - offset - _margin;
    final above = a.top - offset - _margin;
    final maxWidth = math.max(0.0, size.width - _margin * 2);
    return BoxConstraints(
      minWidth: matchWidth ? math.min(a.width, maxWidth) : 0,
      maxWidth: matchWidth ? math.min(a.width, maxWidth) : maxWidth,
      maxHeight: math.max(math.max(below, above), 48),
    );
  }

  @override
  Offset getPositionForChild(Size size, Size childSize) {
    final a = _anchorRect(size);
    final below = a.bottom + offset;
    final above = a.top - offset - childSize.height;
    final fitsBelow = below + childSize.height <= size.height - _margin;
    final fitsAbove = above >= _margin;
    final resolved = side == TrcSide.bottom
        ? (fitsBelow || !fitsAbove ? TrcSide.bottom : TrcSide.top)
        : (fitsAbove || !fitsBelow ? TrcSide.top : TrcSide.bottom);
    final rtl = textDirection == TextDirection.rtl;
    final start = rtl ? TrcAlign.end : TrcAlign.start;
    final end = rtl ? TrcAlign.start : TrcAlign.end;
    var left = align == start
        ? a.left
        : align == end
        ? a.right - childSize.width
        : a.center.dx - childSize.width / 2;
    left = left
        .clamp(
          _margin,
          math.max(_margin, size.width - childSize.width - _margin),
        )
        .toDouble();
    var top = resolved == TrcSide.bottom ? below : above;
    top = top
        .clamp(
          _margin,
          math.max(_margin, size.height - childSize.height - _margin),
        )
        .toDouble();
    return Offset(left, top);
  }

  @override
  bool shouldRelayout(_AnchorDelegate oldDelegate) =>
      anchor != oldDelegate.anchor ||
      side != oldDelegate.side ||
      align != oldDelegate.align ||
      offset != oldDelegate.offset ||
      matchWidth != oldDelegate.matchWidth ||
      textDirection != oldDelegate.textDirection;
}

class _FloatingEntrance extends StatelessWidget {
  const _FloatingEntrance({required this.side, required this.child});

  final TrcSide side;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final duration = trcMotion(context, const Duration(milliseconds: 200));
    if (duration == Duration.zero) return child;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: duration,
      curve: theme.easeOut,
      builder: (context, t, child) => Opacity(
        opacity: t,
        child: Transform.translate(
          offset: Offset(0, (side == TrcSide.bottom ? -4 : 4) * (1 - t)),
          child: child,
        ),
      ),
      child: child,
    );
  }
}

/// Graphite panel of the floating elements: thin border, rounded corners and
/// the one soft shadow of the design, which detaches it from the page.
class TrcFloatingPanel extends StatelessWidget {
  /// Wraps [child] in a floating panel.
  const TrcFloatingPanel({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(6),
    this.radius = 14,
    this.width,
    this.color,
  });

  /// The content.
  final Widget child;

  /// Inner padding.
  final EdgeInsetsGeometry padding;

  /// Corner radius.
  final double radius;

  /// Fixed width, if any.
  final double? width;

  /// Background; the surface by default.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Container(
      width: width,
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? theme.surface,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: const Color(0x1AFFFFFF)),
        boxShadow: const [
          BoxShadow(
            color: Color(0xB3000000),
            offset: Offset(0, 24),
            blurRadius: 60,
            spreadRadius: -20,
          ),
        ],
      ),
      child: DefaultTextStyle(
        style: theme.text(color: theme.foreground),
        child: child,
      ),
    );
  }
}
