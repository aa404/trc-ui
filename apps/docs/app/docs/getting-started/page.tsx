import type { Metadata } from "next";
import { Heading } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { DocPage } from "@/components/doc-page";

export const metadata: Metadata = { title: "Installation" };

export default function GettingStartedPage() {
  return (
    <DocPage
      href="/docs/getting-started/"
      title="Installation"
      lead="trc-ui s'installe en une commande et fonctionne avec React 18 ou plus récent : Next.js, Vite, ou tout autre outil."
    >
      <Heading as="h2" size="lg">
        Installer le *paquet*
      </Heading>
      <CodeBlock lang="bash" code="npm install trc-ui" />
      <p>
        Le paquet ne dépend que de <code>react</code> et <code>react-dom</code>. Il fournit ses composants en ESM et en
        CommonJS, ses types TypeScript, et une feuille de style unique.
      </p>

      <Heading as="h2" size="lg">
        Importer les *styles*
      </Heading>
      <p>
        Importez la feuille de style une seule fois, à la racine de l&apos;application, puis posez la classe{" "}
        <code>trc</code> sur <code>&lt;body&gt;</code> : elle donne le fond quasi noir, la couleur du texte et la
        police.
      </p>
      <CodeBlock
        title="app/layout.tsx"
        code={`
import "trc-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="trc">{children}</body>
    </html>
  );
}`}
      />

      <Heading as="h2" size="lg">
        Charger la *police*
      </Heading>
      <p>
        Les titres fins reposent sur Montserrat (graisses 300, 400 et 500). La police n&apos;est pas incluse dans le
        paquet : chargez-la, puis indiquez-la à trc-ui avec la variable <code>--trc-font</code>.
      </p>
      <CodeBlock
        title="Next.js : app/layout.tsx"
        code={`
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-montserrat" });

// <html className={montserrat.variable}>`}
      />
      <CodeBlock
        title="globals.css"
        lang="css"
        code={`:root {\n  --trc-font: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;\n}`}
      />
      <p>Sans Next.js, une balise Google Fonts suffit ; trc-ui utilise alors « Montserrat » par défaut.</p>
      <CodeBlock
        lang="html"
        title="index.html"
        code={`<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />`}
      />

      <Heading as="h2" size="lg">
        Premier *composant*
      </Heading>
      <CodeBlock
        code={`
import { Heading, PillButton, Text } from "trc-ui";

export function Welcome() {
  return (
    <section>
      <Heading as="h1" size="display">Bienvenue en *noir profond.*</Heading>
      <Text size="lg">Le passage entre astérisques prend la couleur d'accent.</Text>
      <PillButton solid>Commencer</PillButton>
    </section>
  );
}`}
      />

      <Heading as="h2" size="lg">
        Avec un *routeur*
      </Heading>
      <p>
        Les liens acceptent le composant de lien de votre routeur : <code>as</code> sur <code>PillLink</code> et{" "}
        <code>Card</code>, <code>linkAs</code> sur <code>SiteHeader</code> et <code>SiteFooter</code>.
      </p>
      <CodeBlock
        code={`
import Link from "next/link";
import { PillLink, SiteHeader } from "trc-ui";

<PillLink as={Link} href="/tarifs">Voir les tarifs</PillLink>
<SiteHeader linkAs={Link} logo={<Logo />} logoLabel="Accueil" nav={nav} />`}
      />
      <p>
        Les composants interactifs portent déjà la directive <code>&quot;use client&quot;</code> : ils s&apos;utilisent
        tels quels dans l&apos;App Router de Next.js.
      </p>
    </DocPage>
  );
}
