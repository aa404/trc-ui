"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { useAnchoredPosition, useDismiss, type Align, type Side } from "../hooks/use-floating";
import { callAll, getElementRef, mergeRefs } from "../utils/compose";
import { cx } from "../utils/cx";
import { Portal } from "../utils/portal";

type TriggerProps = { ref?: Ref<HTMLElement>; onClick?: (e: unknown) => void };

export type PopoverProps = {
  /** Element that opens the panel. */
  trigger: ReactElement<TriggerProps>;
  /** Title of the panel, also its accessible name. */
  title?: ReactNode;
  /** Accessible name when there is no visible title. */
  label?: string;
  children: ReactNode;
  side?: Side;
  align?: Align;
  /** Controlled state; leave out to let the popover manage itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/**
 * Floating panel anchored to a trigger, for short content and small forms. Not modal: the page stays
 * usable. Focus moves into the panel when it opens; Escape or a click outside closes it.
 */
export function Popover({
  trigger,
  title,
  label,
  children,
  side = "bottom",
  align = "start",
  open: controlled,
  onOpenChange,
  className,
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlled ?? uncontrolled;
  const setOpen = (value: boolean) => {
    if (controlled === undefined) setUncontrolled(value);
    onOpenChange?.(value);
  };
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useAnchoredPosition(open, triggerRef, panelRef, { side, align });
  useDismiss(open, [triggerRef, panelRef], (reason) => {
    setOpen(false);
    if (reason === "escape") triggerRef.current?.focus();
  });

  // Focus the first field or button of the panel, or the panel itself.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(
      "[data-autofocus], input, select, textarea, button, a[href], [tabindex]:not([tabindex='-1'])",
    );
    (first ?? panel)?.focus();
  }, [open]);

  const triggerElement = cloneElement(trigger, {
    ref: mergeRefs(triggerRef, getElementRef(trigger)),
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? `${id}-panel` : undefined,
    onClick: callAll(trigger.props.onClick, () => setOpen(!open)),
  } as TriggerProps);

  return (
    <>
      {triggerElement}
      {open && (
        <Portal>
          <div
            ref={panelRef}
            id={`${id}-panel`}
            role="dialog"
            aria-labelledby={title != null ? `${id}-title` : undefined}
            aria-label={title == null ? label : undefined}
            tabIndex={-1}
            className={cx("trc-floating", "trc-popover", className)}
          >
            {title != null && (
              <p id={`${id}-title`} className="trc-popover__title">
                {title}
              </p>
            )}
            <div className="trc-popover__body">{children}</div>
          </div>
        </Portal>
      )}
    </>
  );
}
