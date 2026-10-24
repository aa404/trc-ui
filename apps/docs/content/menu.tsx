import { Heading } from "trc-ui";
import { Demo } from "@/components/demo";
import { MenuDemo, PopoverDemo } from "@/components/demos/overlays";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const menuTitle = { en: "Menu and popover", fr: "Menu et popover" };

const MENU_PROPS: PropRow[] = [
  {
    name: "trigger",
    type: "ReactElement",
    description: {
      en: "Element that opens the menu; it receives aria-expanded and the keyboard handling.",
      fr: "Élément qui ouvre le menu ; il reçoit aria-expanded et la gestion du clavier.",
    },
  },
  {
    name: "items",
    type: '(MenuAction | "separator")[]',
    description: {
      en: "Actions: label, onSelect or href, hint, disabled, danger.",
      fr: "Actions : label, onSelect ou href, hint, disabled, danger.",
    },
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
    description: { en: "Alignment under the trigger.", fr: "Alignement sous le déclencheur." },
  },
  {
    name: "linkAs",
    type: "ElementType",
    default: '"a"',
    description: { en: "Router link, for items with an href.", fr: "Lien du routeur, pour les entrées avec href." },
  },
];

const POPOVER_PROPS: PropRow[] = [
  {
    name: "trigger",
    type: "ReactElement",
    description: { en: "Element that opens the panel.", fr: "Élément qui ouvre le panneau." },
  },
  {
    name: "title",
    type: "ReactNode",
    description: { en: "Title, also the accessible name.", fr: "Titre, aussi le nom accessible." },
  },
  {
    name: "label",
    type: "string",
    description: { en: "Accessible name without a visible title.", fr: "Nom accessible sans titre visible." },
  },
  {
    name: "side",
    type: '"bottom" | "top"',
    default: '"bottom"',
    description: {
      en: "Preferred side; flips when there is no room.",
      fr: "Côté préféré ; se retourne s'il manque de place.",
    },
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    default: '"start"',
    description: { en: "Alignment along the trigger.", fr: "Alignement le long du déclencheur." },
  },
  {
    name: "open / onOpenChange",
    type: "boolean / (open) => void",
    description: { en: "Controlled state, optional.", fr: "État contrôlé, facultatif." },
  },
];

export function MenuContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/menu/"
      title={menuTitle[lang]}
      lead={
        en
          ? "A menu of actions and a floating panel, anchored to their trigger. They flip above when there is no room below, and stay inside the screen."
          : "Un menu d'actions et un panneau flottant, ancrés à leur déclencheur. Ils passent au-dessus quand la place manque en dessous, et restent dans l'écran."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Menu of *actions*" : "Menu d'*actions*"}
      </Heading>
      <p>
        {en
          ? "Fully usable with the keyboard: Enter, Space or the arrows open it; the arrows, Home and End move; typing a letter jumps to the next item starting with it; Escape closes and returns focus to the trigger."
          : "Entièrement utilisable au clavier : Entrée, Espace ou les flèches l'ouvrent ; les flèches, Début et Fin déplacent ; une lettre saute à l'entrée suivante qui commence par elle ; Échap ferme et rend le focus au déclencheur."}
      </p>
      <Demo
        code={`<DropdownMenu
  trigger={<PillButton size="sm">Actions</PillButton>}
  items={[
    { label: "Edit", onSelect: edit, hint: "E" },
    { label: "Duplicate", onSelect: duplicate, hint: "D" },
    { label: "Share", disabled: true },
    { label: "Archive", onSelect: archive },
    "separator",
    { label: "Delete", onSelect: remove, danger: true },
  ]}
/>`}
      >
        <MenuDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={MENU_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Floating *panel*" : "Panneau *flottant*"}
      </Heading>
      <p>
        {en
          ? "Popover holds short content or a small form. It is not modal: the page stays usable. Focus moves to its first field; Escape or a click outside closes it."
          : "Popover accueille un contenu court ou un petit formulaire. Il n'est pas modal : la page reste utilisable. Le focus va sur son premier champ ; Échap ou un clic à l'extérieur le ferme."}
      </p>
      <Demo
        code={`<Popover trigger={<PillButton size="sm">Filter by date</PillButton>} title="Filter by date">
  <Field label="From"><Input type="date" /></Field>
  <Field label="To"><Input type="date" /></Field>
</Popover>`}
      >
        <PopoverDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={POPOVER_PROPS} />
    </DocPage>
  );
}
