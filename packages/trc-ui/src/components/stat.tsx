import type { ReactNode } from "react";
import { cx } from "../utils/cx";

export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  /** Change since the previous period: "+12 %". */
  change?: ReactNode;
  /** Color of the change: accent when positive, error color when negative. */
  changeTone?: "positive" | "negative" | "neutral";
  /** Short context under the value: "vs last month". */
  description?: ReactNode;
  className?: string;
};

/** A key figure with its label, in a large thin number. */
export function Stat({ label, value, change, changeTone = "neutral", description, className }: StatProps) {
  return (
    <dl className={cx("trc-stat", className)}>
      <dt className="trc-stat__label">{label}</dt>
      <dd className="trc-stat__value">{value}</dd>
      {(change != null || description != null) && (
        <dd className="trc-stat__meta">
          {change != null && (
            <span className={cx("trc-stat__change", `trc-stat__change--${changeTone}`)}>{change}</span>
          )}
          {description != null && <span className="trc-stat__description">{description}</span>}
        </dd>
      )}
    </dl>
  );
}
