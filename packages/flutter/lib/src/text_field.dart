import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';

import 'field.dart';
import 'theme.dart';

/// Single line text control in the trc style. Inside a [TrcField] it takes
/// the field's label, hint, error and required state.
///
/// Built on Material's [TextField] (selection, context menu, autofill), so it
/// needs a [MaterialApp] or Material localizations above it.
class TrcTextField extends StatefulWidget {
  /// A text field.
  const TrcTextField({
    super.key,
    this.controller,
    this.focusNode,
    this.placeholder,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.obscureText = false,
    this.autocorrect = true,
    this.enableSuggestions = true,
    this.autofillHints,
    this.inputFormatters,
    this.maxLength,
    this.onChanged,
    this.onSubmitted,
    this.enabled = true,
    this.readOnly = false,
    this.autofocus = false,
    this.invalid,
    this.semanticLabel,
    this.trailing,
    this.textAlign = TextAlign.start,
    this.style,
    this.minLines,
    this.maxLines = 1,
    this.height = 48,
    this.contentPadding = const EdgeInsets.symmetric(horizontal: 16),
  });

  /// Controls the text; one is created when null.
  final TextEditingController? controller;

  /// Focus node; the field's one, or an internal one, when null.
  final FocusNode? focusNode;

  /// Faint text shown while empty.
  final String? placeholder;

  /// Keyboard shown on phones.
  final TextInputType? keyboardType;

  /// Action key of the keyboard.
  final TextInputAction? textInputAction;

  /// Automatic capitals.
  final TextCapitalization textCapitalization;

  /// Hides the characters.
  final bool obscureText;

  /// Spelling correction.
  final bool autocorrect;

  /// Keyboard suggestions.
  final bool enableSuggestions;

  /// Autofill hints, such as [AutofillHints.email].
  final Iterable<String>? autofillHints;

  /// Input formatters.
  final List<TextInputFormatter>? inputFormatters;

  /// Maximum number of characters (no counter is shown).
  final int? maxLength;

  /// Called on every change.
  final ValueChanged<String>? onChanged;

  /// Called when the keyboard action is pressed.
  final ValueChanged<String>? onSubmitted;

  /// Whether the control accepts input.
  final bool enabled;

  /// Shows the text without editing it.
  final bool readOnly;

  /// Takes the focus when first built.
  final bool autofocus;

  /// Error state; follows the enclosing [TrcField] when null.
  final bool? invalid;

  /// Accessible name outside a [TrcField].
  final String? semanticLabel;

  /// Widget at the end of the control, such as a small text button.
  final Widget? trailing;

  /// Horizontal alignment of the text.
  final TextAlign textAlign;

  /// Overrides the text style.
  final TextStyle? style;

  /// Minimum number of lines.
  final int? minLines;

  /// Maximum number of lines; null to grow with the text.
  final int? maxLines;

  /// Height of the control; null to follow the content.
  final double? height;

  /// Padding around the text.
  final EdgeInsetsGeometry contentPadding;

  @override
  State<TrcTextField> createState() => _TrcTextFieldState();
}

class _TrcTextFieldState extends State<TrcTextField> {
  FocusNode? _ownNode;
  FocusNode? _listened;
  bool _focused = false;
  bool _hovered = false;

  FocusNode get _node =>
      widget.focusNode ??
      TrcFieldScope.maybeOf(context)?.focusNode ??
      (_ownNode ??= FocusNode(debugLabel: 'TrcTextField'));

  void _onFocus() {
    final focused = _listened?.hasFocus ?? false;
    if (focused != _focused) setState(() => _focused = focused);
  }

  void _listen() {
    final node = _node;
    if (node == _listened) return;
    _listened?.removeListener(_onFocus);
    _listened = node..addListener(_onFocus);
    _focused = node.hasFocus;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _listen();
  }

  @override
  void didUpdateWidget(TrcTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    _listen();
  }

