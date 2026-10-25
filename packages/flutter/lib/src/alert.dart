import 'package:flutter/widgets.dart';

import 'theme.dart';

/// Tone of a [TrcAlert].
enum TrcAlertTone {
  /// Accent edge.
  info,

  /// Accent edge.
  success,

  /// Error-colored edge.
  error,
}

/// Inline message in a graphite card, marked by a thin colored edge rather
/// than an icon badge. Static by default; set [live] when it appears after an
/// action, so that screen readers announce it.
class TrcAlert extends StatelessWidget {
  /// An alert with a [title] and/or a [child].
  const TrcAlert({
    super.key,
    this.title,
    this.child,
    this.tone = TrcAlertTone.info,
    this.actions,
    this.live = false,
  }) : assert(title != null || child != null);

  /// Title in medium weight.
  final String? title;

  /// Body text.
  final Widget? child;

  /// Color of the edge.
  final TrcAlertTone tone;

  /// Actions under the text, such as a small pill.
  final List<Widget>? actions;

  /// Announces the alert when it appears.
  final bool live;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final edge = tone == TrcAlertTone.error ? theme.danger : theme.accent;
    return Semantics(
      liveRegion: live,
      container: true,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Container(
          decoration: BoxDecoration(
            color: theme.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: theme.border),
          ),
          child: Stack(
            children: [
              Padding(
                padding: const EdgeInsetsDirectional.fromSTEB(22, 16, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (title != null)
                      Text(
                        title!,
                        style: theme.text(weight: FontWeight.w500, height: 1.4),
                      ),
                    if (child != null)
                      Padding(
                        padding: EdgeInsets.only(top: title != null ? 4 : 0),
                        child: DefaultTextStyle(
                          style: theme.text(
                            size: 14,
                            height: 1.6,
                            color: theme.foregroundMuted,
                          ),
                          child: child!,
                        ),
                      ),
                    if (actions != null && actions!.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 14),
                        child: Wrap(
                          alignment: WrapAlignment.start,
                          spacing: 12,
                          runSpacing: 12,
                          children: actions!,
                        ),
                      ),
                  ],
                ),
              ),
              // The thin colored edge, instead of an icon badge.
              PositionedDirectional(
                start: 0,
                top: 0,
                bottom: 0,
                width: 2,
                child: ColoredBox(color: edge),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
