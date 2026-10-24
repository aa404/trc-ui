"use client";

import { useState, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { ChevronDown } from "../utils/icons";

export type TableColumn<Row> = {
  key: string;
  header: ReactNode;
  /** `right` for numbers, so that digits line up. */
  align?: "left" | "center" | "right";
  sortable?: boolean;
  /** Cell content; the row's `key` field by default. */
  render?: (row: Row) => ReactNode;
  /** Value used to sort; the row's `key` field by default. */
  sortValue?: (row: Row) => string | number | Date;
};

export type SortState = { key: string; direction: "ascending" | "descending" };

export type TableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  /** Unique key of each row. */
  rowKey: (row: Row) => string;
  /** Title of the table, read first by screen readers. */
  caption: ReactNode;
  /** Hides the caption visually; it stays for screen readers. */
  hideCaption?: boolean;
  defaultSort?: SortState;
  dense?: boolean;
  emptyText?: ReactNode;
  className?: string;
};

const compare = (a: unknown, b: unknown) => {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" });
};

/**
 * Data table with a caption and sortable columns: each sortable header is a button, and the
 * current order is announced with `aria-sort`. Scrolls sideways on small screens, in a focusable
 * region so that keyboard users can scroll it too.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  caption,
  hideCaption = false,
  defaultSort,
  dense = false,
  emptyText = "No data",
  className,
}: TableProps<Row>) {
  const [sort, setSort] = useState<SortState | undefined>(defaultSort);
  const field = (row: Row, key: string) => (row as Record<string, unknown>)[key];

  const sorted = (() => {
    const column = columns.find((c) => c.key === sort?.key);
    if (!sort || !column) return rows;
    const value = (row: Row) => (column.sortValue ? column.sortValue(row) : field(row, column.key));
    const ordered = [...rows].sort((a, b) => compare(value(a), value(b)));
    return sort.direction === "ascending" ? ordered : ordered.reverse();
  })();

  const toggle = (key: string) =>
    setSort((current) =>
      current?.key === key && current.direction === "ascending"
        ? { key, direction: "descending" }
        : { key, direction: "ascending" },
    );

  return (
    <div
      className={cx("trc-table", dense && "trc-table--dense", className)}
      role="region"
      aria-label={typeof caption === "string" ? caption : undefined}
      tabIndex={0}
    >
      <table className="trc-table__table">
        <caption className={cx("trc-table__caption", hideCaption && "trc-visually-hidden")}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const direction = sort?.key === column.key ? sort.direction : undefined;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={column.sortable ? (direction ?? "none") : undefined}
                  className={cx("trc-table__head", column.align && `trc-table__cell--${column.align}`)}
                >
                  {column.sortable ? (
                    <button type="button" className="trc-table__sort" onClick={() => toggle(column.key)}>
                      {column.header}
                      <ChevronDown
                        className={cx(
                          "trc-table__sort-icon",
                          direction && "trc-table__sort-icon--active",
                          direction === "ascending" && "trc-table__sort-icon--up",
                        )}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="trc-table__empty">
                {emptyText}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cx("trc-table__cell", column.align && `trc-table__cell--${column.align}`)}
                  >
                    {column.render ? column.render(row) : (field(row, column.key) as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
