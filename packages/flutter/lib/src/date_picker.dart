import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';

import 'dates.dart';
import 'field.dart';
import 'floating.dart';
import 'focus_ring.dart';
import 'foundation.dart';
import 'icon_button.dart';
import 'icons.dart';
import 'theme.dart';

const _shortWeekdays = {
  'en': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'fr': ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
};

/// Date field that opens a calendar. Month and day names come from the
/// app's [MaterialLocalizations] (three-letter weekdays in English and
/// French, narrow ones otherwise, or your own [weekdayLabels]).
///
/// Keyboard in the calendar: the arrows move by a day or a week, Home and End
/// to the start and end of the week, Page Up and Page Down by a month (with
/// Shift, a year), Enter or Space chooses, Escape closes. Each day is
/// announced in full. Works inside a [TrcField].
class TrcDatePicker extends StatefulWidget {
  /// A date field showing [value].
  const TrcDatePicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.min,
    this.max,
    this.weekStartsOn,
    this.weekdayLabels,
    this.placeholder = 'Choose a date',
    this.formatDate,
    this.calendarLabel = 'Choose a date',
    this.previousMonthLabel = 'Previous month',
    this.nextMonthLabel = 'Next month',
    this.invalid,
    this.semanticLabel,
    this.today,
  });

  /// The chosen day, or null.
  final DateTime? value;

  /// Called with the chosen day; disabled when null.
  final ValueChanged<DateTime>? onChanged;

  /// Earliest choosable day.
  final DateTime? min;

  /// Latest choosable day.
  final DateTime? max;

  /// First day of the week: 0 for Sunday, 1 for Monday; the locale's by
  /// default.
  final int? weekStartsOn;

  /// Seven weekday labels from Sunday, to replace the built-in ones.
  final List<String>? weekdayLabels;

  /// Faint text shown until a day is chosen.
  final String placeholder;

  /// Formats the chosen day in the field; the locale's short date ("Mar 12, 2026") by
  /// default.
  final String Function(DateTime date)? formatDate;

  /// Accessible name of the calendar.
  final String calendarLabel;

  /// Accessible name of the previous month button.
  final String previousMonthLabel;

  /// Accessible name of the next month button.
  final String nextMonthLabel;

  /// Error state; follows the enclosing field when null.
  final bool? invalid;

  /// Accessible name outside a field.
  final String? semanticLabel;

  /// Today, marked with an accent dot; the current day by default (for
  /// tests and previews).
  final DateTime? today;

  @override
  State<TrcDatePicker> createState() => _TrcDatePickerState();
}

class _TrcDatePickerState extends State<TrcDatePicker> {
  bool _open = false;
  late DateTime _focused = TrcDates.startOfDay(widget.value ?? DateTime.now());
  final _grid = FocusNode(debugLabel: 'TrcDatePicker grid');
  FocusNode? _ownTrigger;
  bool _gridFocused = false;

  /// The focused day is ringed only once the keyboard is used.
  bool _keyboard = false;

  FocusNode get _trigger =>
      TrcFieldScope.maybeOf(context)?.focusNode ??
      (_ownTrigger ??= FocusNode(debugLabel: 'TrcDatePicker'));

  @override
  void initState() {
    super.initState();
    _grid.addListener(() {
      if (_gridFocused != _grid.hasFocus) {
        setState(() => _gridFocused = _grid.hasFocus);
      }
    });
  }

  @override
  void dispose() {
    _grid.dispose();
    _ownTrigger?.dispose();
    super.dispose();
  }

  bool _outOfRange(DateTime d) =>
      (widget.min != null && TrcDates.isBefore(d, widget.min!)) ||
      (widget.max != null && TrcDates.isBefore(widget.max!, d));

  DateTime _clamp(DateTime d) {
    if (widget.min != null && TrcDates.isBefore(d, widget.min!)) {
      return TrcDates.startOfDay(widget.min!);
    }
    if (widget.max != null && TrcDates.isBefore(widget.max!, d)) {
      return TrcDates.startOfDay(widget.max!);
    }
    return d;
  }

  int _weekStart(MaterialLocalizations l10n) =>
      widget.weekStartsOn ?? l10n.firstDayOfWeekIndex;

