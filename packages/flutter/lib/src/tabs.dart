import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'theme.dart';

/// One tab of [TrcTabs].
@immutable
class TrcTabItem<T> {
  /// A tab labelled [label] showing [content] when selected.
  const TrcTabItem({
    required this.value,
    required this.label,
    required this.content,
    this.disabled = false,
  });

  /// Identifies the tab.
  final T value;

  /// Text of the tab.
  final String label;

  /// Panel shown when the tab is selected.
  final Widget content;

  /// Shown faded, not selectable.
  final bool disabled;
}

/// Moves between the enabled items of a row with the arrow keys, Home and
/// End; returns the index to go to, or null when the key is not one of them.
int? _rovingTarget(
  KeyEvent event,
  int current,
  List<bool> disabled,
  TextDirection direction,
) {
  if (event is! KeyDownEvent && event is! KeyRepeatEvent) return null;
  final key = event.logicalKey;
  final rtl = direction == TextDirection.rtl;
  int step;
  int from = current;
  if (key == LogicalKeyboardKey.arrowRight) {
    step = rtl ? -1 : 1;
  } else if (key == LogicalKeyboardKey.arrowLeft) {
    step = rtl ? 1 : -1;
  } else if (key == LogicalKeyboardKey.home) {
    step = 1;
    from = -1;
  } else if (key == LogicalKeyboardKey.end) {
    step = -1;
    from = disabled.length;
  } else {
    return null;
  }
  var i = from;
  for (var n = 0; n < disabled.length; n++) {
    i += step;
    if (key == LogicalKeyboardKey.arrowRight ||
        key == LogicalKeyboardKey.arrowLeft) {
      i %= disabled.length;
      if (i < 0) i += disabled.length;
    }
    if (i < 0 || i >= disabled.length) return null;
    if (!disabled[i]) return i;
  }
  return null;
}

/// Tabs: thin labels on a hairline, the selected one underlined with the
/// accent. Keyboard: Left and Right arrows, Home and End; only the selected
/// tab is in the Tab order (roving focus). With [manualActivation], the
/// arrows only move the focus and Enter or Space selects.
class TrcTabs<T> extends StatefulWidget {
  /// Tabs over [items].
  const TrcTabs({
    super.key,
    required this.items,
    this.value,
    this.initialValue,
    this.onChanged,
    this.semanticLabel,
    this.manualActivation = false,
  });

  /// The tabs.
  final List<TrcTabItem<T>> items;

  /// Selected tab, when controlled.
  final T? value;

  /// Selected tab at first, when not controlled; the first enabled one by
  /// default.
  final T? initialValue;

  /// Called when a tab is selected.
  final ValueChanged<T>? onChanged;

  /// Accessible name of the tab list.
  final String? semanticLabel;

  /// The arrows move the focus without selecting.
  final bool manualActivation;

  @override
  State<TrcTabs<T>> createState() => _TrcTabsState<T>();
}

class _TrcTabsState<T> extends State<TrcTabs<T>> {
  T? _own;
  List<FocusNode> _nodes = [];

  T? get _value {
    final v = widget.value ?? _own;
    if (v != null) return v;
    for (final item in widget.items) {
      if (!item.disabled) return item.value;
    }
    return null;
  }

  @override
  void initState() {
    super.initState();
    _own = widget.initialValue;
    _sync();
  }

  @override
  void didUpdateWidget(TrcTabs<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    if (_nodes.length == widget.items.length) return;
    for (final n in _nodes) {
      n.dispose();
    }
    _nodes = List.generate(widget.items.length, (i) => FocusNode());
  }

  @override
  void dispose() {
    for (final n in _nodes) {
      n.dispose();
    }
    super.dispose();
  }

