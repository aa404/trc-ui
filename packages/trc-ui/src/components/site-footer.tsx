import type { ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

export type FooterLink = { label: ReactNode; href: string };

export type SiteFooterProps = {
  /** Logo (white), wrapped in a link to `homeHref`. */
  logo?: ReactNode;
  logoLabel?: string;
  homeHref?: string;
  /** Short sentence under the logo. */
  tagline?: ReactNode;
  /** Under the sentence: a pill, a contact… */
  children?: ReactNode;
  /** Site map in columns, each with a spaced small-caps title. */
  columns?: { title: ReactNode; links: FooterLink[] }[];
  /** Accessible name of the site map. */
  columnsLabel?: string;
  /** Bottom line (copyright, credits…). */
  copyright?: ReactNode;
  /** Legal links, aligned right on large screens. */
  legal?: FooterLink[];
  legalLabel?: string;
  /** Router link component (Next.js `Link`…); `<a>` by default. */
  linkAs?: ElementType;
  className?: string;
};

/** Graphite card footer: brand and call to action, site map in columns, legal links. */
export function SiteFooter({
  logo,
  logoLabel,
  homeHref = "/",
  tagline,
  children,
  columns = [],
  columnsLabel = "Site map",
  copyright,
  legal = [],
  legalLabel = "Legal",
  linkAs: LinkTag = "a",
  className,
}: SiteFooterProps) {
  return (
    <footer className={cx("trc-footer", className)}>
      <div className="trc-footer__card">
        <div className="trc-footer__main">
          <div className="trc-footer__brand">
            {logo != null && (
              <LinkTag href={homeHref} aria-label={logoLabel} className="trc-footer__logo">
                {logo}
              </LinkTag>
            )}
            {tagline != null && <p className="trc-footer__tagline">{tagline}</p>}
            {children != null && <div className="trc-footer__extra">{children}</div>}
          </div>

          {columns.length > 0 && (
            <nav className="trc-footer__columns" aria-label={columnsLabel}>
              {columns.map((col, i) => (
                <div key={i}>
                  <p className="trc-footer__heading">{col.title}</p>
                  <ul className="trc-footer__list">
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <LinkTag href={link.href} className="trc-footer__link">
                          {link.label}
                        </LinkTag>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>

        {(copyright != null || legal.length > 0) && (
          <div className="trc-footer__bottom">
            {copyright != null && <p className="trc-footer__copyright">{copyright}</p>}
            {legal.length > 0 && (
              <nav aria-label={legalLabel} className="trc-footer__legal">
                {legal.map((link, i) => (
                  <LinkTag key={i} href={link.href} className="trc-footer__legal-link">
                    {link.label}
                  </LinkTag>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