  void _show() {
    setState(() {
      _focused = _clamp(TrcDates.startOfDay(widget.value ?? DateTime.now()));
      _open = true;
      _keyboard =
          FocusManager.instance.highlightMode ==
              FocusHighlightMode.traditional &&
          _trigger.hasFocus;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && _open) _grid.requestFocus();
    });
  }

  void _close({bool returnFocus = true}) {
    setState(() => _open = false);
    if (returnFocus) _trigger.requestFocus();
  }

  void _choose(DateTime day) {
    if (_outOfRange(day)) return;
    widget.onChanged?.call(day);
    _close();
  }

  KeyEventResult _onGridKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) {
      return KeyEventResult.ignored;
    }
    final l10n = MaterialLocalizations.of(context);
    final rtl = Directionality.of(context) == TextDirection.rtl;
    if (!_keyboard) setState(() => _keyboard = true);
    final key = event.logicalKey;
    final shift = HardwareKeyboard.instance.isShiftPressed;
    final column = (_focused.weekday % 7 - _weekStart(l10n) + 7) % 7;
    DateTime? next;
    if (key == LogicalKeyboardKey.arrowLeft) {
      next = TrcDates.addDays(_focused, rtl ? 1 : -1);
    } else if (key == LogicalKeyboardKey.arrowRight) {
      next = TrcDates.addDays(_focused, rtl ? -1 : 1);
    } else if (key == LogicalKeyboardKey.arrowUp) {
      next = TrcDates.addDays(_focused, -7);
    } else if (key == LogicalKeyboardKey.arrowDown) {
      next = TrcDates.addDays(_focused, 7);
    } else if (key == LogicalKeyboardKey.home) {
      next = TrcDates.addDays(_focused, -column);
    } else if (key == LogicalKeyboardKey.end) {
      next = TrcDates.addDays(_focused, 6 - column);
    } else if (key == LogicalKeyboardKey.pageUp) {
      next = TrcDates.addMonths(_focused, shift ? -12 : -1);
    } else if (key == LogicalKeyboardKey.pageDown) {
      next = TrcDates.addMonths(_focused, shift ? 12 : 1);
    } else if (key == LogicalKeyboardKey.enter ||
        key == LogicalKeyboardKey.numpadEnter ||
        key == LogicalKeyboardKey.space) {
      _choose(_focused);
      return KeyEventResult.handled;
    }
    if (next == null) return KeyEventResult.ignored;
    setState(() => _focused = _clamp(next!));
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final l10n = MaterialLocalizations.of(context);
    final field = TrcFieldScope.maybeOf(context);
    final invalid = widget.invalid ?? field?.invalid ?? false;
    final value = widget.value;
    final text = value == null
        ? widget.placeholder
        : (widget.formatDate ?? l10n.formatShortDate)(value);
    final enabled = widget.onChanged != null;

    return TrcAnchoredOverlay(
      open: _open,
      onDismiss: (reason) =>
          _close(returnFocus: reason == TrcDismissReason.escape),
      panelBuilder: (context) => _calendar(context),
      child: Semantics(
        button: true,
        container: true,
        label: field?.label ?? widget.semanticLabel,
        value: value == null ? null : text,
        hint: field?.message,
        expanded: _open,
        validationResult: invalid
            ? SemanticsValidationResult.invalid
            : SemanticsValidationResult.none,
        child: TrcTappable(
          enabled: enabled,
          excludeChildSemantics: true,
          focusNode: _trigger,
          onTap: () => _open ? _close() : _show(),
          builder: (context, state) => TrcControlFrame(
            focused: state.focused || _open,
            hovered: state.hovered,
            invalid: invalid,
            enabled: enabled,
            padding: const EdgeInsetsDirectional.only(start: 16, end: 14),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    text,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: theme.text(
                      height: 1.4,
                      color: value == null
                          ? theme.foregroundFaint
                          : theme.foreground,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                TrcIcon(
                  TrcGlyph.calendar,
                  size: 18,
                  color: theme.foregroundSubtle,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _calendar(BuildContext context) {
    final theme = TrcTheme.of(context);
    final l10n = MaterialLocalizations.of(context);
    final locale = Localizations.maybeLocaleOf(context);
    final weekStart = _weekStart(l10n);
    final narrow = MediaQuery.sizeOf(context).width <= 380;
    final cell = narrow ? 36.0 : 40.0;
    final start = TrcDates.gridStart(_focused, weekStart);
    final today = TrcDates.startOfDay(widget.today ?? DateTime.now());
    final labels =
        widget.weekdayLabels ??
        _shortWeekdays[locale?.languageCode] ??
        l10n.narrowWeekdays;
    final title = l10n.formatMonthYear(_focused);

    Widget day(DateTime d) {
      final selected = TrcDates.sameDay(d, widget.value);
      final focused = TrcDates.sameDay(d, _focused);
      final disabled = _outOfRange(d);
      final outside = d.month != _focused.month;
      final isToday = TrcDates.sameDay(d, today);
      return Semantics(
        button: true,
        selected: selected,
        enabled: !disabled,
        focused: focused && _gridFocused,
        label: l10n.formatFullDate(d),
        excludeSemantics: true,
        onTap: disabled ? null : () => _choose(d),
        child: _Day(
          size: cell,
          day: d.day,
          selected: selected,
          outside: outside,
          disabled: disabled,
          today: isToday,
          ring: focused && _gridFocused && _keyboard,
          onTap: disabled ? null : () => _choose(d),
        ),
      );
    }

    return Semantics(
      label: widget.calendarLabel,
      scopesRoute: true,
      namesRoute: true,
      explicitChildNodes: true,
      child: FocusScope(
        child: TrcFloatingPanel(
          radius: theme.radius,
          padding: EdgeInsets.all(narrow ? 12 : 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                width: cell * 7 + 14,
                child: Row(
                  children: [
                    TrcIconButton(
                      glyph: TrcGlyph.chevronLeft,
                      label: widget.previousMonthLabel,
                      size: 34,
                      iconSize: 18,
                      onPressed: () => setState(
                        () =>
                            _focused = _clamp(TrcDates.addMonths(_focused, -1)),
                      ),
                    ),
                    Expanded(
                      child: Semantics(
                        liveRegion: true,
                        child: Text(
                          title,
                          textAlign: TextAlign.center,
                          style: theme.text(height: 1.3),
                        ),
                      ),
                    ),
                    TrcIconButton(
                      glyph: TrcGlyph.chevronRight,
                      label: widget.nextMonthLabel,
                      size: 34,
                      iconSize: 18,
                      onPressed: () => setState(
                        () =>
                            _focused = _clamp(TrcDates.addMonths(_focused, 1)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Focus(
                focusNode: _grid,
                onKeyEvent: _onGridKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ExcludeSemantics(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          for (var i = 0; i < 7; i++)
                            Container(
                              width: cell + 2,
                              padding: const EdgeInsets.only(bottom: 6),
                              alignment: Alignment.center,
                              child: Text(
                                labels[(weekStart + i) % 7],
                                style: theme.text(
                                  size: 12,
                                  color: theme.foregroundFaint,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    for (var w = 0; w < 6; w++)
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          for (var i = 0; i < 7; i++)
                            Padding(
                              padding: const EdgeInsets.all(1),
                              child: day(TrcDates.addDays(start, w * 7 + i)),
                            ),
                        ],
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Day extends StatefulWidget {
  const _Day({
    required this.size,
    required this.day,
    required this.selected,
    required this.outside,
    required this.disabled,
    required this.today,
    required this.ring,
    required this.onTap,
  });

  final double size;
  final int day;
  final bool selected;
  final bool outside;
  final bool disabled;
  final bool today;
  final bool ring;
  final VoidCallback? onTap;

  @override
  State<_Day> createState() => _DayState();
}

class _DayState extends State<_Day> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final color = widget.selected
        ? theme.onAccent
        : widget.outside
        ? theme.foregroundFaint
        : theme.foreground;
    return MouseRegion(
      cursor: widget.disabled
          ? SystemMouseCursors.forbidden
          : SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: TrcFocusRing(
          visible: widget.ring,
          circle: true,
          child: Opacity(
            opacity: widget.disabled ? 0.3 : 1,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              width: widget.size,
              height: widget.size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: widget.selected
                    ? theme.accent
                    : _hovered && !widget.disabled
                    ? const Color(0x14FFFFFF)
                    : const Color(0x00FFFFFF),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Text(
                    '${widget.day}',
                    style: theme
                        .text(size: 14, height: 1, color: color)
                        .copyWith(
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                  ),
                  // Today: a small dot under the number.
                  if (widget.today)
                    Positioned(
                      bottom: 6,
                      child: Container(
                        width: 4,
                        height: 4,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: widget.selected
                              ? theme.onAccent
                              : theme.accent,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
