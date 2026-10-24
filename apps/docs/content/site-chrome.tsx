import { Heading, PillLink, SiteFooter, SiteHeader, Text } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const siteChromeTitle = { en: "Header and footer", fr: "En-tête et pied de page" };

const LINK_AS: PropRow = {
  name: "linkAs",
  type: "ElementType",
  default: '"a"',
  description: {
    en: "Your router's link component, used for every link.",
    fr: "Le composant de lien de votre routeur, pour tous les liens.",
  },
};

const HEADER_PROPS: PropRow[] = [
  {
    name: "logo",
    type: "ReactNode",
    description: {
      en: "White logo, wrapped in a link to homeHref.",
      fr: "Logo blanc, placé dans un lien vers homeHref.",
    },
  },
  {
    name: "logoLabel",
    type: "string",
    description: { en: "Accessible name of the logo link.", fr: "Nom accessible du lien du logo." },
  },
  {
    name: "homeHref",
    type: "string",
    default: '"/"',
    description: { en: "Target of the logo link.", fr: "Cible du lien du logo." },
  },
  {
    name: "nav",
    type: "NavItem[]",
    description: {
      en: "Links ({ label, href, active }) and dropdowns ({ label, items }).",
      fr: "Liens ({ label, href, active }) et menus déroulants ({ label, items }).",
    },
  },
  {
    name: "cta",
    type: "{ label, href }",
    description: {
      en: "Main action: a compact pill, and a large one in the mobile menu.",
      fr: "Action principale : pilule compacte, et grande pilule dans le menu mobile.",
    },
  },
  {
    name: "actions",
    type: "ReactNode",
    description: {
      en: "Extra elements on the right (language switcher…).",
      fr: "Éléments en plus à droite (sélecteur de langue…).",
    },
  },
  {
    name: "mobileFooter",
    type: "ReactNode",
    description: { en: "Content at the bottom of the mobile menu.", fr: "Contenu en bas du menu mobile." },
  },
  LINK_AS,
  {
    name: "scrollThreshold",
    type: "number",
    default: "24",
    description: {
      en: "Scroll offset (px) from which the bar turns graphite.",
      fr: "Défilement (px) à partir duquel la barre devient graphite.",
    },
  },
  {
    name: "menuLabel / closeLabel",
    type: "string",
    default: '"Menu" / "Close"',
    description: {
      en: "Labels of the mobile menu buttons, for translations.",
      fr: "Libellés des boutons du menu mobile, pour la traduction.",
    },
  },
];

const FOOTER_PROPS: PropRow[] = [
  {
    name: "logo / logoLabel",
    type: "ReactNode / string",
    description: { en: "Logo and its accessible name.", fr: "Logo et son nom accessible." },
  },
  {
    name: "tagline",
    type: "ReactNode",
    description: { en: "Short sentence under the logo.", fr: "Phrase courte sous le logo." },
  },
  {
    name: "children",
    type: "ReactNode",
    description: { en: "Under the sentence: a pill, a contact…", fr: "Sous la phrase : une pilule, un contact…" },
  },
  {
    name: "columns",
    type: "{ title, links }[]",
    description: {
      en: "Site map in columns, with spaced small-caps titles.",
      fr: "Plan du site en colonnes, titres en petites capitales espacées.",
    },
  },
  {
    name: "copyright",
    type: "ReactNode",
    description: { en: "Bottom line on the left.", fr: "Mention en bas à gauche." },
  },
  {
    name: "legal",
    type: "{ label, href }[]",
    description: { en: "Legal links on the right.", fr: "Liens légaux à droite." },
  },
  LINK_AS,
  {
    name: "columnsLabel / legalLabel",
    type: "string",
    default: '"Site map" / "Legal"',
    description: { en: "Accessible names of both navigations.", fr: "Noms accessibles des deux navigations." },
  },
];

const T = {
  en: {
    lead: "A floating header that turns into a blurred graphite bar as the page scrolls, and a footer laid out as a graphite card. Both take your router's links.",
    product: "Product",
    how: "How it works",
    howDesc: "The three steps, from setup to results.",
    cases: "Use cases",
    casesDesc: "What teams build with it.",
    pricing: "Pricing",
    about: "About",
    signIn: "Sign in",
    below: "The header floats above the page content.",
    tagline: "Interfaces in deep black, sober and precise.",
    start: "Get started",
    company: "Company",
    resources: "Resources",
    contact: "Contact",
    docs: "Docs",
    blog: "Blog",
    rights: "© 2026 Acme. All rights reserved.",
    terms: "Terms",
    privacy: "Privacy",
  },
  fr: {
    lead: "Un en-tête flottant qui devient une barre graphite floutée quand la page défile, et un pied de page en carte graphite. Les deux acceptent les liens de votre routeur.",
    product: "Produit",
    how: "Comment ça marche",
    howDesc: "Les trois étapes, de l'installation aux résultats.",
    cases: "Cas d'usage",
    casesDesc: "Ce que les équipes en font.",
    pricing: "Tarifs",
    about: "À propos",
    signIn: "Se connecter",
    below: "L'en-tête flotte au-dessus du contenu de la page.",
    tagline: "Des interfaces en noir profond, sobres et précises.",
    start: "Commencer",
    company: "Société",
    resources: "Ressources",
    contact: "Contact",
    docs: "Documentation",
    blog: "Blog",
    rights: "© 2026 Acme. Tous droits réservés.",
    terms: "Conditions",
    privacy: "Confidentialité",
  },
};

