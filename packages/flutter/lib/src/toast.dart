import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icon_button.dart';
import 'icons.dart';
import 'theme.dart';

/// Tone of a toast: a small dot before the title tells success and errors.
enum TrcToastTone {
  /// No dot.
  normal,

  /// Accent dot.
  success,

  /// Error-colored dot.
  error,
}

/// Where a [TrcToaster] stacks its toasts.
enum TrcToasterPosition {
  /// Bottom right corner (bottom left in right-to-left text).
  bottomEnd,

  /// Bottom, centered: good on phones.
  bottomCenter,

  /// Top right corner.
  topEnd,
}

/// The one action of a toast, such as "Undo"; choosing it also dismisses it.
@immutable
class TrcToastAction {
  /// An action labelled [label].
  const TrcToastAction({required this.label, required this.onPressed});

  /// Text of the action.
  final String label;

  /// Called when chosen.
  final VoidCallback onPressed;
}

class _ToastItem {
  _ToastItem({
    required this.id,
    required this.title,
    required this.description,
    required this.tone,
    required this.duration,
    required this.action,
  });

  final int id;
  final String title;
  final String? description;
  final TrcToastTone tone;
  final Duration? duration;
  final TrcToastAction? action;
  bool leaving = false;
}

/// Short messages raised from anywhere below a [TrcToaster].
///
/// ```dart
/// TrcToast.show(context, 'Saved');
/// TrcToast.error(context, 'Could not save', description: 'Try again.');
/// ```
abstract final class TrcToast {
  /// Shows a toast and returns its id, for [dismiss]. A null [duration] uses
  /// the toaster's; [Duration.zero] keeps it until dismissed.
  static int show(
    BuildContext context,
    String title, {
    String? description,
    TrcToastTone tone = TrcToastTone.normal,
    Duration? duration,
    TrcToastAction? action,
  }) {
    return TrcToaster.of(context).show(
      title,
      description: description,
      tone: tone,
      duration: duration,
      action: action,
    );
  }

  /// Shows a success toast.
  static int success(
    BuildContext context,
    String title, {
    String? description,
    Duration? duration,
    TrcToastAction? action,
  }) => show(
    context,
    title,
    description: description,
    tone: TrcToastTone.success,
    duration: duration,
    action: action,
  );

  /// Shows an error toast.
  static int error(
    BuildContext context,
    String title, {
    String? description,
    Duration? duration,
    TrcToastAction? action,
  }) => show(
    context,
    title,
    description: description,
    tone: TrcToastTone.error,
    duration: duration,
    action: action,
  );

  /// Dismisses one toast, or all of them without an [id].
  static void dismiss(BuildContext context, [int? id]) =>
      TrcToaster.of(context).dismiss(id);
}

/// Notification area: place it once around your app, for instance with
/// `MaterialApp(builder: (context, child) => TrcToaster(child: child!))`.
///
/// New toasts are announced to screen readers as live regions; timers pause
/// while the pointer or the keyboard focus is inside.
class TrcToaster extends StatefulWidget {
  /// Shows toasts over [child].
  const TrcToaster({
    super.key,
    required this.child,
    this.position = TrcToasterPosition.bottomEnd,
    this.duration = const Duration(seconds: 5),
    this.label = 'Notifications',
    this.closeLabel = 'Close',
  });

  /// The app.
  final Widget child;

  /// Where toasts stack.
  final TrcToasterPosition position;

  /// Default time on screen.
  final Duration duration;

  /// Accessible name of the notification area.
  final String label;

  /// Accessible name of each close button.
  final String closeLabel;

  /// The closest toaster.
  static TrcToasterState of(BuildContext context) {
    final state = context.findAncestorStateOfType<TrcToasterState>();
    assert(state != null, 'No TrcToaster found above this context.');
    return state!;
  }

  @override
  State<TrcToaster> createState() => TrcToasterState();
}

/// State of a [TrcToaster]: shows and dismisses toasts.
class TrcToasterState extends State<TrcToaster> {
  final _items = <_ToastItem>[];
  int _nextId = 1;
  bool _hovered = false;
  bool _focused = false;

  bool get _paused => _hovered || _focused;

  /// Shows a toast and returns its id.
  int show(
    String title, {
    String? description,
    TrcToastTone tone = TrcToastTone.normal,
    Duration? duration,
    TrcToastAction? action,
  }) {
    final id = _nextId++;
    setState(
      () => _items.add(
        _ToastItem(
          id: id,
          title: title,
          description: description,
          tone: tone,
          duration: duration,
          action: action,
        ),
      ),
    );
    return id;
  }

