import {
  Avatar,
  AvatarGroup,
  CodeBlock as LibCodeBlock,
  Divider,
  Heading,
  Kbd,
  Skeleton,
  Spinner,
  Stat,
  Text,
} from "trc-ui";
import { Demo } from "@/components/demo";
import { TableDemo, TagsDemo, UploadProgressDemo } from "@/components/demos/data";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import { asset } from "@/lib/asset";
import type { Lang } from "@/lib/i18n";

type T = Record<Lang, string>;
const p = (name: string, type: string, description: T, def?: string): PropRow => ({
  name,
  type,
  description,
  default: def,
});
const row = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 } as const;

/* ---------- Avatar and tag ---------- */

export const avatarTitle = { en: "Avatar and tag", fr: "Avatar et étiquette" };

export function AvatarContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/avatar/"
      title={avatarTitle[lang]}
      lead={
        en
          ? "Round pictures of people and organizations, with their initials when there is no picture; small labels for metadata."
          : "Des photos rondes de personnes et d'organisations, avec leurs initiales à défaut de photo ; de petites étiquettes pour les métadonnées."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "*Avatars*" : "*Avatars*"}
      </Heading>
      <p>
        {en
          ? "The name is the accessible name, and the source of the initials. When the image is missing or fails to load, the initials take over."
          : "Le nom est le nom accessible, et la source des initiales. Quand l'image manque ou ne se charge pas, les initiales prennent le relais."}
      </p>
      <Demo
        code={`<Avatar name="trc ui" src="/apple-icon.png" size="lg" />
<Avatar name="Aurel Agbado" size="lg" />
<Avatar name="Ama Mensah" />
<Avatar name="Koffi" size="sm" />

<AvatarGroup max={3}>
  <Avatar name="Ama Mensah" />
  <Avatar name="Koffi Adjovi" />
  <Avatar name="Sena Houngbo" />
  <Avatar name="Yao Kouassi" />
  <Avatar name="Fifi Ahouansou" />
</AvatarGroup>`}
      >
        <div style={row}>
          <Avatar name="trc ui" src={asset("/apple-icon.png")} size="lg" />
          <Avatar name="Aurel Agbado" size="lg" />
          <Avatar name="Ama Mensah" />
          <Avatar name="Koffi" size="sm" />
        </div>
        <AvatarGroup max={3} moreLabel={(n) => (en ? `${n} more` : `${n} de plus`)}>
          <Avatar name="Ama Mensah" />
          <Avatar name="Koffi Adjovi" />
          <Avatar name="Sena Houngbo" />
          <Avatar name="Yao Kouassi" />
          <Avatar name="Fifi Ahouansou" />
        </AvatarGroup>
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("name", "string", {
            en: "Accessible name and source of the initials.",
            fr: "Nom accessible et source des initiales.",
          }),
          p("src", "string", {
            en: "Picture; initials when missing or broken.",
            fr: "Photo ; initiales si absente ou cassée.",
          }),
          p("size", '"sm" | "md" | "lg"', { en: "28, 40 or 56 px.", fr: "28, 40 ou 56 px." }, '"md"'),
          p(
            "AvatarGroup max / moreLabel",
            "number / (n) => string",
            { en: "Avatars shown, name of the counter.", fr: "Avatars affichés, nom du compteur." },
            "4",
          ),
        ]}
      />

      <Heading as="h2" size="lg">
        {en ? "*Tags*" : "*Étiquettes*"}
      </Heading>
      <p>
        {en
          ? "For a status, a category or an active filter. Keep the accent for the one tag that matters, and never place tags over photos."
          : "Pour un statut, une catégorie ou un filtre actif. Gardez l'accent pour l'étiquette qui compte, et ne posez jamais d'étiquette sur une photo."}
      </p>
      <Demo
        code={`<Tag tone="accent">New</Tag>
<Tag>Beta</Tag>
<Tag onRemove={() => removeFilter("Design")}>Design</Tag>`}
      >
        <TagsDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("tone", '"default" | "accent"', { en: "Color of the tag.", fr: "Couleur de l'étiquette." }, '"default"'),
          p("onRemove / removeLabel", "() => void / string", {
            en: "Shows a remove button.",
            fr: "Affiche un bouton pour retirer.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Stat and table ---------- */

export const tableTitle = { en: "Stat and table", fr: "Chiffre et tableau" };

export function TableContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/table/"
      title={tableTitle[lang]}
      lead={
        en
          ? "Key figures in large thin numbers, and data tables whose columns sort with a click or the keyboard."
          : "Des chiffres clés en grands numéros fins, et des tableaux dont les colonnes se trient au clic ou au clavier."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Key *figures*" : "Chiffres *clés*"}
      </Heading>
      <Demo
        code={`<Stat label="Visitors" value="12 480" change="+12 %" changeTone="positive" description="vs last month" />
<Stat label="Revenue" value="€8 200" change="−3 %" changeTone="negative" description="vs last month" />
<Stat label="Conversion" value="3.4 %" />`}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 32,
            width: "100%",
          }}
        >
          <Stat
            label={en ? "Visitors" : "Visiteurs"}
            value="12 480"
            change="+12 %"
            changeTone="positive"
            description={en ? "vs last month" : "sur un mois"}
          />
          <Stat
            label={en ? "Revenue" : "Chiffre d'affaires"}
            value="8 200 €"
            change="−3 %"
            changeTone="negative"
            description={en ? "vs last month" : "sur un mois"}
          />
          <Stat label="Conversion" value="3,4 %" />
        </div>
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("label / value", "ReactNode", {
            en: "The figure and what it measures.",
            fr: "Le chiffre et ce qu'il mesure.",
          }),
          p("change / changeTone", 'ReactNode / "positive" | "negative" | "neutral"', {
            en: "Evolution, in the accent or the error color.",
            fr: "Évolution, en accent ou en couleur d'erreur.",
          }),
          p("description", "ReactNode", { en: "Context: vs last month.", fr: "Contexte : sur un mois." }),
        ]}
      />

      <Heading as="h2" size="lg">
        {en ? "Data *table*" : "Tableau de *données*"}
      </Heading>
      <p>
        {en
          ? "The caption names the table; sortable headers are buttons, and the order is announced with aria-sort. Numbers align right. On small screens the table scrolls sideways, in a region reachable with Tab."
          : "La légende nomme le tableau ; les en-têtes triables sont des boutons, et l'ordre est annoncé par aria-sort. Les nombres s'alignent à droite. Sur petit écran, le tableau défile sur le côté, dans une zone atteignable avec Tab."}
      </p>
      <Demo
        code={`<Table
  caption="Invoices"
  rows={invoices}
  rowKey={(row) => row.id}
  defaultSort={{ key: "date", direction: "descending" }}
  columns={[
    { key: "id", header: "Invoice" },
    { key: "client", header: "Client", sortable: true },
    { key: "date", header: "Date", sortable: true, render: (row) => date.format(row.date) },
    { key: "status", header: "Status", render: (row) => <Tag>{row.status}</Tag> },
    { key: "amount", header: "Amount", align: "right", sortable: true, render: (row) => money.format(row.amount) },
  ]}
/>`}
      >
        <TableDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("columns", "{ key, header, align?, sortable?, render?, sortValue? }[]", {
            en: "Columns and how to show and sort them.",
            fr: "Les colonnes, leur affichage et leur tri.",
          }),
          p("rows / rowKey", "Row[] / (row) => string", {
            en: "Data and a unique key per row.",
            fr: "Les données et une clé unique par ligne.",
          }),
          p("caption / hideCaption", "ReactNode / boolean", {
            en: "Title of the table, visible or not.",
            fr: "Titre du tableau, visible ou non.",
          }),
          p("defaultSort", "{ key, direction }", { en: "Initial order.", fr: "Ordre initial." }),
          p("dense / emptyText", "boolean / ReactNode", {
            en: "Tighter rows; text without data.",
            fr: "Lignes resserrées ; texte sans données.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Loading ---------- */

export const loadingTitle = { en: "Loading", fr: "Chargement" };

export function LoadingContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/loading/"
      title={loadingTitle[lang]}
      lead={
        en
          ? "Placeholders while content loads, a spinner for short waits, and a progress bar when the total is known."
          : "Des formes d'attente pendant le chargement, un indicateur pour les attentes courtes, et une barre de progression quand le total est connu."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "*Skeleton*" : "*Squelette*"}
      </Heading>
      <p>
        {en
          ? "Shapes that shimmer where content will appear. They are hidden from screen readers: announce the loading elsewhere, for instance with a Spinner."
          : "Des formes qui scintillent là où le contenu va apparaître. Elles sont cachées aux lecteurs d'écran : annoncez le chargement ailleurs, par exemple avec un Spinner."}
      </p>
      <Demo
        code={`<Skeleton circle width={48} />
<Skeleton lines={3} width={280} />`}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", width: "100%", maxWidth: 360 }}>
          <Skeleton circle width={48} />
          <div style={{ flex: 1 }}>
            <Skeleton lines={3} />
          </div>
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "*Spinner*" : "*Indicateur*"}
      </Heading>
      <Demo code={`<Spinner size="sm" />\n<Spinner />\n<Spinner size="lg" label="Saving" />`}>
        <div style={row}>
          <Spinner size="sm" label={en ? "Loading" : "Chargement"} />
          <Spinner label={en ? "Loading" : "Chargement"} />
          <Spinner size="lg" label={en ? "Saving" : "Enregistrement"} />
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "*Progress*" : "*Progression*"}
      </Heading>
      <Demo code={`<Progress label="Uploading photos" value={value} showValue />\n<Progress label="Preparing…" />`}>
        <UploadProgressDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("Skeleton width / height / circle / lines", "number | string / boolean / number", {
            en: "Shape of the placeholder.",
            fr: "Forme de l'attente.",
          }),
          p(
            "Spinner size / label",
            '"sm" | "md" | "lg" / string',
            { en: "Size and announced text.", fr: "Taille et texte annoncé." },
            '"md" / "Loading"',
          ),
          p(
            "Progress value / max",
            "number",
            { en: "Leave value out for an unknown total.", fr: "Sans value pour un total inconnu." },
            "– / 100",
          ),
          p("Progress label / showValue / formatValue", "ReactNode / boolean / (v, max) => string", {
            en: "Label, shown and announced value.",
            fr: "Libellé, valeur affichée et annoncée.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Kbd and divider ---------- */

export const kbdTitle = { en: "Kbd and divider", fr: "Touches et séparateur" };

export function KbdContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/kbd/"
      title={kbdTitle[lang]}
      lead={
        en
          ? "Keyboard shortcuts, and hairlines between groups of content."
          : "Des raccourcis clavier, et des traits fins entre les groupes de contenu."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Keyboard *keys*" : "Touches du *clavier*"}
      </Heading>
      <Demo code={`<Text>Search with <Kbd>⌘</Kbd> <Kbd>K</Kbd>, close with <Kbd>Esc</Kbd>.</Text>`}>
        <Text>
          {en ? "Search with" : "Rechercher avec"} <Kbd>⌘</Kbd> <Kbd>K</Kbd>, {en ? "close with" : "fermer avec"}{" "}
          <Kbd>Esc</Kbd>.
        </Text>
      </Demo>

      <Heading as="h2" size="lg">
        *Divider*
      </Heading>
      <Demo code={`<Divider />\n<Divider label="or" />\n<Divider orientation="vertical" />`}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Text>{en ? "Sign in with your email" : "Connectez-vous avec votre e-mail"}</Text>
          <Divider label={en ? "or" : "ou"} />
          <Text>{en ? "Continue with a magic link" : "Continuez avec un lien magique"}</Text>
          <Divider />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Text size="sm">Docs</Text>
            <Divider orientation="vertical" />
            <Text size="sm">GitHub</Text>
            <Divider orientation="vertical" />
            <Text size="sm">npm</Text>
          </div>
        </div>
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("Divider label", "ReactNode", { en: "Word in the middle of the line.", fr: "Mot au milieu du trait." }),
          p(
            "Divider orientation",
            '"horizontal" | "vertical"',
            { en: "Direction of the line.", fr: "Sens du trait." },
            '"horizontal"',
          ),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Code block ---------- */

export const codeBlockTitle = { en: "Code block", fr: "Bloc de code" };

export function CodeBlockContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/code-block/"
      title={codeBlockTitle[lang]}
      lead={
        en
          ? "The code block of this site: a file tab, and a copy button that turns into an accent check for a moment."
          : "Le bloc de code de ce site : un onglet de fichier, et un bouton copier qui devient une coche d'accent un instant."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Copy in one *click*" : "Copier en un *clic*"}
      </Heading>
      <p>
        {en
          ? "trc ui does not bundle a highlighter: pass your own rendering (Shiki, Prism…) as children. The copy button always copies the code prop."
          : "trc ui n'embarque pas de coloration : passez votre propre rendu (Shiki, Prism…) en enfant. Le bouton copie toujours la prop code."}
      </p>
      <Demo
        code={`<CodeBlock title="Terminal" language="bash" code="npm install trc-ui" />
<CodeBlock code="pnpm add trc-ui" />`}
      >
        <div style={{ display: "grid", gap: 12, width: "100%" }}>
          <LibCodeBlock
            title="Terminal"
            language="bash"
            code="npm install trc-ui"
            copyLabel={en ? "Copy code" : "Copier le code"}
            copiedLabel={en ? "Copied" : "Copié"}
          />
          <LibCodeBlock
            code="pnpm add trc-ui"
            copyLabel={en ? "Copy code" : "Copier le code"}
            copiedLabel={en ? "Copied" : "Copié"}
          />
        </div>
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("code", "string", { en: "Source, and what gets copied.", fr: "Source, et ce qui est copié." }),
          p("title / language", "ReactNode / string", {
            en: "File tab and its badge.",
            fr: "Onglet de fichier et son badge.",
          }),
          p("children", "ReactNode", {
            en: "Highlighted rendering, from your highlighter.",
            fr: "Rendu coloré, depuis votre outil.",
          }),
          p(
            "copyLabel / copiedLabel",
            "string",
            { en: "Labels, for translations.", fr: "Libellés, pour la traduction." },
            '"Copy code" / "Copied"',
          ),
        ]}
      />
    </DocPage>
  );
}
