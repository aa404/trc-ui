import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'floating.dart';
import 'menu.dart';
import 'theme.dart';

/// Floating panel anchored to a trigger, for short content and small forms.
/// Not modal: the page stays usable. The focus moves into the panel when it
/// opens; Escape or a press outside closes it.
///
/// Leave [open] null to let the popover manage itself, or control it with
/// [open] and [onOpenChange].
class TrcPopover extends StatefulWidget {
  /// A popover showing [child], opened by the widget [builder] returns.
  const TrcPopover({
    super.key,
    required this.builder,
    required this.child,
    this.title,
    this.semanticLabel,
    this.side = TrcSide.bottom,
    this.align = TrcAlign.start,
    this.open,
    this.onOpenChange,
  });

  /// Builds the trigger; call `toggle` from its `onPressed`.
  final TrcTriggerBuilder builder;

  /// Content of the panel.
  final Widget child;

  /// Title of the panel, also its accessible name.
  final String? title;

  /// Accessible name when there is no visible title.
  final String? semanticLabel;

  /// Preferred side.
  final TrcSide side;

  /// Horizontal alignment.
  final TrcAlign align;

  /// Controlled state.
  final bool? open;

  /// Called when the popover asks to open or close.
  final ValueChanged<bool>? onOpenChange;

  @override
  State<TrcPopover> createState() => _TrcPopoverState();
}

class _TrcPopoverState extends State<TrcPopover> {
  bool _ownOpen = false;
  FocusNode? _returnTo;

  bool get _open => widget.open ?? _ownOpen;

  void _set(bool value, {bool restoreFocus = false}) {
    if (value == _open) return;
    if (value) _returnTo = FocusManager.instance.primaryFocus;
    if (widget.open == null) setState(() => _ownOpen = value);
    widget.onOpenChange?.call(value);
    if (!value && restoreFocus) _returnTo?.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    return TrcAnchoredOverlay(
      open: _open,
      side: widget.side,
      align: widget.align,
      onDismiss: (reason) =>
          _set(false, restoreFocus: reason == TrcDismissReason.escape),
      panelBuilder: (context) => Semantics(
        explicitChildNodes: true,
        scopesRoute: true,
        namesRoute: true,
        label: widget.title ?? widget.semanticLabel,
        child: FocusScope(
          autofocus: true,
          child: TrcFloatingPanel(
            width: (width - 16).clamp(0, 320).toDouble(),
            radius: theme.radius,
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (widget.title != null) ...[
                  Text(widget.title!, style: theme.text(size: 17, height: 1.3)),
                  const SizedBox(height: 8),
                ],
                DefaultTextStyle(
                  style: theme.text(
                    size: 14,
                    height: 1.6,
                    color: theme.foregroundMuted,
                  ),
                  child: widget.child,
                ),
              ],
            ),
          ),
        ),
      ),
      child: widget.builder(
        context,
        () => _set(!_open, restoreFocus: true),
        _open,
      ),
    );
  }
}

/// Small label shown on hover (after [delay]) and right away on keyboard
/// focus. It stays open while the pointer moves onto it, Escape hides it, and
/// a long press shows it on touch screens. Never the only way to get the
/// information: it is also given to screen readers as the element's tooltip.
class TrcTooltip extends StatefulWidget {
  /// Describes [child] with [message].
  const TrcTooltip({
    super.key,
    required this.message,
    required this.child,
    this.side = TrcSide.top,
    this.delay = const Duration(milliseconds: 300),
  });

  /// The text shown.
  final String message;

  /// The element described, usually a button.
  final Widget child;

  /// Preferred side.
  final TrcSide side;

  /// Wait before showing on hover.
  final Duration delay;

  @override
  State<TrcTooltip> createState() => _TrcTooltipState();
}

class _TrcTooltipState extends State<TrcTooltip> {
  bool _open = false;
  bool _hoverAnchor = false;
  bool _hoverTip = false;
  Timer? _timer;

  void _schedule(bool open, Duration wait) {
    _timer?.cancel();
    if (wait == Duration.zero) {
      if (mounted && _open != open) setState(() => _open = open);
      return;
    }
    _timer = Timer(wait, () {
      if (mounted && _open != open) setState(() => _open = open);
    });
  }

  void _leave() {
    // A short grace lets the pointer travel onto the tooltip.
    if (!_hoverAnchor && !_hoverTip) {
      _schedule(false, const Duration(milliseconds: 100));
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return TrcAnchoredOverlay(
      open: _open,
      side: widget.side,
      align: TrcAlign.center,
      onDismiss: (_) => _schedule(false, Duration.zero),
      panelBuilder: (context) => MouseRegion(
        onEnter: (_) {
          _hoverTip = true;
          _timer?.cancel();
        },
        onExit: (_) {
          _hoverTip = false;
          _leave();
        },
        child: ExcludeSemantics(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 260),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: theme.surfaceAlt,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: theme.border),
            ),
            child: Text(
              widget.message,
              style: theme.text(size: 13, height: 1.4),
            ),
          ),
        ),
      ),
      child: Semantics(
        tooltip: widget.message,
        child: Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onFocusChange: (focused) {
            final highlight =
                FocusManager.instance.highlightMode ==
                FocusHighlightMode.traditional;
            if (focused && highlight) {
              _schedule(true, Duration.zero);
            } else if (!focused) {
              _schedule(false, Duration.zero);
            }
          },
          child: MouseRegion(
            onEnter: (_) {
              _hoverAnchor = true;
              _schedule(true, widget.delay);
            },
            onExit: (_) {
              _hoverAnchor = false;
              _leave();
            },
            child: GestureDetector(
              behavior: HitTestBehavior.translucent,
              excludeFromSemantics: true,
              onLongPress: () {
                HapticFeedback.selectionClick();
                _schedule(true, Duration.zero);
                _timer = Timer(const Duration(milliseconds: 1500), () {
                  if (mounted) setState(() => _open = false);
                });
              },
              child: widget.child,
            ),
          ),
        ),
      ),
    );
  }
}
