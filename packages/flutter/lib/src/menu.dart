import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'floating.dart';
import 'theme.dart';

/// An entry of a [TrcMenu]: a [TrcMenuItem] or a [TrcMenuSeparator].
sealed class TrcMenuEntry {
  const TrcMenuEntry();
}

/// A hairline between groups of menu items.
class TrcMenuSeparator extends TrcMenuEntry {
  /// A separator.
  const TrcMenuSeparator();
}

/// An action of a [TrcMenu].
class TrcMenuItem extends TrcMenuEntry {
  /// An action labelled [label].
  const TrcMenuItem({
    required this.label,
    this.onSelected,
    this.hint,
    this.disabled = false,
    this.danger = false,
  });

  /// Text of the item; also used to jump to it by typing its first letter.
  final String label;

  /// Called when chosen with a tap, Enter or Space; the menu closes first.
  final VoidCallback? onSelected;

  /// Hint on the right, such as a keyboard shortcut.
  final String? hint;

  /// Shown faded and skipped by the keyboard.
  final bool disabled;

  /// Destructive action (delete, leave…), in the error color.
  final bool danger;
}

/// Opens or closes a [TrcMenu] or a [TrcPopover] from its trigger.
typedef TrcTriggerBuilder =
    Widget Function(BuildContext context, VoidCallback toggle, bool open);

/// Menu of actions opened from a trigger, usually a pill or an icon button.
///
/// Keyboard: Enter, Space or Down open it with the focus on the first item;
/// the arrows, Home and End move between items; typing a letter jumps to the
/// next item starting with it; Escape closes and returns the focus to the
/// trigger; Tab closes and moves on.
class TrcMenu extends StatefulWidget {
  /// A menu of [items] opened by the widget [builder] returns.
  const TrcMenu({
    super.key,
    required this.items,
    required this.builder,
    this.align = TrcAlign.start,
    this.side = TrcSide.bottom,
    this.semanticLabel,
  });

  /// Items and separators.
  final List<TrcMenuEntry> items;

  /// Builds the trigger; call `toggle` from its `onPressed`.
  final TrcTriggerBuilder builder;

  /// Horizontal alignment against the trigger.
  final TrcAlign align;

  /// Preferred side.
  final TrcSide side;

  /// Accessible name of the menu panel.
  final String? semanticLabel;

  @override
  State<TrcMenu> createState() => _TrcMenuState();
}

class _TrcMenuState extends State<TrcMenu> {
  bool _open = false;
  FocusNode? _returnTo;
  List<FocusNode> _nodes = [];
  final _panelNode = FocusNode(debugLabel: 'TrcMenu', skipTraversal: true);
  DateTime? _pointerDown;

  /// Keyboard users see an outline on the focused item; pointer users only
  /// the lit background, like `:focus-visible`.
  bool _keyboard = false;

  List<TrcMenuItem> get _items =>
      widget.items.whereType<TrcMenuItem>().toList();

  @override
  void initState() {
    super.initState();
    _syncNodes();
  }

  @override
  void didUpdateWidget(TrcMenu oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncNodes();
  }

  void _syncNodes() {
    final count = _items.length;
    if (_nodes.length == count) return;
    for (final node in _nodes) {
      node.dispose();
    }
    _nodes = List.generate(
      count,
      (i) => FocusNode(debugLabel: 'TrcMenuItem $i'),
    );
  }

  @override
  void dispose() {
    for (final node in _nodes) {
      node.dispose();
    }
    _panelNode.dispose();
    super.dispose();
  }

