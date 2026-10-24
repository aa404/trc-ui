"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/nav";

/** Barre latérale (grand écran) : sections de la doc, page courante en accent. */
export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      {DOCS_NAV.map((section) => (
        <div key={section.title} className="docs-sidebar__section">
          <p className="docs-sidebar__title">{section.title}</p>
          <ul className="docs-sidebar__list">
            {section.pages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  aria-current={pathname === page.href ? "page" : undefined}
                  className="docs-sidebar__link"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
