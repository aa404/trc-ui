import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'field.dart';
import 'floating.dart';
import 'foundation.dart';
import 'icons.dart';
import 'listbox.dart';
import 'text_field.dart';
import 'theme.dart';

const Map<String, String> _folds = {
  'àáâãäåāăą': 'a',
  'çćĉċč': 'c',
  'ďđ': 'd',
  'èéêëēĕėęě': 'e',
  'ĝğġģ': 'g',
  'ĥħ': 'h',
  'ìíîïĩīĭįı': 'i',
  'ĵ': 'j',
  'ķ': 'k',
  'ĺļľŀł': 'l',
  'ñńņňŉ': 'n',
  'òóôõöøōŏő': 'o',
  'ŕŗř': 'r',
  'śŝşšș': 's',
  'ţťŧț': 't',
  'ùúûüũūŭůűų': 'u',
  'ŵ': 'w',
  'ýÿŷ': 'y',
  'źżž': 'z',
  'æ': 'ae',
  'œ': 'oe',
  'ß': 'ss',
};

final Map<int, String> _foldTable = {
  for (final entry in _folds.entries)
    for (final rune in entry.key.runes) rune: entry.value,
};

/// Case and accent insensitive text, for matching "Bénin" with "benin":
/// lower case, Latin accents folded, combining marks removed.
String normalizeForSearch(String text) {
  final out = StringBuffer();
  for (final rune in text.toLowerCase().runes) {
    // Combining diacritical marks (U+0300 to U+036F).
    if (rune >= 0x300 && rune <= 0x36f) continue;
    out.write(_foldTable[rune] ?? String.fromCharCode(rune));
  }
  return out.toString();
}

/// One suggestion of a [TrcCombobox].
@immutable
class TrcComboboxOption<T> {
  /// A suggestion with its [value] and [label].
  const TrcComboboxOption({
    required this.value,
    required this.label,
    this.description,
    this.disabled = false,
  });

  /// Value chosen.
  final T value;

  /// Text searched and shown.
  final String label;

  /// Detail under the label.
  final String? description;

  /// Shown faded, not choosable.
  final bool disabled;
}

/// Search field with a list of suggestions. Typing filters (ignoring case
/// and accents); the arrows move the active option while the focus stays in
/// the field; Enter chooses; Escape closes; leaving the field restores the
/// chosen label. Works inside a [TrcField].
class TrcCombobox<T> extends StatefulWidget {
  /// A combobox over [options].
  const TrcCombobox({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.placeholder,
    this.emptyText = 'No results',
    this.invalid,
    this.enabled = true,
    this.semanticLabel,
  });

  /// The suggestions.
  final List<TrcComboboxOption<T>> options;

  /// The chosen value, or null.
  final T? value;

  /// Called with the chosen value.
  final ValueChanged<T>? onChanged;

  /// Faint text shown while empty.
  final String? placeholder;

  /// Shown when nothing matches the search.
  final String emptyText;

  /// Error state; follows the enclosing field when null.
  final bool? invalid;

  /// Whether the field accepts input.
  final bool enabled;

  /// Accessible name outside a field.
  final String? semanticLabel;

  @override
  State<TrcCombobox<T>> createState() => _TrcComboboxState<T>();
}

class _TrcComboboxState<T> extends State<TrcCombobox<T>> {
  final _controller = TextEditingController();
  FocusNode? _ownNode;
  FocusNode? _listened;
  bool _open = false;
  int _active = -1;

  TrcComboboxOption<T>? get _selected {
    for (final o in widget.options) {
      if (o.value == widget.value) return o;
    }
    return null;
  }

  String get _selectedLabel => _selected?.label ?? '';

  /// While the field shows the chosen label, the list shows every option.
  List<TrcComboboxOption<T>> get _visible {
    final query = _controller.text;
    if (query == _selectedLabel) return widget.options;
    final key = normalizeForSearch(query);
    return [
      for (final o in widget.options)
        if (normalizeForSearch(o.label).contains(key)) o,
    ];
  }