  void _select(T value) {
    if (widget.value == null) setState(() => _own = value);
    widget.onChanged?.call(value);
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    final current = _nodes.indexWhere((n) => n.hasFocus);
    if (current < 0) return KeyEventResult.ignored;
    final target = _rovingTarget(event, current, [
      for (final i in widget.items) i.disabled,
    ], Directionality.of(context));
    if (target == null) return KeyEventResult.ignored;
    _nodes[target].requestFocus();
    if (!widget.manualActivation) _select(widget.items[target].value);
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final selected = _value;
    final selectedIndex = widget.items.indexWhere((i) => i.value == selected);
    final duration = trcMotion(context, const Duration(milliseconds: 300));
    for (var i = 0; i < _nodes.length; i++) {
      _nodes[i].skipTraversal = i != selectedIndex;
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        Semantics(
          label: widget.semanticLabel,
          container: true,
          explicitChildNodes: true,
          child: Focus(
            canRequestFocus: false,
            skipTraversal: true,
            onKeyEvent: _onKey,
            child: DecoratedBox(
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: theme.border)),
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                clipBehavior: Clip.none,
                child: Row(
                  children: [
                    for (var i = 0; i < widget.items.length; i++) ...[
                      if (i > 0) const SizedBox(width: 28),
                      _tab(context, i, i == selectedIndex, duration),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
        if (selectedIndex >= 0)
          Padding(
            padding: const EdgeInsets.only(top: 24),
            child: KeyedSubtree(
              key: ValueKey(selected),
              child: widget.items[selectedIndex].content,
            ),
          ),
      ],
    );
  }

  Widget _tab(BuildContext context, int i, bool selected, Duration duration) {
    final theme = TrcTheme.of(context);
    final item = widget.items[i];
    return Semantics(
      button: true,
      selected: selected,
      enabled: !item.disabled,
      label: item.label,
      container: true,
      child: TrcTappable(
        excludeChildSemantics: true,
        enabled: !item.disabled,
        focusNode: _nodes[i],
        onTap: () => _select(item.value),
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(4),
          child: Opacity(
            opacity: item.disabled ? 0.4 : 1,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 12, bottom: 14),
                  child: AnimatedDefaultTextStyle(
                    duration: const Duration(milliseconds: 200),
                    style: theme.text(
                      height: 1.3,
                      color: selected || state.hovered
                          ? theme.foreground
                          : theme.foregroundSubtle,
                    ),
                    child: Text(item.label, maxLines: 1, softWrap: false),
                  ),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  child: AnimatedScale(
                    scale: selected ? 1 : 0,
                    duration: duration,
                    curve: theme.easeOut,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: theme.accent,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// One option of a [TrcSegmentedControl].
@immutable
class TrcSegment<T> {
  /// An option with its [value] and [label].
  const TrcSegment({
    required this.value,
    required this.label,
    this.disabled = false,
  });

  /// Value chosen.
  final T value;

  /// Text shown.
  final String label;

  /// Shown faded, not choosable.
  final bool disabled;
}

/// Pill switch between a few options, announced as a group of radio buttons:
/// the arrows move the choice. For views of the same content; use [TrcTabs]
/// to switch panels.
class TrcSegmentedControl<T> extends StatefulWidget {
  /// A segmented control over [options].
  const TrcSegmentedControl({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.semanticLabel,
    this.small = false,
  });

  /// The options.
  final List<TrcSegment<T>> options;

  /// The chosen value.
  final T value;

  /// Called with the new value.
  final ValueChanged<T>? onChanged;

  /// Accessible name of the group.
  final String? semanticLabel;

  /// Compact version.
  final bool small;

  @override
  State<TrcSegmentedControl<T>> createState() => _TrcSegmentedControlState<T>();
}

class _TrcSegmentedControlState<T> extends State<TrcSegmentedControl<T>> {
  List<FocusNode> _nodes = [];

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(TrcSegmentedControl<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    if (_nodes.length == widget.options.length) return;
    for (final n in _nodes) {
      n.dispose();
    }
    _nodes = List.generate(widget.options.length, (i) => FocusNode());
  }

  @override
  void dispose() {
    for (final n in _nodes) {
      n.dispose();
    }
    super.dispose();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    final current = _nodes.indexWhere((n) => n.hasFocus);
    if (current < 0 || widget.onChanged == null) return KeyEventResult.ignored;
    final target = _rovingTarget(event, current, [
      for (final o in widget.options) o.disabled,
    ], Directionality.of(context));
    if (target == null) return KeyEventResult.ignored;
    _nodes[target].requestFocus();
    widget.onChanged!(widget.options[target].value);
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final selectedIndex = widget.options.indexWhere(
      (o) => o.value == widget.value,
    );
    for (var i = 0; i < _nodes.length; i++) {
      _nodes[i].skipTraversal = selectedIndex >= 0
          ? i != selectedIndex
          : i != 0;
    }
    return Semantics(
      label: widget.semanticLabel,
      container: true,
      explicitChildNodes: true,
      child: Focus(
        canRequestFocus: false,
        skipTraversal: true,
        onKeyEvent: _onKey,
        child: Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: theme.borderStrong),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var i = 0; i < widget.options.length; i++)
                  _segment(context, i, i == selectedIndex),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _segment(BuildContext context, int i, bool selected) {
    final theme = TrcTheme.of(context);
    final option = widget.options[i];
    final enabled = !option.disabled && widget.onChanged != null;
    return Semantics(
      inMutuallyExclusiveGroup: true,
      checked: selected,
      enabled: enabled,
      label: option.label,
      container: true,
      child: TrcTappable(
        excludeChildSemantics: true,
        enabled: enabled,
        focusNode: _nodes[i],
        onTap: () => widget.onChanged?.call(option.value),
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(999),
          child: Opacity(
            opacity: option.disabled ? 0.4 : 1,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: widget.small
                  ? const EdgeInsets.symmetric(horizontal: 12, vertical: 6)
                  : const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(999),
                color: selected ? theme.surfaceAlt : const Color(0x00000000),
              ),
              child: Text(
                option.label,
                maxLines: 1,
                softWrap: false,
                style: theme.text(
                  size: widget.small ? 13 : 14,
                  height: 1.3,
                  color: selected || state.hovered
                      ? theme.foreground
                      : theme.foregroundSubtle,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
