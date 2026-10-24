import type { Lang } from "./i18n";

/** Plan du site de documentation : barre latérale, menu mobile et liens précédent / suivant. */
export type DocPage = { title: Record<Lang, string>; href: string };
export type DocSection = { title: Record<Lang, string>; pages: DocPage[] };

export const DOCS_NAV: DocSection[] = [
  {
    title: { en: "Getting started", fr: "Démarrer" },
    pages: [
      { title: { en: "Installation", fr: "Installation" }, href: "/docs/getting-started/" },
      { title: { en: "Theming", fr: "Thème" }, href: "/docs/theming/" },
    ],
  },
  {
    title: { en: "Components", fr: "Composants" },
    pages: [
      { title: { en: "Typography", fr: "Typographie" }, href: "/docs/typography/" },
      { title: { en: "Pill buttons", fr: "Boutons pilule" }, href: "/docs/pill/" },
      { title: { en: "Surfaces", fr: "Surfaces" }, href: "/docs/surfaces/" },
      { title: { en: "Forms", fr: "Formulaires" }, href: "/docs/forms/" },
      { title: { en: "Header and footer", fr: "En-tête et pied de page" }, href: "/docs/site-chrome/" },
      { title: { en: "Heroes", fr: "Héros" }, href: "/docs/heroes/" },
    ],
  },
];

export const ALL_PAGES = DOCS_NAV.flatMap((section) => section.pages);

export const REPO_URL = "https://github.com/aa404/trc-ui";
