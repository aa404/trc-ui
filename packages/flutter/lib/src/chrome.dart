import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';

import 'dialog.dart';
import 'floating.dart';
import 'focus_ring.dart';
import 'foundation.dart';
import 'icon_button.dart';
import 'icons.dart';
import 'menu.dart';
import 'pill.dart';
import 'theme.dart';
import 'typography.dart';

/// A link of a [TrcHeader]: a destination, or a dropdown when it has
/// [children].
@immutable
class TrcNavItem {
  /// A navigation entry labelled [label].
  const TrcNavItem({
    required this.label,
    this.onTap,
    this.active = false,
    this.children = const [],
  });

  /// Text of the entry.
  final String label;

  /// Navigates to the destination.
  final VoidCallback? onTap;

  /// Current page: marked with an accent dot.
  final bool active;

  /// Entries of a dropdown (no deeper level).
  final List<TrcNavItem> children;
}

/// Floating header for apps and sites: transparent over the content at the
/// top, it becomes a blurred graphite bar once [scrolled] (or once the
/// [controller] passes [scrollThreshold]). Navigation in the middle on large
/// screens, a menu button opening a side panel below 1024 px.
///
/// Put it on top of your content, for instance as the last child of a
/// [Stack], or as `Scaffold.appBar` through a [PreferredSize].
class TrcHeader extends StatefulWidget {
  /// A header with [logo].
  const TrcHeader({
    super.key,
    required this.logo,
    this.onLogoTap,
    this.logoLabel = 'Home',
    this.nav = const [],
    this.actions = const [],
    this.cta,
    this.onCta,
    this.mobileFooter,
    this.controller,
    this.scrolled,
    this.scrollThreshold = 24,
    this.menuLabel = 'Menu',
    this.closeLabel = 'Close',
  });

  /// Logo, in white.
  final Widget logo;

  /// Goes to the home screen.
  final VoidCallback? onLogoTap;

  /// Accessible name of the logo button.
  final String logoLabel;

  /// Navigation entries.
  final List<TrcNavItem> nav;

  /// Extra widgets on the right on screens from 640 px (language switcher…).
  final List<Widget> actions;

  /// Label of the main action, shown as a compact pill.
  final String? cta;

  /// Called by the main action.
  final VoidCallback? onCta;

  /// Content added at the bottom of the mobile menu.
  final Widget? mobileFooter;

  /// Scroll position that turns the bar graphite.
  final ScrollController? controller;

  /// Forces the graphite bar on or off; follows [controller] when null.
  final bool? scrolled;

  /// Scroll offset from which the bar turns graphite.
  final double scrollThreshold;

  /// Accessible name of the menu button, and title of the mobile menu.
  final String menuLabel;

  /// Accessible name of the mobile menu's close button.
  final String closeLabel;

  @override
  State<TrcHeader> createState() => _TrcHeaderState();
}

class _TrcHeaderState extends State<TrcHeader> {
  bool _past = false;

  @override
  void initState() {
    super.initState();
    widget.controller?.addListener(_onScroll);
  }

