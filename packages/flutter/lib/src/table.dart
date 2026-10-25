import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// Horizontal alignment of a table column.
enum TrcColumnAlign {
  /// Start of the cell.
  start,

  /// Centered.
  center,

  /// End of the cell, for numbers so that digits line up.
  end,
}

/// A column of a [TrcTable].
@immutable
class TrcTableColumn<T> {
  /// A column titled [header] whose cells come from [cell].
  const TrcTableColumn({
    required this.header,
    required this.cell,
    this.align = TrcColumnAlign.start,
    this.sortValue,
  });

  /// Title of the column.
  final String header;

  /// Cell content of a row: a string, or any widget.
  final Object Function(T row) cell;

  /// Alignment of the column.
  final TrcColumnAlign align;

  /// Value to sort by; the column is sortable when given.
  final Comparable<Object?> Function(T row)? sortValue;
}

/// Order of a sorted [TrcTable].
enum TrcSortDirection {
  /// Smallest first.
  ascending,

  /// Largest first.
  descending,
}

/// Data table with a caption and sortable columns: each sortable header is a
/// button announcing its order. Scrolls sideways on small screens.
class TrcTable<T> extends StatefulWidget {
  /// A table of [rows].
  const TrcTable({
    super.key,
    required this.columns,
    required this.rows,
    required this.caption,
    this.hideCaption = false,
    this.initialSortColumn,
    this.initialSortDirection = TrcSortDirection.ascending,
    this.dense = false,
    this.emptyText = 'No data',
    this.ascendingLabel = 'sorted ascending',
    this.descendingLabel = 'sorted descending',
    this.sortableLabel = 'sortable',
  });

  /// The columns.
  final List<TrcTableColumn<T>> columns;

  /// The rows.
  final List<T> rows;

  /// Title of the table, read first by screen readers.
  final String caption;

  /// Hides the caption visually; screen readers still read it.
  final bool hideCaption;

  /// Index of the column sorted at first.
  final int? initialSortColumn;

  /// Order of that column.
  final TrcSortDirection initialSortDirection;

  /// Tighter cells.
  final bool dense;

  /// Shown without rows.
  final String emptyText;

  /// Read on a header sorted ascending.
  final String ascendingLabel;

  /// Read on a header sorted descending.
  final String descendingLabel;

  /// Read on a sortable header not sorted.
  final String sortableLabel;

  @override
  State<TrcTable<T>> createState() => _TrcTableState<T>();
}

class _TrcTableState<T> extends State<TrcTable<T>> {
  late int? _sortColumn = widget.initialSortColumn;
  late TrcSortDirection _direction = widget.initialSortDirection;

  List<T> get _sorted {
    final index = _sortColumn;
    if (index == null) return widget.rows;
    final value = widget.columns[index].sortValue;
    if (value == null) return widget.rows;
    final ordered = [...widget.rows]
      ..sort((a, b) => value(a).compareTo(value(b)));
    return _direction == TrcSortDirection.ascending
        ? ordered
        : ordered.reversed.toList();
  }

