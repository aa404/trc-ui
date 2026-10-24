"use client";

import { useState } from "react";
import { LanguageSwitcher, Pagination, Text } from "trc-ui";
import type { Lang } from "@/lib/i18n";

export function PaginationDemo({ lang }: { lang: Lang }) {
  const [page, setPage] = useState(5);
  const en = lang === "en";
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Pagination
        page={page}
        total={20}
        onPageChange={setPage}
        label={en ? "Pagination" : "Pagination"}
        previousLabel={en ? "Previous" : "Précédent"}
        nextLabel={en ? "Next" : "Suivant"}
        pageLabel={(p) => `Page ${p}`}
      />
      <Text size="sm" tone="subtle" aria-live="polite">
        {en ? `Page ${page} of 20` : `Page ${page} sur 20`}
      </Text>
    </div>
  );
}

export function LanguageButtonsDemo({ lang }: { lang: Lang }) {
  const [value, setValue] = useState("fr");
  const names: Record<string, string> = { en: "English", fr: "Français", es: "Español" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <LanguageSwitcher
        label={lang === "en" ? "Language" : "Langue"}
        value={value}
        onChange={setValue}
        languages={Object.entries(names).map(([code, name]) => ({ code, name }))}
      />
      <Text size="sm" tone="subtle" aria-live="polite">
        {names[value]}
      </Text>
    </div>
  );
}
