"use client";

import { useId, type ReactNode } from "react";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";

export type RadioOption = { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean };

export type RadioGroupProps = {
  /** Question of the group, rendered as its legend. */
  label: ReactNode;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  className?: string;
};

/**
 * A choice among a few options, as native radio buttons in a fieldset: the legend is read with
 * each option, the arrows move the choice, and the hint or error is tied to the group.
 */
export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  hint,
  error,
  required = false,
  orientation = "vertical",
  className,
}: RadioGroupProps) {
  const [selected, setSelected] = useControllable<string | undefined>(value, defaultValue, (v) => v && onValueChange?.(v));
  const id = useId();
  const message = error ?? hint;
  return (
    <fieldset
      className={cx("trc-radio-group", className)}
      aria-describedby={message != null ? `${id}-message` : undefined}
      aria-invalid={error != null || undefined}
      aria-required={required || undefined}
    >
      <legend className="trc-field__label">
        {label}
        {required && (
          <span aria-hidden className="trc-field__required">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className={cx("trc-radio-group__options", orientation === "horizontal" && "trc-radio-group__options--row")}>
        {options.map((option) => (
          <label key={option.value} className="trc-toggle trc-toggle--radio">
            <span className="trc-radio">
              <input
                type="radio"
                name={name ?? id}
                value={option.value}
                checked={selected === option.value}
                disabled={option.disabled}
                required={required}
                onChange={() => setSelected(option.value)}
                className="trc-radio__input"
              />
            </span>
            <span className="trc-toggle__text">
              <span className="trc-toggle__label">{option.label}</span>
              {option.description != null && <span className="trc-toggle__description">{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
      {message != null && (
        <p id={`${id}-message`} className={cx("trc-field__message", error != null && "trc-field__message--error")}>
          {message}
        </p>
      )}
    </fieldset>
  );
}
