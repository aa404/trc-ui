import { Heading, SegmentedControl, Tabs, Text } from "trc-ui";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const tabsTitle = { en: "Tabs and segmented control", fr: "Onglets et sélecteur" };

const TABS_PROPS: PropRow[] = [
  {
    name: "items",
    type: "{ value, label, content, disabled? }[]",
    description: { en: "Tabs and their panels.", fr: "Les onglets et leurs panneaux." },
  },
  {
    name: "value / defaultValue",
    type: "string",
    description: { en: "Selected tab, controlled or not.", fr: "Onglet choisi, contrôlé ou non." },
  },
  {
    name: "onValueChange",
    type: "(value) => void",
    description: { en: "Called when the selection changes.", fr: "Appelé au changement d'onglet." },
  },
  {
    name: "label",
    type: "string",
    description: { en: "Accessible name of the tab list.", fr: "Nom accessible de la liste d'onglets." },
  },
  {
    name: "activation",
    type: '"automatic" | "manual"',
    default: '"automatic"',
    description: {
      en: "Whether the arrows select, or only move focus (Enter selects).",
      fr: "Les flèches sélectionnent, ou déplacent seulement le focus (Entrée sélectionne).",
    },
  },
];

const SEGMENTED_PROPS: PropRow[] = [
  { name: "options", type: "{ value, label, disabled? }[]", description: { en: "The choices.", fr: "Les choix." } },
  {
    name: "label",
    type: "string",
    description: { en: "Accessible name of the group (required).", fr: "Nom accessible du groupe (obligatoire)." },
  },
  {
    name: "value / defaultValue",
    type: "string",
    description: { en: "Selected option, controlled or not.", fr: "Option choisie, contrôlée ou non." },
  },
  {
    name: "onValueChange",
    type: "(value) => void",
    description: { en: "Called on change.", fr: "Appelé au changement." },
  },
  { name: "name", type: "string", description: { en: "Form field name.", fr: "Nom du champ de formulaire." } },
  {
    name: "size",
    type: '"md" | "sm"',
    default: '"md"',
    description: { en: "Size of the pill.", fr: "Taille de la pilule." },
  },
];

const code = (text: string) => <code className="docs-install">{text}</code>;

export function TabsContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/tabs/"
      title={tabsTitle[lang]}
      lead={
        en
          ? "Tabs switch between panels; the segmented control switches between options. Both work with the arrow keys."
          : "Les onglets passent d'un panneau à l'autre ; le sélecteur, d'une option à l'autre. Les deux se pilotent aux flèches."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "*Tabs*" : "*Onglets*"}
      </Heading>
      <p>
        {en
          ? "Thin labels, the selected one underlined with the accent. Only the selected tab is in the Tab order; Left and Right arrows, Home and End move between tabs."
          : "Des libellés fins, l'onglet choisi souligné de l'accent. Seul l'onglet choisi est dans l'ordre de tabulation ; les flèches gauche et droite, Début et Fin passent d'un onglet à l'autre."}
      </p>
      <Demo
        code={`<Tabs
  label="Package manager"
  items={[
    { value: "npm", label: "npm", content: <code>npm install trc-ui</code> },
    { value: "yarn", label: "yarn", content: <code>yarn add trc-ui</code> },
    { value: "pnpm", label: "pnpm", content: <code>pnpm add trc-ui</code> },
    { value: "bun", label: "bun", content: <code>bun add trc-ui</code> },
  ]}
/>`}
      >
        <div style={{ width: "100%" }}>
          <Tabs
            label={en ? "Package manager" : "Gestionnaire de paquets"}
            items={[
              { value: "npm", label: "npm", content: code("npm install trc-ui") },
              { value: "yarn", label: "yarn", content: code("yarn add trc-ui") },
              { value: "pnpm", label: "pnpm", content: code("pnpm add trc-ui") },
              { value: "bun", label: "bun", content: code("bun add trc-ui") },
            ]}
          />
        </div>
      </Demo>
      <PropsTable lang={lang} rows={TABS_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Segmented *control*" : "*Sélecteur*"}
      </Heading>
      <p>
        {en
          ? "A pill to choose between a few options, such as a period or a view. It is a group of native radio buttons: forms, the arrow keys and screen readers work as usual."
          : "Une pilule pour choisir entre quelques options, comme une période ou une vue. C'est un groupe de boutons radio natifs : formulaires, flèches et lecteurs d'écran fonctionnent comme d'habitude."}
      </p>
      <Demo
        code={`<SegmentedControl
  label="Period"
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year", disabled: true },
  ]}
  defaultValue="week"
/>`}
      >
        <SegmentedControl
          label={en ? "Period" : "Période"}
          defaultValue="week"
          options={[
            { value: "day", label: en ? "Day" : "Jour" },
            { value: "week", label: en ? "Week" : "Semaine" },
            { value: "month", label: en ? "Month" : "Mois" },
            { value: "year", label: en ? "Year" : "Année", disabled: true },
          ]}
        />
        <SegmentedControl
          size="sm"
          label={en ? "View" : "Vue"}
          options={[
            { value: "grid", label: en ? "Grid" : "Grille" },
            { value: "list", label: en ? "List" : "Liste" },
          ]}
        />
      </Demo>
      <Text size="sm" tone="subtle">
        {en
          ? "Use Tabs when each choice shows different content, and SegmentedControl when it changes how the same content is shown."
          : "Utilisez Tabs quand chaque choix affiche un contenu différent, et SegmentedControl quand il change la façon de montrer le même contenu."}
      </Text>
      <PropsTable lang={lang} rows={SEGMENTED_PROPS} />
    </DocPage>
  );
}
