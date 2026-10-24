import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

/**
 * Colors the words between asterisks with the accent: "How it *works*".
 * Without asterisks, `accentLast` colors the last words (titles coming from a CMS).
 */
export function AccentText({ text, accentLast = 0 }: { text: string; accentLast?: number }) {
  if (text.includes("*")) {
    return (
      <>
        {text.split("*").map((part, i) =>
          i % 2 === 1 ? (
            <span key={i} className="trc-accent">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  }
  const words = text.split(" ");
  if (!accentLast || words.length < 2) return <>{text}</>;
  const n = Math.min(accentLast, words.length - 1);
  return (
    <>
      {words.slice(0, -n).join(" ")} <span className="trc-accent">{words.slice(-n).join(" ")}</span>
    </>
  );
}

/** Plain text of a marked-up title, for attributes (`alt`, `title`, metadata). */
export const plainText = (text: string) => text.replaceAll("*", "");

export type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";

export type HeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "children"> & {
  /** Rendered tag; the visual size is set separately with `size`. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?: HeadingSize;
  /** When `children` is a string without asterisks, number of trailing words in the accent color. */
  accentLast?: number;
  children: ReactNode;
};

/** Thin Montserrat 400 heading; a string may contain an *accent word* between asterisks. */
export function Heading({ as: Tag = "h2", size = "xl", accentLast, className, children, ...props }: HeadingProps) {
  return (
    <Tag className={cx("trc-display", `trc-heading--${size}`, className)} {...props}>
      {typeof children === "string" ? <AccentText text={children} accentLast={accentLast} /> : children}
    </Tag>
  );
}

export type TextProps<C extends ElementType = "p"> = {
  as?: C;
  size?: "lg" | "md" | "sm";
  tone?: "default" | "muted" | "subtle";
} & Omit<ComponentPropsWithoutRef<C>, "as" | "size">;

/** Body text; `tone="muted"` (default) so that it does not compete with headings. */
export function Text<C extends ElementType = "p">({ as, size = "md", tone = "muted", className, ...props }: TextProps<C>) {
  const Tag: ElementType = as ?? "p";
  return <Tag className={cx("trc-text", `trc-text--${size}`, `trc-text--${tone}`, className)} {...props} />;
}

/** Large thin number in the accent color ("01", "02"…), reserved for steps in a real order. */
export function StepNumber({ n, size = "md", className }: { n: number; size?: "md" | "sm"; className?: string }) {
  return (
    <span aria-hidden className={cx("trc-step-number", size === "sm" && "trc-step-number--sm", className)}>
      {String(n).padStart(2, "0")}
    </span>
  );
}
