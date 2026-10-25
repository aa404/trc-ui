import 'dart:math' as math;
import 'dart:ui' show ImageFilter;

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'theme.dart';

/// A destination of a [TrcBottomNav].
@immutable
class TrcBottomNavItem {
  /// A destination with an [icon] and a [label].
  const TrcBottomNavItem({
    required this.icon,
    required this.label,
    this.activeIcon,
    this.badge,
    this.dot = false,
  });

  /// Icon, such as `Icon(Icons.home_outlined)` or a [TrcIcon]; its size and
  /// color come from the bar.
  final Widget icon;

  /// Label, shown according to [TrcBottomNav.labels] and always read by
  /// screen readers.
  final String label;

  /// Icon of the selected destination, such as a filled variant.
  final Widget? activeIcon;

  /// Number shown in a small accent badge ("99+" above 99); none when null
  /// or zero.
  final int? badge;

  /// A small accent dot, for news without a count.
  final bool dot;
}

/// Shape of a [TrcBottomNav].
enum TrcBottomNavStyle {
  /// A full-width bar docked to the bottom edge, above the safe area.
  bar,

  /// A capsule floating above the bottom edge, with margins: the trc inset
  /// card look.
  floating,
}

/// When a [TrcBottomNav] shows its labels.
enum TrcBottomNavLabels {
  /// Under every icon.
  always,

  /// Under the selected icon only.
  selected,

  /// Never: icons only (the labels are still read by screen readers).
  never,
}

/// Bottom navigation bar in the trc style: an accent pill behind the
/// selected icon slides from one destination to the next, stretching like
/// the pill button. Docked [TrcBottomNavStyle.bar] or
/// [TrcBottomNavStyle.floating] capsule, with an optional frosted [glass]
/// background that blurs the content scrolling behind it.
///
/// ```dart
/// TrcBottomNav(
///   items: const [
///     TrcBottomNavItem(icon: Icon(Icons.home_outlined), label: 'Home'),
///     TrcBottomNavItem(icon: Icon(Icons.search), label: 'Search'),
///   ],
///   currentIndex: index,
///   onTap: (i) => setState(() => index = i),
/// )
/// ```
///
/// Use it as `Scaffold.bottomNavigationBar`, with `extendBody: true` so that
/// the content scrolls behind a floating or glass bar. Keyboard: the arrows,
/// Home and End move between destinations, Enter or Space opens one; only the
/// current destination is in the Tab order.
class TrcBottomNav extends StatefulWidget {
  /// A bottom navigation over 2 to 5 [items].
  const TrcBottomNav({
    super.key,
    required this.items,
    required this.currentIndex,
    required this.onTap,
    this.style = TrcBottomNavStyle.floating,
    this.labels = TrcBottomNavLabels.always,
    this.glass = false,
    this.blurSigma = 24,
    this.glassOpacity = 0.6,
    this.height,
    this.backgroundColor,
    this.borderColor,
    this.radius,
    this.margin,
    this.itemSpacing = 4,
    this.iconSize = 22,
    this.centerAction,
    this.semanticLabel = 'Navigation',
    this.badgeLabel = '{count} new',
    this.dotLabel = 'New',
  }) : assert(items.length >= 2 && items.length <= 5),
       assert(currentIndex >= 0 && currentIndex < items.length),
       assert(glassOpacity >= 0 && glassOpacity <= 1);

  /// The destinations, from 2 to 5.
  final List<TrcBottomNavItem> items;

  /// Index of the selected destination.
  final int currentIndex;

  /// Called with the index of the destination chosen.
  final ValueChanged<int> onTap;

  /// Docked bar or floating capsule.
  final TrcBottomNavStyle style;

  /// When the labels show.
  final TrcBottomNavLabels labels;

  /// Frosted, translucent background blurring what scrolls behind.
  final bool glass;

  /// Strength of the blur of the [glass] background.
  final double blurSigma;

  /// Opacity of the graphite of the [glass] background, from 0 to 1.
  final double glassOpacity;

  /// Height of the destinations; 64 by default (56 without labels).
  final double? height;

