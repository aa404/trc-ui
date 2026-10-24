import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/** `useLayoutEffect` in the browser, `useEffect` on the server (no warning during server rendering). */
export const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type Side = "top" | "bottom";
export type Align = "start" | "center" | "end";

const MARGIN = 8;

/**
 * Places a floating element (menu, popover, tooltip) in `position: fixed` against its anchor.
 * It flips to the other side when there is not enough room, stays inside the viewport and follows
 * scrolling and resizing. The resolved side is written to `data-side`, for the entrance animation.
 */
export function useAnchoredPosition(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  { side = "bottom", align = "start", offset = 8 }: { side?: Side; align?: Align; offset?: number } = {},
) {
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = anchorRef.current;
      const floating = floatingRef.current;
      if (!anchor || !floating) return;
      const a = anchor.getBoundingClientRect();
      const f = floating.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const below = a.bottom + offset;
      const above = a.top - offset - f.height;
      const fitsBelow = below + f.height <= vh - MARGIN;
      const fitsAbove = above >= MARGIN;
      const resolved: Side = side === "bottom" ? (fitsBelow || !fitsAbove ? "bottom" : "top") : fitsAbove || !fitsBelow ? "top" : "bottom";
      const top = resolved === "bottom" ? below : above;

      let left = align === "start" ? a.left : align === "end" ? a.right - f.width : a.left + a.width / 2 - f.width / 2;
      left = Math.min(Math.max(left, MARGIN), Math.max(MARGIN, vw - f.width - MARGIN));

      floating.style.top = `${Math.round(top)}px`;
      floating.style.left = `${Math.round(left)}px`;
      floating.dataset.side = resolved;
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, side, align, offset]);
}

/** Calls `onDismiss` on a press outside every given element, or on Escape. */
export function useDismiss(open: boolean, refs: RefObject<HTMLElement | null>[], onDismiss: (reason: "outside" | "escape") => void) {
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!refs.some((ref) => ref.current?.contains(target))) dismiss.current("outside");
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss.current("escape");
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // The refs are stable objects: only the open state matters.
  }, [open]);
}
