"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader, type NavItem } from "trc-ui";
import { DOCS_NAV, REPO_URL } from "@/lib/nav";

/** En-tête du site : les sections de la doc deviennent des menus déroulants (et des groupes dans le menu mobile). */
export function DocsHeader() {
  const pathname = usePathname();
  const nav: NavItem[] = DOCS_NAV.map((section) => ({
    label: section.title,
    items: section.pages.map((page) => ({ label: page.title, href: page.href, active: pathname === page.href })),
  }));
  return (
    <SiteHeader
      logo={<span className="docs-logo">trc</span>}
      logoLabel="trc-ui, accueil"
      linkAs={Link}
      nav={nav}
      cta={{ label: "GitHub", href: REPO_URL }}
    />
  );
}
