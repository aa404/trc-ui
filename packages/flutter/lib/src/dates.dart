/// Small local-date helpers for the date picker: days only, no time of day,
/// no time zone surprises.
abstract final class TrcDates {
  /// Midnight of [date], local time.
  static DateTime startOfDay(DateTime date) =>
      DateTime(date.year, date.month, date.day);

  /// [date] moved by [days] calendar days (safe across clock changes).
  static DateTime addDays(DateTime date, int days) =>
      DateTime(date.year, date.month, date.day + days);

  /// Same day of another month, clamped to the last day when it does not
  /// exist (31 January + 1 month = 28 February).
  static DateTime addMonths(DateTime date, int months) {
    final target = DateTime(date.year, date.month + months);
    final lastDay = DateTime(target.year, target.month + 1, 0).day;
    return DateTime(
      target.year,
      target.month,
      date.day < lastDay ? date.day : lastDay,
    );
  }

  /// Whether both dates fall on the same day.
  static bool sameDay(DateTime? a, DateTime? b) =>
      a != null &&
      b != null &&
      a.year == b.year &&
      a.month == b.month &&
      a.day == b.day;

  /// "2026-10-24".
  static String toIsoDate(DateTime date) =>
      '${date.year.toString().padLeft(4, '0')}-'
      '${date.month.toString().padLeft(2, '0')}-'
      '${date.day.toString().padLeft(2, '0')}';

  /// First day shown in the month grid: the start of the week holding the
  /// 1st. [weekStartsOn] is 0 for Sunday, 1 for Monday… 6 for Saturday.
  static DateTime gridStart(DateTime month, int weekStartsOn) {
    final first = DateTime(month.year, month.month);
    final offset = (first.weekday % 7 - weekStartsOn + 7) % 7;
    return addDays(first, -offset);
  }

  /// Whether [a] is an earlier day than [b].
  static bool isBefore(DateTime a, DateTime b) =>
      startOfDay(a).isBefore(startOfDay(b));
}
