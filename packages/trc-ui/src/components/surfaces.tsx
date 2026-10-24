import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

type Polymorphic<C extends ElementType, P> = P & { as?: C } & Omit<ComponentPropsWithoutRef<C>, "as" | keyof P>;

export type ContainerProps<C extends ElementType = "div"> = Polymorphic<
  C,
  {
    /** `default`: 1280 px, for text and grids; `wide`: 1600 px, for full-width cards; `narrow`: 768 px. */
    size?: "default" | "wide" | "narrow";
  }
>;

/** Centered max width, with side gutters that grow with the screen. */
export function Container<C extends ElementType = "div">({
  as,
  size = "default",
  className,
  ...props
}: ContainerProps<C>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cx("trc-container", size !== "default" && `trc-container--${size}`, className)} {...props} />;
}

export type SectionProps<C extends ElementType = "section"> = Polymorphic<
  C,
  {
    /** Vertical spacing. */
    spacing?: "sm" | "md" | "lg" | "none";
    /**
     * Card inset from the screen edges ("magazine" effect): graphite background and rounded corners,
     * for banners, calls to action and heroes.
     */
    inset?: boolean;
  }
>;

/** Vertical block of a page. With `inset`, it becomes a large rounded card a few pixels from the edges. */
export function Section<C extends ElementType = "section">({
  as,
  spacing = "md",
  inset = false,
  className,
  children,
  ...props
}: SectionProps<C>) {
  const Tag: ElementType = as ?? "section";
  if (inset) {
    return (
      <Tag className={cx("trc-section-inset", className)} {...props}>
        <div className={cx("trc-section-inset__card", spacing !== "none" && `trc-section--${spacing}`)}>{children}</div>
      </Tag>
    );
  }
  return (
    <Tag className={cx(spacing !== "none" && `trc-section--${spacing}`, className)} {...props}>
      {children}
    </Tag>
  );
}

export type CardProps<C extends ElementType = "div"> = Polymorphic<
  C,
  {
    /** `alt`: a slightly lighter grey, to tell two side-by-side blocks apart. */
    tone?: "default" | "alt";
    padding?: "none" | "sm" | "md" | "lg";
    /** Lightens on hover (clickable cards: links, buttons). */
    interactive?: boolean;
    /** Decorative watermark icon: very large, thin stroke, half out of the corner; wakes up on hover. */
    watermark?: ReactNode;
  }
>;

/** Graphite card, rounded corners, no shadow: depth comes from shades of grey. */
export function Card<C extends ElementType = "div">({
  as,
  tone = "default",
  padding = "md",
  interactive = false,
  watermark,
  className,
  children,
  ...props
}: CardProps<C>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cx(
        "trc-card",
        tone === "alt" && "trc-card--alt",
        padding !== "none" && `trc-card--pad-${padding}`,
        interactive && "trc-card--interactive",
        !!watermark && "trc-card--watermark",
        className,
      )}
      {...props}
    >
      {!!watermark && (
        <span aria-hidden className="trc-card__watermark">
          {watermark}
        </span>
      )}
      {children}
    </Tag>
  );
}