  @override
  void didUpdateWidget(TrcHeader oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller?.removeListener(_onScroll);
      widget.controller?.addListener(_onScroll);
    }
  }

  @override
  void dispose() {
    widget.controller?.removeListener(_onScroll);
    super.dispose();
  }

  void _onScroll() {
    final c = widget.controller!;
    final past = c.hasClients && c.offset > widget.scrollThreshold;
    if (past != _past) setState(() => _past = past);
  }

  void _openMenu() {
    final nav = widget.nav;
    showTrcDrawer<void>(
      context: context,
      title: widget.menuLabel,
      closeLabel: widget.closeLabel,
      child: Builder(
        builder: (context) => _MobileNav(
          nav: nav,
          cta: widget.cta,
          onCta: widget.onCta,
          footer: widget.mobileFooter,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final wide = width >= TrcBreakpoints.lg;
    final tablet = width >= TrcBreakpoints.sm;
    final scrolled = widget.scrolled ?? _past;
    final duration = trcMotion(context, const Duration(milliseconds: 300));
    final radius = BorderRadius.circular(theme.radius);
    final hasMenu =
        widget.nav.isNotEmpty ||
        widget.cta != null ||
        widget.mobileFooter != null;

    final logo = Semantics(
      button: true,
      container: true,
      label: widget.logoLabel,
      child: TrcTappable(
        excludeChildSemantics: true,
        enabled: widget.onLogoTap != null,
        cursor: SystemMouseCursors.click,
        onTap: widget.onLogoTap,
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(6),
          child: IconTheme(
            data: IconThemeData(color: theme.foreground),
            child: widget.logo,
          ),
        ),
      ),
    );

    final end = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (tablet)
          for (final action in widget.actions) ...[
            action,
            const SizedBox(width: 8),
          ],
        if (tablet && widget.cta != null)
          TrcPillButton(
            label: widget.cta!,
            small: true,
            onPressed: widget.onCta,
          ),
        if (!wide && hasMenu) ...[
          const SizedBox(width: 8),
          TrcIconButton(
            glyph: TrcGlyph.menu,
            label: widget.menuLabel,
            color: theme.foreground,
            onPressed: _openMenu,
          ),
        ],
      ],
    );

    // The two sides share the remaining width equally, so the navigation
    // stays centered whatever the width of the logo and of the actions.
    final bar = Row(
      children: [
        Expanded(
          child: Align(
            alignment: AlignmentDirectional.centerStart,
            child: logo,
          ),
        ),
        if (wide && widget.nav.isNotEmpty) ...[
          const SizedBox(width: 16),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (var i = 0; i < widget.nav.length; i++) ...[
                if (i > 0) const SizedBox(width: 28),
                _NavLink(item: widget.nav[i]),
              ],
            ],
          ),
          const SizedBox(width: 16),
        ],
        Expanded(
          child: Align(alignment: AlignmentDirectional.centerEnd, child: end),
        ),
      ],
    );

    return SafeArea(
      bottom: false,
      child: Padding(
        padding: EdgeInsets.all(tablet ? 16 : 8),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1600),
            child: ClipRRect(
              borderRadius: radius,
              child: BackdropFilter(
                enabled: scrolled,
                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: AnimatedContainer(
                  duration: duration,
                  height: tablet ? 80 : 64,
                  padding: EdgeInsets.symmetric(horizontal: tablet ? 32 : 16),
                  decoration: BoxDecoration(
                    borderRadius: radius,
                    color: scrolled
                        ? theme.surface.withValues(alpha: 0.8)
                        : theme.surface.withValues(alpha: 0),
                    border: Border.all(
                      color: scrolled
                          ? const Color(0x1AFFFFFF)
                          : const Color(0x00FFFFFF),
                    ),
                  ),
                  child: bar,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavLink extends StatelessWidget {
  const _NavLink({required this.item});

  final TrcNavItem item;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    Widget link(VoidCallback? onTap, {bool open = false}) => Semantics(
      container: true,
      link: item.children.isEmpty,
      button: item.children.isNotEmpty,
      expanded: item.children.isEmpty ? null : open,
      selected: item.active,
      label: item.label,
      child: TrcTappable(
        excludeChildSemantics: true,
        onTap: onTap,
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(4),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.bottomCenter,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      item.label,
                      style: theme.text(
                        color: state.hovered || item.active || open
                            ? theme.foreground
                            : const Color(0xCCFFFFFF),
                      ),
                    ),
                    if (item.children.isNotEmpty) ...[
                      const SizedBox(width: 6),
                      AnimatedRotation(
                        turns: open ? 0.5 : 0,
                        duration: trcMotion(
                          context,
                          const Duration(milliseconds: 300),
                        ),
                        child: TrcIcon(
                          TrcGlyph.chevronDown,
                          size: 16,
                          color: theme.foregroundMuted,
                        ),
                      ),
                    ],
                  ],
                ),
                // Current page: an accent dot under the link.
                if (item.active)
                  Positioned(
                    bottom: -8,
                    child: Container(
                      width: 4,
                      height: 4,
                      decoration: BoxDecoration(
                        color: theme.accent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );

    if (item.children.isEmpty) return link(item.onTap);
    return TrcMenu(
      align: TrcAlign.center,
      items: [
        for (final child in item.children)
          TrcMenuItem(label: child.label, onSelected: child.onTap),
      ],
      builder: (context, toggle, open) => link(toggle, open: open),
    );
  }
}

class _MobileNav extends StatelessWidget {
  const _MobileNav({
    required this.nav,
    required this.cta,
    required this.onCta,
    required this.footer,
  });

  final List<TrcNavItem> nav;
  final String? cta;
  final VoidCallback? onCta;
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    void go(VoidCallback? onTap) {
      Navigator.of(context).pop();
      onTap?.call();
    }

    Widget entry(TrcNavItem item, {bool sub = false}) => Semantics(
      link: true,
      container: true,
      selected: item.active,
      label: item.label,
      child: TrcTappable(
        excludeChildSemantics: true,
        onTap: () => go(item.onTap),
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(4),
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: sub ? 6 : 0),
            child: Text(
              item.label,
              style: theme.text(
                size: sub ? 15 : 18,
                color: state.hovered || item.active
                    ? theme.accent
                    : sub
                    ? const Color(0xB3FFFFFF)
                    : theme.foreground,
              ),
            ),
          ),
        ),
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final item in nav)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Color(0x1AFFFFFF))),
            ),
            child: item.children.isEmpty
                ? Align(
                    alignment: AlignmentDirectional.centerStart,
                    child: entry(item),
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.label, style: theme.text(size: 18)),
                      Container(
                        margin: const EdgeInsets.only(top: 12),
                        padding: const EdgeInsetsDirectional.only(start: 16),
                        decoration: const BoxDecoration(
                          border: BorderDirectional(
                            start: BorderSide(color: Color(0x1AFFFFFF)),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            for (final child in item.children)
                              entry(child, sub: true),
                          ],
                        ),
                      ),
                    ],
                  ),
          ),
        if (cta != null) ...[
          const SizedBox(height: 24),
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: TrcPillButton(label: cta!, onPressed: () => go(onCta)),
          ),
        ],
        if (footer != null) ...[const SizedBox(height: 24), footer!],
      ],
    );
  }
}

