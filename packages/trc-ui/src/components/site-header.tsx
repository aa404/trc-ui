"use client";

import { useEffect, useId, useRef, useState, type ElementType, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { ChevronDown, Menu } from "../utils/icons";
import { Drawer } from "./drawer";
import { PillLink } from "./pill";

export type NavLink = {
  label: ReactNode;
  href: string;
  /** Current page: marked with an accent dot. */
  active?: boolean;
};

export type NavMenu = {
  label: ReactNode;
  /** Dropdown items, with an optional short description (no numbers). */
  items: (NavLink & { description?: ReactNode })[];
};

export type NavItem = NavLink | NavMenu;

export type SiteHeaderProps = {
  /** Logo (white), wrapped in a link to `homeHref`. */
  logo: ReactNode;
  /** Accessible name of the logo link, usually the brand name. */
  logoLabel: string;
  homeHref?: string;
  nav?: NavItem[];
  /** Main action, shown as a compact pill (and a large one in the mobile menu). */
  cta?: { label: ReactNode; href: string };
  /** Extra elements on the right on large screens (language switcher…). */
  actions?: ReactNode;
  /** Content added at the bottom of the mobile menu. */
  mobileFooter?: ReactNode;
  /** Router link component (Next.js `Link`…); `<a>` by default. */
  linkAs?: ElementType;
  /** Scroll offset (px) from which the bar becomes blurred graphite. */
  scrollThreshold?: number;
  menuLabel?: string;
  closeLabel?: string;
  className?: string;
};

const isMenu = (item: NavItem): item is NavMenu => "items" in item;

/**
 * Floating header: transparent over the hero at the top of the page, it becomes a blurred
 * graphite bar as soon as the page scrolls. Dropdowns on large screens, side panel on mobile.
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
  closeLabel = "Close",
  className,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Read after hydration: same render on the server and on the client.
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
 * Dropdown menu (large screens): opens on hover or click, closes on leave, with Escape,
 * when keyboard focus leaves the menu, or after a choice.
 */
function NavDropdown({ menu, linkAs: LinkTag }: { menu: NavMenu; linkAs: ElementType }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const button = useRef<HTMLButtonElement>(null);
  // Opened by hovering: the click that usually follows must not close it right away.
  const openedByHover = useRef(false);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  // Short delay: the pointer may cross the gap between the button and the panel.
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
        onClick={() => {
          if (open && openedByHover.current) openedByHover.current = false;
          else setOpen((o) => !o);
        }}
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

/** Mobile menu: a `Drawer` holding the navigation, the main action and the extra content. */
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
  return (
    <Drawer open={open} onClose={onClose} title={title} closeLabel={closeLabel} className="trc-mobile-menu">
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
        <PillLink as={LinkTag} href={cta.href} onClick={onClose} className="trc-mobile-menu__cta">
          {cta.label}
        </PillLink>
      )}
      {footer != null && <div className="trc-mobile-menu__footer">{footer}</div>}
    </Drawer>
  );
}
