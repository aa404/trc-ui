import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import 'icon_button.dart';
import 'icons.dart';
import 'theme.dart';

const _badges = {
  'tsx': 'TS',
  'ts': 'TS',
  'jsx': 'JS',
  'js': 'JS',
  'css': 'CSS',
  'bash': 'SH',
  'sh': 'SH',
  'html': 'HTML',
  'json': 'JSON',
  'dart': 'DART',
  'yaml': 'YAML',
};

/// Code block with an optional file tab and a copy button that turns into an
/// accent check for a moment. Bring your own highlighting through [child];
/// the copied text is always [code].
class TrcCodeBlock extends StatefulWidget {
  /// A block showing [code].
  const TrcCodeBlock({
    super.key,
    required this.code,
    this.title,
    this.language,
    this.child,
    this.copyLabel = 'Copy code',
    this.copiedLabel = 'Copied',
  });

  /// Source code, also what the copy button copies.
  final String code;

  /// File name shown in a tab: "lib/main.dart".
  final String? title;

  /// Language, shown as a small badge in the tab.
  final String? language;

  /// Highlighted rendering of the code, such as a `Text.rich`; plain text by
  /// default.
  final Widget? child;

  /// Accessible name of the copy button.
  final String copyLabel;

  /// Announced once the code is copied.
  final String copiedLabel;

  @override
  State<TrcCodeBlock> createState() => _TrcCodeBlockState();
}

class _TrcCodeBlockState extends State<TrcCodeBlock> {
  bool _copied = false;
  Timer? _timer;

  Future<void> _copy() async {
    await Clipboard.setData(ClipboardData(text: widget.code));
    if (!mounted) return;
    setState(() => _copied = true);
    _timer?.cancel();
    _timer = Timer(const Duration(milliseconds: 1600), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final button = Semantics(
      liveRegion: _copied,
      value: _copied ? widget.copiedLabel : null,
      child: TrcIconButton(
        glyph: _copied ? TrcGlyph.check : TrcGlyph.copy,
        label: widget.copyLabel,
        size: 34,
        iconSize: 18,
        radius: 8,
        color: _copied ? theme.accent : null,
        onPressed: () => unawaited(_copy()),
      ),
    );
    final code = SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: widget.title == null
          ? const EdgeInsetsDirectional.fromSTEB(20, 20, 56, 20)
          : const EdgeInsets.fromLTRB(20, 16, 20, 20),
      child: DefaultTextStyle(
        style: theme.mono(
          size: 13.5,
          height: 1.7,
          color: const Color(0xFFC9CACC),
        ),
        child: widget.child ?? Text(widget.code),
      ),
    );
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: theme.surface,
        borderRadius: BorderRadius.circular(theme.radius),
        border: Border.all(color: theme.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: widget.title == null
          ? Stack(
              fit: StackFit.passthrough,
              children: [
                code,
                PositionedDirectional(top: 10, end: 10, child: button),
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsetsDirectional.fromSTEB(16, 12, 12, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Align(
                          alignment: AlignmentDirectional.centerStart,
                          child: Container(
                            padding: const EdgeInsetsDirectional.fromSTEB(
                              8,
                              7,
                              14,
                              7,
                            ),
                            decoration: BoxDecoration(
                              color: theme.background,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: theme.borderStrong),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (widget.language != null) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 5,
                                      vertical: 2,
                                    ),
                                    decoration: BoxDecoration(
                                      color: theme.accent,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      _badges[widget.language!.toLowerCase()] ??
                                          widget.language!.toUpperCase(),
                                      style: theme
                                          .mono(
                                            size: 10,
                                            height: 1.2,
                                            color: theme.onAccent,
                                          )
                                          .copyWith(
                                            fontWeight: FontWeight.w700,
                                          ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                ],
                                Flexible(
                                  child: Text(
                                    widget.title!,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: theme.mono(size: 13),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      button,
                    ],
                  ),
                ),
                code,
              ],
            ),
    );
  }
}
