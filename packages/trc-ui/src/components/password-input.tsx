"use client";

import { forwardRef, useState } from "react";
import { cx } from "../utils/cx";
import { Input, useFieldProps, type InputProps } from "./field";

export type PasswordInputProps = Omit<InputProps, "type"> & {
  /** Visible text of the button: "Show", "Afficher"… */
  showLabel?: string;
  hideLabel?: string;
  /** Completes the button's name for screen readers: "Show password". */
  noun?: string;
};

/**
 * Password field with a Show / Hide button. Works inside `Field` like `Input`. The button's
 * accessible name includes its visible text ("Show password"), as WCAG 2.5.3 asks.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showLabel = "Show", hideLabel = "Hide", noun = "password", className, autoComplete = "current-password", ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  // The id the input will get, from the props or from the parent Field.
  const { id } = useFieldProps(props);
  return (
    <span className={cx("trc-password", className)}>
      <Input ref={ref} {...props} id={id} type={visible ? "text" : "password"} autoComplete={autoComplete} />
      <button type="button" className="trc-password__toggle" aria-controls={id} onClick={() => setVisible((v) => !v)}>
        {visible ? hideLabel : showLabel} <span className="trc-visually-hidden">{noun}</span>
      </button>
    </span>
  );
});
