import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'field.dart';
import 'floating.dart';
import 'foundation.dart';
import 'icons.dart';
import 'listbox.dart';
import 'theme.dart';

/// One choice of a [TrcSelect].
@immutable
class TrcSelectOption<T> {
  /// An option with its [value] and visible [label].
  const TrcSelectOption({
    required this.value,
    required this.label,
    this.disabled = false,
  });

  /// Value returned when chosen.
  final T value;

  /// Text shown.
  final String label;

  /// Shown faded, not choosable.
  final bool disabled;
}

/// A choice among options, as a control that opens a list in the trc style,
/// with a thin chevron. Keyboard: Enter, Space or the arrows open it; the
/// arrows, Home and End move; Enter or Space chooses; Escape closes. Works
/// inside a [TrcField].
class TrcSelect<T> extends StatefulWidget {
  /// A select over [options].
  const TrcSelect({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.placeholder,
    this.invalid,
    this.semanticLabel,
    this.focusNode,
  });

  /// The choices.
  final List<TrcSelectOption<T>> options;

  /// The chosen value, or null.
  final T? value;

  /// Called with the chosen value; the select is disabled when null.
  final ValueChanged<T>? onChanged;

  /// Faint text shown until something is chosen.
  final String? placeholder;

  /// Error state; follows the enclosing [TrcField] when null.
  final bool? invalid;

  /// Accessible name outside a [TrcField].
  final String? semanticLabel;

  /// Focus node; the field's one when null.
  final FocusNode? focusNode;

  @override
  State<TrcSelect<T>> createState() => _TrcSelectState<T>();
}

class _TrcSelectState<T> extends State<TrcSelect<T>> {
  bool _open = false;
  int _active = -1;

  bool get _enabled => widget.onChanged != null;

  int get _selectedIndex =>
      widget.options.indexWhere((o) => o.value == widget.value);

  List<TrcListboxItem> get _items => [
    for (final o in widget.options)
      TrcListboxItem(
        label: o.label,
        selected: o.value == widget.value,
        disabled: o.disabled,
      ),
  ];

  void _show() {
    if (!_enabled) return;
    final selected = _selectedIndex;
    setState(() {
      _open = true;
      _active = selected >= 0 ? selected : nextEnabled(_items, -1, 1);
    });
  }

  void _close() => setState(() => _open = false);

  void _choose(int index) {
    final option = widget.options[index];
    if (option.disabled) return;
    widget.onChanged?.call(option.value);
    _close();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    final items = _items;
    if (!_open) {
      if (key == LogicalKeyboardKey.arrowDown ||
          key == LogicalKeyboardKey.arrowUp) {
        _show();
        return KeyEventResult.handled;
      }
      return KeyEventResult.ignored;
    }
    int? move;
    if (key == LogicalKeyboardKey.arrowDown) {
      move = nextEnabled(items, _active, 1);
    } else if (key == LogicalKeyboardKey.arrowUp) {
      move = nextEnabled(items, _active < 0 ? 0 : _active, -1);
    } else if (key == LogicalKeyboardKey.home) {
      move = nextEnabled(items, -1, 1);
    } else if (key == LogicalKeyboardKey.end) {
      move = nextEnabled(items, 0, -1);
    } else if (key == LogicalKeyboardKey.enter ||
        key == LogicalKeyboardKey.numpadEnter ||
        key == LogicalKeyboardKey.space) {
      if (_active >= 0) _choose(_active);
      return KeyEventResult.handled;
    } else if (key == LogicalKeyboardKey.tab) {
      _close();
      return KeyEventResult.ignored;
    }
    if (move != null) {
      setState(() => _active = move!);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final field = TrcFieldScope.maybeOf(context);
    final invalid = widget.invalid ?? field?.invalid ?? false;
    final selected = _selectedIndex;
    final label = selected >= 0
        ? widget.options[selected].label
        : (widget.placeholder ?? '');
    final reduce = trcReduceMotion(context);

    return TrcAnchoredOverlay(
      open: _open,
      matchWidth: true,
      onDismiss: (_) => _close(),
      panelBuilder: (context) => TrcListbox(
        items: _items,
        active: _active,
        onChoose: _choose,
        onHover: (i) => setState(() => _active = i),
      ),
      child: Semantics(
        button: true,
        label: field?.label ?? widget.semanticLabel,
        value: selected >= 0 ? label : null,
        hint: field?.message,
        expanded: _open,
        isRequired: field?.required,
        validationResult: invalid
            ? SemanticsValidationResult.invalid
            : SemanticsValidationResult.none,
        excludeSemantics: true,
        child: Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onKeyEvent: _onKey,
          child: TrcTappable(
            enabled: _enabled,
            focusNode: widget.focusNode ?? field?.focusNode,
            onTap: _open ? _close : _show,
            builder: (context, state) => TrcControlFrame(
              focused: state.focused || _open,
              hovered: state.hovered,
              invalid: invalid,
              enabled: _enabled,
              padding: const EdgeInsetsDirectional.only(start: 16, end: 14),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.text(
                        height: 1.4,
                        color: selected >= 0
                            ? theme.foreground
                            : theme.foregroundFaint,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  AnimatedRotation(
                    turns: _open ? 0.5 : 0,
                    duration: reduce
                        ? Duration.zero
                        : const Duration(milliseconds: 300),
                    curve: theme.easeOut,
                    child: TrcIcon(
                      TrcGlyph.chevronDown,
                      size: 18,
                      color: theme.foregroundSubtle,
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
