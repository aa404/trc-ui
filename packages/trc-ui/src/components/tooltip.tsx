"use client";

import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode, type Ref } from "react";
import { useAnchoredPosition, type Side } from "../hooks/use-floating";
import { callAll, getElementRef, mergeRefs } from "../utils/compose";
import { cx } from "../utils/cx";
import { Portal } from "../utils/portal";

type ChildProps = {
  ref?: Ref<HTMLElement>;
  "aria-describedby"?: string;
  onMouseEnter?: (e: unknown) => void;
  onMouseLeave?: (e: unknown) => void;
  onFocus?: (e: unknown) => void;
  onBlur?: (e: unknown) => void;
};

export type TooltipProps = {
  /** Short text describing the element; never the only way to get the information. */
  label: ReactNode;
  /** A single focusable element: a button, a link, an input. */
  children: ReactElement<ChildProps>;
  side?: Side;
  /** Delay before showing on hover, in milliseconds. Keyboard focus shows it right away. */
  delay?: number;
  className?: string;
};

/**
 * Small label shown on hover and keyboard focus, tied to its element with `aria-describedby`.
 * It stays open while the pointer moves onto it, and Escape hides it (WCAG 1.4.13).
 */
export function Tooltip({ label, children, side = "top", delay = 300, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  const show = (wait: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), wait);
  };
  // A short grace period lets the pointer travel from the element onto the tooltip.
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 100);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useAnchoredPosition(open, anchorRef, tipRef, { side, align: "center", offset: 8 });

  const child = cloneElement(children, {
    ref: mergeRefs(anchorRef, getElementRef(children)),
    "aria-describedby": [children.props["aria-describedby"], id].filter(Boolean).join(" "),
    onMouseEnter: callAll(children.props.onMouseEnter, () => show(delay)),
    onMouseLeave: callAll(children.props.onMouseLeave, hide),
    onFocus: callAll(children.props.onFocus, () => show(0)),
    onBlur: callAll(children.props.onBlur, () => {
      window.clearTimeout(timer.current);
      setOpen(false);
    }),
  } as ChildProps);

  return (
    <>
      {child}
      {/* Always in the DOM (hidden when closed) so that aria-describedby points to real text. */}
      <Portal>
        <div
          ref={tipRef}
          id={id}
          role="tooltip"
          className={cx("trc-floating", "trc-tooltip", open && "trc-tooltip--open", className)}
          onMouseEnter={() => window.clearTimeout(timer.current)}
          onMouseLeave={hide}
        >
          {label}
        </div>
      </Portal>
    </>
  );
}
