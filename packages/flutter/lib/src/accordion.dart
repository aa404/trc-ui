import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// One item of a [TrcAccordion].
@immutable
class TrcAccordionItem<T> {
  /// An item titled [title] that reveals [content].
  const TrcAccordionItem({
    required this.value,
    required this.title,
    required this.content,
    this.disabled = false,
  });

  /// Identifies the item.
  final T value;

  /// Title, the button that opens and closes it.
  final String title;

  /// Revealed content.
  final Widget content;

  /// Shown faded, cannot be toggled.
  final bool disabled;
}

/// Items that open and close, for FAQs and details. Each title is a button
/// inside a heading; the height animates; closed content is out of the
/// accessibility tree. Up and Down arrows, Home and End move between titles.
class TrcAccordion<T> extends StatefulWidget {
  /// An accordion of [items].
  const TrcAccordion({
    super.key,
    required this.items,
    this.multiple = false,
    this.value,
    this.initialValue = const [],
    this.onChanged,
    this.headingLevel = 3,
  });

  /// The items.
  final List<TrcAccordionItem<T>> items;

  /// Any number of items open at once; one at a time otherwise.
  final bool multiple;

  /// Open items, when controlled.
  final List<T>? value;

  /// Open items at first, when not controlled.
  final List<T> initialValue;

  /// Called with the open items.
  final ValueChanged<List<T>>? onChanged;

  /// Heading level of each title, to fit the page outline.
  final int headingLevel;

  @override
  State<TrcAccordion<T>> createState() => _TrcAccordionState<T>();
}

class _TrcAccordionState<T> extends State<TrcAccordion<T>> {
  late List<T> _own = List.of(widget.initialValue);
  List<FocusNode> _nodes = [];

  List<T> get _open => widget.value ?? _own;

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(TrcAccordion<T> oldWidget) {
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

  void _toggle(T value) {
    final open = _open.contains(value);
    final next = widget.multiple
        ? (open ? (_open.where((v) => v != value).toList()) : [..._open, value])
        : (open ? <T>[] : [value]);
    if (widget.value == null) setState(() => _own = next);
    widget.onChanged?.call(next);
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final current = _nodes.indexWhere((n) => n.hasFocus);
    if (current < 0) return KeyEventResult.ignored;
    final enabled = [
      for (var i = 0; i < widget.items.length; i++)
        if (!widget.items[i].disabled) i,
    ];
    if (enabled.isEmpty) return KeyEventResult.ignored;
    final pos = enabled.indexOf(current);
    final key = event.logicalKey;
    int? target;
    if (key == LogicalKeyboardKey.arrowDown) {
      target = enabled[(pos + 1) % enabled.length];
    } else if (key == LogicalKeyboardKey.arrowUp) {
      target = enabled[(pos - 1 + enabled.length) % enabled.length];
    } else if (key == LogicalKeyboardKey.home) {
      target = enabled.first;
    } else if (key == LogicalKeyboardKey.end) {
      target = enabled.last;
    }
    if (target == null) return KeyEventResult.ignored;
    _nodes[target].requestFocus();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Focus(
      canRequestFocus: false,
      skipTraversal: true,
      onKeyEvent: _onKey,
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: theme.border)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < widget.items.length; i++)
              _AccordionRow(
                item: widget.items[i],
                open: _open.contains(widget.items[i].value),
                focusNode: _nodes[i],
                headingLevel: widget.headingLevel,
                onToggle: () => _toggle(widget.items[i].value),
              ),
          ],
        ),
      ),
    );
  }
}

class _AccordionRow<T> extends StatefulWidget {
  const _AccordionRow({
    required this.item,
    required this.open,
    required this.focusNode,
    required this.headingLevel,
    required this.onToggle,
  });

  final TrcAccordionItem<T> item;
  final bool open;
  final FocusNode focusNode;
  final int headingLevel;
  final VoidCallback onToggle;

  @override
  State<_AccordionRow<T>> createState() => _AccordionRowState<T>();
}

class _AccordionRowState<T> extends State<_AccordionRow<T>>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 400),
    value: widget.open ? 1 : 0,
  );

  @override
  void didUpdateWidget(_AccordionRow<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.open != oldWidget.open) {
      _controller.duration = trcMotion(
        context,
        const Duration(milliseconds: 400),
      );
      widget.open ? _controller.forward() : _controller.reverse();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final item = widget.item;
    final curve = CurvedAnimation(parent: _controller, curve: theme.easeOut);
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: theme.border)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Semantics(
            header: true,
            headingLevel: widget.headingLevel,
            child: Semantics(
              button: true,
              expanded: widget.open,
              enabled: !item.disabled,
              label: item.title,
              container: true,
              child: TrcTappable(
                excludeChildSemantics: true,
                enabled: !item.disabled,
                focusNode: widget.focusNode,
                onTap: widget.onToggle,
                builder: (context, state) => TrcFocusRing(
                  visible: state.focused,
                  borderRadius: BorderRadius.circular(4),
                  child: Opacity(
                    opacity: item.disabled ? 0.4 : 1,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 22),
                      child: Row(
                        children: [
                          Expanded(
                            child: AnimatedDefaultTextStyle(
                              duration: const Duration(milliseconds: 200),
                              style: theme.text(
                                size: 18,
                                height: 1.35,
                                letterSpacing: -0.015,
                                color: state.hovered
                                    ? theme.accent
                                    : theme.foreground,
                              ),
                              child: Text(item.title),
                            ),
                          ),
                          const SizedBox(width: 24),
                          RotationTransition(
                            turns: Tween<double>(
                              begin: 0,
                              end: 0.5,
                            ).animate(curve),
                            child: TrcIcon(
                              TrcGlyph.chevronDown,
                              size: 20,
                              color: theme.foregroundSubtle,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          AnimatedBuilder(
            animation: _controller,
            builder: (context, child) => _controller.isDismissed
                ? const SizedBox.shrink()
                : ClipRect(
                    child: Align(
                      alignment: AlignmentDirectional.topStart,
                      heightFactor: curve.value,
                      child: child,
                    ),
                  ),
            child: ExcludeSemantics(
              excluding: !widget.open,
              child: Padding(
                padding: const EdgeInsetsDirectional.only(end: 40, bottom: 24),
                child: DefaultTextStyle(
                  style: theme.text(height: 1.7, color: theme.foregroundMuted),
                  child: item.content,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
