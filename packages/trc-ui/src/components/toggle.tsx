import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { Check } from "../utils/icons";

type ToggleProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: ReactNode;
  /** Extra detail under the label. */
  description?: ReactNode;
};

/** The label wraps the control: the whole block is clickable. */
function ToggleLabel({
  kind,
  label,
  description,
  className,
  children,
}: {
  kind: "checkbox" | "switch";
  label: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cx("trc-toggle", `trc-toggle--${kind}`, className)}>
      {children}
      <span className="trc-toggle__text">
        <span className="trc-toggle__label">{label}</span>
        {description != null && <span className="trc-toggle__description">{description}</span>}
      </span>
    </label>
  );
}

export type CheckboxProps = ToggleProps;

/** Native checkbox, filled with the accent color once checked. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, ...props },
  ref,
) {
  return (
    <ToggleLabel kind="checkbox" label={label} description={description} className={className}>
      <span className="trc-checkbox">
        <input ref={ref} type="checkbox" className="trc-checkbox__input" {...props} />
        <Check className="trc-checkbox__check" />
      </span>
    </ToggleLabel>
  );
});

export type SwitchProps = ToggleProps;

/** Switch: a native checkbox announced as a `switch` to screen readers. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, className, ...props },
  ref,
) {
  return (
    <ToggleLabel kind="switch" label={label} description={description} className={className}>
      <span className="trc-switch">
        <input ref={ref} type="checkbox" role="switch" className="trc-switch__input" {...props} />
        <span aria-hidden className="trc-switch__thumb" />
      </span>
    </ToggleLabel>
  );
});
