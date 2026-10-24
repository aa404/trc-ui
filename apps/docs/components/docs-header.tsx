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
  const link = (path: string) => {
    const href = localePath(lang, path);
    return { href, active: pathname === href };
  };
  const [start] = DOCS_NAV;
  // Getting started as a dropdown; components through their overview page; the colors generator as a direct link.
  const nav: NavItem[] = [
    {
      label: start!.title[lang],
      items: start!.pages.map((page) => ({ label: page.title[lang], ...link(page.href) })),
    },
    { label: UI[lang].components, ...link("/docs/components/") },
    { label: UI[lang].colorsGenerator, ...link("/docs/colors-generator/") },
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