  @override
  void dispose() {
    _listened?.removeListener(_onFocus);
    _ownNode?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final field = TrcFieldScope.maybeOf(context);
    final invalid = widget.invalid ?? field?.invalid ?? false;
    final multiline = widget.maxLines != 1;
    final style =
        widget.style ?? theme.text(size: 15, height: multiline ? 1.55 : 1.4);

    final input = TextField(
      controller: widget.controller,
      focusNode: _node,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      textCapitalization: widget.textCapitalization,
      obscureText: widget.obscureText,
      autocorrect: widget.autocorrect,
      enableSuggestions: widget.enableSuggestions,
      autofillHints: widget.autofillHints,
      inputFormatters: widget.inputFormatters,
      maxLength: widget.maxLength,
      maxLengthEnforcement: MaxLengthEnforcement.enforced,
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      autofocus: widget.autofocus,
      textAlign: widget.textAlign,
      minLines: widget.minLines,
      maxLines: widget.maxLines,
      style: style,
      cursorColor: theme.accent,
      cursorWidth: 1.5,
      decoration: InputDecoration(
        isCollapsed: true,
        border: InputBorder.none,
        counterText: '',
        hintText: widget.placeholder,
        hintStyle: style.copyWith(color: theme.foregroundFaint),
      ),
    );

    return Semantics(
      label: field?.label ?? widget.semanticLabel,
      hint: field?.message,
      isRequired: field?.required,
      validationResult: invalid
          ? SemanticsValidationResult.invalid
          : SemanticsValidationResult.none,
      child: MouseRegion(
        cursor: widget.enabled
            ? SystemMouseCursors.text
            : SystemMouseCursors.forbidden,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: TrcControlFrame(
          focused: _focused,
          hovered: _hovered,
          invalid: invalid,
          enabled: widget.enabled,
          height: widget.height,
          padding: widget.trailing == null
              ? widget.contentPadding
              : widget.contentPadding.add(
                  const EdgeInsetsDirectional.only(end: -10),
                ),
          child: Material(
            type: MaterialType.transparency,
            child: Row(
              crossAxisAlignment: multiline
                  ? CrossAxisAlignment.start
                  : CrossAxisAlignment.center,
              children: [
                Expanded(child: input),
                if (widget.trailing != null) ...[
                  const SizedBox(width: 8),
                  widget.trailing!,
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Multi-line text control: at least [rows] lines, growing with the text up
/// to [maxRows]. Works inside a [TrcField] like [TrcTextField].
class TrcTextArea extends StatelessWidget {
  /// A text area.
  const TrcTextArea({
    super.key,
    this.controller,
    this.focusNode,
    this.placeholder,
    this.rows = 4,
    this.maxRows,
    this.maxLength,
    this.onChanged,
    this.enabled = true,
    this.readOnly = false,
    this.invalid,
    this.semanticLabel,
    this.textCapitalization = TextCapitalization.sentences,
  });

  /// Controls the text.
  final TextEditingController? controller;

  /// Focus node.
  final FocusNode? focusNode;

  /// Faint text shown while empty.
  final String? placeholder;

  /// Minimum number of lines.
  final int rows;

  /// Maximum number of lines before scrolling; unlimited when null.
  final int? maxRows;

  /// Maximum number of characters.
  final int? maxLength;

  /// Called on every change.
  final ValueChanged<String>? onChanged;

  /// Whether the control accepts input.
  final bool enabled;

  /// Shows the text without editing it.
  final bool readOnly;

  /// Error state; follows the enclosing [TrcField] when null.
  final bool? invalid;

  /// Accessible name outside a [TrcField].
  final String? semanticLabel;

  /// Automatic capitals.
  final TextCapitalization textCapitalization;

  @override
  Widget build(BuildContext context) {
    return TrcTextField(
      controller: controller,
      focusNode: focusNode,
      placeholder: placeholder,
      minLines: rows,
      maxLines: maxRows,
      maxLength: maxLength,
      onChanged: onChanged,
      enabled: enabled,
      readOnly: readOnly,
      invalid: invalid,
      semanticLabel: semanticLabel,
      keyboardType: TextInputType.multiline,
      textInputAction: TextInputAction.newline,
      textCapitalization: textCapitalization,
      height: null,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    );
  }
}
