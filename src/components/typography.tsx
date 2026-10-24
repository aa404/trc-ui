import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

/**
 * Met en couleur d'accent le passage entre astérisques : « Comment ça *marche* ».
 * Sans astérisques, `accentLast` colore les derniers mots (titres venant d'un CMS).
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

/** Texte brut d'un titre balisé, pour les attributs (`alt`, `title`, métadonnées). */
export const plainText = (text: string) => text.replaceAll("*", "");

export type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";

export type HeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "children"> & {
  /** Balise rendue ; la taille visuelle se règle à part avec `size`. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?: HeadingSize;
  /** Si `children` est une chaîne sans astérisques, nombre de derniers mots mis en accent. */
  accentLast?: number;
  children: ReactNode;
};

/** Titre fin en Montserrat 400 ; une chaîne peut contenir un *mot d'accent* entre astérisques. */
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

/** Texte courant ; `tone="muted"` (par défaut) pour le corps, qui ne doit pas rivaliser avec les titres. */
export function Text<C extends ElementType = "p">({ as, size = "md", tone = "muted", className, ...props }: TextProps<C>) {
  const Tag: ElementType = as ?? "p";
  return <Tag className={cx("trc-text", `trc-text--${size}`, `trc-text--${tone}`, className)} {...props} />;
}

/** Grand numéro fin en couleur d'accent (« 01 », « 02 »…), réservé aux étapes d'un ordre réel. */
export function StepNumber({ n, size = "md", className }: { n: number; size?: "md" | "sm"; className?: string }) {
  return (
    <span aria-hidden className={cx("trc-step-number", size === "sm" && "trc-step-number--sm", className)}>
      {String(n).padStart(2, "0")}
    </span>
  );
}
