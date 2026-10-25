import 'package:flutter/semantics.dart';
import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// Label and description next to a toggle; the whole block is tappable.
class _ToggleLabel extends StatelessWidget {
  const _ToggleLabel({
    required this.control,
    required this.label,
    required this.description,
    required this.enabled,
    required this.onTap,
    required this.semantics,
    required this.focusNode,
    required this.autofocus,
  });

  final Widget Function(TrcInteractionState state) control;
  final String label;
  final String? description;
  final bool enabled;
  final VoidCallback onTap;
  final SemanticsProperties semantics;
  final FocusNode? focusNode;
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return MergeSemantics(
      child: Semantics.fromProperties(
        properties: semantics,
        child: TrcTappable(
          enabled: enabled,
          onTap: onTap,
          focusNode: focusNode,
          autofocus: autofocus,
          builder: (context, state) => Opacity(
            opacity: enabled ? 1 : 0.5,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                control(state),
                const SizedBox(width: 12),
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(label, style: theme.text(height: 1.45)),
                      if (description != null) ...[
                        const SizedBox(height: 2),
                        Text(
                          description!,
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

/// A checkbox filled with the accent once checked, with its label and an
/// optional description; the whole block toggles it.
class TrcCheckbox extends StatelessWidget {
  /// A checkbox labelled [label].
  const TrcCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.description,
    this.focusNode,
    this.autofocus = false,
  });

  /// Whether it is checked.
  final bool value;

  /// Called with the new value; disabled when null.
  final ValueChanged<bool>? onChanged;

  /// Text next to the box.
  final String label;

  /// Extra detail under the label.
  final String? description;

  /// Optional focus node.
  final FocusNode? focusNode;

  /// Takes the focus when first built.
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final duration = trcMotion(context, const Duration(milliseconds: 200));
    return _ToggleLabel(
      label: label,
      description: description,
      enabled: onChanged != null,
      onTap: () => onChanged?.call(!value),
      focusNode: focusNode,
      autofocus: autofocus,
      semantics: SemanticsProperties(
        checked: value,
        enabled: onChanged != null,
      ),
      control: (state) => Padding(
        padding: const EdgeInsets.only(top: 1),
        child: TrcFocusRing(
          visible: state.focused,
          borderRadius: BorderRadius.circular(6),
          child: AnimatedContainer(
            duration: duration,
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              color: value ? theme.accent : const Color(0x08FFFFFF),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(
                color: value
                    ? theme.accent
                    : state.hovered
                    ? const Color(0x66FFFFFF)
                    : theme.borderPill,
              ),
            ),
            child: AnimatedScale(
              scale: value ? 1 : 0.6,
              duration: trcMotion(context, const Duration(milliseconds: 300)),
              curve: theme.easeOut,
              child: AnimatedOpacity(
                opacity: value ? 1 : 0,
                duration: duration,
                child: Center(
                  child: TrcIcon(
                    TrcGlyph.check,
                    size: 14,
                    strokeWidth: 3,
                    color: theme.onAccent,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// A switch, announced as a toggle to screen readers, with its label and an
/// optional description; the whole block toggles it.
class TrcSwitch extends StatelessWidget {
  /// A switch labelled [label].
  const TrcSwitch({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.description,
    this.focusNode,
    this.autofocus = false,
  });

  /// Whether it is on.
  final bool value;

  /// Called with the new value; disabled when null.
  final ValueChanged<bool>? onChanged;

  /// Text next to the switch.
  final String label;

  /// Extra detail under the label.
  final String? description;

  /// Optional focus node.
  final FocusNode? focusNode;

  /// Takes the focus when first built.
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final duration = trcMotion(context, const Duration(milliseconds: 300));
    return _ToggleLabel(
      label: label,
      description: description,
      enabled: onChanged != null,
      onTap: () => onChanged?.call(!value),
      focusNode: focusNode,
      autofocus: autofocus,
      semantics: SemanticsProperties(
        toggled: value,
        enabled: onChanged != null,
      ),
      control: (state) => TrcFocusRing(
        visible: state.focused,
        borderRadius: BorderRadius.circular(12),
        child: AnimatedContainer(
          duration: duration,
          width: 40,
          height: 24,
          decoration: BoxDecoration(
            color: value ? theme.accent : const Color(0x14FFFFFF),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: value ? theme.accent : theme.borderStrong,
            ),
          ),
          child: AnimatedAlign(
            duration: duration,
            curve: theme.ease,
            alignment: value ? Alignment.centerRight : Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 3),
              child: AnimatedContainer(
                duration: duration,
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: value ? theme.onAccent : theme.foreground,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