  void _show({bool last = false}) {
    _returnTo = FocusManager.instance.primaryFocus;
    final down = _pointerDown;
    final byPointer =
        down != null &&
        DateTime.now().difference(down) < const Duration(seconds: 1);
    setState(() {
      _open = true;
      _keyboard = !byPointer;
    });
    // Focus an item once the panel is built (the panel itself after a tap,
    // so that the arrows work without lighting an item).
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || !_open) return;
      if (byPointer) {
        _panelNode.requestFocus();
        return;
      }
      final items = _items;
      final order = List.generate(items.length, (i) => i);
      for (final i in last ? order.reversed : order) {
        if (!items[i].disabled) {
          _nodes[i].requestFocus();
          break;
        }
      }
    });
  }

  void _close({bool restoreFocus = true}) {
    if (!_open) return;
    setState(() => _open = false);
    if (restoreFocus) _returnTo?.requestFocus();
  }

  void _toggle() => _open ? _close() : _show();

  void _choose(TrcMenuItem item) {
    if (item.disabled) return;
    _close();
    item.onSelected?.call();
  }

  int get _focusedIndex => _nodes.indexWhere((n) => n.hasFocus);

  void _move(int from, int step) {
    final items = _items;
    var i = from;
    for (var n = 0; n < items.length; n++) {
      i = (i + step) % items.length;
      if (i < 0) i += items.length;
      if (!items[i].disabled) {
        _nodes[i].requestFocus();
        return;
      }
    }
  }

  KeyEventResult _onMenuKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    final current = _focusedIndex;
    if (!_keyboard) setState(() => _keyboard = true);
    if (key == LogicalKeyboardKey.arrowDown) {
      _move(current, 1);
    } else if (key == LogicalKeyboardKey.arrowUp) {
      _move(current < 0 ? 0 : current, -1);
    } else if (key == LogicalKeyboardKey.home) {
      _move(-1, 1);
    } else if (key == LogicalKeyboardKey.end) {
      _move(0, -1);
    } else if (key == LogicalKeyboardKey.tab) {
      _close();
      return KeyEventResult.ignored;
    } else if (key == LogicalKeyboardKey.enter ||
        key == LogicalKeyboardKey.numpadEnter ||
        key == LogicalKeyboardKey.space) {
      if (current >= 0) _choose(_items[current]);
    } else {
      final char = event.character;
      if (char == null || char.trim().isEmpty || char.length != 1) {
        return KeyEventResult.ignored;
      }
      // Typeahead: the next enabled item starting with the letter typed.
      final items = _items;
      final letter = char.toLowerCase();
      for (var n = 1; n <= items.length; n++) {
        final i = (current + n) % items.length;
        if (!items[i].disabled &&
            items[i].label.toLowerCase().startsWith(letter)) {
          _nodes[i].requestFocus();
          break;
        }
      }
    }
    return KeyEventResult.handled;
  }

  KeyEventResult _onTriggerKey(FocusNode node, KeyEvent event) {
    if (_open || event is! KeyDownEvent) return KeyEventResult.ignored;
    if (event.logicalKey == LogicalKeyboardKey.arrowDown) {
      _show();
      return KeyEventResult.handled;
    }
    if (event.logicalKey == LogicalKeyboardKey.arrowUp) {
      _show(last: true);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    return TrcAnchoredOverlay(
      open: _open,
      side: widget.side,
      align: widget.align,
      onDismiss: (reason) =>
          _close(restoreFocus: reason == TrcDismissReason.escape),
      panelBuilder: (context) => _panel(context),
      child: Listener(
        onPointerDown: (_) => _pointerDown = DateTime.now(),
        child: Focus(
          canRequestFocus: false,
          skipTraversal: true,
          onKeyEvent: _onTriggerKey,
          child: widget.builder(context, _toggle, _open),
        ),
      ),
    );
  }

  Widget _panel(BuildContext context) {
    final theme = TrcTheme.of(context);
    var index = 0;
    final children = <Widget>[];
    for (final entry in widget.items) {
      switch (entry) {
        case TrcMenuSeparator():
          children.add(
            Container(
              height: 1,
              margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
              color: theme.border,
            ),
          );
        case TrcMenuItem():
          children.add(
            _MenuRow(
              item: entry,
              focusNode: _nodes[index],
              keyboard: _keyboard,
              onPointer: () {
                if (_keyboard) setState(() => _keyboard = false);
              },
              onChoose: () => _choose(entry),
            ),
          );
          index++;
      }
    }
    return Semantics(
      label: widget.semanticLabel,
      explicitChildNodes: true,
      child: Focus(
        focusNode: _panelNode,
        onKeyEvent: _onMenuKey,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minWidth: 200, maxWidth: 320),
          child: IntrinsicWidth(
            child: TrcFloatingPanel(
              color: theme.surface.withValues(alpha: 0.96),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: children,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _MenuRow extends StatefulWidget {
  const _MenuRow({
    required this.item,
    required this.focusNode,
    required this.keyboard,
    required this.onPointer,
    required this.onChoose,
  });

  final TrcMenuItem item;
  final FocusNode focusNode;
  final bool keyboard;
  final VoidCallback onPointer;
  final VoidCallback onChoose;

  @override
  State<_MenuRow> createState() => _MenuRowState();
}

class _MenuRowState extends State<_MenuRow> {
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final item = widget.item;
    return Semantics(
      button: true,
      enabled: !item.disabled,
      label: item.label,
      hint: item.hint,
      excludeSemantics: true,
      onTap: item.disabled ? null : widget.onChoose,
      child: FocusableActionDetector(
        focusNode: widget.focusNode,
        mouseCursor: item.disabled
            ? SystemMouseCursors.forbidden
            : SystemMouseCursors.click,
        onFocusChange: (v) => setState(() => _focused = v),
        child: MouseRegion(
          // The pointer moves the focus, like in a native menu.
          onEnter: (_) {
            widget.onPointer();
            if (!item.disabled) widget.focusNode.requestFocus();
          },
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: item.disabled ? null : widget.onChoose,
            child: Opacity(
              opacity: item.disabled ? 0.4 : 1,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: _focused
                      ? const Color(0x0FFFFFFF)
                      : const Color(0x00000000),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: _focused && widget.keyboard
                        ? theme.borderStrong
                        : const Color(0x00000000),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.label,
                        style: theme.text(
                          height: 1.3,
                          color: item.danger ? theme.danger : theme.foreground,
                        ),
                      ),
                    ),
                    if (item.hint != null) ...[
                      const SizedBox(width: 24),
                      Text(
                        item.hint!,
                        style: theme.text(
                          size: 13,
                          color: theme.foregroundFaint,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
