import { Breadcrumbs, Heading } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { PaginationDemo } from "@/components/demos/navigation";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const paginationTitle = { en: "Breadcrumbs and pagination", fr: "Fil d'Ariane et pagination" };

const BREADCRUMB_PROPS: PropRow[] = [
  {
    name: "items",
    type: "{ label, href? }[]",
    description: {
      en: "From the home page to the current page, which has no link.",
      fr: "De l'accueil à la page courante, qui n'a pas de lien.",
    },
  },
  {
    name: "label",
    type: "string",
    default: '"Breadcrumb"',
    description: { en: "Accessible name.", fr: "Nom accessible." },
  },
  {
    name: "linkAs",
    type: "ElementType",
    default: '"a"',
    description: { en: "Router link component.", fr: "Composant de lien du routeur." },
  },
];

const PAGINATION_PROPS: PropRow[] = [
  { name: "page", type: "number", description: { en: "Current page, from 1.", fr: "Page courante, à partir de 1." } },
  { name: "total", type: "number", description: { en: "Number of pages.", fr: "Nombre de pages." } },
  { name: "onPageChange", type: "(page) => void", description: { en: "Buttons mode.", fr: "Mode boutons." } },
  {
    name: "href",
    type: "string | (page) => string",
    description: {
      en: 'Links mode: a function, or a pattern such as "/blog/page/{page}" that also works from a server component.',
      fr: 'Mode liens : une fonction, ou un modèle comme "/blog/page/{page}" qui fonctionne aussi depuis un composant serveur.',
    },
  },
  {
    name: "siblings",
    type: "number",
    default: "1",
    description: {
      en: "Pages shown on each side of the current one.",
      fr: "Pages affichées de chaque côté de la page courante.",
    },
  },
  {
    name: "label / previousLabel / nextLabel / pageLabel",
    type: "string / (page) => string",
    description: { en: "Labels, for translations.", fr: "Libellés, pour la traduction." },
  },
];

export function PaginationContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/pagination/"
      title={paginationTitle[lang]}
      lead={
        en
          ? "Breadcrumbs show where the page is; pagination leads to the next ones."
          : "Le fil d'Ariane montre où se trouve la page ; la pagination mène aux suivantes."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "*Breadcrumbs*" : "Fil d'*Ariane*"}
      </Heading>
      <Demo
        code={`<Breadcrumbs
  linkAs={Link}
  items={[
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Breadcrumbs and pagination" },
  ]}
/>`}
      >
        <Breadcrumbs
          label={en ? "Breadcrumb" : "Fil d'Ariane"}
          items={[
            { label: en ? "Home" : "Accueil", href: "#" },
            { label: "Docs", href: "#" },
            { label: paginationTitle[lang] },
          ]}
        />
      </Demo>
      <PropsTable lang={lang} rows={BREADCRUMB_PROPS} />

      <Heading as="h2" size="lg">
        *Pagination*
      </Heading>
      <p>
        {en
          ? "The first and last pages are always there, with the current one and its neighbours in between; the number of controls stays constant, so they do not jump as you move."
          : "La première et la dernière page sont toujours là, avec la page courante et ses voisines entre les deux ; le nombre de contrôles reste constant, ils ne bougent pas quand on avance."}
      </p>
      <Demo
        code={`const [page, setPage] = useState(5);\n\n<Pagination page={page} total={20} onPageChange={setPage} />`}
      >
        <PaginationDemo lang={lang} />
      </Demo>
      <p>
        {en
          ? "For lists that search engines should crawl, use links: give a pattern, which also works in a server component."
          : "Pour les listes que les moteurs de recherche doivent parcourir, utilisez des liens : donnez un modèle, qui fonctionne aussi dans un composant serveur."}
      </p>
      <CodeBlock code={`<Pagination page={page} total={total} href="/blog/page/{page}" linkAs={Link} />`} />
      <PropsTable lang={lang} rows={PAGINATION_PROPS} />
    </DocPage>
  );
}
