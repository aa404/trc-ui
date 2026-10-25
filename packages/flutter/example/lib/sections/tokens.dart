import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class TokensDemo extends StatelessWidget {
  const TokensDemo({super.key});

  @override
  Widget build(BuildContext context) {
    final t = TrcTheme.of(context);
    final swatches = {
      'background': t.background,
      'surface': t.surface,
      'surfaceRaised': t.surfaceRaised,
      'surfaceAlt': t.surfaceAlt,
      'accent': t.accent,
      'danger': t.danger,
    };
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        for (final entry in swatches.entries)
          SizedBox(
            width: 150,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 72,
                  decoration: BoxDecoration(
                    color: entry.value,
                    borderRadius: BorderRadius.circular(t.radiusSmall),
                    border: Border.all(color: t.border),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  entry.key,
                  style: t.text(size: 13, color: t.foregroundSubtle),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
