import { useRef, useState } from "react";

/**
 * State that can be controlled (`value` given) or not (`defaultValue` only).
 * `onChange` is called in both cases.
 */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = useRef(value !== undefined).current;
  const current = controlled ? (value as T) : internal;
  const set = (next: T) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };
  return [current, set] as const;
}
