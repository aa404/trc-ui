import { Heading, StepNumber, Text } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const typographyTitle = { en: "Typography", fr: "Typographie" };

const HEADING_PROPS: PropRow[] = [
  {
    name: "as",
    type: '"h1" | "h2" | … | "h6" | "p" | "span"',
    default: '"h2"',
    description: {
      en: "Rendered tag, independent from the visual size.",
      fr: "Balise rendue, indépendante de la taille visuelle.",
    },
  },
  {
    name: "size",
    type: '"display" | "xl" | "lg" | "md" | "sm"',
    default: '"xl"',
    description: {
      en: "display: 48–72 px, xl: 36–48 px, lg: 28–36 px, md: 24 px, sm: 20 px.",
      fr: "display : 48–72 px, xl : 36–48 px, lg : 28–36 px, md : 24 px, sm : 20 px.",
    },
  },
  {
    name: "accentLast",
    type: "number",
    description: {
      en: "For a string without asterisks: number of trailing words in the accent color.",
      fr: "Pour une chaîne sans astérisques : nombre de derniers mots en couleur d'accent.",
    },
  },
];

const TEXT_PROPS: PropRow[] = [
  { name: "as", type: "ElementType", default: '"p"', description: { en: "Rendered element.", fr: "Élément rendu." } },
  {
    name: "size",
    type: '"lg" | "md" | "sm"',
    default: '"md"',
    description: { en: "18, 16 or 14 px.", fr: "18, 16 ou 14 px." },
  },
  {
    name: "tone",
    type: '"default" | "muted" | "subtle"',
    default: '"muted"',
    description: {
      en: "White, 72 % or 55 % opacity. Body text stays muted so it does not compete with headings.",
      fr: "Blanc, opacité 72 % ou 55 %. Le corps reste atténué pour ne pas rivaliser avec les titres.",
    },
  },
];

const STEP_PROPS: PropRow[] = [
  {
    name: "n",
    type: "number",
    description: { en: "Step number, shown on two digits.", fr: "Numéro de l'étape, affiché sur deux chiffres." },
  },
  { name: "size", type: '"md" | "sm"', default: '"md"', description: { en: "48 or 24 px.", fr: "48 ou 24 px." } },
];

const SIZES = ["display", "xl", "lg", "md", "sm"] as const;

const T = {
  en: {
    accent: "How it *works*",
    cms: "The reality on the ground in data",
    steps: ["Install", "Compose", "Publish"],
    lead: "Thin Montserrat headings carry the page. One accent word per heading, nothing in bold.",
    sizeSample: "Thin headings",
  },
  fr: {
    accent: "Comment ça *marche*",
    cms: "La réalité du terrain en données",
    steps: ["Installer", "Composer", "Publier"],
    lead: "Des titres fins en Montserrat portent la page. Un mot d'accent par titre, rien en gras.",
    sizeSample: "Titres fins",
  },
};

export function TypographyContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  return (
    <DocPage lang={lang} href="/docs/typography/" title={typographyTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "The *accent* word" : "Le mot d'*accent*"}
      </Heading>
      <p>
        {en ? (
          <>
            Wrap a part of the title in asterisks: it takes the accent color. Keep it to a single passage per heading.
          </>
        ) : (
          <>
            Entourez une partie du titre d&apos;astérisques : elle prend la couleur d&apos;accent. Un seul passage par
            titre.
          </>
        )}
      </p>
      <Demo code={`<Heading>${t.accent}</Heading>`}>
        <Heading>{t.accent}</Heading>
      </Demo>
      <p>
        {en ? (
          <>
            Titles coming from a CMS have no asterisks: <code>accentLast</code> colors the last words instead.
          </>
        ) : (
          <>
            Les titres venant d&apos;un CMS n&apos;ont pas d&apos;astérisques : <code>accentLast</code> colore alors les
            derniers mots.
          </>
        )}
      </p>
      <Demo code={`<Heading size="lg" accentLast={2}>\n  ${t.cms}\n</Heading>`}>
        <Heading size="lg" accentLast={2}>
          {t.cms}
        </Heading>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Heading *sizes*" : "Tailles de *titre*"}
      </Heading>
      <p>
        {en ? (
          <>
            The visual <code>size</code> is independent from the tag set with <code>as</code>: keep a correct outline
            (one <code>h1</code> per page) whatever the look.
          </>
        ) : (
          <>
            La <code>size</code> visuelle est indépendante de la balise choisie avec <code>as</code> : gardez un plan
            correct (un seul <code>h1</code> par page) quel que soit le rendu.
          </>
        )}
      </p>
      <Demo code={SIZES.map((s) => `<Heading as="p" size="${s}">${t.sizeSample}</Heading>`).join("\n")}>
        <div style={{ display: "grid", gap: 16 }}>
          {SIZES.map((s) => (
            <Heading key={s} as="p" size={s}>
              {t.sizeSample}
            </Heading>
          ))}
        </div>
      </Demo>
      <PropsTable lang={lang} rows={HEADING_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Body *text*" : "Texte *courant*"}
      </Heading>
      <Demo code={`<Text size="lg" tone="default">…</Text>\n<Text>…</Text>\n<Text size="sm" tone="subtle">…</Text>`}>
        <div style={{ display: "grid", gap: 12 }}>
          <Text size="lg" tone="default">
            {en ? "Large, default tone: an introduction." : "Grand, ton par défaut : une introduction."}
          </Text>
          <Text>{en ? "Medium, muted: the body of the page." : "Moyen, atténué : le corps de la page."}</Text>
          <Text size="sm" tone="subtle">
            {en ? "Small, subtle: a detail or a hint." : "Petit, discret : un détail ou une aide."}
          </Text>
        </div>
      </Demo>
      <PropsTable lang={lang} rows={TEXT_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Step *numbers*" : "Numéros d'*étape*"}
      </Heading>
      <p>
        {en
          ? "Large thin numbers replace icons for steps that follow a real order. Lists without an order get no numbers at all: the card simply starts with its title."
          : "De grands numéros fins remplacent les icônes pour des étapes qui suivent un ordre réel. Une liste sans ordre n'a pas de numéro : la carte commence simplement par son titre."}
      </p>
      <Demo
        code={`{steps.map((step, i) => (\n  <div key={step}>\n    <StepNumber n={i + 1} />\n    <Heading as="h3" size="sm">{step}</Heading>\n  </div>\n))}`}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48 }}>
          {t.steps.map((step, i) => (
            <div key={step}>
              <StepNumber n={i + 1} />
              <Heading as="p" size="sm" style={{ marginTop: 16 }}>
                {step}
              </Heading>
            </div>
          ))}
        </div>
      </Demo>
      <PropsTable lang={lang} rows={STEP_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Plain *text*" : "Texte *brut*"}
      </Heading>
      <p>
        {en ? (
          <>
            <code>plainText</code> removes the asterisks, for attributes and metadata. <code>AccentText</code> renders
            the accent inside your own elements.
          </>
        ) : (
          <>
            <code>plainText</code> retire les astérisques, pour les attributs et les métadonnées.{" "}
            <code>AccentText</code> affiche l&apos;accent dans vos propres éléments.
          </>
        )}
      </p>
      <CodeBlock
        code={`import { AccentText, plainText } from "trc-ui";

const title = "${t.accent}";

<img alt={plainText(title)} src="…" />
<h2 className="my-title"><AccentText text={title} /></h2>`}
      />
    </DocPage>
  );
}
