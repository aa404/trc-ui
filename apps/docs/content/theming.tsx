import type { CSSProperties } from "react";
import { Heading, PillButton, StepNumber } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { TokenTable, type TokenRow } from "@/components/token-table";
import type { Lang } from "@/lib/i18n";

export const themingTitle = { en: "Theming", fr: "Thème" };

const COLORS: TokenRow[] = [
  { name: "--trc-bg", value: "#0b0c0f", swatch: true, description: { en: "Page background.", fr: "Fond de la page." } },
  {
    name: "--trc-surface",
    value: "#151618",
    swatch: true,
    description: { en: "Cards, footer, panels.", fr: "Cartes, pied de page, panneaux." },
  },
  {
    name: "--trc-surface-raised",
    value: "#1b1c1f",
    swatch: true,
    description: { en: "Hovered cards.", fr: "Cartes survolées." },
  },
  {
    name: "--trc-surface-alt",
    value: "#232428",
    swatch: true,
    description: {
      en: "Second level, to tell two side-by-side blocks apart.",
      fr: "Deuxième niveau, pour distinguer deux blocs côte à côte.",
    },
  },
  {
    name: "--trc-fg",
    value: "#ffffff",
    swatch: true,
    description: { en: "Headings and primary text.", fr: "Titres et texte principal." },
  },
  {
    name: "--trc-fg-muted",
    value: "rgba(255,255,255,.72)",
    swatch: true,
    description: { en: "Body text.", fr: "Texte courant." },
  },
  {
    name: "--trc-fg-subtle",
    value: "rgba(255,255,255,.55)",
    swatch: true,
    description: { en: "Hints, secondary details.", fr: "Aides, détails secondaires." },
  },
  {
    name: "--trc-fg-faint",
    value: "rgba(255,255,255,.4)",
    swatch: true,
    description: { en: "Placeholders.", fr: "Textes indicatifs des champs." },
  },
  {
    name: "--trc-border",
    value: "rgba(255,255,255,.08)",
    swatch: true,
    description: { en: "Barely visible borders.", fr: "Bordures à peine visibles." },
  },
  {
    name: "--trc-border-strong",
    value: "rgba(255,255,255,.16)",
    swatch: true,
    description: { en: "Form controls.", fr: "Champs de formulaire." },
  },
  {
    name: "--trc-accent",
    value: "#08c8d8",
    swatch: true,
    description: { en: "The single accent color.", fr: "L'unique couleur d'accent." },
  },
  {
    name: "--trc-on-accent",
    value: "#0b0c0f",
    swatch: true,
    description: { en: "Text and icons on the accent.", fr: "Texte et icônes posés sur l'accent." },
  },
  {
    name: "--trc-danger",
    value: "#ff6b6b",
    swatch: true,
    description: { en: "Form errors only.", fr: "Erreurs de formulaire uniquement." },
  },
];

const OTHERS: TokenRow[] = [
  {
    name: "--trc-font",
    value: '"Montserrat", …',
    description: { en: "Font of the whole design.", fr: "Police de tout le design." },
  },
  { name: "--trc-font-mono", value: "ui-monospace, …", description: { en: "Code.", fr: "Code." } },
  {
    name: "--trc-radius",
    value: "16px",
    description: { en: "Cards, heroes, footer.", fr: "Cartes, héros, pied de page." },
  },
  { name: "--trc-radius-sm", value: "10px", description: { en: "Small elements.", fr: "Petits éléments." } },
  {
    name: "--trc-ease",
    value: "cubic-bezier(.77,0,.175,1)",
    description: { en: "Pill stretch curve.", fr: "Courbe d'étirement des pilules." },
  },
  {
    name: "--trc-ease-out",
    value: "cubic-bezier(.22,1,.36,1)",
    description: { en: "Entrances, menus.", fr: "Apparitions, menus." },
  },
  {
    name: "--trc-duration",
    value: "500ms",
    description: { en: "Pill stretch duration.", fr: "Durée d'étirement des pilules." },
  },
];

