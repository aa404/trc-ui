import 'package:flutter/widgets.dart';

import 'theme.dart';

/// What a [TrcField] tells the control placed inside it: its label, its hint
/// or error, and the focus node its label moves the focus to.
class TrcFieldScope extends InheritedWidget {
  /// Provides the field's details to [child].
  const TrcFieldScope({
    super.key,
    required this.label,
    required this.focusNode,
    required super.child,
    this.message,
    this.invalid = false,
    this.required = false,
  });

  /// Label of the field, the accessible name of its control.
  final String label;

  /// Hint or error message, read as the control's description.
  final String? message;

  /// Whether the field shows an error.
  final bool invalid;

  /// Whether the field must be filled.
  final bool required;

  /// Focus node the control uses unless it has its own.
  final FocusNode focusNode;

  /// The closest field, if any.
  static TrcFieldScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TrcFieldScope>();

  @override
  bool updateShouldNotify(TrcFieldScope oldWidget) =>
      label != oldWidget.label ||
      message != oldWidget.message ||
      invalid != oldWidget.invalid ||
      required != oldWidget.required ||
      focusNode != oldWidget.focusNode;
}

/// Label, hint and error of a form control.
///
/// The trc control placed inside ([TrcTextField], [TrcTextArea],
/// [TrcSelect]…) takes the label as its accessible name, the hint or error as
/// its description and the invalid state; tapping the label focuses it.
class TrcField extends StatefulWidget {
  /// A field labelled [label] around [child].
  const TrcField({
    super.key,
    required this.label,
    required this.child,
    this.hint,
    this.error,
    this.required = false,
  });

  /// Visible label.
  final String label;

  /// Hint shown under the control.
  final String? hint;

  /// Error message: replaces the hint and marks the control as invalid.
  final String? error;

  /// Shows an accent asterisk after the label and marks the control required.
  final bool required;

  /// The control.
  final Widget child;

  @override
  State<TrcField> createState() => _TrcFieldState();
}

class _TrcFieldState extends State<TrcField> {
  final _focusNode = FocusNode(debugLabel: 'TrcField');

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final message = widget.error ?? widget.hint;
    final invalid = widget.error != null;
    return TrcFieldScope(
      label: widget.label,
      message: message,
      invalid: invalid,
      required: widget.required,
      focusNode: _focusNode,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          // The control announces the label itself.
          ExcludeSemantics(
            child: GestureDetector(
              onTap: () => _focusNode.requestFocus(),
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
          ),
          const SizedBox(height: 8),
          widget.child,
          if (message != null) ...[
            const SizedBox(height: 8),
            // Errors are announced as they appear; the hint is read with
            // the control.
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
    );
  }
}

/// The frame of the text controls: slightly lighter background, a thin border
/// that lightens on hover and takes the accent with a soft halo on focus, the
/// error color when invalid. Shared by text fields, selects and pickers.
class TrcControlFrame extends StatelessWidget {
  /// Frames [child].
  const TrcControlFrame({
    super.key,
    required this.child,
    this.focused = false,
    this.hovered = false,
    this.invalid = false,
    this.enabled = true,
    this.height = 48,
    this.padding = const EdgeInsets.symmetric(horizontal: 16),
  });

  /// The control's content.
  final Widget child;

  /// Shows the accent border and halo.
  final bool focused;

  /// Lightens the border.
  final bool hovered;

  /// Shows the error border.
  final bool invalid;

  /// Fades the control when false.
  final bool enabled;

  /// Fixed height; null to follow the content (text areas).
  final double? height;

  /// Inner padding.
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final border = invalid
        ? theme.danger
        : focused
        ? theme.accent
        : hovered && enabled
        ? const Color(0x47FFFFFF)
        : theme.borderStrong;
    final halo = invalid
        ? theme.danger.withValues(alpha: 0.18)
        : theme.accentSoft;
    return Opacity(
      opacity: enabled ? 1 : 0.5,
      child: CustomPaint(
        // The halo is drawn outside the box only: a shadow would also show
        // through the translucent background.
        foregroundPainter: focused ? _HaloPainter(halo) : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.ease,
          height: height,
          padding: padding,
          decoration: BoxDecoration(
            color: const Color(0x08FFFFFF),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: border),
          ),
          child: child,
        ),
      ),
    );
  }
}

class _HaloPainter extends CustomPainter {
  _HaloPainter(this.color);

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        (Offset.zero & size).inflate(1.5),
        const Radius.circular(13.5),
      ),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3,
    );
  }

  @override
  bool shouldRepaint(_HaloPainter old) => old.color != color;
}
