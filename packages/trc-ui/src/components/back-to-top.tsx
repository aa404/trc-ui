"use client";

import { useEffect, useState } from "react";
import { cx } from "../utils/cx";
import { ArrowUp } from "../utils/icons";

export type BackToTopProps = {
  label?: string;
  /** Défilement, en hauteurs d'écran, à partir duquel le bouton apparaît. */
  threshold?: number;
  className?: string;
};

/** Pastille d'accent flottante « Haut de page » : apparaît une fois le premier écran dépassé. */
export function BackToTop({ label = "Haut de page", threshold = 0.8, className }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        })
      }
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cx("trc-back-to-top", visible && "trc-back-to-top--visible", className)}
    >
      <ArrowUp />
    </button>
  );
}
