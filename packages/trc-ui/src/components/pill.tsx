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
  /** White background: the main action of a screen. */
  solid?: boolean;
  /** Compact version (header, toolbars). */
  size?: "md" | "sm";
  /** Replaces the dot's arrow (for instance a left arrow for "Back"). */
  icon?: ReactNode;
};

const pillClass = ({ solid, size }: PillStyle, className?: string) =>
  cx("trc-pill", size === "sm" && "trc-pill--sm", solid && "trc-pill--solid", className);

/** The dot and the fill are one shape: it stretches on hover without a visible circle. */
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
    /** Replaces the icon with a spinner and disables the button. */
    loading?: boolean;
  };

/** Pill button: thin border, accent dot with an arrow that stretches on hover. */
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
  /** Router link component (Next.js or React Router `Link`…); `<a>` by default. */
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, "as" | keyof PillStyle>;

/** Same pill as a link. With a router: `<PillLink as={Link} href="/">`. */
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
