import 'package:flutter/material.dart';

import 'foundation.dart';
import 'icon_button.dart';
import 'icons.dart';
import 'theme.dart';

/// Width of a [TrcDialog].
enum TrcDialogSize {
  /// 400 px.
  sm,

  /// 520 px.
  md,

  /// 720 px.
  lg,
}

/// Title row, description, body and footer shared by dialogs and drawers.
class _LayerContent extends StatelessWidget {
  const _LayerContent({
    required this.title,
    required this.description,
    required this.body,
    required this.actions,
    required this.closeLabel,
    required this.onClose,
    required this.actionsAlignment,
    required this.expandBody,
  });

  final String title;
  final String? description;
  final Widget? body;
  final List<Widget>? actions;
  final String closeLabel;
  final VoidCallback onClose;
  final WrapAlignment actionsAlignment;
  final bool expandBody;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    Widget? bodyWidget = body == null
        ? null
        : Padding(
            padding: const EdgeInsets.only(top: 24),
            child: DefaultTextStyle(
              style: theme.text(height: 1.65, color: theme.foregroundMuted),
              child: body!,
            ),
          );
    if (bodyWidget != null && expandBody) {
      bodyWidget = Expanded(child: SingleChildScrollView(child: bodyWidget));
    }
    return Column(
      mainAxisSize: expandBody ? MainAxisSize.max : MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Semantics(
                header: true,
                container: true,
                child: Text(
                  title,
                  style: theme.text(
                    size: 22,
                    height: 1.25,
                    letterSpacing: -0.025,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Transform.translate(
              offset: const Offset(8, -8),
              child: TrcIconButton(
                glyph: TrcGlyph.close,
                label: closeLabel,
                onPressed: onClose,
              ),
            ),
          ],
        ),
        if (description != null) ...[
          const SizedBox(height: 8),
          Text(
            description!,
            style: theme.text(height: 1.6, color: theme.foregroundMuted),
          ),
        ],
        ?bodyWidget,
        if (bodyWidget == null && expandBody) const Spacer(),
        if (actions != null && actions!.isNotEmpty) ...[
          const SizedBox(height: 32),
          Wrap(
            alignment: actionsAlignment,
            spacing: 12,
            runSpacing: 12,
            children: actions!,
          ),
        ],
      ],
    );
  }
}

/// Modal window: a graphite card with a title, a description, a body and
/// actions. Show it with [showTrcDialog]; this widget is the card itself.
class TrcDialog extends StatelessWidget {
  /// A dialog card titled [title].
  const TrcDialog({
    super.key,
    required this.title,
    this.description,
    this.child,
    this.actions,
    this.size = TrcDialogSize.md,
    this.closeLabel = 'Close',
    this.onClose,
  });

  /// Title, also the window's accessible name.
  final String title;

  /// Short text under the title.
  final String? description;

  /// Body.
  final Widget? child;

  /// Actions at the bottom, usually pills: the main one solid, last.
  final List<Widget>? actions;

  /// Maximum width.
  final TrcDialogSize size;

  /// Accessible name of the close button.
  final String closeLabel;

  /// Called by the close button; pops the route by default.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final media = MediaQuery.of(context);
    final maxWidth = switch (size) {
      TrcDialogSize.sm => 400.0,
      TrcDialogSize.md => 520.0,
      TrcDialogSize.lg => 720.0,
    };
    final pad = media.size.width >= TrcBreakpoints.sm ? 32.0 : 28.0;
    return Semantics(
      scopesRoute: true,
      namesRoute: true,
      explicitChildNodes: true,
      label: title,
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: maxWidth,
          maxHeight: media.size.height - media.padding.vertical - 32,
        ),
        child: Container(
          decoration: BoxDecoration(
            color: theme.surface,
            borderRadius: BorderRadius.circular(theme.radius),
            border: Border.all(color: theme.border),
          ),
          child: SingleChildScrollView(
            padding: EdgeInsets.all(pad),
            child: _LayerContent(
              title: title,
              description: description,
              body: child,
              actions: actions,
              closeLabel: closeLabel,
              onClose: onClose ?? () => Navigator.of(context).maybePop(),
              actionsAlignment: WrapAlignment.end,
              expandBody: false,
            ),
          ),
        ),
      ),
    );
  }
}