  FocusNode get _node =>
      TrcFieldScope.maybeOf(context)?.focusNode ??
      (_ownNode ??= FocusNode(debugLabel: 'TrcCombobox'));

  @override
  void initState() {
    super.initState();
    _controller.text = _selectedLabel;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final node = _node;
    if (node != _listened) {
      _listened?.removeListener(_onFocus);
      _listened = node..addListener(_onFocus);
    }
  }

  @override
  void didUpdateWidget(TrcCombobox<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Keep the field in sync when the value changes from outside.
    if (!_open && _controller.text != _selectedLabel) {
      _controller.text = _selectedLabel;
    }
  }

  @override
  void dispose() {
    _listened?.removeListener(_onFocus);
    _ownNode?.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _onFocus() {
    if (!(_listened?.hasFocus ?? false) && _open) _close();
  }

  List<TrcListboxItem> _items(List<TrcComboboxOption<T>> visible) => [
    for (final o in visible)
      TrcListboxItem(
        label: o.label,
        description: o.description,
        selected: o.value == widget.value,
        disabled: o.disabled,
      ),
  ];

  void _show({bool last = false}) {
    final visible = _visible;
    final items = _items(visible);
    final current = visible.indexWhere((o) => o.value == widget.value);
    setState(() {
      _open = true;
      _active = !last && current >= 0
          ? current
          : nextEnabled(items, last ? 0 : -1, last ? -1 : 1);
    });
  }

  void _close() {
    setState(() {
      _open = false;
      _active = -1;
      _controller.text = _selectedLabel;
    });
  }

  void _choose(TrcComboboxOption<T> option) {
    if (option.disabled) return;
    widget.onChanged?.call(option.value);
    setState(() {
      _open = false;
      _active = -1;
      _controller.text = option.label;
      _controller.selection = TextSelection.collapsed(
        offset: option.label.length,
      );
    });
  }

  void _onChanged(String text) {
    final items = _items(_visible);
    setState(() {
      _open = true;
      _active = nextEnabled(items, -1, 1);
    });
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    final visible = _visible;
    final items = _items(visible);
    if (key == LogicalKeyboardKey.arrowDown) {
      if (!_open) {
        _show();
      } else {
        setState(() => _active = nextEnabled(items, _active, 1));
      }
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.arrowUp) {
      if (!_open) {
        _show(last: true);
      } else {
        setState(
          () => _active = nextEnabled(items, _active < 0 ? 0 : _active, -1),
        );
      }
      return KeyEventResult.handled;
    }
    if ((key == LogicalKeyboardKey.enter ||
            key == LogicalKeyboardKey.numpadEnter) &&
        _open) {
      if (_active >= 0 && _active < visible.length) _choose(visible[_active]);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.escape && !_open) {
      if (_controller.text != _selectedLabel) {
        setState(() => _controller.text = _selectedLabel);
        return KeyEventResult.handled;
      }
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final visible = _visible;
    final reduce = trcReduceMotion(context);
    return TrcAnchoredOverlay(
      open: _open,
      matchWidth: true,
      offset: 6,
      onDismiss: (_) => _close(),
      panelBuilder: (context) => TrcListbox(
        items: _items(visible),
        active: _active,
        emptyText: widget.emptyText,
        onChoose: (i) => _choose(visible[i]),
        onHover: (i) => setState(() => _active = i),
      ),
      child: Semantics(
        expanded: _open,
        child: Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onKeyEvent: _onKey,
          child: TrcTextField(
            onTap: () {
              if (!_open && widget.enabled) _show();
            },
            controller: _controller,
            focusNode: _node,
            placeholder: widget.placeholder,
            invalid: widget.invalid,
            enabled: widget.enabled,
            semanticLabel: widget.semanticLabel,
            autocorrect: false,
            onChanged: _onChanged,
            trailing: Padding(
              padding: const EdgeInsetsDirectional.only(end: 8),
              child: AnimatedRotation(
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
            ),
          ),
        ),
      ),
    );
  }
}
