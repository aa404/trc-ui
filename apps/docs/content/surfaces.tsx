import { Card, Heading, PillButton, Section, StepNumber, Text } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { Compass, Layers, Spark } from "@/components/demo-icons";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const surfacesTitle = { en: "Surfaces", fr: "Surfaces" };

const POLY: PropRow = {
  name: "as",
  type: "ElementType",
  description: { en: "Rendered element or component.", fr: "Élément ou composant rendu." },
};

const CARD_PROPS: PropRow[] = [
  { ...POLY, default: '"div"' },
  {
    name: "tone",
    type: '"default" | "alt"',
    default: '"default"',
    description: {
      en: "alt: a slightly lighter grey, to tell two side-by-side blocks apart.",
      fr: "alt : un gris un peu plus clair, pour distinguer deux blocs côte à côte.",
    },
  },
  {
    name: "padding",
    type: '"none" | "sm" | "md" | "lg"',
    default: '"md"',
    description: { en: "20, 28 or 32–40 px.", fr: "20, 28 ou 32–40 px." },
  },
  {
    name: "interactive",
    type: "boolean",
    default: "false",
    description: {
      en: "Lightens on hover, for cards that are links or buttons.",
      fr: "S'éclaircit au survol, pour les cartes qui sont des liens ou des boutons.",
    },
  },
  {
    name: "watermark",
    type: "ReactNode",
    description: {
      en: "Large decorative icon, half out of the top-right corner; takes the accent on hover.",
      fr: "Grande icône décorative, à demi sortie du coin supérieur droit ; prend l'accent au survol.",
    },
  },
];

const SECTION_PROPS: PropRow[] = [
  { ...POLY, default: '"section"' },
  {
    name: "spacing",
    type: '"none" | "sm" | "md" | "lg"',
    default: '"md"',
    description: { en: "Vertical padding: 48, 72–96 or 96–128 px.", fr: "Marge verticale : 48, 72–96 ou 96–128 px." },
  },
  {
    name: "inset",
    type: "boolean",
    default: "false",
    description: {
      en: "Turns the section into a large graphite card, 8–16 px from the screen edges.",
      fr: "Transforme la section en grande carte graphite, à 8–16 px des bords de l'écran.",
    },
  },
];

const CONTAINER_PROPS: PropRow[] = [
  { ...POLY, default: '"div"' },
  {
    name: "size",
    type: '"narrow" | "default" | "wide"',
    default: '"default"',
    description: {
      en: "Max width: 768, 1280 or 1600 px. Gutters grow from 16 to 40 px with the screen.",
      fr: "Largeur maximale : 768, 1280 ou 1600 px. Les marges passent de 16 à 40 px avec l'écran.",
    },
  },
];

const T = {
  en: {
    lead: "Graphite cards, rounded corners, no shadows: depth comes from shades of grey. Sections and containers give the page its rhythm.",
    pillars: [
      ["Sober", "Lots of black, a single accent, nothing shouting."],
      ["Thin", "A light typography that carries the page on its own."],
      ["Alive", "Interactions you notice without being distracted."],
    ],
    teams: "For organizations",
    teamsBody: "Default card, graphite surface.",
    agents: "For field agents",
    agentsBody: "Alt tone, one step lighter.",
    steps: ["Install", "Compose", "Publish"],
    ready: "Ready to *start*?",
    readyBody: "An inset section: the page breathes around it.",
    install: "Install trc-ui",
  },
  fr: {
    lead: "Des cartes graphite, des coins arrondis, aucune ombre : la profondeur vient des écarts de gris. Sections et conteneurs donnent son rythme à la page.",
    pillars: [
      ["Sobre", "Beaucoup de noir, un seul accent, rien qui crie."],
      ["Fin", "Une typographie légère qui porte la page à elle seule."],
      ["Vivant", "Des interactions qui se remarquent sans distraire."],
    ],
    teams: "Pour les organisations",
    teamsBody: "Carte par défaut, surface graphite.",
    agents: "Pour les agents",
    agentsBody: "Ton alt, un cran plus clair.",
    steps: ["Installer", "Composer", "Publier"],
    ready: "Prêt à *commencer* ?",
    readyBody: "Une section en retrait : la page respire autour.",
    install: "Installer trc-ui",
  },
};

const ICONS = [Compass, Layers, Spark];
const grid = (cols: number) => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 2 ? 240 : 200}px, 1fr))`,
  gap: 16,
  width: "100%",
});

export function SurfacesContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  return (
    <DocPage lang={lang} href="/docs/surfaces/" title={surfacesTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "Cards with a *watermark*" : "Cartes en *filigrane*"}
      </Heading>
      <p>
        {en
          ? "Instead of icons in bordered badges, a card can carry a very large, thin icon half out of its corner. Almost invisible at rest, it takes the accent on hover. Use it for unordered lists, like pillars or features."
          : "Plutôt qu'une icône dans une pastille bordée, une carte peut porter une très grande icône fine, à demi sortie de son coin. Presque invisible au repos, elle prend l'accent au survol. Pour les listes sans ordre, comme des piliers ou des fonctionnalités."}
      </p>
      <Demo
        code={`<Card watermark={<CompassIcon />} padding="lg">
  <Heading as="h3" size="md">${t.pillars[0]![0]}</Heading>
  <Text>${t.pillars[0]![1]}</Text>