  /// Dismisses one toast, or all of them without an [id]. They leave with a
  /// short animation.
  void dismiss([int? id]) {
    if (!mounted) return;
    setState(() {
      for (final item in _items) {
        if (id == null || item.id == id) item.leaving = true;
      }
    });
    Timer(const Duration(milliseconds: 200), () {
      if (!mounted) return;
      setState(
        () =>
            _items.removeWhere((t) => t.leaving && (id == null || t.id == id)),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.maybeOf(context);
    final screen = media?.size ?? Size.zero;
    final padding = media?.padding ?? EdgeInsets.zero;
    final edge = screen.width >= TrcBreakpoints.sm ? 24.0 : 16.0;
    final width = math.min(380.0, math.max(0.0, screen.width - 32));
    final top = widget.position == TrcToasterPosition.topEnd;
    final list = Semantics(
      label: widget.label,
      explicitChildNodes: true,
      container: true,
      child: MouseRegion(
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onFocusChange: (v) => setState(() => _focused = v),
          child: SizedBox(
            width: width,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              verticalDirection: top
                  ? VerticalDirection.up
                  : VerticalDirection.down,
              children: [
                for (final item in _items)
                  Padding(
                    key: ValueKey(item.id),
                    padding: EdgeInsets.only(
                      top: top ? 0 : 8,
                      bottom: top ? 8 : 0,
                    ),
                    child: _ToastCard(
                      item: item,
                      duration: item.duration ?? widget.duration,
                      paused: _paused,
                      closeLabel: widget.closeLabel,
                      onDismiss: () => dismiss(item.id),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
    final Widget positioned = switch (widget.position) {
      TrcToasterPosition.bottomEnd => PositionedDirectional(
        end: edge + padding.right,
        bottom: edge + padding.bottom,
        child: list,
      ),
      TrcToasterPosition.bottomCenter => Positioned(
        left: 0,
        right: 0,
        bottom: 16 + padding.bottom,
        child: Center(child: list),
      ),
      TrcToasterPosition.topEnd => PositionedDirectional(
        end: edge + padding.right,
        top: edge + padding.top,
        child: list,
      ),
    };
    return Stack(
      textDirection: Directionality.maybeOf(context) ?? TextDirection.ltr,
      children: [widget.child, if (_items.isNotEmpty) positioned],
    );
  }
}

class _ToastCard extends StatefulWidget {
  const _ToastCard({
    required this.item,
    required this.duration,
    required this.paused,
    required this.closeLabel,
    required this.onDismiss,
  });

  final _ToastItem item;
  final Duration duration;
  final bool paused;
  final String closeLabel;
  final VoidCallback onDismiss;

  @override
  State<_ToastCard> createState() => _ToastCardState();
}

class _ToastCardState extends State<_ToastCard> {
  Timer? _timer;
  late Duration _remaining = widget.duration;
  DateTime? _startedAt;

  void _start() {
    if (widget.duration == Duration.zero || widget.item.leaving) return;
    _startedAt = DateTime.now();
    _timer = Timer(_remaining, widget.onDismiss);
  }

  void _pause() {
    _timer?.cancel();
    _timer = null;
    final started = _startedAt;
    if (started != null) {
      _remaining -= DateTime.now().difference(started);
      if (_remaining.isNegative) _remaining = Duration.zero;
      _startedAt = null;
    }
  }

  @override
  void initState() {
    super.initState();
    if (!widget.paused) _start();
  }

  @override
  void didUpdateWidget(_ToastCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.paused && !oldWidget.paused) _pause();
    if (!widget.paused && oldWidget.paused) _start();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final item = widget.item;
    final dotted = item.tone != TrcToastTone.normal;
    final reduce = trcReduceMotion(context);
    Widget withDot(Widget child) => dotted
        ? Padding(
            padding: const EdgeInsetsDirectional.only(start: 16),
            child: child,
          )
        : child;

    final card = Container(
      padding: const EdgeInsetsDirectional.fromSTEB(18, 14, 10, 14),
      decoration: BoxDecoration(
        color: theme.surface,
        borderRadius: BorderRadius.circular(14),
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
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Semantics(
              liveRegion: true,
              container: true,
              child: Padding(
                padding: const EdgeInsets.only(top: 2),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        if (dotted)
                          PositionedDirectional(
                            start: 0,
                            top: 7.5,
                            child: Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: item.tone == TrcToastTone.error
                                    ? theme.danger
                                    : theme.accent,
                              ),
                            ),
                          ),
                        withDot(
                          Text(item.title, style: theme.text(height: 1.4)),
                        ),
                      ],
                    ),
                    if (item.description != null)
                      withDot(
                        Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            item.description!,
                            style: theme.text(
                              size: 14,
                              height: 1.5,
                              color: theme.foregroundMuted,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
          if (item.action != null) ...[
            const SizedBox(width: 12),
            _ActionButton(action: item.action!, onDone: widget.onDismiss),
          ],
          const SizedBox(width: 4),
          TrcIconButton(
            glyph: TrcGlyph.close,
            label: widget.closeLabel,
            size: 28,
            iconSize: 16,
            onPressed: widget.onDismiss,
          ),
        ],
      ),
    );

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: reduce ? 1 : 0, end: item.leaving ? 0 : 1),
      duration: reduce
          ? Duration.zero
          : Duration(milliseconds: item.leaving ? 200 : 300),
      curve: item.leaving ? Curves.ease : theme.easeOut,
      builder: (context, t, child) => Opacity(
        opacity: t,
        child: Transform.translate(
          offset: Offset(0, (item.leaving ? 8 : 12) * (1 - t)),
          child: child,
        ),
      ),
      child: card,
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({required this.action, required this.onDone});

  final TrcToastAction action;
  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Semantics(
      button: true,
      child: TrcTappable(
        onTap: () {
          action.onPressed();
          onDone();
        },
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(8),
          child: Container(
            margin: const EdgeInsets.only(top: 1),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: state.hovered
                  ? const Color(0x0FFFFFFF)
                  : const Color(0x00FFFFFF),
            ),
            child: Text(
              action.label,
              style: theme.text(
                size: 14,
                weight: FontWeight.w500,
                height: 1.4,
                color: theme.accent,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
