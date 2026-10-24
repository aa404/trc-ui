"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { DOCS_NAV } from "@/lib/nav";

/** Sidebar (large screens): docs sections, current page in the accent color. */
export function DocsSidebar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  return (
    <nav className="docs-sidebar" aria-label={UI[lang].docs}>
      {DOCS_NAV.map((section) => (
        <div key={section.title.en} className="docs-sidebar__section">
          <p className="docs-sidebar__title">{section.title[lang]}</p>
          <ul className="docs-sidebar__list">
            {section.pages.map((page) => {
              const href = localePath(lang, page.href);
              return (
                <li key={page.href}>
                  <Link
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    className="docs-sidebar__link"
                  >
                    {page.title[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
