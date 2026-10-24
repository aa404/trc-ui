import Link from "next/link";
import { PillLink, SiteFooter } from "trc-ui";
import { Logo } from "@/components/logo";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { DOCS_NAV, NPM_URL, REPO_URL } from "@/lib/nav";

const T = {
  en: {
    tagline: "Open source React components in deep black: sober, thin and precise.",
    project: "Project",
    issues: "Report an issue",
    releases: "Releases",
    license: "MIT License",
    rights: "Released under the MIT License.",
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
        ...DOCS_NAV.map((section) => ({
          title: section.title[lang],
          links: section.pages.map((page) => ({ label: page.title[lang], href: localePath(lang, page.href) })),
        })),
        {
          title: t.project,
          links: [
            { label: "GitHub", href: REPO_URL },
            { label: "npm", href: NPM_URL },
            { label: t.releases, href: `${REPO_URL}/releases` },
            { label: t.issues, href: `${REPO_URL}/issues` },
          ],
        },
      ]}
      copyright={`© 2026 trc ui. ${t.rights}`}
      legal={[{ label: t.license, href: `${REPO_URL}/blob/main/LICENSE` }]}
    >
      <PillLink as={Link} href={localePath(lang, "/docs/getting-started/")}>
        {UI[lang].getStarted}
      </PillLink>
    </SiteFooter>
  );
}
