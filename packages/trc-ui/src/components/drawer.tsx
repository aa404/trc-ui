"use client";

import type { ReactNode } from "react";
import { cx } from "../utils/cx";
import { ModalLayer } from "./layer";

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Actions pinned to the bottom of the panel. */
  footer?: ReactNode;
  /** Edge the panel slides from. */
  side?: "right" | "left";
  size?: "sm" | "md";
  closeLabel?: string;
  closeOnOverlay?: boolean;
  className?: string;
};

/** Side panel that slides over the page: filters, cart, settings, mobile navigation. Modal, like `Dialog`. */
export function Drawer({
  side = "right",
  size = "sm",
  closeLabel = "Close",
  closeOnOverlay = true,
  className,
  ...props
}: DrawerProps) {
  return (
    <ModalLayer
      {...props}
      closeLabel={closeLabel}
      closeOnOverlay={closeOnOverlay}
      rootClassName={`trc-layer--drawer trc-layer--${side}`}
      panelClassName={cx("trc-drawer", `trc-drawer--${size}`, className)}
    />
  );
}
