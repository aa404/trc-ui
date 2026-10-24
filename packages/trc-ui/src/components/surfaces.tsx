import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

type Polymorphic<C extends ElementType, P> = P & { as?: C } & Omit<ComponentPropsWithoutRef<C>, "as" | keyof P>;

export type ContainerProps<C extends ElementType = "div"> = Polymorphic<
  C,
  {
    /** `default` : 1280 px, pour le texte et les grilles ; `wide` : 1600 px, pour les cartes pleine largeur. */
    size?: "default" | "wide" | "narrow";
  }
>;

/** Largeur maximale centrée, avec des marges latérales qui grandissent avec l'écran. */
export function Container<C extends ElementType = "div">({ as, size = "default", className, ...props }: ContainerProps<C>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={cx("trc-container", size !== "default" && `trc-container--${size}`, className)} {...props} />;
}

export type SectionProps<C extends ElementType = "section"> = Polymorphic<
  C,
  {
    /** Espacement vertical. */
    spacing?: "sm" | "md" | "lg" | "none";
    /**
     * Carte en retrait des bords de l'écran (effet « magazine ») : fond graphite et coins arrondis,
     * pour les bandeaux, les appels à l'action, les héros.
     */
    inset?: boolean;
  }
>;

/** Bloc vertical d'une page. Avec `inset`, il devient une grande carte arrondie à quelques pixels des bords. */
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
    /** `alt` : un gris un peu plus clair, pour distinguer deux blocs parallèles. */
    tone?: "default" | "alt";
    padding?: "none" | "sm" | "md" | "lg";
    /** S'éclaircit au survol (cartes cliquables : liens, boutons). */
    interactive?: boolean;
    /** Icône décorative en filigrane : très grande, trait fin, à demi sortie du coin ; s'éveille au survol. */
    watermark?: ReactNode;
  }
>;

/** Carte graphite, coins arrondis, sans ombre : la profondeur vient des écarts de gris. */
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