  void _toggle(int index) {
    setState(() {
      if (_sortColumn == index && _direction == TrcSortDirection.ascending) {
        _direction = TrcSortDirection.descending;
      } else {
        _sortColumn = index;
        _direction = TrcSortDirection.ascending;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final pad = widget.dense
        ? const EdgeInsets.symmetric(horizontal: 14, vertical: 8)
        : const EdgeInsets.symmetric(horizontal: 20, vertical: 14);
    final headPad = widget.dense
        ? const EdgeInsets.symmetric(horizontal: 14, vertical: 8)
        : const EdgeInsets.symmetric(horizontal: 20, vertical: 12);
    final rows = _sorted;
    const tabular = [FontFeature.tabularFigures()];

    Alignment align(TrcColumnAlign a) => switch (a) {
      TrcColumnAlign.start => AlignmentDirectional.centerStart.resolve(
        Directionality.of(context),
      ),
      TrcColumnAlign.center => Alignment.center,
      TrcColumnAlign.end => AlignmentDirectional.centerEnd.resolve(
        Directionality.of(context),
      ),
    };

    Widget header(int i) {
      final column = widget.columns[i];
      final style = theme.text(
        size: 14,
        weight: FontWeight.w500,
        color: theme.foregroundSubtle,
      );
      final text = Text(column.header, style: style, softWrap: false);
      Widget content = text;
      if (column.sortValue != null) {
        final active = _sortColumn == i;
        final up = active && _direction == TrcSortDirection.ascending;
        content = Semantics(
          button: true,
          container: true,
          label: column.header,
          value: active
              ? (up ? widget.ascendingLabel : widget.descendingLabel)
              : widget.sortableLabel,
          child: TrcTappable(
            excludeChildSemantics: true,
            onTap: () => _toggle(i),
            builder: (context, state) => TrcFocusRing(
              visible: state.focused,
              borderRadius: BorderRadius.circular(4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                textDirection: column.align == TrcColumnAlign.end
                    ? (Directionality.of(context) == TextDirection.ltr
                          ? TextDirection.rtl
                          : TextDirection.ltr)
                    : null,
                children: [
                  Text(
                    column.header,
                    softWrap: false,
                    style: style.copyWith(
                      color: state.hovered ? theme.foreground : null,
                    ),
                  ),
                  const SizedBox(width: 6),
                  AnimatedRotation(
                    turns: up ? 0.5 : 0,
                    duration: trcMotion(
                      context,
                      const Duration(milliseconds: 200),
                    ),
                    child: Opacity(
                      opacity: active ? 1 : 0.35,
                      child: TrcIcon(
                        TrcGlyph.chevronDown,
                        size: 14,
                        color: active ? theme.accent : style.color,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }
      return Container(
        padding: headPad,
        alignment: align(column.align),
        color: theme.surface,
        child: content,
      );
    }

    Widget cell(int c, T row, bool last) {
      final column = widget.columns[c];
      final value = column.cell(row);
      return Container(
        padding: pad,
        alignment: align(column.align),
        decoration: BoxDecoration(
          border: last ? null : Border(bottom: BorderSide(color: theme.border)),
        ),
        child: value is Widget
            ? DefaultTextStyle(
                style: theme.text(size: 14, color: theme.foregroundMuted),
                child: value,
              )
            : Text(
                '$value',
                style: theme
                    .text(size: 14, height: 1.45, color: theme.foregroundMuted)
                    .copyWith(
                      fontFeatures: column.align == TrcColumnAlign.end
                          ? tabular
                          : null,
                    ),
              ),
      );
    }

    final table = Table(
      defaultColumnWidth: const IntrinsicColumnWidth(flex: 1),
      defaultVerticalAlignment: TableCellVerticalAlignment.middle,
      children: [
        TableRow(
          decoration: BoxDecoration(
            border: Border(
              top: widget.hideCaption
                  ? BorderSide.none
                  : BorderSide(color: theme.border),
              bottom: BorderSide(color: theme.border),
            ),
          ),
          children: [for (var i = 0; i < widget.columns.length; i++) header(i)],
        ),
        for (var r = 0; r < rows.length; r++)
          TableRow(
            children: [
              for (var c = 0; c < widget.columns.length; c++)
                cell(c, rows[r], r == rows.length - 1),
            ],
          ),
      ],
    );

    return Semantics(
      container: true,
      label: widget.caption,
      explicitChildNodes: true,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(theme.radius),
          border: Border.all(color: theme.border),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (!widget.hideCaption)
              ExcludeSemantics(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  child: Text(widget.caption, style: theme.text()),
                ),
              ),
            LayoutBuilder(
              builder: (context, constraints) => SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: ConstrainedBox(
                  constraints: BoxConstraints(minWidth: constraints.maxWidth),
                  child: table,
                ),
              ),
            ),
            if (rows.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 32,
                ),
                child: Text(
                  widget.emptyText,
                  textAlign: TextAlign.center,
                  style: theme.text(size: 14, color: theme.foregroundSubtle),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
