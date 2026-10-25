import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// Round, quiet icon button (close, copy, previous month): subtle at rest,
/// lit on hover. Its [label] is the accessible name, since it shows no text.
class TrcIconButton extends StatelessWidget {
  /// A round button showing [glyph].
  const TrcIconButton({
    super.key,
    required this.glyph,
    required this.label,
    required this.onPressed,
    this.size = 40,
    this.iconSize = 20,
    this.color,
    this.radius,
  });

  /// The icon.
  final TrcGlyph glyph;

  /// Accessible name.
  final String label;

  /// Called on tap, Enter or Space; disabled when null.
  final VoidCallback? onPressed;

  /// Width and height of the button.
  final double size;

  /// Size of the icon.
  final double iconSize;

  /// Icon color; subtle by default, full white on hover.
  final Color? color;

  /// Corner radius; round by default.
  final double? radius;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final shape = BorderRadius.circular(radius ?? size / 2);
    return Semantics(
      button: true,
      enabled: onPressed != null,
      label: label,
      container: true,
      child: TrcTappable(
        excludeChildSemantics: true,
        enabled: onPressed != null,
        onTap: onPressed,
        builder: (context, state) => TrcFocusRing(
          visible: state.focused,
          borderRadius: shape,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: size,
            height: size,
            decoration: BoxDecoration(
              borderRadius: shape,
              color: state.hovered
                  ? const Color(0x14FFFFFF)
                  : const Color(0x00FFFFFF),
            ),
            child: Opacity(
              opacity: state.enabled ? 1 : 0.35,
              child: Center(
                child: TrcIcon(
                  glyph,
                  size: iconSize,
                  color:
                      color ??
                      (state.hovered
                          ? theme.foreground
                          : theme.foregroundSubtle),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
