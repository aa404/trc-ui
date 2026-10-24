import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../utils/cx";
import { ArrowRight, Spinner } from "../utils/icons";

type PillStyle = {
  /** Fond blanc : l'action principale d'un écran. */
  solid?: boolean;
  /** Version compacte (en-tête, barres d'outils). */
  size?: "md" | "sm";
  /** Remplace la flèche de la pastille (par exemple une flèche vers la gauche pour « Retour »). */
  icon?: ReactNode;
};

const pillClass = ({ solid, size }: PillStyle, className?: string) =>
  cx("trc-pill", size === "sm" && "trc-pill--sm", solid && "trc-pill--solid", className);

/** La pastille et le remplissage sont une seule forme : elle s'étire au survol sans laisser voir de rond. */
function PillInner({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <>
      <span aria-hidden className="trc-pill__fill" />
      <span aria-hidden className="trc-pill__icon">
        {icon ?? <ArrowRight />}
      </span>
      <span className="trc-pill__label">{children}</span>
    </>
  );
}

export type PillButtonProps = ComponentPropsWithoutRef<"button"> &
  PillStyle & {
    /** Remplace l'icône par un indicateur de chargement et désactive le bouton. */
    loading?: boolean;
  };

/** Bouton pilule : bordure fine, pastille d'accent avec flèche, qui s'étire au survol. */
export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(function PillButton(
  { solid, size = "md", icon, loading = false, disabled, type = "button", className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={pillClass({ solid, size }, className)}
      {...props}
    >
      <PillInner icon={loading ? <Spinner className="trc-spin" /> : icon}>{children}</PillInner>
    </button>
  );
});

export type PillLinkProps<C extends ElementType = "a"> = PillStyle & {
  /** Composant de lien du routeur (`Link` de Next.js, de React Router…) ; `<a>` par défaut. */
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, "as" | keyof PillStyle>;

/** Même pilule pour un lien. Avec un routeur : `<PillLink as={Link} href="/">`. */
export const PillLink = forwardRef(function PillLink(
  { as, solid, size = "md", icon, className, children, ...props }: PillLinkProps<ElementType>,
  ref: Ref<HTMLAnchorElement>,
) {
  const Tag: ElementType = as ?? "a";
  return (
    <Tag ref={ref} className={pillClass({ solid, size }, className)} {...props}>
      <PillInner icon={icon}>{children}</PillInner>
    </Tag>
  );
}) as <C extends ElementType = "a">(props: PillLinkProps<C> & { ref?: Ref<HTMLAnchorElement> }) => ReactNode;
