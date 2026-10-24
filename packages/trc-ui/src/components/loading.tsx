import { useId, type CSSProperties, type ReactNode } from "react";
import { cx } from "../utils/cx";

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  /** Round, for an avatar. */
  circle?: boolean;
  /** Several lines of text, the last one shorter. */
  lines?: number;
  className?: string;
};

const size = (value: number | string | undefined) => (typeof value === "number" ? `${value}px` : value);

/** Placeholder shapes while content loads. Hidden from screen readers: announce the loading state elsewhere. */
export function Skeleton({ width, height, circle = false, lines, className }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <span aria-hidden className={cx("trc-skeleton-lines", className)} style={{ width: size(width) }}>
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="trc-skeleton trc-skeleton--text" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
        ))}
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={cx("trc-skeleton", circle && "trc-skeleton--circle", !height && !circle && "trc-skeleton--text", className)}
      style={{ width: size(width), height: size(height) ?? (circle ? size(width) : undefined) }}
    />
  );
}

export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  /** Announced to screen readers. */
  label?: string;
  className?: string;
};

/** Accent arc turning while something loads, announced through `role="status"`. */
export function Spinner({ size: s = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span role="status" className={cx("trc-spinner", `trc-spinner--${s}`, className)}>
      <svg viewBox="0 0 24 24" aria-hidden className="trc-spinner__svg">
        <circle cx="12" cy="12" r="10" className="trc-spinner__track" />
        <path d="M12 2a10 10 0 0 1 10 10" className="trc-spinner__arc" />
      </svg>
      <span className="trc-visually-hidden">{label}</span>
    </span>
  );
}

export type ProgressProps = {
  /** Progress from 0 to `max`; leave out while the total is unknown. */
  value?: number | null;
  max?: number;
  /** Visible label above the bar, also its accessible name. */
  label?: ReactNode;
  /** Accessible name when there is no visible label. */
  "aria-label"?: string;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
  className?: string;
};

/** Progress bar filled with the accent; indeterminate without a value. */
export function Progress({
  value,
  max = 100,
  label,
  "aria-label": ariaLabel,
  showValue = false,
  formatValue = (v, m) => `${Math.round((v / m) * 100)} %`,
  className,
}: ProgressProps) {
  const id = useId();
  const determinate = value !== undefined && value !== null;
  const clamped = determinate ? Math.min(Math.max(value, 0), max) : 0;
  const text = determinate ? formatValue(clamped, max) : undefined;
  return (
    <div className={cx("trc-progress", !determinate && "trc-progress--indeterminate", className)}>
      {(label != null || (showValue && text)) && (
        <div className="trc-progress__head">
          {label != null && (
            <span id={`${id}-label`} className="trc-progress__label">
              {label}
            </span>
          )}
          {showValue && text && (
            <span aria-hidden className="trc-progress__value">
              {text}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-labelledby={label != null ? `${id}-label` : undefined}
        aria-label={label == null ? ariaLabel : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={determinate ? clamped : undefined}
        aria-valuetext={text}
        className="trc-progress__track"
      >
        <div className="trc-progress__fill" style={{ "--trc-progress": `${(clamped / max) * 100}%` } as CSSProperties} />
      </div>
    </div>
  );
}
