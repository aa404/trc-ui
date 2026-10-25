import 'dart:async';

import 'package:flutter/widgets.dart';

import 'field.dart';
import 'foundation.dart';
import 'icon_button.dart';
import 'icons.dart';
import 'theme.dart';

/// A file chosen by the user, as described by your file picker. trc_ui does
/// not pick files itself (that needs a platform plugin): it shows, checks
/// and lists them.
@immutable
class TrcFile {
  /// A file named [name] of [size] bytes.
  const TrcFile({
    required this.name,
    required this.size,
    this.mimeType,
    this.data,
  });

  /// File name, with its extension.
  final String name;

  /// Size in bytes.
  final int size;

  /// Media type, such as `image/png`, when known.
  final String? mimeType;

  /// Anything your app needs to keep with the file (bytes, a path, the
  /// picker's own object).
  final Object? data;

  @override
  String toString() => 'TrcFile($name, $size B)';
}

/// Readable size: 820 B, 14 KB, 3.5 MB.
String formatBytes(int bytes) {
  if (bytes < 1024) return '$bytes B';
  const units = ['KB', 'MB', 'GB'];
  var value = bytes / 1024;
  var unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  final text = value < 10 ? value.toStringAsFixed(1) : '${value.round()}';
  return '$text ${units[unit]}';
}

/// Whether [file] matches an [accept] list such as `image/*,.pdf`: by
/// extension, by media type family, or by exact media type.
bool acceptsFile(TrcFile file, String? accept) {
  if (accept == null || accept.trim().isEmpty) return true;
  final name = file.name.toLowerCase();
  final type = (file.mimeType ?? '').toLowerCase();
  return accept
      .split(',')
      .map((rule) => rule.trim().toLowerCase())
      .where((rule) => rule.isNotEmpty)
      .any(
        (rule) => rule.startsWith('.')
            ? name.endsWith(rule)
            : rule.endsWith('/*')
            ? type.startsWith(rule.substring(0, rule.length - 1))
            : type == rule,
      );
}

/// Why a file was turned down.
enum TrcFileRejectionReason {
  /// Its type is not in the accept list.
  type,

  /// It is larger than the maximum size.
  size,

  /// There are already as many files as allowed.
  count,
}

/// A file turned down, with its reason.
typedef TrcFileRejection = ({TrcFile file, TrcFileRejectionReason reason});

/// Splits [files] into accepted and rejected ones, checking the type, then
/// the size, then the count ([alreadyAccepted] files are already kept).
({List<TrcFile> accepted, List<TrcFileRejection> rejected}) validateFiles(
  List<TrcFile> files, {
  String? accept,
  int? maxSize,
  int? maxFiles,
  int alreadyAccepted = 0,
}) {
  final accepted = <TrcFile>[];
  final rejected = <TrcFileRejection>[];
  for (final file in files) {
    if (!acceptsFile(file, accept)) {
      rejected.add((file: file, reason: TrcFileRejectionReason.type));
    } else if (maxSize != null && file.size > maxSize) {
      rejected.add((file: file, reason: TrcFileRejectionReason.size));
    } else if (maxFiles != null &&
        alreadyAccepted + accepted.length >= maxFiles) {
      rejected.add((file: file, reason: TrcFileRejectionReason.count));
    } else {
      accepted.add(file);
    }
  }
  return (accepted: accepted, rejected: rejected);
}

/// Opens your app's file picker and returns the chosen files, or null when
/// the user cancels.
typedef TrcFilePicker = Future<List<TrcFile>?> Function();

/// Compact file control: a "Choose a file" button and the chosen names.
/// Tapping it calls [onPick], which opens your app's file picker (for
/// instance with the file_picker package). Works inside a [TrcField].
class TrcFileField extends StatefulWidget {
  /// A file control.
  const TrcFileField({
    super.key,
    required this.onPick,
    this.onChanged,
    this.buttonLabel = 'Choose a file',
    this.placeholder = 'No file chosen',
    this.countLabel = '{count} files',
    this.invalid,
    this.enabled = true,
    this.semanticLabel,
  });

  /// Opens the file picker.
  final TrcFilePicker onPick;

  /// Called with the chosen files.
  final ValueChanged<List<TrcFile>>? onChanged;

  /// Text of the button.
  final String buttonLabel;

  /// Shown while no file is chosen.
  final String placeholder;

  /// Shown when several files are chosen, with `{count}`.
  final String countLabel;

  /// Error state; follows the enclosing field when null.
  final bool? invalid;

