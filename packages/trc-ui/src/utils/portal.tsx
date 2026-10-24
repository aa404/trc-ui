import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noop = () => () => {};

/** `false` on the server and during hydration, `true` afterwards: client-only rendering without a mismatch. */
export const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );

/**
 * Renders its children into `document.body` on the client: nothing in the server render, so server
 * and client agree. After hydration it renders right away, in the same commit as its parent, so the
 * parent's layout effects can measure it. Keeps layers out of `overflow: hidden` and `transform` parents.
 */
export function Portal({ children }: { children: ReactNode }) {
  return useIsClient() ? createPortal(children, document.body) : null;
}
