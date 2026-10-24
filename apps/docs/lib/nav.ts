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
    id: "navigation",
    title: { en: "Navigation", fr: "Navigation" },
    description: {
      en: "Move between views, pages, languages and steps.",
      fr: "Passer d'une vue, d'une page, d'une langue ou d'une étape à l'autre.",
    },
    pages: [
      {
        title: { en: "Tabs and segmented control", fr: "Onglets et sélecteur" },
        href: "/docs/tabs/",
        description: {
          en: "Panels behind tabs, and a pill switch between options.",
          fr: "Des panneaux derrière des onglets, et une pilule pour choisir une option.",
        },
      },
      {
        title: { en: "Accordion", fr: "Accordéon" },
        href: "/docs/accordion/",
        description: {
          en: "Items that open and close, the base of a FAQ.",
          fr: "Des éléments qui s'ouvrent et se ferment, la base d'une FAQ.",
        },
      },
      {
        title: { en: "Breadcrumbs and pagination", fr: "Fil d'Ariane et pagination" },
        href: "/docs/pagination/",
        description: {
          en: "Where the page is, and how to reach the next ones.",
          fr: "Où se trouve la page, et comment atteindre les suivantes.",
        },
      },
      {
        title: { en: "Language switcher", fr: "Choix de la langue" },
        href: "/docs/language-switcher/",
        description: { en: "The EN | FR pill, as links or buttons.", fr: "La pilule EN | FR, en liens ou en boutons." },
      },
      {
        title: { en: "Steps", fr: "Étapes" },
        href: "/docs/steps/",
        description: { en: "Vertical timeline with large thin numbers.", fr: "Frise verticale à grands numéros fins." },
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
      {
        title: { en: "Radio group", fr: "Boutons radio" },
        href: "/docs/radio-group/",
        description: {
          en: "One choice among a few options, in a fieldset.",
          fr: "Un choix parmi quelques options, dans un groupe.",
        },
      },
      {
        title: { en: "Password and code", fr: "Mot de passe et code" },
        href: "/docs/password/",
        description: {
          en: "Show / hide password, one-time code boxes.",
          fr: "Mot de passe à afficher, cases pour code à usage unique.",
        },
      },
      {
        title: { en: "Combobox", fr: "Liste avec recherche" },
        href: "/docs/combobox/",
        description: {
          en: "Search field with suggestions, accent insensitive.",
          fr: "Recherche avec suggestions, insensible aux accents.",
        },
      },
      {
        title: { en: "File upload", fr: "Envoi de fichiers" },
        href: "/docs/file-upload/",
        description: {
          en: "Compact file field and drop zone, with validation.",
          fr: "Champ fichier compact et zone de dépôt, avec validation.",
        },
      },
      {
        title: { en: "Slider", fr: "Curseur" },
        href: "/docs/slider/",
        description: { en: "Range slider filled with the accent.", fr: "Curseur rempli de l'accent." },
      },
      {
        title: { en: "Date picker", fr: "Sélecteur de date" },
        href: "/docs/date-picker/",
        description: {
          en: "Calendar fully usable with the keyboard.",
          fr: "Calendrier entièrement utilisable au clavier.",
        },
      },
    ],
  },
  {
    id: "data",
    title: { en: "Data display", fr: "Affichage de données" },
    description: {
      en: "People, figures, tables, loading states and code.",
      fr: "Personnes, chiffres, tableaux, chargements et code.",
    },
    pages: [
      {
        title: { en: "Avatar and tag", fr: "Avatar et étiquette" },
        href: "/docs/avatar/",
        description: {
          en: "Pictures with initials as a fallback, small labels.",
          fr: "Photos avec initiales de secours, petites étiquettes.",
        },
      },
      {
        title: { en: "Stat and table", fr: "Chiffre et tableau" },
        href: "/docs/table/",
        description: { en: "Key figures and sortable data tables.", fr: "Chiffres clés et tableaux triables." },
      },
      {
        title: { en: "Loading", fr: "Chargement" },
        href: "/docs/loading/",
        description: {
          en: "Skeleton, spinner and progress bar.",
          fr: "Squelette, indicateur et barre de progression.",
        },
      },
      {
        title: { en: "Kbd and divider", fr: "Touches et séparateur" },
        href: "/docs/kbd/",
        description: { en: "Keyboard shortcuts and hairlines.", fr: "Raccourcis clavier et traits fins." },
      },
      {
        title: { en: "Code block", fr: "Bloc de code" },
        href: "/docs/code-block/",
        description: { en: "File tab and copy button.", fr: "Onglet de fichier et bouton copier." },
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
