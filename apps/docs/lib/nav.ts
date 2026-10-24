/** Plan du site de documentation : sert à la barre latérale, au menu mobile et aux liens précédent / suivant. */
export type DocPage = { title: string; href: string };
export type DocSection = { title: string; pages: DocPage[] };

export const DOCS_NAV: DocSection[] = [
  {
    title: "Démarrer",
    pages: [
      { title: "Installation", href: "/docs/getting-started/" },
      { title: "Thème", href: "/docs/theming/" },
    ],
  },
  {
    title: "Composants",
    pages: [
      { title: "Typographie", href: "/docs/typography/" },
      { title: "Boutons pilule", href: "/docs/pill/" },
      { title: "Surfaces", href: "/docs/surfaces/" },
      { title: "Formulaires", href: "/docs/forms/" },
      { title: "En-tête et pied de page", href: "/docs/site-chrome/" },
      { title: "Héros", href: "/docs/heroes/" },
    ],
  },
];

export const ALL_PAGES = DOCS_NAV.flatMap((section) => section.pages);

export const REPO_URL = "https://github.com/aa404/trc-ui";
