import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "../utils/cx";
import { Close } from "../utils/icons";

export type TagProps = ComponentPropsWithoutRef<"span"> & {
  /** `accent` for the one tag that matters on a card. */
  tone?: "default" | "accent";
  /** Shows a remove button. */
  onRemove?: () => void;
  removeLabel?: string;
  children: ReactNode;
};

/** Small label for metadata (status, category, filter). Never placed over photos. */
export function Tag({ tone = "default", onRemove, removeLabel = "Remove", className, children, ...props }: TagProps) {
  return (
    <span className={cx("trc-tag", tone === "accent" && "trc-tag--accent", className)} {...props}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="trc-tag__remove"
          aria-label={`${removeLabel} ${typeof children === "string" ? children : ""}`.trim()}
          onClick={onRemove}
        >
          <Close />
        </button>
      )}
    </span>
  );
}
