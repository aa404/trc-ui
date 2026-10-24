"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "trc-ui";
import { UI, localePath, splitPath } from "@/lib/i18n";

/** EN / FR switch of the site, built with trc-ui's LanguageSwitcher: same page in the other language. */
export function LanguageSwitch() {
  const { lang, path } = splitPath(usePathname());
  return (
    <LanguageSwitcher
      label={UI[lang].language}
      value={lang}
      linkAs={Link}
      languages={[
        { code: "en", name: "English", href: localePath("en", path) },
        { code: "fr", name: "Français", href: localePath("fr", path) },
      ]}
    />
  );
}
