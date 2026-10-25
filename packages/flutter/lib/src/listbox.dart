import 'package:flutter/widgets.dart';

import 'floating.dart';
import 'theme.dart';

/// One row of a [TrcListbox].
@immutable
class TrcListboxItem {
  /// An option labelled [label].
  const TrcListboxItem({
    required this.label,
    this.description,
    this.selected = false,
    this.disabled = false,
  });

  /// Text of the option.
  final String label;

  /// Detail under the label.
  final String? description;

  /// Carries the small accent dot.
  final bool selected;

  /// Shown faded, not choosable.
  final bool disabled;
}

/// The list of options of the pickers (select, combobox): a graphite panel
/// whose active row is lightly lit and whose chosen row carries an accent
/// dot. The focus stays in the control that opened it; the control moves the
/// [active] row with the keyboard.
class TrcListbox extends StatefulWidget {
  /// A list of [items].
  const TrcListbox({
    super.key,
    required this.items,
    required this.active,
    required this.onChoose,
    this.onHover,
    this.emptyText,
    this.maxHeight = 280,
  });

  /// The options.
  final List<TrcListboxItem> items;

  /// Index of the lit row, or -1.
  final int active;

  /// Called with the index of a tapped option.
  final ValueChanged<int> onChoose;

  /// Called with the index of the row under the mouse.
  final ValueChanged<int>? onHover;

  /// Shown when there is no option.
  final String? emptyText;

  /// Height above which the list scrolls.
  final double maxHeight;

  @override
  State<TrcListbox> createState() => _TrcListboxState();
}

class _TrcListboxState extends State<TrcListbox> {
  final _keys = <int, GlobalKey>{};

  @override
  void didUpdateWidget(TrcListbox oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.active != oldWidget.active && widget.active >= 0) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final context = _keys[widget.active]?.currentContext;
        if (context != null && context.mounted) {
          Scrollable.ensureVisible(
            context,
            alignmentPolicy: ScrollPositionAlignmentPolicy.keepVisibleAtEnd,
          );
          Scrollable.ensureVisible(
            context,
            alignmentPolicy: ScrollPositionAlignmentPolicy.keepVisibleAtStart,
          );
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    if (widget.items.isEmpty) {
      return TrcFloatingPanel(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Text(
            widget.emptyText ?? '',
            style: theme.text(size: 14, color: theme.foregroundSubtle),
          ),
        ),
      );
    }
    return TrcFloatingPanel(
      padding: EdgeInsets.zero,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxHeight: widget.maxHeight),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(6),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (var i = 0; i < widget.items.length; i++)
                _row(context, i, widget.items[i]),
            ],
          ),
        ),
      ),
    );
  }

  Widget _row(BuildContext context, int index, TrcListboxItem item) {
    final theme = TrcTheme.of(context);
    final key = _keys.putIfAbsent(index, GlobalKey.new);
    return Semantics(
      key: key,
      button: true,
      selected: item.selected,
      enabled: !item.disabled,
      label: item.label,
      hint: item.description,
      excludeSemantics: true,
      onTap: item.disabled ? null : () => widget.onChoose(index),
      child: MouseRegion(
        cursor: item.disabled
            ? SystemMouseCursors.forbidden
            : SystemMouseCursors.click,
        onEnter: (_) => widget.onHover?.call(index),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: item.disabled ? null : () => widget.onChoose(index),
          child: Opacity(
            opacity: item.disabled ? 0.4 : 1,
            child: Container(
              padding: const EdgeInsets.fromLTRB(28, 10, 12, 10),
              decoration: BoxDecoration(
                color: index == widget.active
                    ? const Color(0x0FFFFFFF)
                    : const Color(0x00000000),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  if (item.selected)
                    Positioned(
                      left: -16,
                      top: 7,
                      child: Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: theme.accent,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(item.label, style: theme.text(height: 1.35)),
                      if (item.description != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          item.description!,
                          style: theme.text(
                            size: 13,
                            height: 1.4,
                            color: theme.foregroundSubtle,
                          ),
                        ),
                      ],
                    ],
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

/// Next enabled index from [from] in [step] direction, wrapping around; -1
/// when every item is disabled.
int nextEnabled(List<TrcListboxItem> items, int from, int step) {
  if (items.isEmpty) return -1;
  var i = from;
  for (var n = 0; n < items.length; n++) {
    i = (i + step) % items.length;
    if (i < 0) i += items.length;
    if (!items[i].disabled) return i;
  }
  return -1;
}
