import { version, type ReactElement, type Ref, type RefCallback } from "react";

/** Calls every handler in turn, skipping the empty ones: the trigger keeps its own handlers. */
export function callAll<A extends unknown[]>(...fns: (((...args: A) => void) | undefined)[]) {
  return (...args: A) => fns.forEach((fn) => fn?.(...args));
}

/** One ref callback feeding several refs (object or function). */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) (ref as { current: T | null }).current = value;
    }
  };
}

/** Ref of a React element: a prop in React 19, a field of the element in React 18. */
export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
  const fromProps = (element.props as { ref?: Ref<T> }).ref;
  if (Number.parseInt(version, 10) >= 19) return fromProps;
  return (element as unknown as { ref?: Ref<T> }).ref;
}
