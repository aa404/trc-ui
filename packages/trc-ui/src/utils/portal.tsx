import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders its children into `document.body`, once mounted on the client: nothing in the server
 * render, so server and client agree. Keeps layers out of `overflow: hidden` and `transform` parents.
 */
export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}
