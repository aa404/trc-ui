import type { ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";
import { ArrowLeft, ArrowRight } from "../utils/icons";

type Entry = number | "ellipsis";

/**
 * Pages to show: always the first and the last, the current one with `siblings` on each side, and
 * ellipses in between. The number of entries stays constant, so the controls do not jump around.
 */
export function paginationRange(page: number, total: number, siblings = 1): Entry[] {
  const slots = siblings * 2 + 5;
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  if (page <= siblings + 3) return [...range(1, slots - 2), "ellipsis", total];
  if (page >= total - siblings - 2) return [1, "ellipsis", ...range(total - slots + 3, total)];
  return [1, "ellipsis", ...range(page - siblings, page + siblings), "ellipsis", total];
}

export type PaginationProps = {
  /** Current page, from 1. */
  page: number;
  /** Number of pages. */
  total: number;
  /** Buttons mode: called with the new page. */
  onPageChange?: (page: number) => void;
  /**
   * Links mode (better for search engines): the address of each page, as a function or as a
   * pattern with `{page}`, such as `"/blog/page/{page}"`. The pattern also works from a server component.
   */
  href?: string | ((page: number) => string);
  siblings?: number;
  linkAs?: ElementType;
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name of a page number, such as "Page 3". */
  pageLabel?: (page: number) => string;
  className?: string;
};

/** Page navigation: numbers with ellipses, previous and next. As buttons or as links. */
export function Pagination({
  page,
  total,
  onPageChange,
  href,
  siblings = 1,
  linkAs: LinkTag = "a",
  label = "Pagination",
  previousLabel = "Previous",
  nextLabel = "Next",
  pageLabel = (p) => `Page ${p}`,
  className,
}: PaginationProps) {
  if (total <= 1) return null;
  const getHref = href === undefined ? undefined : typeof href === "string" ? (p: number) => href.replace("{page}", String(p)) : href;

  const control = (target: number, content: ReactNode, extra: { className: string; ariaLabel: string; current?: boolean }) => {
    const disabled = target < 1 || target > total;
    const common = {
      className: cx("trc-pagination__control", extra.className),
      "aria-label": extra.ariaLabel,
      "aria-current": extra.current ? ("page" as const) : undefined,
    };
    if (getHref) {
      return disabled ? (
        <span {...common} aria-disabled="true">
          {content}
        </span>
      ) : (
        <LinkTag href={getHref(target)} {...common}>
          {content}
        </LinkTag>
      );
    }
    return (
      <button type="button" {...common} disabled={disabled} onClick={() => !extra.current && onPageChange?.(target)}>
        {content}
      </button>
    );
  };

  return (
    <nav aria-label={label} className={cx("trc-pagination", className)}>
      <ul className="trc-pagination__list">
        <li>{control(page - 1, <ArrowLeft />, { className: "trc-pagination__step", ariaLabel: previousLabel })}</li>
        {paginationRange(page, total, siblings).map((entry, i) =>
          entry === "ellipsis" ? (
            <li key={`e${i}`} aria-hidden className="trc-pagination__ellipsis">
              …
            </li>
          ) : (
            <li key={entry}>
              {control(entry, entry, {
                className: "trc-pagination__page",
                ariaLabel: pageLabel(entry),
                current: entry === page,
              })}
            </li>
          ),
        )}
        <li>{control(page + 1, <ArrowRight />, { className: "trc-pagination__step", ariaLabel: nextLabel })}</li>
      </ul>
    </nav>
  );
}
