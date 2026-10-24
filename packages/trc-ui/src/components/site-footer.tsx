import type { ElementType, ReactNode } from "react";
import { cx } from "../utils/cx";

export type FooterLink = { label: ReactNode; href: string };

export type SiteFooterProps = {
  /** Logo (blanc), placé dans un lien vers `homeHref`. */
  logo?: ReactNode;
  logoLabel?: string;
  homeHref?: string;
  /** Phrase courte sous le logo. */
  tagline?: ReactNode;
  /** Sous la phrase : une pilule, un contact… */
  children?: ReactNode;
  /** Plan du site en colonnes, avec un titre en petites capitales espacées. */
  columns?: { title: ReactNode; links: FooterLink[] }[];
  /** Nom accessible du plan du site. */
  columnsLabel?: string;
  /** Mentions de bas de page (droits, fabrication…). */
  copyright?: ReactNode;
  /** Liens légaux, alignés à droite sur grand écran. */
  legal?: FooterLink[];
  legalLabel?: string;
  /** Composant de lien du routeur (`Link` de Next.js…) ; `<a>` par défaut. */
  linkAs?: ElementType;
  className?: string;
};

/** Pied de page en carte graphite : marque et appel à l'action, plan du site en colonnes, liens légaux. */
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
