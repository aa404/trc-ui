"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader, type NavItem } from "trc-ui";
import { LanguageSwitch } from "@/components/language-switch";
import { Logo } from "@/components/logo";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { DOCS_NAV, REPO_URL } from "@/lib/nav";

/** Site header: docs sections become dropdown menus (and groups in the mobile menu). */
export function DocsHeader({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const generator = localePath(lang, "/docs/colors-generator/");
  const nav: NavItem[] = [
    ...DOCS_NAV.map((section) => ({
      label: section.title[lang],
      items: section.pages.map((page) => {
        const href = localePath(lang, page.href);
        return { label: page.title[lang], href, active: pathname === href };
      }),
    })),
    // Direct link to the most used tool, third in the menu.
    { label: UI[lang].colorsGenerator, href: generator, active: pathname === generator },
  ];
  return (
    <SiteHeader
      logo={<Logo />}
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