const ROOT = `:root {
  --trc-accent: #d41367;
}`;

const SCOPED = {
  en: `<div style={{ "--trc-accent": "#d41367" }}>
  <Heading size="lg">A *magenta* section</Heading>
  <StepNumber n={1} />
  <PillButton>Continue</PillButton>
</div>`,
  fr: `<div style={{ "--trc-accent": "#d41367" }}>
  <Heading size="lg">Une section *magenta*</Heading>
  <StepNumber n={1} />
  <PillButton>Continuer</PillButton>
</div>`,
};

const LIGHT = `:root {
  --trc-accent: #f5c518;
  --trc-on-accent: #0b0c0f;
}`;

const magenta = {
  "--trc-accent": "#d41367",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 24,
} as CSSProperties;

export function ThemingContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/theming/"
      title={themingTitle[lang]}
      lead={
        en
          ? "The whole design runs on CSS variables prefixed with --trc-. Override them to adapt trc-ui to your brand, globally or for a single area."
          : "Tout le design repose sur des variables CSS préfixées par --trc-. Redéfinissez-les pour adapter trc-ui à votre marque, partout ou sur une seule zone."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Change the *accent*" : "Changer l'*accent*"}
      </Heading>
      {en ? (
        <p>
          The accent is the only color of the design: pill dots, accent words, step numbers, focus rings. Set it once on{" "}
          <code>:root</code>, after importing <code>trc-ui/styles.css</code>.
        </p>
      ) : (
        <p>
          L&apos;accent est la seule couleur du design : pastilles des pilules, mots d&apos;accent, numéros
          d&apos;étape, anneaux de focus. Définissez-le une fois sur <code>:root</code>, après l&apos;import de{" "}
          <code>trc-ui/styles.css</code>.
        </p>
      )}
      <CodeBlock title="globals.css" lang="css" code={ROOT} />

      <Heading as="h2" size="lg">
        {en ? "Theme a *single area*" : "Thème d'une *seule zone*"}
      </Heading>
      <p>
        {en
          ? "Variables cascade: set them on any element and every component inside follows."
          : "Les variables se propagent : posez-les sur n'importe quel élément, et tous les composants qu'il contient suivent."}
      </p>
      <Demo code={SCOPED[lang]}>
        <div style={magenta}>
          <Heading size="lg">{en ? "A *magenta* section" : "Une section *magenta*"}</Heading>
          <StepNumber n={1} />
          <PillButton>{en ? "Continue" : "Continuer"}</PillButton>
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Light *accents*" : "Accents *clairs*"}
      </Heading>
      <p>
        {en ? (
          <>
            Text on the accent uses <code>--trc-on-accent</code>, near black by default. It suits most bright accents;
            for a dark accent, switch it to white.
          </>
        ) : (
          <>
            Le texte posé sur l&apos;accent utilise <code>--trc-on-accent</code>, quasi noir par défaut. Il convient à
            la plupart des accents vifs ; pour un accent sombre, passez-le en blanc.
          </>
        )}
      </p>
      <CodeBlock lang="css" code={LIGHT} />

      <Heading as="h2" size="lg">
        {en ? "One accent, *on purpose*" : "Un seul accent, *volontairement*"}
      </Heading>
      <p>
        {en
          ? "Everything colored draws the eye, so color has to stay rare. trc-ui has no secondary color and no gradients: depth comes from shades of grey, emphasis from the accent alone."
          : "Tout ce qui est coloré attire l'œil : la couleur doit donc rester rare. trc-ui n'a ni couleur secondaire ni dégradé : la profondeur vient des gris, l'insistance de l'accent seul."}
      </p>

      <Heading as="h2" size="lg">
        {en ? "Color *tokens*" : "Jetons de *couleur*"}
      </Heading>
      <TokenTable lang={lang} rows={COLORS} />

      <Heading as="h2" size="lg">
        {en ? "Type, shape and *motion*" : "Typographie, formes et *mouvement*"}
      </Heading>
      <TokenTable lang={lang} rows={OTHERS} />
    </DocPage>
  );
}
