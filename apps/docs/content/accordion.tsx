import { Accordion, Heading } from "trc-ui";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const accordionTitle = { en: "Accordion", fr: "Accordéon" };

const PROPS: PropRow[] = [
  {
    name: "items",
    type: "{ value, title, content, disabled? }[]",
    description: { en: "Titles and their content.", fr: "Les titres et leur contenu." },
  },
  {
    name: "type",
    type: '"single" | "multiple"',
    default: '"single"',
    description: { en: "One item open at a time, or several.", fr: "Un seul élément ouvert à la fois, ou plusieurs." },
  },
  {
    name: "value / defaultValue",
    type: "string[]",
    description: { en: "Open items, controlled or not.", fr: "Éléments ouverts, contrôlés ou non." },
  },
  {
    name: "onValueChange",
    type: "(value) => void",
    description: { en: "Called when items open or close.", fr: "Appelé à l'ouverture ou à la fermeture." },
  },
  {
    name: "headingLevel",
    type: "2 | 3 | 4 | 5 | 6",
    default: "3",
    description: {
      en: "Level of the headings, to fit the page outline.",
      fr: "Niveau des titres, selon le plan de la page.",
    },
  },
];

const FAQ = {
  en: [
    ["Is trc ui free?", "Yes. It is open source under the MIT license, for personal and commercial projects."],
    [
      "Does it work with Next.js?",
      "Yes. Components carry the use client directive and accept your router's link component.",
    ],
    [
      "Can I change the colors?",
      "Change the accent with one CSS variable, or use the colors generator to build it from your brand.",
    ],
    ["Is there a light theme?", "No, on purpose: the design is always dark. That is what keeps it consistent."],
  ],
  fr: [
    [
      "trc ui est-il gratuit ?",
      "Oui. Il est open source sous licence MIT, pour les projets personnels comme commerciaux.",
    ],
    [
      "Fonctionne-t-il avec Next.js ?",
      "Oui. Les composants portent la directive use client et acceptent le lien de votre routeur.",
    ],
    [
      "Puis-je changer les couleurs ?",
      "Changez l'accent avec une variable CSS, ou construisez-le depuis votre marque avec le générateur de couleurs.",
    ],
    [
      "Y a-t-il un thème clair ?",
      "Non, volontairement : le design est toujours sombre. C'est ce qui le garde cohérent.",
    ],
  ],
};

export function AccordionContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const items = FAQ[lang].map(([title, content], i) => ({ value: `q${i}`, title, content }));
  return (
    <DocPage
      lang={lang}
      href="/docs/accordion/"
      title={accordionTitle[lang]}
      lead={
        en
          ? "Items that open and close, for FAQs and details. The height animates, and closed content leaves the accessibility tree."
          : "Des éléments qui s'ouvrent et se ferment, pour les FAQ et les détails. La hauteur s'anime, et le contenu fermé sort de l'arbre d'accessibilité."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "A *FAQ*" : "Une *FAQ*"}
      </Heading>
      <p>
        {en
          ? "Each title is a button inside a heading. Up and Down arrows, Home and End move between titles."
          : "Chaque titre est un bouton dans un titre de section. Les flèches haut et bas, Début et Fin passent d'un titre à l'autre."}
      </p>
      <Demo
        code={`<Accordion
  headingLevel={3}
  defaultValue={["free"]}
  items={[
    { value: "free", title: "Is trc ui free?", content: "Yes. It is open source under the MIT license." },
    { value: "next", title: "Does it work with Next.js?", content: "Yes." },
  ]}
/>`}
      >
        <div style={{ width: "100%" }}>
          <Accordion items={items} defaultValue={["q0"]} />
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Several *open*" : "Plusieurs *ouverts*"}
      </Heading>
      <Demo code={`<Accordion type="multiple" items={items} />`}>
        <div style={{ width: "100%" }}>
          <Accordion type="multiple" items={items.slice(0, 3)} />
        </div>
      </Demo>
      <PropsTable lang={lang} rows={PROPS} />
    </DocPage>
  );
}
