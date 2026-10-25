import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'theme.dart';

/// One choice of a [TrcRadioGroup].
@immutable
class TrcRadioOption<T> {
  /// A choice with its [value] and [label].
  const TrcRadioOption({
    required this.value,
    required this.label,
    this.description,
    this.disabled = false,
  });

  /// Value chosen.
  final T value;

  /// Text next to the radio.
  final String label;

  /// Detail under the label.
  final String? description;

  /// Shown faded, not choosable.
  final bool disabled;
}

/// A choice among a few options, as radio buttons under a question: the
/// question is read with the group, the arrows move the choice, and the hint
/// or error is tied to the group.
class TrcRadioGroup<T> extends StatefulWidget {
  /// A group asking [label].
  const TrcRadioGroup({
    super.key,
    required this.label,
    required this.options,
    required this.value,
    required this.onChanged,
    this.hint,
    this.error,
    this.required = false,
    this.horizontal = false,
  });

  /// The question, shown like a field label.
  final String label;

  /// The choices.
  final List<TrcRadioOption<T>> options;

  /// The chosen value, or null.
  final T? value;

  /// Called with the chosen value; disabled when null.
  final ValueChanged<T>? onChanged;

  /// Hint under the options.
  final String? hint;

  /// Error message: replaces the hint and marks the unchecked radios.
  final String? error;

  /// Shows an accent asterisk after the question.
  final bool required;

  /// Options on one line (wrapping), instead of a column.
  final bool horizontal;

  @override
  State<TrcRadioGroup<T>> createState() => _TrcRadioGroupState<T>();
}

class _TrcRadioGroupState<T> extends State<TrcRadioGroup<T>> {
  List<FocusNode> _nodes = [];

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(TrcRadioGroup<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    if (_nodes.length == widget.options.length) return;
    for (final n in _nodes) {
      n.dispose();
    }
    _nodes = List.generate(widget.options.length, (_) => FocusNode());
  }

  @override
  void dispose() {
    for (final n in _nodes) {
      n.dispose();
    }
    super.dispose();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    if (widget.onChanged == null) return KeyEventResult.ignored;
    final key = event.logicalKey;
    final rtl = Directionality.of(context) == TextDirection.rtl;
    int step;
    if (key == LogicalKeyboardKey.arrowDown ||
        key ==
            (rtl
                ? LogicalKeyboardKey.arrowLeft
                : LogicalKeyboardKey.arrowRight)) {
      step = 1;
    } else if (key == LogicalKeyboardKey.arrowUp ||
        key ==
            (rtl
                ? LogicalKeyboardKey.arrowRight
                : LogicalKeyboardKey.arrowLeft)) {
      step = -1;
    } else {
      return KeyEventResult.ignored;
    }
    final count = widget.options.length;
    var i = _nodes.indexWhere((n) => n.hasFocus);
    for (var n = 0; n < count; n++) {
      i = (i + step) % count;
      if (i < 0) i += count;
      if (!widget.options[i].disabled) {
        _nodes[i].requestFocus();
        widget.onChanged!(widget.options[i].value);
        break;
      }
    }
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final message = widget.error ?? widget.hint;
    final invalid = widget.error != null;
    final selected = widget.options.indexWhere((o) => o.value == widget.value);
    // One tab stop for the group: the chosen radio, or the first one.
    final stop = selected >= 0
        ? selected
        : widget.options.indexWhere((o) => !o.disabled);
    for (var i = 0; i < _nodes.length; i++) {
      _nodes[i].skipTraversal = i != stop;
    }
    final radios = [
      for (var i = 0; i < widget.options.length; i++)
        _radio(context, i, i == selected, invalid),
    ];
    return Semantics(
      container: true,
      explicitChildNodes: true,
      label: widget.label,
      hint: message,
      child: Focus(
        canRequestFocus: false,
        skipTraversal: true,
        onKeyEvent: _onKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            ExcludeSemantics(
              child: Text.rich(
                TextSpan(
                  text: widget.label,
                  children: [
                    if (widget.required)
                      TextSpan(
                        text: ' *',
                        style: TextStyle(color: theme.accent),
                      ),
                  ],
                ),
                style: theme.text(
                  size: 14,
                  weight: FontWeight.w500,
                  height: 1.4,
                ),
              ),
            ),
            const SizedBox(height: 16),
            if (widget.horizontal)
              Wrap(spacing: 28, runSpacing: 14, children: radios)
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  for (var i = 0; i < radios.length; i++) ...[
                    if (i > 0) const SizedBox(height: 14),
                    radios[i],
                  ],
                ],
              ),
            if (message != null) ...[
              const SizedBox(height: 12),
              Semantics(
                liveRegion: invalid,
                child: ExcludeSemantics(
                  excluding: !invalid,
                  child: Text(
                    message,
                    style: theme.text(
                      size: 13,
                      height: 1.5,
                      color: invalid ? theme.danger : theme.foregroundSubtle,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _radio(BuildContext context, int i, bool checked, bool invalid) {
    final theme = TrcTheme.of(context);
    final option = widget.options[i];
    final enabled = !option.disabled && widget.onChanged != null;
    return MergeSemantics(
      child: Semantics(
        inMutuallyExclusiveGroup: true,
        checked: checked,
        enabled: enabled,
        child: TrcTappable(
          enabled: enabled,
          focusNode: _nodes[i],
          onTap: () => widget.onChanged?.call(option.value),
          builder: (context, state) => Opacity(
            opacity: option.disabled ? 0.5 : 1,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 1),
                  child: TrcFocusRing(
                    visible: state.focused,
                    circle: true,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: checked ? theme.accent : const Color(0x08FFFFFF),
                        border: Border.all(
                          color: checked
                              ? theme.accent
                              : invalid
                              ? theme.danger
                              : state.hovered
                              ? const Color(0x66FFFFFF)
                              : theme.borderPill,
                        ),
                      ),
                      // Checked: a thick accent ring around a dark center.
                      child: checked
                          ? Center(
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: theme.background,
                                ),
                              ),
                            )
                          : null,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(option.label, style: theme.text(height: 1.45)),
                      if (option.description != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          option.description!,
                          style: theme.text(
                            size: 13,
                            height: 1.5,
                            color: theme.foregroundSubtle,
                          ),
                        ),
                      ],
                    ],
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
