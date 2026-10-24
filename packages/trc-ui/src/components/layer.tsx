"use client";

import { useId, useRef, type ReactNode } from "react";
import { useModal } from "../hooks/use-modal";
import { cx } from "../utils/cx";
import { Close } from "../utils/icons";
import { Portal } from "../utils/portal";

export type ModalLayerProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel: string;
  /** Closes when the dark overlay is clicked. */
  closeOnOverlay: boolean;
  /** Classes of the root (`trc-layer--…`) and of the panel. */
  rootClassName: string;
  panelClassName: string;
};

/**
 * Shared modal layer for Dialog, Drawer and the mobile menu: portal, overlay, labelled `dialog`
 * role, focus kept inside, Escape to close and page scroll locked (see `useModal`).
 * It stays in the DOM when closed, hidden, so that it can animate out.
 */
export function ModalLayer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel,
  closeOnOverlay,
  rootClassName,
  panelClassName,
}: ModalLayerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panel = useRef<HTMLDivElement>(null);
  useModal(open, panel, onClose);

  return (
    <Portal>
      <div className={cx("trc-layer", rootClassName, open && "trc-layer--open")} aria-hidden={!open}>
        <div className="trc-layer__overlay" onClick={closeOnOverlay ? onClose : undefined} />
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description != null ? descriptionId : undefined}
          tabIndex={-1}
          className={panelClassName}
        >
          <div className="trc-layer__head">
            <h2 id={titleId} className="trc-layer__title">
              {title}
            </h2>
            <button type="button" className="trc-layer__close" aria-label={closeLabel} onClick={onClose}>
              <Close />
            </button>
          </div>
          {description != null && (
            <p id={descriptionId} className="trc-layer__description">
              {description}
            </p>
          )}
          {children != null && <div className="trc-layer__body">{children}</div>}
          {footer != null && <div className="trc-layer__footer">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}