/// Header of inner screens: a rounded card inset from the edges, with a
/// heavily darkened background picture (or a subtle accent glow without
/// one), and a thin title whose last words take the accent. The texts enter
/// one after another.
class TrcPageHero extends StatelessWidget {
  /// A hero titled [title].
  const TrcPageHero({
    super.key,
    required this.title,
    this.accentLast,
    this.description,
    this.meta,
    this.image,
    this.imageAlignment = Alignment.center,
    this.actions = const [],
    this.topPadding,
  });

  /// Title: the words between *asterisks* take the accent, otherwise the
  /// last words ([accentLast]).
  final String title;

  /// Trailing words in the accent without asterisks: 2 for a long title, 1
  /// otherwise by default.
  final int? accentLast;

  /// Text under the title.
  final String? description;

  /// Discreet line under the description (date, breadcrumbs…).
  final Widget? meta;

  /// Background picture, darkened for legibility.
  final ImageProvider? image;

  /// Which part of the picture stays visible.
  final Alignment imageAlignment;

  /// Pills under the text.
  final List<Widget> actions;

  /// Space above the title; leaves room for a floating header (144 px on
  /// phones, 176 px from tablets) by default.
  final double? topPadding;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final tablet = width >= TrcBreakpoints.md;
    final side = width >= TrcBreakpoints.sm ? 40.0 : 24.0;
    final words = plainText(title).split(' ').length;
    final size = (25.6 + 3 * width / 100).clamp(36.0, 60.0);

