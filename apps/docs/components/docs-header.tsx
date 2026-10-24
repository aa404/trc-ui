"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader, type NavItem } from "trc-ui";
import { LanguageSwitch } from "@/components/language-switch";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { DOCS_NAV, REPO_URL } from "@/lib/nav";

/** Site header: docs sections become dropdown menus (and groups in the mobile menu). */
export function DocsHeader({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const nav: NavItem[] = DOCS_NAV.map((section) => ({
    label: section.title[lang],
    items: section.pages.map((page) => {
      const href = localePath(lang, page.href);
      return { label: page.title[lang], href, active: pathname === href };
    }),
  }));
  return (
    <SiteHeader
      logo={<span className="docs-logo">trc</span>}
      logoLabel={UI[lang].home}
      homeHref={localePath(lang, "/")}
      linkAs={Link}
      nav={nav}
      actions={<LanguageSwitch />}
      mobileFooter={<LanguageSwitch />}
      cta={{ label: "GitHub", href: REPO_URL }}
      menuLabel={UI[lang].menu}
      closeLabel={UI[lang].close}
    />
  );
}
