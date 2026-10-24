import type { ReactNode } from "react";
import { cx } from "../utils/cx";

export type StepItem = { title: ReactNode; description?: ReactNode };

export type StepsProps = {
  items: StepItem[];
  /**
   * Index of the step in progress (from 0): earlier steps are complete, later ones upcoming.
   * Leave out for a plain list of steps, all alike.
   */
  current?: number;
  className?: string;
};

/**
 * Vertical timeline of steps in a real order: large thin numbers in the accent, joined by a hairline.
 * With `current`, the step in progress carries `aria-current="step"` and the upcoming ones fade.
 */
export function Steps({ items, current, className }: StepsProps) {
  return (
    <ol className={cx("trc-steps", className)}>
      {items.map((item, i) => {
        const state = current === undefined ? "default" : i < current ? "complete" : i === current ? "current" : "upcoming";
        return (
          <li key={i} className={cx("trc-steps__item", `trc-steps__item--${state}`)} aria-current={state === "current" ? "step" : undefined}>
            <span aria-hidden className="trc-steps__number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="trc-steps__text">
              <p className="trc-steps__title">{item.title}</p>
              {item.description != null && <div className="trc-steps__description">{item.description}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
