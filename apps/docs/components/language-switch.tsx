"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, UI, localePath, splitPath } from "@/lib/i18n";

/** Bascule EN / FR : mène à la même page dans l'autre langue. */
export function LanguageSwitch() {
  const { lang, path } = splitPath(usePathname());
  return (
    <nav className="docs-lang" aria-label={UI[lang].language}>
      {LANGS.map((l) => (
        <Link
          key={l}
          href={localePath(l, path)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className="docs-lang__link"
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
