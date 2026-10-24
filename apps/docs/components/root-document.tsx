import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import { UI, type Lang } from "@/lib/i18n";
import "trc-ui/styles.css";
import "@/app/docs.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-montserrat" });

export const rootMetadata = (lang: Lang): Metadata => ({
  title: { default: "trc-ui", template: "%s · trc-ui" },
  description: UI[lang].description,
  alternates: { languages: { en: "/", fr: "/fr/" } },
});

/** Document HTML commun aux deux langues : chacune a son propre gabarit racine, pour un `<html lang>` juste. */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={montserrat.variable}>
      <body className="trc">{children}</body>
    </html>
  );
}
