import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "trc-ui/styles.css";
import "./docs.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: { default: "trc-ui", template: "%s · trc-ui" },
  description:
    "Composants React au design « noir profond » : fonds quasi noirs, cartes graphite, titres fins et boutons pilule.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className="trc">{children}</body>
    </html>
  );
}
