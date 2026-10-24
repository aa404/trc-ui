import Link from "next/link";
import type { ReactNode } from "react";
import { Card, Heading, Text } from "trc-ui";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { ALL_PAGES } from "@/lib/nav";

/** Docs page template: title, lead, content, then links to the previous and next pages. */
export function DocPage({
  lang,
  href,
  title,
  lead,
  children,
}: {
  lang: Lang;
  href: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  const index = ALL_PAGES.findIndex((page) => page.href === href);
  const prev = ALL_PAGES[index - 1];
  const next = ALL_PAGES[index + 1];
  const t = UI[lang];
  return (
    <article className="docs-content">
      <Heading as="h1" size="xl">
        {title}
      </Heading>
      <Text className="docs-lead">{lead}</Text>
      {children}
      <nav className="docs-pager" aria-label={t.adjacent}>
        {prev ? (
          <Card as={Link} href={localePath(lang, prev.href)} interactive padding="sm">
            <span className="docs-pager__label">{t.previous}</span>
            <span className="docs-pager__title">{prev.title[lang]}</span>
          </Card>
        ) : (
          <span />
        )}
        {next && (
          <Card as={Link} href={localePath(lang, next.href)} interactive padding="sm" className="docs-pager__next">
            <span className="docs-pager__label">{t.next}</span>
            <span className="docs-pager__title">{next.title[lang]}</span>
          </Card>
        )}
      </nav>
    </article>
  );
}
