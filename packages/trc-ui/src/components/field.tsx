"use client";

import { createContext, forwardRef, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { ChevronDown } from "../utils/icons";

type FieldContextValue = { id: string; describedBy?: string; invalid: boolean; required: boolean };

const FieldContext = createContext<FieldContextValue | null>(null);

export type FieldProps = {
  label: ReactNode;
  /** Hint shown under the control. */
  hint?: ReactNode;
  /** Error message: replaces the hint and marks the control as invalid. */
  error?: ReactNode;
  required?: boolean;
  /** Control id; generated when omitted. */
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Label, hint and error of a form control. The control placed inside (`Input`, `Textarea`, `Select`)
 * automatically receives its `id`, `aria-describedby` and `aria-invalid`.
 */
export function Field({ label, hint, error, required = false, id, className, children }: FieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const messageId = `${fieldId}-message`;
  const message = error ?? hint;
  return (
    <FieldContext.Provider
      value={{ id: fieldId, describedBy: message ? messageId : undefined, invalid: error != null, required }}
    >
      <div className={cx("trc-field", className)}>
        <label htmlFor={fieldId} className="trc-field__label">
          {label}
          {required && (
            <span aria-hidden className="trc-field__required">
              {" "}
              *
            </span>
          )}
        </label>
        {children}
        {message != null && (
          <p id={messageId} className={cx("trc-field__message", error != null && "trc-field__message--error")}>
            {message}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

/** Accessibility attributes from the parent `Field`, without overriding those passed to the control. Internal: shared by every control. */
export function useFieldProps(props: { id?: string; required?: boolean; invalid?: boolean; "aria-describedby"?: string }) {
  const field = useContext(FieldContext);
  const invalid = props.invalid ?? field?.invalid ?? false;
  return {
    id: props.id ?? field?.id,
    required: props.required ?? field?.required,
    "aria-describedby": cx(field?.describedBy, props["aria-describedby"]) || undefined,
    "aria-invalid": invalid || undefined,
  };
}

type ControlProps = { invalid?: boolean };

export type InputProps = ComponentPropsWithoutRef<"input"> & ControlProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, className, ...props }, ref) {
  const a11y = useFieldProps({ ...props, invalid });
  return <input ref={ref} className={cx("trc-control", className)} {...props} {...a11y} />;
});

export type TextareaProps = ComponentPropsWithoutRef<"textarea"> & ControlProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, rows = 4, className, ...props },
  ref,
) {
  const a11y = useFieldProps({ ...props, invalid });
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx("trc-control", "trc-control--textarea", className)}
      {...props}
      {...a11y}
    />
  );
});

export type SelectProps = ComponentPropsWithoutRef<"select"> &
  ControlProps & {
    /** Empty option shown until something is chosen. */
    placeholder?: string;
  };

/** Native select (accessible and mobile friendly), dressed with a thin chevron. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, placeholder, defaultValue, className, children, ...props },
  ref,
) {
  const a11y = useFieldProps({ ...props, invalid });
  // Without a given value, keep the empty option shown (otherwise the browser picks the first enabled option).
  const initial = defaultValue ?? (props.value === undefined && placeholder != null ? "" : undefined);
  return (
    <span className={cx("trc-select", className)}>
      <select ref={ref} className="trc-control trc-control--select" defaultValue={initial} {...props} {...a11y}>
        {placeholder != null && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown className="trc-select__chevron" />
    </span>
  );
});
