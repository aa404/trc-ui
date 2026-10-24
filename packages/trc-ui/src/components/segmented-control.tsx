"use client";

import { useId, type ReactNode } from "react";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";

export type SegmentedOption = { value: string; label: ReactNode; disabled?: boolean };

export type SegmentedControlProps = {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the group. */
  label: string;
  /** Form field name; generated when omitted. */
  name?: string;
  size?: "md" | "sm";
  className?: string;
};

/**
 * Pill switch between a few options, built on native radio buttons: the arrows move the choice,
 * forms and screen readers work as usual. For views of the same content; use Tabs to switch panels.
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  name,
  size = "md",
  className,
}: SegmentedControlProps) {
  const [selected, setSelected] = useControllable(value, defaultValue ?? options[0]?.value ?? "", onValueChange);
  const generated = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cx("trc-segmented", size === "sm" && "trc-segmented--sm", className)}>
      {options.map((option) => (
        <label key={option.value} className="trc-segmented__option">
          <input
            type="radio"
            name={name ?? generated}
            value={option.value}
            checked={option.value === selected}
            disabled={option.disabled}
            onChange={() => setSelected(option.value)}
            className="trc-segmented__input"
          />
          <span className="trc-segmented__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