    return Padding(
      padding: EdgeInsets.all(width >= TrcBreakpoints.sm ? 16 : 8),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1600),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(theme.radius),
            child: DecoratedBox(
              decoration: BoxDecoration(color: theme.surface),
              child: Stack(
                children: [
                  Positioned.fill(
                    child: image != null
                        ? Image(
                            image: image!,
                            fit: BoxFit.cover,
                            alignment: imageAlignment,
                            excludeFromSemantics: true,
                            errorBuilder: (context, error, stack) =>
                                const SizedBox.shrink(),
                          )
                        : DecoratedBox(
                            // Without a picture: a subtle accent glow.
                            decoration: BoxDecoration(
                              gradient: RadialGradient(
                                center: const Alignment(0.7, -1),
                                radius: 1.2,
                                colors: [
                                  theme.accent.withValues(alpha: 0.16),
                                  theme.accent.withValues(alpha: 0),
                                ],
                                stops: const [0, 0.6],
                              ),
                            ),
                          ),
                  ),
                  if (image != null)
                    const Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment(-1, -0.2),
                            end: Alignment(1, 0.2),
                            colors: [
                              Color(0xF70B0C0F),
                              Color(0xD90B0C0F),
                              Color(0x8C0B0C0F),
                            ],
                          ),
                        ),
                      ),
                    ),
                  Align(
                    alignment: AlignmentDirectional.topStart,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1280),
                      child: Padding(
                        padding: EdgeInsets.fromLTRB(
                          side,
                          topPadding ?? (tablet ? 176 : 144),
                          side,
                          tablet ? 80 : 64,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            TrcEnter(
                              delay: const Duration(milliseconds: 150),
                              child: ConstrainedBox(
                                constraints: const BoxConstraints(
                                  maxWidth: 896,
                                ),
                                child: Semantics(
                                  header: true,
                                  container: true,
                                  headingLevel: 1,
                                  child: TrcAccentText(
                                    title,
                                    accentLast:
                                        accentLast ?? (words > 3 ? 2 : 1),
                                    style: theme.text(
                                      size: size,
                                      height: 1.08,
                                      letterSpacing: -0.025,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            if (description != null)
                              TrcEnter(
                                delay: const Duration(milliseconds: 250),
                                child: Padding(
                                  padding: const EdgeInsets.only(top: 24),
                                  child: ConstrainedBox(
                                    constraints: const BoxConstraints(
                                      maxWidth: 672,
                                    ),
                                    child: Text(
                                      description!,
                                      style: theme.text(
                                        size: 18,
                                        height: 1.65,
                                        color: theme.foregroundMuted,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            if (meta != null)
                              TrcEnter(
                                delay: const Duration(milliseconds: 350),
                                child: Padding(
                                  padding: const EdgeInsets.only(top: 24),
                                  child: DefaultTextStyle(
                                    style: theme.text(
                                      size: 14,
                                      color: theme.foregroundSubtle,
                                    ),
                                    child: meta!,
                                  ),
                                ),
                              ),
                            if (actions.isNotEmpty)
                              TrcEnter(
                                delay: const Duration(milliseconds: 450),
                                child: Padding(
                                  padding: const EdgeInsets.only(top: 32),
                                  child: Wrap(
                                    spacing: 12,
                                    runSpacing: 12,
                                    children: actions,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Floating accent "Back to top" button: appears once [controller] scrolls
/// past [threshold], and scrolls back smoothly (at once with reduced motion).
class TrcBackToTop extends StatefulWidget {
  /// A back-to-top button for [controller].
  const TrcBackToTop({
    super.key,
    required this.controller,
    this.threshold = 600,
    this.label = 'Back to top',
  });

  /// The scroll view to bring back.
  final ScrollController controller;

  /// Offset from which the button appears.
  final double threshold;

  /// Accessible name.
  final String label;

  @override
  State<TrcBackToTop> createState() => _TrcBackToTopState();
}

class _TrcBackToTopState extends State<TrcBackToTop> {
  bool _visible = false;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onScroll);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onScroll);
    super.dispose();
  }

  void _onScroll() {
    final c = widget.controller;
    final visible = c.hasClients && c.offset > widget.threshold;
    if (visible != _visible) setState(() => _visible = visible);
  }

  void _top() {
    if (trcReduceMotion(context)) {
      widget.controller.jumpTo(0);
    } else {
      widget.controller.animateTo(
        0,
        duration: const Duration(milliseconds: 600),
        curve: TrcTheme.of(context).ease,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final duration = trcMotion(context, const Duration(milliseconds: 300));
    return IgnorePointer(
      ignoring: !_visible,
      child: ExcludeSemantics(
        excluding: !_visible,
        child: AnimatedOpacity(
          opacity: _visible ? 1 : 0,
          duration: duration,
          child: AnimatedSlide(
            offset: _visible ? Offset.zero : const Offset(0, 0.33),
            duration: duration,
            child: Semantics(
              button: true,
              container: true,
              label: widget.label,
              child: TrcTappable(
                excludeChildSemantics: true,
                onTap: _top,
                builder: (context, state) => TrcFocusRing(
                  visible: state.focused,
                  circle: true,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: 48,
                    height: 48,
                    transform: Matrix4.translationValues(
                      0,
                      state.hovered ? -2 : 0,
                      0,
                    ),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: theme.accent,
                    ),
                    child: Center(
                      child: TrcIcon(
                        TrcGlyph.arrowUp,
                        size: 20,
                        color: theme.onAccent,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
