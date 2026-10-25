import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'text_field.dart';
import 'theme.dart';

/// Password control with a Show / Hide button. Works inside a `TrcField`
/// like [TrcTextField]. The button's accessible name includes its visible
/// text ("Show password"), as WCAG 2.5.3 asks.
class TrcPasswordField extends StatefulWidget {
  /// A password field.
  const TrcPasswordField({
    super.key,
    this.controller,
    this.focusNode,
    this.placeholder,
    this.autofillHints = const [AutofillHints.password],
    this.textInputAction,
    this.onChanged,
    this.onSubmitted,
    this.enabled = true,
    this.invalid,
    this.semanticLabel,
    this.showLabel = 'Show',
    this.hideLabel = 'Hide',
    this.noun = 'password',
  });

  /// Controls the text.
  final TextEditingController? controller;

  /// Focus node.
  final FocusNode? focusNode;

  /// Faint text shown while empty.
  final String? placeholder;

  /// Autofill hints; use [AutofillHints.newPassword] on sign-up forms.
  final Iterable<String>? autofillHints;

  /// Action key of the keyboard.
  final TextInputAction? textInputAction;

  /// Called on every change.
  final ValueChanged<String>? onChanged;

  /// Called when the keyboard action is pressed.
  final ValueChanged<String>? onSubmitted;

  /// Whether the control accepts input.
  final bool enabled;

  /// Error state; follows the enclosing field when null.
  final bool? invalid;

  /// Accessible name outside a field.
  final String? semanticLabel;

  /// Visible text of the button while hidden: "Show", "Afficher"…
  final String showLabel;

  /// Visible text of the button while shown.
  final String hideLabel;

  /// Completes the button's accessible name: "Show password".
  final String noun;

  @override
  State<TrcPasswordField> createState() => _TrcPasswordFieldState();
}

class _TrcPasswordFieldState extends State<TrcPasswordField> {
  bool _visible = false;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final text = _visible ? widget.hideLabel : widget.showLabel;
    return TrcTextField(
      controller: widget.controller,
      focusNode: widget.focusNode,
      placeholder: widget.placeholder,
      obscureText: !_visible,
      autocorrect: false,
      enableSuggestions: false,
      keyboardType: TextInputType.visiblePassword,
      autofillHints: widget.autofillHints,
      textInputAction: widget.textInputAction,
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
      enabled: widget.enabled,
      invalid: widget.invalid,
      semanticLabel: widget.semanticLabel,
      trailing: Semantics(
        button: true,
        container: true,
        label: '$text ${widget.noun}',
        child: TrcTappable(
          enabled: widget.enabled,
          excludeChildSemantics: true,
          onTap: () => setState(() => _visible = !_visible),
          builder: (context, state) => TrcFocusRing(
            visible: state.focused,
            borderRadius: BorderRadius.circular(999),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(999),
                color: state.hovered
                    ? const Color(0x0FFFFFFF)
                    : const Color(0x00FFFFFF),
              ),
              child: Text(
                text,
                style: theme.text(
                  size: 13,
                  weight: FontWeight.w500,
                  height: 1.2,
                  color: state.hovered
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
