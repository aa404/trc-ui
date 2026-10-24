"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useAnchoredPosition, useDismiss } from "../hooks/use-floating";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";
import { addDays, addMonths, gridStart, isBefore, sameDay, startOfDay, toISODate } from "../utils/dates";
import { Calendar, ChevronLeft, ChevronRight } from "../utils/icons";
import { Portal } from "../utils/portal";
import { useFieldProps } from "./field";

export type DatePickerProps = {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  /** Earliest and latest choosable dates. */
  min?: Date;
  max?: Date;
  /** Locale of the month and day names, such as "fr-FR"; the browser's by default. */
  locale?: string;
  /** First day of the week: 0 for Sunday, 1 for Monday. */
  weekStartsOn?: number;
  placeholder?: string;
  /** Formats the chosen date in the field. */
  formatDate?: (date: Date) => string;
  /** Form field name: the date is submitted as YYYY-MM-DD. */
  name?: string;
  label?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
};

/**
 * Date field that opens a calendar. Keyboard in the calendar: arrows move by a day or a week, Home
 * and End to the start and end of the week, Page Up and Page Down by a month (with Shift, a year),
 * Enter or Space chooses, Escape closes. Each day is announced in full; works inside `Field`.
 */
export function DatePicker({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  locale,
  weekStartsOn = 1,
  placeholder = "Choose a date",
  formatDate,
  name,
  label = "Choose a date",
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  invalid,
  disabled,
  required,
  id,
  className,
}: DatePickerProps) {
  const [selected, setSelected] = useControllable<Date | null>(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  // Day with the keyboard focus in the grid; it also sets the month shown.
  const [focused, setFocused] = useState<Date>(() => startOfDay(selected ?? new Date()));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const a11y = useFieldProps({ id, invalid, required });

  const display = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "full" });
  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const format = formatDate ?? ((d: Date) => display.format(d));

  const outOfRange = (date: Date) => (!!min && isBefore(date, min)) || (!!max && isBefore(max, date));
  const clamp = (date: Date) =>
    min && isBefore(date, min) ? startOfDay(min) : max && isBefore(max, date) ? startOfDay(max) : date;

  const openCalendar = () => {
    setFocused(clamp(startOfDay(selected ?? new Date())));
    setOpen(true);
  };
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };
  const choose = (date: Date) => {
    if (outOfRange(date)) return;
    setSelected(date);
    close();
  };

  useAnchoredPosition(open, triggerRef, panelRef, { side: "bottom", align: "start" });
  useDismiss(open, [triggerRef, panelRef], (reason) => close(reason === "escape"));

  // Move the real focus to the focused day whenever it changes.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toISODate(focused)}"]`)?.focus();
  }, [open, focused]);

  const onGridKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      setFocused(clamp(move()));
    }
  };

  // Tab stays inside the calendar while it is open.
  const onPanelKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = [
      ...(panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]):not([tabindex='-1'])") ?? []),
    ];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  const start = gridStart(focused, weekStartsOn);
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const today = startOfDay(new Date());
  const valueId = `${uid}-value`;

  return (
    <div className={cx("trc-date-picker", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={a11y.id}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={a11y["aria-invalid"]}
        aria-describedby={cx(valueId, a11y["aria-describedby"]) || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openCalendar())}
        className={cx("trc-control", "trc-date-picker__trigger", !selected && "trc-date-picker__trigger--empty")}
      >
        <span id={valueId}>{selected ? format(selected) : placeholder}</span>
        <Calendar className="trc-date-picker__icon" />
      </button>
      {name && <input type="hidden" name={name} value={selected ? toISODate(selected) : ""} required={required} />}

      {open && (
        <Portal>
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="trc-floating trc-calendar"
            onKeyDown={onPanelKeyDown}
          >
            <div className="trc-calendar__head">
              <button
                type="button"
                className="trc-calendar__nav"
                aria-label={previousMonthLabel}
                onClick={() => setFocused(clamp(addMonths(focused, -1)))}
              >
                <ChevronLeft />
              </button>
              <p id={`${uid}-title`} className="trc-calendar__title" aria-live="polite">
                {monthTitle.format(focused)}
              </p>
              <button
                type="button"
                className="trc-calendar__nav"
                aria-label={nextMonthLabel}
                onClick={() => setFocused(clamp(addMonths(focused, 1)))}
              >
                <ChevronRight />
              </button>
            </div>
            <table
              role="grid"
              aria-labelledby={`${uid}-title`}
              className="trc-calendar__grid"
              onKeyDown={onGridKeyDown}
            >
              <thead>
                <tr>
                  {weeks[0]!.map((day) => (
                    <th key={day.getDay()} scope="col" abbr={weekdayLong.format(day)} className="trc-calendar__weekday">
                      {weekdayShort.format(day).replace(".", "").slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, w) => (
                  <tr key={w}>
                    {week.map((day) => {
                      const isSelected = sameDay(day, selected);
                      const disabledDay = outOfRange(day);
                      return (
                        <td key={toISODate(day)} role="gridcell" aria-selected={isSelected || undefined}>
                          <button
                            type="button"
                            data-date={toISODate(day)}
                            tabIndex={sameDay(day, focused) ? 0 : -1}
                            aria-label={full.format(day)}
                            aria-current={sameDay(day, today) ? "date" : undefined}
                            disabled={disabledDay}
                            onClick={() => choose(day)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                choose(day);
                              }
                            }}
                            className={cx(
                              "trc-calendar__day",
                              day.getMonth() !== focused.getMonth() && "trc-calendar__day--outside",
                              isSelected && "trc-calendar__day--selected",
                            )}
                          >
                            {day.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Portal>
      )}
    </div>
  );
}
