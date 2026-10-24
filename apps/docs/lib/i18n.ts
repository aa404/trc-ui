/** Site languages: English at the root, French under /fr. */
export const LANGS = ["en", "fr"] as const;
export type Lang = (typeof LANGS)[number];

/** Path of a page in a given language (`/docs/x/` → `/fr/docs/x/`). */
export const localePath = (lang: Lang, path: string) => (lang === "en" ? path : `/fr${path === "/" ? "/" : path}`);

/** Language of a path, and the same path without the language prefix. */
export const splitPath = (pathname: string): { lang: Lang; path: string } =>
  pathname === "/fr" || pathname.startsWith("/fr/")
    ? { lang: "fr", path: pathname.slice(3) || "/" }
    : { lang: "en", path: pathname };

/** Site UI strings (page content lives in `content/`). */
export const UI = {
  en: {
    tagline:
      "Open source React components: near-black backgrounds, graphite cards, thin headings and a single accent color.",
    description:
      "React components with a deep black design: near-black backgrounds, graphite cards, thin headings and pill buttons.",
    getStarted: "Get started",
    browse: "Browse components",
    previous: "Previous",
    next: "Next",
    adjacent: "Adjacent pages",
    docs: "Documentation",
    menu: "Menu",
    close: "Close",
    home: "trc-ui, home",
    language: "Language",
    colorsGenerator: "Colors generator",
    components: "Components",
    notifications: "Notifications",
  },
  fr: {
    tagline:
      "Composants React open source : fonds quasi noirs, cartes graphite, titres fins et une seule couleur d'accent.",
    description:
      "Composants React au design « noir profond » : fonds quasi noirs, cartes graphite, titres fins et boutons pilule.",
    getStarted: "Démarrer",
    browse: "Voir les composants",
    previous: "Précédent",
    next: "Suivant",
    adjacent: "Pages voisines",
    docs: "Documentation",
    menu: "Menu",
    close: "Fermer",
    home: "trc-ui, accueil",
    language: "Langue",
    colorsGenerator: "Générateur de couleurs",
    components: "Composants",
    notifications: "Notifications",
  },
} satisfies Record<Lang, Record<string, string>>;
