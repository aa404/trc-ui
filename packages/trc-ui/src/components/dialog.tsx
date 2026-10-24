"use client";

import type { ReactNode } from "react";
import { cx } from "../utils/cx";
import { ModalLayer } from "./layer";

export type DialogProps = {
  open: boolean;
  /** Called on Escape, on the close button and on the overlay. */
  onClose: () => void;
  /** Title of the window, also its accessible name. */
  title: ReactNode;
  /** Short text under the title, announced with it. */
  description?: ReactNode;
  children?: ReactNode;
  /** Actions at the bottom, usually pills: the main one solid, on the right. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  closeLabel?: string;
  closeOnOverlay?: boolean;
  className?: string;
};

/**
 * Modal window: a graphite card centered over a dark overlay. Focus moves inside and stays there;
 * Escape, the close button or the overlay close it, and focus returns to where it was.
 * Put `data-autofocus` on the element that should receive focus first.
 */
export function Dialog({
  size = "md",
  closeLabel = "Close",
  closeOnOverlay = true,
  className,
  ...props
}: DialogProps) {
  return (
    <ModalLayer
      {...props}
      closeLabel={closeLabel}
      closeOnOverlay={closeOnOverlay}
      rootClassName="trc-layer--dialog"
      panelClassName={cx("trc-dialog", `trc-dialog--${size}`, className)}
    />
  );
}
