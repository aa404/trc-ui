import type { ReactNode } from "react";
import { DocsHeader } from "@/components/docs-header";
import { DocsSidebar } from "@/components/docs-sidebar";
import type { Lang } from "@/lib/i18n";

/** Cadre des pages de doc : en-tête, barre latérale et contenu. */
export function DocsFrame({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <>
      <DocsHeader lang={lang} />
      <div className="docs-shell">
        <DocsSidebar lang={lang} />
        <main>{children}</main>
      </div>
    </>
  );
}