  /// Whether the control reacts.
  final bool enabled;

  /// Accessible name outside a field.
  final String? semanticLabel;

  @override
  State<TrcFileField> createState() => _TrcFileFieldState();
}

class _TrcFileFieldState extends State<TrcFileField> {
  List<TrcFile> _files = const [];

  Future<void> _pick() async {
    final files = await widget.onPick();
    if (files == null || !mounted) return;
    setState(() => _files = files);
    widget.onChanged?.call(files);
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final field = TrcFieldScope.maybeOf(context);
    final invalid = widget.invalid ?? field?.invalid ?? false;
    final summary = _files.isEmpty
        ? widget.placeholder
        : _files.length == 1
        ? _files.first.name
        : fillLabel(widget.countLabel, {'count': _files.length});
    return Semantics(
      button: true,
      container: true,
      label: field?.label ?? widget.semanticLabel ?? widget.buttonLabel,
      value: summary,
      hint: field?.message,
      child: TrcTappable(
        enabled: widget.enabled,
        excludeChildSemantics: true,
        focusNode: field?.focusNode,
        onTap: () => unawaited(_pick()),
        builder: (context, state) => TrcControlFrame(
          focused: state.focused,
          hovered: state.hovered,
          invalid: invalid,
          enabled: widget.enabled,
          padding: const EdgeInsetsDirectional.only(start: 6, end: 16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: theme.surfaceAlt,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(widget.buttonLabel, style: theme.text(size: 14)),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  summary,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: theme.text(
                    color: _files.isEmpty
                        ? theme.foregroundFaint
                        : theme.foreground,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Area to tap (or reach with the keyboard) to browse for files; accepted
/// files are listed with their size and a remove button, rejected ones are
/// announced with their reason.
///
/// Picking is left to your app through [onPick]. Dropping files needs a
/// platform drag and drop plugin: from its callbacks, set [dragging] to light
/// the area and pass the dropped files to [TrcDropzoneState.add] through a
/// `GlobalKey<TrcDropzoneState>`.
class TrcDropzone extends StatefulWidget {
  /// A drop zone.
  const TrcDropzone({
    super.key,
    required this.onPick,
    this.onChanged,
    this.accept,
    this.maxSize,
    this.maxFiles,
    this.multiple = true,
    this.dragging = false,
    this.enabled = true,
    this.title = 'Drop files here or',
    this.browseLabel = 'browse',
    this.hint,
    this.removeLabel = 'Remove {name}',
    this.rejectionLabels = const {},
  });

  /// English messages used for the reasons missing from [rejectionLabels].
  static const defaultRejectionLabels = {
    TrcFileRejectionReason.type: '{name}: this type of file is not accepted',
    TrcFileRejectionReason.size: '{name}: the file is too large',
    TrcFileRejectionReason.count: '{name}: too many files',
  };

  /// Opens the file picker.
  final TrcFilePicker onPick;

  /// Called with every accepted file after each change.
  final ValueChanged<List<TrcFile>>? onChanged;

  /// Accepted types, such as `image/*,.pdf`.
  final String? accept;

  /// Maximum size of a file, in bytes.
  final int? maxSize;

  /// Maximum number of files.
  final int? maxFiles;

  /// Keeps adding files; a new choice replaces the file otherwise.
  final bool multiple;

  /// Lights the area while files are dragged over it.
  final bool dragging;

  /// Whether the area reacts.
  final bool enabled;

  /// Main text.
  final String title;

  /// Link-looking word after the title.
  final String browseLabel;

  /// Constraints shown under the title: "PNG or PDF, up to 5 MB".
  final String? hint;

  /// Accessible name of each remove button, with `{name}`.
  final String removeLabel;

  /// Message of a rejected file per reason, with `{name}`; the missing ones
  /// come from [defaultRejectionLabels].
  final Map<TrcFileRejectionReason, String> rejectionLabels;

  @override
  State<TrcDropzone> createState() => TrcDropzoneState();
}

/// State of a [TrcDropzone]: holds the accepted files.
class TrcDropzoneState extends State<TrcDropzone> {
  List<TrcFile> _files = [];
  List<TrcFileRejection> _rejections = [];

  /// The accepted files.
  List<TrcFile> get files => List.unmodifiable(_files);

  /// Checks [incoming] files (picked or dropped) and keeps the accepted ones.
  void add(List<TrcFile> incoming) {
    final base = widget.multiple ? _files : <TrcFile>[];
    final result = validateFiles(
      widget.multiple ? incoming : incoming.take(1).toList(),
      accept: widget.accept,
      maxSize: widget.maxSize,
      maxFiles: widget.maxFiles,
      alreadyAccepted: base.length,
    );
    setState(() {
      _files = [...base, ...result.accepted];
      _rejections = result.rejected;
    });
    widget.onChanged?.call(files);
  }

  void _remove(int index) {
    setState(() {
      _files = [..._files]..removeAt(index);
      _rejections = [];
    });
    widget.onChanged?.call(files);
  }

  Future<void> _browse() async {
    final picked = await widget.onPick();
    if (picked != null && mounted) add(picked);
  }

  String _rejectionText(TrcFileRejection r) => fillLabel(
    widget.rejectionLabels[r.reason] ??
        TrcDropzone.defaultRejectionLabels[r.reason]!,
    {'name': r.file.name},
  );

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final field = TrcFieldScope.maybeOf(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        Semantics(
          button: true,
          container: true,
          label: '${widget.title} ${widget.browseLabel}',
          hint: [field?.message, widget.hint].whereType<String>().join(' '),
          child: TrcTappable(
            enabled: widget.enabled,
            excludeChildSemantics: true,
            focusNode: field?.focusNode,
            onTap: () => unawaited(_browse()),
            builder: (context, state) {
              final lit = widget.dragging || state.focused;
              return Opacity(
                opacity: widget.enabled ? 1 : 0.5,
                child: CustomPaint(
                  painter: _DashedBorder(
                    color: lit
                        ? theme.accent
                        : state.hovered
                        ? const Color(0x59FFFFFF)
                        : theme.borderPill,
                    radius: theme.radius,
                  ),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 36,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(theme.radius),
                      color: widget.dragging
                          ? theme.accentSoft
                          : const Color(0x05FFFFFF),
                    ),
                    child: Column(
                      children: [
                        Text.rich(
                          TextSpan(
                            text: '${widget.title} ',
                            children: [
                              TextSpan(
                                text: widget.browseLabel,
                                style: TextStyle(
                                  color: theme.accent,
                                  decoration: TextDecoration.underline,
                                  decorationColor: theme.accent.withValues(
                                    alpha: 0.4,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          textAlign: TextAlign.center,
                          style: theme.text(size: 16, height: 1.4),
                        ),
                        if (widget.hint != null) ...[
                          const SizedBox(height: 6),
                          Text(
                            widget.hint!,
                            textAlign: TextAlign.center,
                            style: theme.text(
                              size: 13,
                              height: 1.4,
                              color: theme.foregroundSubtle,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        Semantics(
          liveRegion: _rejections.isNotEmpty,
          child: _rejections.isEmpty
              ? const SizedBox.shrink()
              : Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      for (final r in _rejections)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 4),
                          child: Text(
                            _rejectionText(r),
                            style: theme.text(
                              size: 13,
                              height: 1.4,
                              color: theme.danger,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
        ),
        for (var i = 0; i < _files.length; i++)
          Padding(
            padding: EdgeInsets.only(top: i == 0 ? 12 : 6),
            child: Container(
              padding: const EdgeInsetsDirectional.fromSTEB(16, 8, 8, 8),
              decoration: BoxDecoration(
                color: theme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: theme.border),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      _files[i].name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.text(size: 14),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    formatBytes(_files[i].size),
                    style: theme
                        .text(size: 13, color: theme.foregroundSubtle)
                        .copyWith(
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                  ),
                  const SizedBox(width: 8),
                  TrcIconButton(
                    glyph: TrcGlyph.close,
                    label: fillLabel(widget.removeLabel, {
                      'name': _files[i].name,
                    }),
                    size: 30,
                    iconSize: 16,
                    onPressed: () => _remove(i),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// The dashed outline of the drop zone.
class _DashedBorder extends CustomPainter {
  _DashedBorder({required this.color, required this.radius});

  final Color color;
  final double radius;

  @override
  void paint(Canvas canvas, Size size) {
    final path = Path()
      ..addRRect(
        RRect.fromRectAndRadius(
          (Offset.zero & size).deflate(0.5),
          Radius.circular(radius),
        ),
      );
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;
    for (final metric in path.computeMetrics()) {
      for (var d = 0.0; d < metric.length; d += 9) {
        canvas.drawPath(metric.extractPath(d, d + 5), paint);
      }
    }
  }

  @override
  bool shouldRepaint(_DashedBorder old) =>
      old.color != color || old.radius != radius;
}
