import { Heading } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { DocPage } from "@/components/doc-page";
import { InstallTabs } from "@/components/install-tabs";
import type { Lang } from "@/lib/i18n";

export const gettingStartedTitle = { en: "Installation", fr: "Installation" };

const LAYOUT = `
import "trc-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="trc">{children}</body>
    </html>
  );
}`;

const FONT_NEXT = `
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-montserrat" });

// <html className={montserrat.variable}>`;

const FONT_CSS = `:root {
  --trc-font: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
}`;

const FONT_HTML = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />`;

const FIRST = {
  en: `
import { Heading, PillButton, Text } from "trc-ui";

export function Welcome() {
  return (
    <section>
      <Heading as="h1" size="display">Welcome to *deep black.*</Heading>
      <Text size="lg">The words between asterisks take the accent color.</Text>
      <PillButton solid>Get started</PillButton>
    </section>
  );
}`,
  fr: `
import { Heading, PillButton, Text } from "trc-ui";

export function Welcome() {
  return (
    <section>
      <Heading as="h1" size="display">Bienvenue en *noir profond.*</Heading>
      <Text size="lg">Le passage entre astérisques prend la couleur d'accent.</Text>
      <PillButton solid>Commencer</PillButton>
    </section>
  );
}`,
};

const ROUTER = {
  en: `
import Link from "next/link";
import { PillLink, SiteHeader } from "trc-ui";

<PillLink as={Link} href="/pricing">See pricing</PillLink>
<SiteHeader linkAs={Link} logo={<Logo />} logoLabel="Home" nav={nav} />`,
  fr: `
import Link from "next/link";
import { PillLink, SiteHeader } from "trc-ui";

<PillLink as={Link} href="/tarifs">Voir les tarifs</PillLink>
<SiteHeader linkAs={Link} logo={<Logo />} logoLabel="Accueil" nav={nav} />`,
};

export function GettingStartedContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/getting-started/"
      title={gettingStartedTitle[lang]}
      lead={
        en
          ? "trc-ui installs with a single command and works with React 18 or later: Next.js, Vite, or any other tool."
          : "trc-ui s'installe en une commande et fonctionne avec React 18 ou plus récent : Next.js, Vite, ou tout autre outil."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Install the *package*" : "Installer le *paquet*"}
      </Heading>
      <InstallTabs lang={lang} />
      {en ? (
        <p>
          The package only depends on <code>react</code> and <code>react-dom</code>. It ships its components as ESM and
          CommonJS, its TypeScript types, and a single stylesheet.
        </p>
      ) : (
        <p>
          Le paquet ne dépend que de <code>react</code> et <code>react-dom</code>. Il fournit ses composants en ESM et
          en CommonJS, ses types TypeScript, et une feuille de style unique.
        </p>
      )}

      <Heading as="h2" size="lg">
        {en ? "Import the *styles*" : "Importer les *styles*"}
      </Heading>
      {en ? (
        <p>
          Import the stylesheet once, at the root of your app, then add the <code>trc</code> class to{" "}
          <code>&lt;body&gt;</code>: it sets the near-black background, the text color and the font.
        </p>
      ) : (
        <p>
          Importez la feuille de style une seule fois, à la racine de l&apos;application, puis posez la classe{" "}
          <code>trc</code> sur <code>&lt;body&gt;</code> : elle donne le fond quasi noir, la couleur du texte et la
          police.
        </p>
      )}
      <CodeBlock title="app/layout.tsx" code={LAYOUT} />

      <Heading as="h2" size="lg">
        {en ? "Load the *font*" : "Charger la *police*"}
      </Heading>
      {en ? (
        <p>
          The thin headings rely on Montserrat (weights 300, 400 and 500). The font is not bundled with the package:
          load it, then pass it to trc-ui through the <code>--trc-font</code> variable.
        </p>
      ) : (
        <p>
          Les titres fins reposent sur Montserrat (graisses 300, 400 et 500). La police n&apos;est pas incluse dans le
          paquet : chargez-la, puis indiquez-la à trc-ui avec la variable <code>--trc-font</code>.
        </p>
      )}
      <CodeBlock title="Next.js : app/layout.tsx" code={FONT_NEXT} />
      <CodeBlock title="globals.css" lang="css" code={FONT_CSS} />
      <p>
        {en
          ? "Without Next.js, a Google Fonts tag is enough; trc-ui then uses “Montserrat” by default."
          : "Sans Next.js, une balise Google Fonts suffit ; trc-ui utilise alors « Montserrat » par défaut."}
      </p>
      <CodeBlock lang="html" title="index.html" code={FONT_HTML} />

      <Heading as="h2" size="lg">
        {en ? "Your first *component*" : "Premier *composant*"}
      </Heading>
      <CodeBlock code={FIRST[lang]} />

      <Heading as="h2" size="lg">
        {en ? "With a *router*" : "Avec un *routeur*"}
      </Heading>
      {en ? (
        <p>
          Links accept your router&apos;s link component: <code>as</code> on <code>PillLink</code> and <code>Card</code>
          , <code>linkAs</code> on <code>SiteHeader</code> and <code>SiteFooter</code>.
        </p>
      ) : (
        <p>
          Les liens acceptent le composant de lien de votre routeur : <code>as</code> sur <code>PillLink</code> et{" "}
          <code>Card</code>, <code>linkAs</code> sur <code>SiteHeader</code> et <code>SiteFooter</code>.
        </p>
      )}
      <CodeBlock code={ROUTER[lang]} />
      {en ? (
        <p>
          Interactive components already carry the <code>&quot;use client&quot;</code> directive: they work as-is in the
          Next.js App Router.
        </p>
      ) : (
        <p>
          Les composants interactifs portent déjà la directive <code>&quot;use client&quot;</code> : ils
          s&apos;utilisent tels quels dans l&apos;App Router de Next.js.
        </p>
      )}
    </DocPage>
  );
}
