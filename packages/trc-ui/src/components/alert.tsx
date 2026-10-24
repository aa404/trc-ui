import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

export type AlertProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  title?: ReactNode;
  /** `info` and `success` use the accent, `error` the error color. */
  tone?: "info" | "success" | "error";
  /** Actions under the text, such as a small pill. */
  actions?: ReactNode;
};

/**
 * Inline message in a graphite card, marked by a thin colored edge rather than an icon badge.
 * Static by default; pass `role="alert"` (urgent) or `role="status"` when it appears after an action.
 */
export function Alert({ title, tone = "info", actions, className, children, ...props }: AlertProps) {
  return (
    <div className={cx("trc-alert", `trc-alert--${tone}`, className)} {...props}>
      {title != null && <p className="trc-alert__title">{title}</p>}
      {children != null && <div className="trc-alert__body">{children}</div>}
      {actions != null && <div className="trc-alert__actions">{actions}</div>}
    </div>
  );
}
