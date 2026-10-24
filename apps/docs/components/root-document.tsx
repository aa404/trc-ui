import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "trc-ui";
import { BASE_PATH } from "@/lib/asset";
import { UI, type Lang } from "@/lib/i18n";
import "trc-ui/styles.css";
import "@/app/docs.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-montserrat" });

export const rootMetadata = (lang: Lang): Metadata => ({
  title: { default: "trc-ui", template: "%s · trc-ui" },
  description: UI[lang].description,
  alternates: { languages: { en: `${BASE_PATH}/`, fr: `${BASE_PATH}/fr/` } },
});

/** HTML document shared by both languages: each has its own root layout, for a correct `<html lang>`. */
export function RootDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} className={montserrat.variable}>
      <body className="trc">
        {children}
        <Toaster label={UI[lang].notifications} closeLabel={UI[lang].close} />
      </body>
    </html>
  );
}
