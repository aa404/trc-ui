import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";

/** A key of the keyboard, for shortcuts: <Kbd>⌘</Kbd> <Kbd>K</Kbd>. */
export function Kbd({ className, ...props }: ComponentPropsWithoutRef<"kbd">) {
  return <kbd className={cx("trc-kbd", className)} {...props} />;
}

export type DividerProps = {
  /** Text in the middle of the line: "or". */
  label?: ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/** Hairline between groups of content, optionally with a word in the middle. */
export function Divider({ label, orientation = "horizontal", className }: DividerProps) {
  if (orientation === "vertical") {
    return <span role="separator" aria-orientation="vertical" className={cx("trc-divider--vertical", className)} />;
  }
  if (label == null) return <hr className={cx("trc-divider", className)} />;
  return (
    <div role="separator" className={cx("trc-divider-label", className)}>
      <span className="trc-divider-label__text">{label}</span>
    </div>
  );
}