</Card>`}
      >
        <div style={grid(3)}>
          {t.pillars.map(([title, body], i) => {
            const Icon = ICONS[i]!;
            return (
              <Card key={title} watermark={<Icon />} padding="lg">
                <Heading as="p" size="md">
                  {title}
                </Heading>
                <Text style={{ marginTop: 12 }}>{body}</Text>
              </Card>
            );
          })}
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Two *tones*" : "Deux *tons*"}
      </Heading>
      <p>
        {en
          ? "To set two parallel blocks apart, give one of them the alt tone rather than an inverted white card."
          : "Pour distinguer deux blocs parallèles, donnez à l'un le ton alt plutôt qu'une carte blanche inversée."}
      </p>
      <Demo code={`<Card padding="lg">…</Card>\n<Card tone="alt" padding="lg">…</Card>`}>
        <div style={grid(2)}>
          <Card padding="lg">
            <Heading as="p" size="md">
              {t.teams}
            </Heading>
            <Text style={{ marginTop: 12 }}>{t.teamsBody}</Text>
          </Card>
          <Card tone="alt" padding="lg">
            <Heading as="p" size="md">
              {t.agents}
            </Heading>
            <Text style={{ marginTop: 12 }}>{t.agentsBody}</Text>
          </Card>
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Clickable *cards*" : "Cartes *cliquables*"}
      </Heading>
      <p>
        {en ? (
          <>
            Render the card as a link with <code>as</code>, and add <code>interactive</code>: the background lightens
            slightly on hover and the focus ring shows for keyboard users.
          </>
        ) : (
          <>
            Rendez la carte comme un lien avec <code>as</code>, et ajoutez <code>interactive</code> : le fond
            s&apos;éclaircit légèrement au survol et l&apos;anneau de focus s&apos;affiche au clavier.
          </>
        )}
      </p>
      <Demo
        code={`<Card as={Link} href="/install" interactive>
  <StepNumber n={1} />
  <Heading as="h3" size="sm">${t.steps[0]}</Heading>
</Card>`}
      >
        <div style={grid(3)}>
          {t.steps.map((step, i) => (
            <Card key={step} as="a" href="#" interactive>
              <StepNumber n={i + 1} />
              <Heading as="p" size="sm" style={{ marginTop: 24 }}>
                {step}
              </Heading>
            </Card>
          ))}
        </div>
      </Demo>
      <PropsTable lang={lang} rows={CARD_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Inset *sections*" : "Sections en *retrait*"}
      </Heading>
      <p>
        {en ? (
          <>
            With <code>inset</code>, a section becomes a large rounded graphite card, a few pixels from the screen
            edges: the &ldquo;magazine&rdquo; effect, for calls to action and banners.
          </>
        ) : (
          <>
            Avec <code>inset</code>, une section devient une grande carte graphite arrondie, à quelques pixels des bords
            de l&apos;écran : l&apos;effet « magazine », pour les appels à l&apos;action et les bandeaux.
          </>
        )}
      </p>
      <Demo
        code={`<Section inset spacing="lg">
  <Container size="narrow" style={{ textAlign: "center" }}>
    <Heading>${t.ready}</Heading>
    <Text size="lg">${t.readyBody}</Text>
    <PillButton solid>${t.install}</PillButton>
  </Container>
</Section>`}
      >
        <Section inset spacing="md" style={{ width: "100%", padding: 0 }}>
          <div style={{ display: "grid", justifyItems: "center", gap: 20, padding: "0 24px", textAlign: "center" }}>
            <Heading>{t.ready}</Heading>
            <Text size="lg">{t.readyBody}</Text>
            <PillButton solid>{t.install}</PillButton>
          </div>
        </Section>
      </Demo>
      <PropsTable lang={lang} rows={SECTION_PROPS} />

      <Heading as="h2" size="lg">
        Container
      </Heading>
      <p>
        {en
          ? "Centers the content within a max width, with side gutters that grow with the screen (16, 24 then 40 px)."
          : "Centre le contenu dans une largeur maximale, avec des marges latérales qui grandissent avec l'écran (16, 24 puis 40 px)."}
      </p>
      <CodeBlock
        code={`<Container as="main">…</Container>
<Container size="narrow">…</Container>  {/* 768 px */}
<Container size="wide">…</Container>    {/* 1600 px */}`}
      />
      <PropsTable lang={lang} rows={CONTAINER_PROPS} />
    </DocPage>
  );
}
