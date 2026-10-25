import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'field.dart';
import 'foundation.dart';
import 'theme.dart';

/// One box per character for one-time codes. Typing moves forward,
/// Backspace moves back, pasting a code fills every box, and phones can fill
/// it from a text message ([AutofillHints.oneTimeCode]).
class TrcPinInput extends StatefulWidget {
  /// A code of [length] characters.
  const TrcPinInput({
    super.key,
    this.length = 6,
    this.initialValue = '',
    this.onChanged,
    this.onCompleted,
    this.numeric = true,
    this.obscure = false,
    this.semanticLabel = 'Verification code',
    this.charLabel = 'Character {index} of {length}',
    this.invalid,
    this.enabled = true,
    this.autofocus = false,
  });

  /// Number of characters.
  final int length;

  /// Code shown at first.
  final String initialValue;

  /// Called with the code on every change (empty boxes are spaces).
  final ValueChanged<String>? onChanged;

  /// Called once every box is filled.
  final ValueChanged<String>? onCompleted;

  /// Digits only, with the number keyboard; letters and digits otherwise.
  final bool numeric;

  /// Hides the characters, like a password.
  final bool obscure;

  /// Accessible name of the group.
  final String semanticLabel;

  /// Accessible name of each box, with `{index}` (from 1) and `{length}`.
  final String charLabel;

  /// Error state; follows the enclosing field when null.
  final bool? invalid;

  /// Whether the boxes accept input.
  final bool enabled;

  /// Focuses the first box when first built.
  final bool autofocus;

  @override
  State<TrcPinInput> createState() => _TrcPinInputState();
}

class _TrcPinInputState extends State<TrcPinInput> {
  late List<String> _chars;
  late List<TextEditingController> _controllers;
  late List<FocusNode> _nodes;
  final _focused = <int>{};

  @override
  void initState() {
    super.initState();
    _chars = List.generate(
      widget.length,
      (i) => i < widget.initialValue.length && widget.initialValue[i] != ' '
          ? widget.initialValue[i]
          : '',
    );
    _controllers = [for (final c in _chars) TextEditingController(text: c)];
    _nodes = List.generate(widget.length, (i) {
      final node = FocusNode();
      node.addListener(() {
        setState(() => node.hasFocus ? _focused.add(i) : _focused.remove(i));
        if (node.hasFocus) _selectAll(i);
      });
      return node;
    });
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final n in _nodes) {
      n.dispose();
    }
    super.dispose();
  }

  String get _code => _chars.map((c) => c.isEmpty ? ' ' : c).join().trimRight();

  bool _accepts(String c) => widget.numeric
      ? RegExp('[0-9]').hasMatch(c)
      : RegExp('[0-9a-zA-Z]').hasMatch(c);

  void _selectAll(int i) {
    final c = _controllers[i];
    c.selection = TextSelection(baseOffset: 0, extentOffset: c.text.length);
  }

  void _focus(int i) {
    final index = i.clamp(0, widget.length - 1);
    _nodes[index].requestFocus();
    _selectAll(index);
  }

  void _emit() {
    for (var i = 0; i < widget.length; i++) {
      if (_controllers[i].text != _chars[i]) {
        _controllers[i].value = TextEditingValue(
          text: _chars[i],
          selection: TextSelection.collapsed(offset: _chars[i].length),
        );
      }
    }
    final code = _code;
    widget.onChanged?.call(code);
    if (_chars.every((c) => c.isNotEmpty)) widget.onCompleted?.call(code);
  }

  void _onInput(int i, String raw) {
    final typed = raw.split('').where(_accepts).join();
    if (typed.isEmpty) {
      // Cleared by the keyboard (a soft Backspace).
      if (raw.isEmpty && _chars[i].isNotEmpty) {
        setState(() => _chars[i] = '');
        _emit();
      } else {
        _controllers[i].text = _chars[i];
      }
      return;
    }
    // The box held a character: the new one is what was typed around it.
    var text = typed;
    if (_chars[i].isNotEmpty &&
        typed.length == 2 &&
        typed.contains(_chars[i])) {
      text = typed.replaceFirst(_chars[i], '');
    }
    if (text.length > 1) {
      // Several characters at once (paste, autofill): fill from this box.
      for (var k = 0; k < text.length && i + k < widget.length; k++) {
        _chars[i + k] = text[k];
      }
      setState(() {});
      _emit();
      _focus(i + text.length);
      return;
    }
    setState(() => _chars[i] = text);
    _emit();
    if (i < widget.length - 1) _focus(i + 1);
  }

  KeyEventResult _onKey(int i, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.backspace) {
      if (_chars[i].isNotEmpty) {
        setState(() => _chars[i] = '');
        _emit();
      } else if (i > 0) {
        setState(() => _chars[i - 1] = '');
        _emit();
        _focus(i - 1);
      }
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.arrowLeft) {
      _focus(i - 1);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.arrowRight) {
      _focus(i + 1);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.home) {
      _focus(0);
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.end) {
      _focus(widget.length - 1);
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final field = TrcFieldScope.maybeOf(context);
    final invalid = widget.invalid ?? field?.invalid ?? false;
    final narrow = MediaQuery.sizeOf(context).width <= 400;
    final width = narrow ? 42.0 : 48.0;
    final height = narrow ? 52.0 : 56.0;
    final style = theme
        .text(size: 22, height: 1.2)
        .copyWith(fontFeatures: const [FontFeature.tabularFigures()]);
    return Semantics(
      container: true,
      explicitChildNodes: true,
      label: field?.label ?? widget.semanticLabel,
      hint: field?.message,
      child: Material(
        type: MaterialType.transparency,
        child: Wrap(
          spacing: narrow ? 6 : 8,
          runSpacing: 8,
          children: [
            for (var i = 0; i < widget.length; i++)
              Semantics(
                label: fillLabel(widget.charLabel, {
                  'index': i + 1,
                  'length': widget.length,
                }),
                child: Focus(
                  canRequestFocus: false,
                  skipTraversal: true,
                  onKeyEvent: (node, event) => _onKey(i, event),
                  child: TrcControlFrame(
                    focused: _focused.contains(i),
                    invalid: invalid,
                    enabled: widget.enabled,
                    height: height,
                    padding: EdgeInsets.zero,
                    child: SizedBox(
                      width: width - 2,
                      child: Center(
                        child: TextField(
                          controller: _controllers[i],
                          focusNode: _nodes[i],
                          autofocus: widget.autofocus && i == 0,
                          enabled: widget.enabled,
                          obscureText: widget.obscure,
                          textAlign: TextAlign.center,
                          keyboardType: widget.numeric
                              ? TextInputType.number
                              : TextInputType.visiblePassword,
                          textCapitalization: TextCapitalization.characters,
                          autocorrect: false,
                          enableSuggestions: false,
                          autofillHints: i == 0
                              ? const [AutofillHints.oneTimeCode]
                              : null,
                          showCursor: true,
                          cursorColor: theme.accent,
                          cursorWidth: 1.5,
                          style: style,
                          onChanged: (v) => _onInput(i, v),
                          decoration: const InputDecoration(
                            isCollapsed: true,
                            border: InputBorder.none,
                            counterText: '',
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
