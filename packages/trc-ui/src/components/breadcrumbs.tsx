import type { ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

export type BreadcrumbItem = { label: ReactNode; href?: string };

export type BreadcrumbsProps = {
  /** From the home page to the current page; the last item is the current page and has no link. */
  items: BreadcrumbItem[];
  label?: string;
  linkAs?: ElementType;
  className?: string;
};

/** Trail from the home page to the current page, separated by thin slashes. */
export function Breadcrumbs({ items, label = "Breadcrumb", linkAs: LinkTag = "a", className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cx("trc-breadcrumbs", className)}>
      <ol className="trc-breadcrumbs__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="trc-breadcrumbs__item">
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="trc-breadcrumbs__current">
                  {item.label}
                </span>
              ) : (
                <LinkTag href={item.href} className="trc-breadcrumbs__link">
                  {item.label}
                </LinkTag>
              )}
              {!last && (
                <span aria-hidden className="trc-breadcrumbs__separator">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
