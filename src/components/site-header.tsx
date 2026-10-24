import { useEffect, useId, useRef, useState, type ElementType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../hooks/use-modal";
import { cx } from "../utils/cx";
import { ChevronDown, Close, Menu } from "../utils/icons";
import { PillLink } from "./pill";

export type NavLink = {
  label: ReactNode;
  href: string;
  /** Page courante : marquée d'un point d'accent. */
  active?: boolean;
};

export type NavMenu = {
  label: ReactNode;
  /** Entrées du menu déroulant, avec une courte description facultative (sans numéro). */
  items: (NavLink & { description?: ReactNode })[];
};

export type NavItem = NavLink | NavMenu;

export type SiteHeaderProps = {
  /** Logo (blanc), placé dans un lien vers `homeHref`. */
  logo: ReactNode;
  /** Nom accessible du lien du logo, souvent le nom de la marque. */
  logoLabel: string;
  homeHref?: string;
  nav?: NavItem[];
  /** Action principale, affichée en pilule compacte (et en grand dans le menu mobile). */
  cta?: { label: ReactNode; href: string };
  /** Éléments supplémentaires à droite sur grand écran (sélecteur de langue…). */
  actions?: ReactNode;
  /** Contenu ajouté au bas du menu mobile. */
  mobileFooter?: ReactNode;
  /** Composant de lien du routeur (`Link` de Next.js…) ; `<a>` par défaut. */
  linkAs?: ElementType;
  /** Défilement (px) à partir duquel la barre devient graphite floutée. */
  scrollThreshold?: number;
  menuLabel?: string;
  closeLabel?: string;
  className?: string;
};

const isMenu = (item: NavItem): item is NavMenu => "items" in item;

/**
 * En-tête flottant : transparent sur le héros en haut de page, il devient une barre graphite
 * floutée dès que la page défile. Menus déroulants sur grand écran, panneau latéral sur mobile.
 */
export function SiteHeader({
  logo,
  logoLabel,
  homeHref = "/",
  nav = [],
  cta,
  actions,
  mobileFooter,
  linkAs: LinkTag = "a",
  scrollThreshold = 24,
  menuLabel = "Menu",
  closeLabel = "Fermer",
  className,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Lu après l'hydratation : même rendu côté serveur et côté client.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > scrollThreshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [scrollThreshold]);

  return (
    <header className={cx("trc-header", className)}>
      <div className={cx("trc-header__bar", scrolled && "trc-header__bar--scrolled")}>
        <LinkTag href={homeHref} aria-label={logoLabel} className="trc-header__logo">
          {logo}
        </LinkTag>

        {nav.length > 0 && (
          <nav className="trc-header__nav">
            {nav.map((item, i) =>
              isMenu(item) ? (
                <NavDropdown key={i} menu={item} linkAs={LinkTag} />
              ) : (
                <LinkTag
                  key={i}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={cx("trc-header__link", item.active && "trc-header__link--active")}
                >
                  {item.label}
                </LinkTag>
              ),
            )}
          </nav>
        )}

        <div className="trc-header__end">
          {actions && <div className="trc-header__actions">{actions}</div>}
          {cta && (
            <PillLink as={LinkTag} href={cta.href} size="sm" className="trc-header__cta">
              {cta.label}
            </PillLink>
          )}
          {(nav.length > 0 || cta || mobileFooter) && (
            <button
              type="button"
              className="trc-header__burger"
              aria-label={menuLabel}
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          )}
        </div>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        nav={nav}
        cta={cta}
        footer={mobileFooter}
        linkAs={LinkTag}
        title={menuLabel}
        closeLabel={closeLabel}
      />
    </header>
  );
}

/**
 * Menu déroulant (grand écran) : s'ouvre au survol ou au clic, se ferme en sortant,
 * avec Échap, en quittant le menu au clavier ou après un choix.
 */
function NavDropdown({ menu, linkAs: LinkTag }: { menu: NavMenu; linkAs: ElementType }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const button = useRef<HTMLButtonElement>(null);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Petit délai : le pointeur peut traverser l'espace entre le bouton et le panneau.
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      className="trc-dropdown"
      onMouseEnter={show}
      onMouseLeave={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cx("trc-header__link", "trc-dropdown__trigger", open && "trc-dropdown__trigger--open")}
      >
        {menu.label}
        <ChevronDown className="trc-dropdown__chevron" />
      </button>
      <div id={id} className={cx("trc-dropdown__panel", open && "trc-dropdown__panel--open")}>
        <ul className="trc-dropdown__list">
          {menu.items.map((item, i) => (
            <li key={i}>
              <LinkTag
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="trc-dropdown__item"
              >
                <span className="trc-dropdown__label">{item.label}</span>
                {item.description != null && <span className="trc-dropdown__description">{item.description}</span>}
              </LinkTag>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Panneau latéral du menu mobile, rendu dans `document.body` : la barre floutée de l'en-tête
 * (`backdrop-filter`) enfermerait sinon un élément `fixed` dans ses propres limites.
 */
function MobileMenu({
  open,
  onClose,
  nav,
  cta,
  footer,
  linkAs: LinkTag,
  title,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  nav: NavItem[];
  cta?: SiteHeaderProps["cta"];
  footer?: ReactNode;
  linkAs: ElementType;
  title: string;
  closeLabel: string;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useModal(open, panel, onClose);

  if (!mounted) return null;
  return createPortal(
    <div className={cx("trc-drawer", open && "trc-drawer--open")} aria-hidden={!open}>
      <div className="trc-drawer__overlay" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="trc-drawer__panel"
      >
        <div className="trc-drawer__head">
          <p id={titleId} className="trc-drawer__title">
            {title}
          </p>
          <button type="button" className="trc-drawer__close" aria-label={closeLabel} onClick={onClose}>
            <Close />
          </button>
        </div>
        <nav className="trc-mobile-nav">
          {nav.map((item, i) =>
            isMenu(item) ? (
              <div key={i} className="trc-mobile-nav__group">
                <p className="trc-mobile-nav__heading">{item.label}</p>
                <ul className="trc-mobile-nav__sub">
                  {item.items.map((sub, j) => (
                    <li key={j}>
                      <LinkTag
                        href={sub.href}
                        aria-current={sub.active ? "page" : undefined}
                        onClick={onClose}
                        className="trc-mobile-nav__sublink"
                      >
                        {sub.label}
                      </LinkTag>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <LinkTag
                key={i}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                onClick={onClose}
                className={cx("trc-mobile-nav__link", item.active && "trc-mobile-nav__link--active")}
              >
                {item.label}
              </LinkTag>
            ),
          )}
        </nav>
        {cta && (
          <PillLink as={LinkTag} href={cta.href} onClick={onClose} className="trc-drawer__cta">
            {cta.label}
          </PillLink>
        )}
        {footer != null && <div className="trc-drawer__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
