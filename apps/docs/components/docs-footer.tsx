import Link from "next/link";
import { PillLink, SiteFooter } from "trc-ui";
import { Logo } from "@/components/logo";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { AUTHOR, COMPONENT_SECTIONS, DOCS_NAV, NPM_URL, REPO_URL } from "@/lib/nav";

const T = {
  en: {
    tagline: "Open source React components in deep black: sober, thin and precise.",
    project: "Project",
    issues: "Report an issue",
    releases: "Releases",
    license: "MIT License",
    rights: "Released under the MIT License.",
    by: "by",
    siteMap: "Site map",
    legal: "License",
  },
  fr: {
    tagline: "Des composants React open source en noir profond : sobres, fins et précis.",
    project: "Projet",
    issues: "Signaler un problème",
    releases: "Versions",
    license: "Licence MIT",
    rights: "Publié sous licence MIT.",
    by: "par",
    siteMap: "Plan du site",
    legal: "Licence",
  },
};

/** Site footer: brand and call to action, docs sections, project links. */
export function DocsFooter({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <SiteFooter
      logo={<Logo />}
      logoLabel={UI[lang].home}
      homeHref={localePath(lang, "/")}
      tagline={t.tagline}
      linkAs={Link}
      columnsLabel={t.siteMap}
      legalLabel={t.legal}
      columns={[
        {
          title: DOCS_NAV[0]!.title[lang],
          links: DOCS_NAV[0]!.pages.map((page) => ({ label: page.title[lang], href: localePath(lang, page.href) })),
        },
        {
          title: UI[lang].components,
          links: COMPONENT_SECTIONS.map((section) => ({
            label: section.title[lang],
            href: `${localePath(lang, "/docs/components/")}#${section.id}`,
          })),
        },
        {
          title: t.project,
          links: [
            { label: "GitHub", href: REPO_URL },
            { label: "npm", href: NPM_URL },
            { label: t.releases, href: `${REPO_URL}/releases` },
            { label: t.issues, href: `${REPO_URL}/issues` },
            { label: AUTHOR.name, href: AUTHOR.url },
          ],
        },
      ]}
      copyright={
        <>
          © 2026 trc ui, {t.by}{" "}
          <a href={AUTHOR.url} className="docs-footer__author">
            {AUTHOR.name}
          </a>
          . {t.rights}
        </>
      }
      legal={[{ label: t.license, href: `${REPO_URL}/blob/main/LICENSE` }]}
    >
      <PillLink as={Link} href={localePath(lang, "/docs/getting-started/")}>
        {UI[lang].getStarted}
      </PillLink>
    </SiteFooter>
  );
}
