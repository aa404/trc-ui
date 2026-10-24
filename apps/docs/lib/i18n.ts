/** Langues du site : l'anglais à la racine, le français sous /fr. */
export const LANGS = ["en", "fr"] as const;
export type Lang = (typeof LANGS)[number];

/** Chemin d'une page dans une langue donnée (`/docs/x/` → `/fr/docs/x/`). */
export const localePath = (lang: Lang, path: string) => (lang === "en" ? path : `/fr${path === "/" ? "/" : path}`);

/** Langue d'un chemin, et le même chemin sans préfixe de langue. */
export const splitPath = (pathname: string): { lang: Lang; path: string } =>
  pathname === "/fr" || pathname.startsWith("/fr/")
    ? { lang: "fr", path: pathname.slice(3) || "/" }
    : { lang: "en", path: pathname };

/** Textes de l'interface du site (le contenu des pages est dans `content/`). */
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
  },
} satisfies Record<Lang, Record<string, string>>;
