"use client";

import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ReactNode } from "react";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";
import { useFieldProps } from "./field";

export type SliderProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "value" | "defaultValue" | "onChange"> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Shows the value next to the slider. */
  showValue?: boolean;
  /** Formats the shown and announced value: "€ 40", "75 %". */
  formatValue?: (value: number) => ReactNode;
  invalid?: boolean;
};

/**
 * Range slider on the native input: keyboard (arrows, Page Up / Down, Home, End) and screen readers
 * work as usual. The track fills with the accent up to the thumb. Works inside `Field` like `Input`.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    formatValue = (v) => v,
    invalid,
    className,
    style,
    ...props
  },
  ref,
) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? min, onValueChange);
  const a11y = useFieldProps({ ...props, invalid });
  const progress = max > min ? ((current - min) / (max - min)) * 100 : 0;
  const formatted = formatValue(current);
  return (
    <div className={cx("trc-slider", className)}>
      <input
        ref={ref}
        {...props}
        {...a11y}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        aria-valuetext={typeof formatted === "string" ? formatted : undefined}
        onChange={(e) => setCurrent(Number(e.target.value))}
        className="trc-slider__input"
        style={{ ...style, "--trc-slider-progress": `${progress}%` } as CSSProperties}
      />
      {showValue && (
        <output htmlFor={a11y.id} className="trc-slider__value" aria-hidden>
          {formatted}
        </output>
      )}
    </div>
  );
});
