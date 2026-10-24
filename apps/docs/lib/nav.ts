import type { Lang } from "./i18n";

type Text = Record<Lang, string>;

/** Docs site map: sidebar, mobile menu, components overview, footer and previous / next links. */
export type DocPage = { title: Text; href: string; description?: Text };
export type DocSection = { id: string; title: Text; description?: Text; pages: DocPage[] };

export const DOCS_NAV: DocSection[] = [
  {
    id: "getting-started",
    title: { en: "Getting started", fr: "Démarrer" },
    pages: [
      { title: { en: "Installation", fr: "Installation" }, href: "/docs/getting-started/" },
      { title: { en: "Theming", fr: "Thème" }, href: "/docs/theming/" },
      { title: { en: "Colors generator", fr: "Générateur de couleurs" }, href: "/docs/colors-generator/" },
      { title: { en: "All components", fr: "Tous les composants" }, href: "/docs/components/" },
    ],
  },
  {
    id: "basics",
    title: { en: "Basics", fr: "Essentiels" },
    description: {
      en: "Typography, pills, surfaces and the frame of a showcase site.",
      fr: "Typographie, pilules, surfaces et le cadre d'un site vitrine.",
    },
    pages: [
      {
        title: { en: "Typography", fr: "Typographie" },
        href: "/docs/typography/",
        description: {
          en: "Thin headings, accent words, step numbers.",
          fr: "Titres fins, mots d'accent, numéros d'étape.",
        },
      },
      {
        title: { en: "Pill buttons", fr: "Boutons pilule" },
        href: "/docs/pill/",
        description: {
          en: "The signature button, with its stretching dot.",
          fr: "Le bouton signature, avec sa pastille qui s'étire.",
        },
      },
      {
        title: { en: "Surfaces", fr: "Surfaces" },
        href: "/docs/surfaces/",
        description: {
          en: "Graphite cards, inset sections, containers.",
          fr: "Cartes graphite, sections en retrait, conteneurs.",
        },
      },
      {
        title: { en: "Header and footer", fr: "En-tête et pied de page" },
        href: "/docs/site-chrome/",
        description: {
          en: "Floating header with dropdowns, footer as a card.",
          fr: "En-tête flottant avec menus, pied de page en carte.",
        },
      },
      {
        title: { en: "Heroes", fr: "Héros" },
        href: "/docs/heroes/",
        description: {
          en: "Photo and video heroes inset from the edges.",
          fr: "Héros photo et vidéo, en retrait des bords.",
        },
      },
    ],
  },
  {
    id: "overlays",
    title: { en: "Overlays and feedback", fr: "Fenêtres et retours" },
    description: {
      en: "Windows, menus and messages that appear above the page.",
      fr: "Fenêtres, menus et messages qui apparaissent au-dessus de la page.",
    },
    pages: [
      {
        title: { en: "Dialog and drawer", fr: "Fenêtre et panneau" },
        href: "/docs/dialog/",
        description: {
          en: "Modal window and side panel, focus kept inside.",
          fr: "Fenêtre modale et panneau latéral, focus gardé à l'intérieur.",
        },
      },
      {
        title: { en: "Menu and popover", fr: "Menu et popover" },
        href: "/docs/menu/",
        description: {
          en: "Menu of actions and floating panel, anchored to a trigger.",
          fr: "Menu d'actions et panneau flottant, ancrés à un déclencheur.",
        },
      },
      {
        title: { en: "Tooltip", fr: "Infobulle" },
        href: "/docs/tooltip/",
        description: {
          en: "Short label on hover and keyboard focus.",
          fr: "Court libellé au survol et au focus clavier.",
        },
      },
      {
        title: { en: "Toast", fr: "Notification" },
        href: "/docs/toast/",
        description: {
          en: "Short messages raised from anywhere, announced to screen readers.",
          fr: "Messages courts lancés de partout, annoncés aux lecteurs d'écran.",
        },
      },
      {
        title: { en: "Alert", fr: "Alerte" },
        href: "/docs/alert/",
        description: {
          en: "Inline message marked by a thin colored edge.",
          fr: "Message en ligne, marqué d'un fin bord coloré.",
        },
      },
    ],
  },
  {
    id: "forms",
    title: { en: "Forms", fr: "Formulaires" },
    description: {
      en: "Native controls, wired for screen readers.",
      fr: "Des champs natifs, reliés pour les lecteurs d'écran.",
    },
    pages: [
      {
        title: { en: "Fields", fr: "Champs" },
        href: "/docs/forms/",
        description: {
          en: "Input, textarea, select, checkbox and switch.",
          fr: "Champ, zone de texte, liste, case et interrupteur.",
        },
      },
    ],
  },
];

export const ALL_PAGES = DOCS_NAV.flatMap((section) => section.pages);

/** Sections of components, without "Getting started". */
export const COMPONENT_SECTIONS = DOCS_NAV.filter((section) => section.id !== "getting-started");

export const REPO_URL = "https://github.com/aa404/trc-ui";
export const NPM_URL = "https://www.npmjs.com/package/trc-ui";
export const AUTHOR = { name: "The Ring Concept", url: "https://www.theringconcept.com/" };