  /// Background; graphite by default.
  final Color? backgroundColor;

  /// Hairline around the capsule, or above the bar.
  final Color? borderColor;

  /// Corner radius of the floating capsule; fully rounded by default.
  final double? radius;

  /// Space around the floating capsule; 16 px on the sides and 12 px under
  /// it by default, plus the safe area.
  final EdgeInsetsGeometry? margin;

  /// Space between destinations.
  final double itemSpacing;

  /// Size of the icons.
  final double iconSize;

  /// A widget in the middle of the bar, such as a round "new" button; keep
  /// it at most as tall as the bar.
  final Widget? centerAction;

  /// Accessible name of the bar.
  final String semanticLabel;

  /// Read after a destination's label when it has a badge, with `{count}`.
  final String badgeLabel;

  /// Read after a destination's label when it has a dot.
  final String dotLabel;

  @override
  State<TrcBottomNav> createState() => _TrcBottomNavState();
}

class _TrcBottomNavState extends State<TrcBottomNav>
    with SingleTickerProviderStateMixin {
  late final AnimationController _slide = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 500),
    value: 1,
  );
  late int _from = widget.currentIndex;
  List<FocusNode> _nodes = [];

  @override
  void initState() {
    super.initState();
    _syncNodes();
  }

  @override
  void didUpdateWidget(TrcBottomNav oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncNodes();
    if (oldWidget.currentIndex != widget.currentIndex) {
      _from = oldWidget.currentIndex.clamp(0, widget.items.length - 1);
      if (trcReduceMotion(context)) {
        _slide.value = 1;
      } else {
        _slide.forward(from: 0);
      }
    }
  }

  void _syncNodes() {
    if (_nodes.length == widget.items.length) return;
    for (final n in _nodes) {
      n.dispose();
    }
    _nodes = List.generate(
      widget.items.length,
      (i) => FocusNode(debugLabel: 'TrcBottomNav $i'),
    );
  }

  @override
  void dispose() {
    for (final n in _nodes) {
      n.dispose();
    }
    _slide.dispose();
    super.dispose();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final current = _nodes.indexWhere((n) => n.hasFocus);
    if (current < 0) return KeyEventResult.ignored;
    final rtl = Directionality.of(context) == TextDirection.rtl;
    final count = widget.items.length;
    final key = event.logicalKey;
    int? target;
    if (key == LogicalKeyboardKey.arrowRight) {
      target = (current + (rtl ? -1 : 1)) % count;
    } else if (key == LogicalKeyboardKey.arrowLeft) {
      target = (current + (rtl ? 1 : -1)) % count;
    } else if (key == LogicalKeyboardKey.home) {
      target = 0;
    } else if (key == LogicalKeyboardKey.end) {
      target = count - 1;
    }
    if (target == null) return KeyEventResult.ignored;
    if (target < 0) target += count;
    _nodes[target].requestFocus();
    return KeyEventResult.handled;
  }

  String _semanticValue(TrcBottomNavItem item) {
    final badge = item.badge;
    if (badge != null && badge > 0) {
      return fillLabel(widget.badgeLabel, {'count': badge});
    }
    return item.dot ? widget.dotLabel : '';
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final media = MediaQuery.of(context);
    final floating = widget.style == TrcBottomNavStyle.floating;
    final showLabels = widget.labels != TrcBottomNavLabels.never;
    final height = widget.height ?? (showLabels ? 64.0 : 56.0);
    final radius = widget.radius ?? height / 2;
    final background =
        widget.backgroundColor ??
        (widget.glass
            ? theme.surface.withValues(alpha: widget.glassOpacity)
            : theme.surface);
    final border =
        widget.borderColor ??
        (widget.glass ? const Color(0x24FFFFFF) : theme.border);

    // Only the current destination is in the Tab order (roving focus).
    for (var i = 0; i < _nodes.length; i++) {
      _nodes[i].skipTraversal = i != widget.currentIndex;
    }

    final row = SizedBox(
      height: height,
      child: LayoutBuilder(
        builder: (context, constraints) =>
            _items(context, constraints.maxWidth, height, showLabels),
      ),
    );

    final shape = floating ? BorderRadius.circular(radius) : BorderRadius.zero;
    Widget surface = DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: shape,
        border: floating
            ? Border.all(color: border)
            : Border(top: BorderSide(color: border)),
      ),
      child: Padding(
        padding: EdgeInsets.only(
          left: floating ? 6 : 8,
          right: floating ? 6 : 8,
          bottom: floating ? 0 : media.padding.bottom,
        ),
        child: row,
      ),
    );
    if (widget.glass) {
      surface = Stack(
        children: [
          surface,
          // A subtle highlight along the top edge, where light would catch.
          Positioned(
            top: 0,
            left: floating ? radius * 0.6 : 0,
            right: floating ? radius * 0.6 : 0,
            height: 1,
            child: const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0x00FFFFFF),
                    Color(0x40FFFFFF),
                    Color(0x00FFFFFF),
                  ],
                ),
              ),
            ),
          ),
        ],
      );
      surface = BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: widget.blurSigma,
          sigmaY: widget.blurSigma,
        ),
        child: surface,
      );
    }
    surface = ClipRRect(borderRadius: shape, child: surface);

    final nav = Semantics(
      container: true,
      explicitChildNodes: true,
      label: widget.semanticLabel,
      child: Focus(
        canRequestFocus: false,
        skipTraversal: true,
        onKeyEvent: _onKey,
        child: surface,
      ),
    );

    if (!floating) return nav;
    final margin = widget.margin ?? const EdgeInsets.fromLTRB(16, 0, 16, 12);
    return Padding(
      padding: margin.add(EdgeInsets.only(bottom: media.padding.bottom)),
      child: Center(
        heightFactor: 1,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 560),
          child: nav,
        ),
      ),
    );
  }

  Widget _items(
    BuildContext context,
    double width,
    double height,
    bool showLabels,
  ) {
    final theme = TrcTheme.of(context);
    final count = widget.items.length;
    final hasCenter = widget.centerAction != null;
    final centerWidth = hasCenter ? math.min(72.0, width / (count + 1)) : 0.0;
    final spacing = widget.itemSpacing;
    final slot = (width - centerWidth - spacing * (count - 1)) / count;
    final before = (count / 2).floor();
    final rtl = Directionality.of(context) == TextDirection.rtl;

    // Left edge of a destination's slot, in visual order.
    double slotLeft(int i) {
      final visual = rtl ? count - 1 - i : i;
      var x = visual * (slot + spacing);
      final centerAfter = rtl ? count - before : before;
      if (hasCenter && visual >= centerAfter) x += centerWidth;
      return x;
    }

    final indicatorWidth = math.min(slot - 8, 56.0);
    const indicatorHeight = 32.0;
    // Icons sit at the same height whether their label shows or not.
    final labelTop = showLabels ? (height - 52) / 2 : (height - 32) / 2;

    final indicator = AnimatedBuilder(
      animation: _slide,
      builder: (context, _) {
        final t = _slide.value;
        final from = slotLeft(_from) + (slot - indicatorWidth) / 2;
        final to = slotLeft(widget.currentIndex) + (slot - indicatorWidth) / 2;
        // The leading edge moves first and the trailing edge follows: the
        // pill stretches toward its new place, then contracts.
        final ease = theme.ease;
        final lead = ease.transform((t / 0.7).clamp(0.0, 1.0));
        final trail = ease.transform(((t - 0.3) / 0.7).clamp(0.0, 1.0));
        final right = to > from;
        final leftEdge = right
            ? from + (to - from) * trail
            : from + (to - from) * lead;
        final rightEdge = right
            ? from + indicatorWidth + (to - from) * lead
            : from + indicatorWidth + (to - from) * trail;
        return Positioned(
          left: leftEdge,
          top: labelTop,
          width: rightEdge - leftEdge,
          height: indicatorHeight,
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: theme.accent,
              borderRadius: BorderRadius.circular(indicatorHeight / 2),
            ),
          ),
        );
      },
    );

    return Stack(
      clipBehavior: Clip.none,
      children: [
        indicator,
        for (var i = 0; i < count; i++)
          Positioned(
            left: slotLeft(i),
            top: 0,
            bottom: 0,
            width: slot,
            child: _item(context, i, showLabels, labelTop),
          ),
        if (hasCenter)
          Positioned(
            left: (rtl ? count - before : before) * (slot + spacing),
            top: 0,
            bottom: 0,
            width: centerWidth,
            child: Center(child: widget.centerAction),
          ),
      ],
    );
  }

  Widget _item(BuildContext context, int i, bool showLabels, double top) {
    final theme = TrcTheme.of(context);
    final item = widget.items[i];
    final selected = i == widget.currentIndex;
    final showLabel =
        widget.labels == TrcBottomNavLabels.always ||
        (widget.labels == TrcBottomNavLabels.selected && selected);
    final duration = trcMotion(context, const Duration(milliseconds: 250));
    final value = _semanticValue(item);
    final badge = item.badge;
    final hasBadge = badge != null && badge > 0;

    Widget icon = IconTheme(
      data: IconThemeData(
        size: widget.iconSize,
        color: selected ? theme.onAccent : theme.foregroundSubtle,
      ),
      child: selected ? (item.activeIcon ?? item.icon) : item.icon,
    );
    if (hasBadge || item.dot) {
      icon = Stack(
        clipBehavior: Clip.none,
        children: [
          icon,
          PositionedDirectional(
            top: hasBadge ? -6 : -2,
            end: hasBadge ? -10 : -3,
            child: _Badge(count: hasBadge ? badge : null),
          ),
        ],
      );
    }

    return Semantics(
      button: true,
      container: true,
      selected: selected,
      label: item.label,
      value: value.isEmpty ? null : value,
      child: TrcTappable(
        excludeChildSemantics: true,
        focusNode: _nodes[i],
        onTap: () => widget.onTap(i),
        builder: (context, state) => Column(
          children: [
            SizedBox(height: top),
            TrcFocusRing(
              visible: state.focused,
              borderRadius: BorderRadius.circular(16),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 56,
                height: 32,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: state.hovered && !selected
                      ? const Color(0x0FFFFFFF)
                      : const Color(0x00FFFFFF),
                ),
                child: Center(child: icon),
              ),
            ),
            if (showLabels)
              AnimatedSize(
                duration: duration,
                curve: theme.easeOut,
                child: showLabel
                    ? Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          item.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textScaler: MediaQuery.textScalerOf(
                            context,
                          ).clamp(maxScaleFactor: 1.3),
                          style: theme.text(
                            size: 11,
                            weight: FontWeight.w500,
                            height: 1.2,
                            letterSpacing: 0,
                            color: selected || state.hovered
                                ? theme.foreground
                                : theme.foregroundSubtle,
                          ),
                        ),
                      )
                    : const SizedBox(width: 0),
              ),
          ],
        ),
      ),
    );
  }
}

/// The accent count (or dot) on a destination, ringed with the page color so
/// that it stays readable over the selected pill.
class _Badge extends StatelessWidget {
  const _Badge({this.count});

  final int? count;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final count = this.count;
    if (count == null) {
      return Container(
        width: 10,
        height: 10,
        decoration: BoxDecoration(
          color: theme.accent,
          shape: BoxShape.circle,
          border: Border.all(color: theme.surface, width: 2),
        ),
      );
    }
    return Container(
      constraints: const BoxConstraints(minWidth: 18),
      height: 18,
      padding: const EdgeInsets.symmetric(horizontal: 5),
      decoration: BoxDecoration(
        color: theme.accent,
        borderRadius: BorderRadius.circular(9),
        border: Border.all(color: theme.surface, width: 2),
      ),
      child: Center(
        widthFactor: 1,
        child: Text(
          count > 99 ? '99+' : '$count',
          textScaler: TextScaler.noScaling,
          style: theme.text(
            size: 10,
            weight: FontWeight.w600,
            height: 1,
            letterSpacing: 0,
            color: theme.onAccent,
          ),
        ),
      ),
    );
  }
}
