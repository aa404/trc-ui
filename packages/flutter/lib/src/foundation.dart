import 'package:flutter/widgets.dart';

/// Fills a label template: `'{count} more'` with `{'count': 3}` gives
/// `'3 more'`. Unknown placeholders are kept as they are.
///
/// Every built-in label of the widgets that depends on a value takes such a
/// template, so that it can be translated without code.
String fillLabel(String template, Map<String, Object> values) {
  return template.replaceAllMapped(RegExp(r'\{(\w+)\}'), (match) {
    final key = match.group(1)!;
    return values.containsKey(key) ? '${values[key]}' : match.group(0)!;
  });
}

/// Whether animations should be skipped: the platform asks for reduced motion.
bool trcReduceMotion(BuildContext context) =>
    MediaQuery.maybeDisableAnimationsOf(context) ?? false;

/// [duration], or zero when the platform asks for reduced motion.
Duration trcMotion(BuildContext context, Duration duration) =>
    trcReduceMotion(context) ? Duration.zero : duration;

/// Screen width breakpoints shared by the widgets (the CSS media queries of
/// the React library).
abstract final class TrcBreakpoints {
  /// Small tablets and large phones in landscape.
  static const double sm = 640;

  /// Tablets.
  static const double md = 768;

  /// Laptops.
  static const double lg = 1024;
}

/// Interaction state of a tappable element.
@immutable
class TrcInteractionState {
  /// Creates a state.
  const TrcInteractionState({
    this.hovered = false,
    this.focused = false,
    this.pressed = false,
    this.enabled = true,
  });

  /// A mouse pointer is over the element.
  final bool hovered;

  /// The element has the keyboard focus and it should show (like
  /// `:focus-visible`: not after a tap).
  final bool focused;

  /// A pointer is down on the element.
  final bool pressed;

  /// The element reacts to input.
  final bool enabled;

  /// Hovered or focused: the state that "wakes up" most trc elements.
  bool get active => enabled && (hovered || focused);
}

/// Shared plumbing of the trc buttons: tap, keyboard activation (Enter and
/// Space), focus with a visible state only for keyboard users, hover and press
/// states, and the click cursor. The caller adds the semantic role and label.
class TrcTappable extends StatefulWidget {
  /// Creates a tappable area.
  const TrcTappable({
    super.key,
    required this.builder,
    this.onTap,
    this.enabled = true,
    this.focusNode,
    this.autofocus = false,
    this.cursor,
    this.onFocusChange,
    this.onHoverChange,
    this.onStateChange,
    this.behavior = HitTestBehavior.opaque,
  });

  /// Builds the element for its current state.
  final Widget Function(BuildContext context, TrcInteractionState state)
  builder;

  /// Called on tap, Enter or Space.
  final VoidCallback? onTap;

  /// When false, the element ignores input and shows the forbidden cursor.
  final bool enabled;

  /// Optional focus node, to move the focus from outside.
  final FocusNode? focusNode;

  /// Takes the focus when first built.
  final bool autofocus;

  /// Cursor over the element; a click cursor by default.
  final MouseCursor? cursor;

  /// Called when the focus changes.
  final ValueChanged<bool>? onFocusChange;

  /// Called when the mouse enters or leaves.
  final ValueChanged<bool>? onHoverChange;

  /// Called whenever the hover, focus or press state changes.
  final ValueChanged<TrcInteractionState>? onStateChange;

  /// How the area takes hits.
  final HitTestBehavior behavior;

  @override
  State<TrcTappable> createState() => _TrcTappableState();
}

class _TrcTappableState extends State<TrcTappable> {
  bool _hovered = false;
  bool _focused = false;
  bool _pressed = false;

  late final Map<Type, Action<Intent>> _actions = {
    ActivateIntent: CallbackAction<ActivateIntent>(
      onInvoke: (_) => _activate(),
    ),
    ButtonActivateIntent: CallbackAction<ButtonActivateIntent>(
      onInvoke: (_) => _activate(),
    ),
  };

  Object? _activate() {
    if (widget.enabled) widget.onTap?.call();
    return null;
  }

  TrcInteractionState get _state => TrcInteractionState(
    hovered: _hovered && widget.enabled,
    focused: _focused && widget.enabled,
    pressed: _pressed && widget.enabled,
    enabled: widget.enabled,
  );

  void _set({bool? hovered, bool? focused, bool? pressed}) {
    final before = _state;
    setState(() {
      _hovered = hovered ?? _hovered;
      _focused = focused ?? _focused;
      _pressed = pressed ?? _pressed;
    });
    final after = _state;
    if (before.hovered != after.hovered ||
        before.focused != after.focused ||
        before.pressed != after.pressed) {
      widget.onStateChange?.call(after);
    }
  }

  void _hover(bool value) {
    if (_hovered == value) return;
    _set(hovered: value);
    widget.onHoverChange?.call(value);
  }

  void _setPressed(bool value) {
    if (_pressed != value) _set(pressed: value);
  }

  @override
  void didUpdateWidget(TrcTappable oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.enabled && !widget.enabled) {
      _pressed = false;
      widget.onStateChange?.call(_state);
    }
  }

  @override
  Widget build(BuildContext context) {
    final enabled = widget.enabled;
    return FocusableActionDetector(
      enabled: enabled,
      focusNode: widget.focusNode,
      autofocus: widget.autofocus,
      descendantsAreFocusable: true,
      actions: _actions,
      mouseCursor: enabled
          ? (widget.cursor ?? SystemMouseCursors.click)
          : SystemMouseCursors.forbidden,
      onShowFocusHighlight: (value) {
        if (_focused != value) _set(focused: value);
      },
      onFocusChange: widget.onFocusChange,
      // Hover from a mouse, whatever the focus highlight mode.
      child: MouseRegion(
        onEnter: (_) => _hover(true),
        onExit: (_) => _hover(false),
        child: GestureDetector(
          behavior: widget.behavior,
          onTapDown: enabled ? (_) => _setPressed(true) : null,
          onTapUp: enabled ? (_) => _setPressed(false) : null,
          onTapCancel: enabled ? () => _setPressed(false) : null,
          onTap: enabled ? widget.onTap : null,
          child: widget.builder(context, _state),
        ),
      ),
    );
  }
}