/// Shows a [TrcDialog] over a dark overlay. Focus moves inside and stays
/// there; Escape, the close button or the overlay (unless
/// [barrierDismissible] is false) close it, and focus returns where it was.
/// Completes with the value given to `Navigator.pop`.
Future<T?> showTrcDialog<T>({
  required BuildContext context,
  required String title,
  String? description,
  Widget? child,
  List<Widget>? actions,
  TrcDialogSize size = TrcDialogSize.md,
  String closeLabel = 'Close',
  String barrierLabel = 'Close',
  bool barrierDismissible = true,
  bool useRootNavigator = true,
}) {
  final theme = TrcTheme.of(context);
  final reduce = trcReduceMotion(context);
  return showGeneralDialog<T>(
    context: context,
    useRootNavigator: useRootNavigator,
    barrierDismissible: barrierDismissible,
    barrierLabel: barrierLabel,
    barrierColor: const Color(0x99000000),
    transitionDuration: reduce
        ? Duration.zero
        : const Duration(milliseconds: 400),
    pageBuilder: (context, animation, secondary) => TrcTheme(
      data: theme,
      child: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: TrcDialog(
              title: title,
              description: description,
              actions: actions,
              size: size,
              closeLabel: closeLabel,
              child: child,
            ),
          ),
        ),
      ),
    ),
    transitionBuilder: (context, animation, secondary, child) {
      final rise = CurvedAnimation(parent: animation, curve: theme.easeOut);
      final fade = CurvedAnimation(
        parent: animation,
        curve: Interval(0, 0.75, curve: theme.easeOut),
      );
      return FadeTransition(
        opacity: fade,
        child: AnimatedBuilder(
          animation: rise,
          builder: (context, child) => Transform.translate(
            offset: Offset(0, 12 * (1 - rise.value)),
            child: Transform.scale(
              scale: 0.98 + 0.02 * rise.value,
              child: child,
            ),
          ),
          child: child,
        ),
      );
    },
  );
}

/// Edge a drawer slides from.
enum TrcDrawerSide {
  /// From the left (the right in right-to-left text).
  start,

  /// From the right (the left in right-to-left text).
  end,
}

/// Shows a side panel that slides over the page, for filters, a cart,
/// settings or navigation. Modal, like [showTrcDialog]. The [actions] stay
/// at the bottom of the panel.
Future<T?> showTrcDrawer<T>({
  required BuildContext context,
  required String title,
  String? description,
  Widget? child,
  List<Widget>? actions,
  TrcDrawerSide side = TrcDrawerSide.end,
  bool wide = false,
  String closeLabel = 'Close',
  String barrierLabel = 'Close',
  bool barrierDismissible = true,
  bool useRootNavigator = true,
}) {
  final theme = TrcTheme.of(context);
  final reduce = trcReduceMotion(context);
  return showGeneralDialog<T>(
    context: context,
    useRootNavigator: useRootNavigator,
    barrierDismissible: barrierDismissible,
    barrierLabel: barrierLabel,
    barrierColor: const Color(0x99000000),
    transitionDuration: reduce
        ? Duration.zero
        : const Duration(milliseconds: 400),
    pageBuilder: (context, animation, secondary) => TrcTheme(
      data: theme,
      child: TrcDrawer(
        title: title,
        description: description,
        actions: actions,
        side: side,
        wide: wide,
        closeLabel: closeLabel,
        child: child,
      ),
    ),
    transitionBuilder: (context, animation, secondary, child) {
      final rtl = Directionality.of(context) == TextDirection.rtl;
      final fromRight = (side == TrcDrawerSide.end) != rtl;
      return SlideTransition(
        position: Tween(
          begin: Offset(fromRight ? 1 : -1, 0),
          end: Offset.zero,
        ).animate(CurvedAnimation(parent: animation, curve: theme.easeOut)),
        child: child,
      );
    },
  );
}

/// The panel shown by [showTrcDrawer]: full height, page colored, a hairline
/// on its inner edge.
class TrcDrawer extends StatelessWidget {
  /// A drawer titled [title].
  const TrcDrawer({
    super.key,
    required this.title,
    this.description,
    this.child,
    this.actions,
    this.side = TrcDrawerSide.end,
    this.wide = false,
    this.closeLabel = 'Close',
    this.onClose,
  });

  /// Title, also the panel's accessible name.
  final String title;

  /// Short text under the title.
  final String? description;

  /// Body, scrolled when long.
  final Widget? child;

  /// Actions pinned to the bottom.
  final List<Widget>? actions;

  /// Edge the panel sits on.
  final TrcDrawerSide side;

  /// 480 px instead of 380 px.
  final bool wide;

  /// Accessible name of the close button.
  final String closeLabel;

  /// Called by the close button; pops the route by default.
  final VoidCallback? onClose;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final panelWidth = wide
        ? (width * 0.92).clamp(0, 480).toDouble()
        : (width * 0.88).clamp(0, 380).toDouble();
    final hairline = BorderSide(color: theme.foreground.withValues(alpha: 0.1));
    return Align(
      alignment: side == TrcDrawerSide.end
          ? AlignmentDirectional.centerEnd
          : AlignmentDirectional.centerStart,
      child: Semantics(
        scopesRoute: true,
        namesRoute: true,
        explicitChildNodes: true,
        label: title,
        child: Container(
          width: panelWidth,
          height: double.infinity,
          decoration: BoxDecoration(
            color: theme.background,
            border: BorderDirectional(
              start: side == TrcDrawerSide.end ? hairline : BorderSide.none,
              end: side == TrcDrawerSide.start ? hairline : BorderSide.none,
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: _LayerContent(
                title: title,
                description: description,
                body: child,
                actions: actions,
                closeLabel: closeLabel,
                onClose: onClose ?? () => Navigator.of(context).maybePop(),
                actionsAlignment: WrapAlignment.start,
                expandBody: true,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
