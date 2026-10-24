import Link from "next/link";
import type { ReactNode } from "react";
import { Card, Heading, Text } from "trc-ui";
import { ALL_PAGES } from "@/lib/nav";

/** Gabarit d'une page de doc : titre, chapeau, contenu, puis liens vers les pages précédente et suivante. */
export function DocPage({
  href,
  title,
  lead,
  children,
}: {
  href: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  const index = ALL_PAGES.findIndex((page) => page.href === href);
  const prev = ALL_PAGES[index - 1];
  const next = ALL_PAGES[index + 1];
  return (
    <article className="docs-content">
      <Heading as="h1" size="xl">
        {title}
      </Heading>
      <Text className="docs-lead">{lead}</Text>
      {children}
      <nav className="docs-pager" aria-label="Pages voisines">
        {prev ? (
          <Card as={Link} href={prev.href} interactive padding="sm">
            <span className="docs-pager__label">Précédent</span>
            <span className="docs-pager__title">{prev.title}</span>
          </Card>
        ) : (
          <span />
        )}
        {next && (
          <Card as={Link} href={next.href} interactive padding="sm" className="docs-pager__next">
            <span className="docs-pager__label">Suivant</span>
            <span className="docs-pager__title">{next.title}</span>
          </Card>
        )}
      </nav>
    </article>
  );
}