const Logo = () => <span className="docs-logo">acme</span>;

export function SiteChromeContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  const nav = [
    {
      label: t.product,
      items: [
        { label: t.how, href: "#", description: t.howDesc },
        { label: t.cases, href: "#", description: t.casesDesc },
      ],
    },
    { label: t.pricing, href: "#", active: true },
    { label: t.about, href: "#" },
  ];
  return (
    <DocPage lang={lang} href="/docs/site-chrome/" title={siteChromeTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "Floating *header*" : "En-tête *flottant*"}
      </Heading>
      <p>
        {en
          ? "Transparent over the hero at the top of the page, the bar becomes blurred graphite once the page scrolls. Hover the first entry to open its dropdown: no numbers, a label and a short description per item. Below 1024 px, the navigation moves into a side panel that keeps focus inside and closes with Escape."
          : "Transparente sur le héros en haut de page, la barre devient graphite floutée dès que la page défile. Survolez la première entrée pour ouvrir son menu : pas de numéros, un libellé et une courte description par entrée. Sous 1024 px, la navigation passe dans un panneau latéral qui garde le focus et se ferme avec Échap."}
      </p>
      <Demo
        frame
        code={`<SiteHeader
  logo={<Logo />}
  logoLabel="Acme"
  linkAs={Link}
  nav={[
    {
      label: "${t.product}",
      items: [
        { label: "${t.how}", href: "/how", description: "${t.howDesc}" },
        { label: "${t.cases}", href: "/cases", description: "${t.casesDesc}" },
      ],
    },
    { label: "${t.pricing}", href: "/pricing", active: true },
    { label: "${t.about}", href: "/about" },
  ]}
  cta={{ label: "${t.signIn}", href: "/login" }}
/>`}
      >
        <div style={{ position: "relative", height: 380 }}>
          <SiteHeader logo={<Logo />} logoLabel="Acme" nav={nav} cta={{ label: t.signIn, href: "#" }} />
          <Text tone="subtle" style={{ position: "absolute", bottom: 28, left: 32, right: 32 }}>
            {t.below}
          </Text>
        </div>
      </Demo>
      <p>
        {en ? (
          <>
            The header is <code>position: fixed</code>: leave room for it at the top of your first section (about 112 px
            on mobile, 136 px beyond), as heroes already do.
          </>
        ) : (
          <>
            L&apos;en-tête est en <code>position: fixed</code> : laissez-lui de la place en haut de votre première
            section (environ 112 px sur mobile, 136 px au-delà), comme le font déjà les héros.
          </>
        )}
      </p>
      <PropsTable lang={lang} rows={HEADER_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Footer as a *card*" : "Pied de page en *carte*"}
      </Heading>
      <p>
        {en
          ? "Brand and call to action on the left, site map in columns on the right, legal links at the bottom. The column titles are the only place where spaced small caps are allowed."
          : "Marque et appel à l'action à gauche, plan du site en colonnes à droite, liens légaux en bas. Les titres de colonnes sont le seul endroit où les petites capitales espacées sont admises."}
      </p>
      <Demo
        frame
        code={`<SiteFooter
  logo={<Logo />}
  logoLabel="Acme"
  tagline="${t.tagline}"
  linkAs={Link}
  columns={[
    { title: "${t.product}", links: [{ label: "${t.how}", href: "/how" }, { label: "${t.pricing}", href: "/pricing" }] },
    { title: "${t.resources}", links: [{ label: "${t.docs}", href: "/docs" }, { label: "${t.blog}", href: "/blog" }] },
    { title: "${t.company}", links: [{ label: "${t.about}", href: "/about" }, { label: "${t.contact}", href: "/contact" }] },
  ]}
  copyright="${t.rights}"
  legal={[{ label: "${t.terms}", href: "/terms" }, { label: "${t.privacy}", href: "/privacy" }]}
>
  <PillLink as={Link} href="/start">${t.start}</PillLink>
</SiteFooter>`}
      >
        <SiteFooter
          logo={<Logo />}
          logoLabel="Acme"
          tagline={t.tagline}
          columns={[
            {
              title: t.product,
              links: [
                { label: t.how, href: "#" },
                { label: t.pricing, href: "#" },
              ],
            },
            {
              title: t.resources,
              links: [
                { label: t.docs, href: "#" },
                { label: t.blog, href: "#" },
              ],
            },
            {
              title: t.company,
              links: [
                { label: t.about, href: "#" },
                { label: t.contact, href: "#" },
              ],
            },
          ]}
          copyright={t.rights}
          legal={[
            { label: t.terms, href: "#" },
            { label: t.privacy, href: "#" },
          ]}
        >
          <PillLink href="#">{t.start}</PillLink>
        </SiteFooter>
      </Demo>
      <PropsTable lang={lang} rows={FOOTER_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Translating the *labels*" : "Traduire les *libellés*"}
      </Heading>
      <p>
        {en
          ? "Every built-in label is in English by default and can be replaced:"
          : "Chaque libellé intégré est en anglais par défaut et peut être remplacé :"}
      </p>
      <CodeBlock
        code={`<SiteHeader menuLabel="Menu" closeLabel="Fermer" … />
<SiteFooter columnsLabel="Plan du site" legalLabel="Informations légales" … />`}
      />
    </DocPage>
  );
}
