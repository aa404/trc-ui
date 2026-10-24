import { Heading } from "trc-ui";
import { Demo } from "@/components/demo";
import {
  ComboboxDemo,
  DatePickerDemo,
  DropzoneDemo,
  FileDemo,
  PasswordDemo,
  PinDemo,
  RadioDemo,
  SliderDemo,
} from "@/components/demos/forms";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

type T = Record<Lang, string>;
const p = (name: string, type: string, description: T, def?: string): PropRow => ({
  name,
  type,
  description,
  default: def,
});

/* ---------- Radio group ---------- */

export const radioGroupTitle = { en: "Radio group", fr: "Boutons radio" };

export function RadioGroupContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/radio-group/"
      title={radioGroupTitle[lang]}
      lead={
        en
          ? "One choice among a few options, as native radio buttons in a fieldset. The legend is read with each option, and the arrows move the choice."
          : "Un choix parmi quelques options, en boutons radio natifs dans un groupe. La légende est lue avec chaque option, et les flèches déplacent le choix."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Vertical and *horizontal*" : "Vertical et *horizontal*"}
      </Heading>
      <Demo
        code={`<RadioGroup
  label="Plan"
  hint="You can change it at any time."
  defaultValue="pro"
  options={[
    { value: "free", label: "Free", description: "For personal projects" },
    { value: "pro", label: "Pro", description: "For a business, up to 10 sites" },
    { value: "team", label: "Team", description: "Coming soon", disabled: true },
  ]}
/>

<RadioGroup label="Contact me by" orientation="horizontal" options={…} error="Choose a way to reach you." required />`}
      >
        <RadioDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("label", "ReactNode", { en: "Question of the group, its legend.", fr: "Question du groupe, sa légende." }),
          p("options", "{ value, label, description?, disabled? }[]", { en: "The choices.", fr: "Les choix." }),
          p("value / defaultValue", "string", {
            en: "Chosen option, controlled or not.",
            fr: "Option choisie, contrôlée ou non.",
          }),
          p("onValueChange", "(value) => void", { en: "Called on change.", fr: "Appelé au changement." }),
          p("hint / error", "ReactNode", {
            en: "Tied to the group; error marks it invalid.",
            fr: "Reliés au groupe ; l'erreur le marque invalide.",
          }),
          p(
            "orientation",
            '"vertical" | "horizontal"',
            { en: "Layout of the options.", fr: "Disposition des options." },
            '"vertical"',
          ),
          p("required / name", "boolean / string", {
            en: "Native form behavior.",
            fr: "Comportement natif des formulaires.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Password and code ---------- */

export const passwordTitle = { en: "Password and code", fr: "Mot de passe et code" };

export function PasswordContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/password/"
      title={passwordTitle[lang]}
      lead={
        en
          ? "A password field that can show what was typed, and boxes for one-time codes sent by text or email."
          : "Un mot de passe que l'on peut afficher, et des cases pour les codes à usage unique reçus par SMS ou e-mail."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Show the *password*" : "Afficher le *mot de passe*"}
      </Heading>
      <p>
        {en
          ? "The button reads “Show password” for screen readers: its visible text plus a hidden word, so voice users can say what they see."
          : "Le bouton s'annonce « Afficher le mot de passe » : son texte visible plus un mot masqué, pour que la commande vocale fonctionne avec ce qu'on voit."}
      </p>
      <Demo
        code={`<Field label="Password" hint="At least 12 characters.">
  <PasswordInput autoComplete="new-password" />
</Field>

<PasswordInput showLabel="Afficher" hideLabel="Masquer" noun="le mot de passe" />`}
      >
        <PasswordDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p(
            "showLabel / hideLabel",
            "string",
            { en: "Visible text of the button.", fr: "Texte visible du bouton." },
            '"Show" / "Hide"',
          ),
          p("noun", "string", { en: "Completes the button's name.", fr: "Complète le nom du bouton." }, '"password"'),
          p("…props", 'ComponentProps<"input">', {
            en: "Every attribute of Input.",
            fr: "Tous les attributs d'Input.",
          }),
        ]}
      />

      <Heading as="h2" size="lg">
        {en ? "One-time *code*" : "Code à *usage unique*"}
      </Heading>
      <p>
        {en
          ? "Typing moves forward, Backspace moves back, pasting fills every box, and phones can fill the code from a text message."
          : "La saisie avance seule, Retour arrière recule, un collage remplit toutes les cases, et les téléphones peuvent remplir le code depuis un SMS."}
      </p>
      <Demo
        code={`<Field label="Verification code" hint="Sent to +229 •• •• 42 17">
  <PinInput length={6} onComplete={(code) => verify(code)} />
</Field>`}
      >
        <PinDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("length", "number", { en: "Number of boxes.", fr: "Nombre de cases." }, "6"),
          p("value / defaultValue / onChange", "string", {
            en: "The code, controlled or not.",
            fr: "Le code, contrôlé ou non.",
          }),
          p("onComplete", "(code) => void", {
            en: "Called once every box is filled.",
            fr: "Appelé quand toutes les cases sont remplies.",
          }),
          p(
            "type",
            '"numeric" | "alphanumeric"',
            { en: "Accepted characters and phone keyboard.", fr: "Caractères acceptés et clavier du téléphone." },
            '"numeric"',
          ),
          p("mask", "boolean", { en: "Hides the characters.", fr: "Masque les caractères." }, "false"),
          p("label / charLabel", "string / (i, n) => string", {
            en: "Accessible names, for translations.",
            fr: "Noms accessibles, pour la traduction.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Combobox ---------- */

export const comboboxTitle = { en: "Combobox", fr: "Liste avec recherche" };

export function ComboboxContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/combobox/"
      title={comboboxTitle[lang]}
      lead={
        en
          ? "A search field with suggestions, for long lists such as countries or cities. The search ignores case and accents."
          : "Un champ de recherche avec suggestions, pour les longues listes comme des pays ou des villes. La recherche ignore majuscules et accents."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Search and *choose*" : "Chercher et *choisir*"}
      </Heading>
      <p>
        {en
          ? "The arrows move the active option while focus stays in the field; Enter chooses; Escape closes; leaving the field restores the chosen label."
          : "Les flèches déplacent l'option active pendant que le focus reste dans le champ ; Entrée choisit ; Échap ferme ; quitter le champ remet le libellé choisi."}
      </p>
      <Demo
        code={`const [country, setCountry] = useState<string | null>("bj");

<Field label="Country">
  <Combobox
    options={[{ value: "bj", label: "Bénin" }, { value: "ci", label: "Côte d'Ivoire" }, …]}
    value={country}
    onValueChange={setCountry}
    placeholder="Search a country"
    name="country"
  />
</Field>`}
      >
        <ComboboxDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("options", "{ value, label, description?, disabled? }[]", { en: "Suggestions.", fr: "Les suggestions." }),
          p("value / defaultValue", "string | null", {
            en: "Chosen value, controlled or not.",
            fr: "Valeur choisie, contrôlée ou non.",
          }),
          p("onValueChange", "(value) => void", { en: "Called on change.", fr: "Appelé au changement." }),
          p("placeholder / emptyText", "string / ReactNode", {
            en: "Texts of the field and of an empty search.",
            fr: "Textes du champ et d'une recherche vide.",
          }),
          p("name", "string", {
            en: "Submits the chosen value with forms.",
            fr: "Envoie la valeur choisie avec le formulaire.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- File upload ---------- */

export const fileUploadTitle = { en: "File upload", fr: "Envoi de fichiers" };

export function FileUploadContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/file-upload/"
      title={fileUploadTitle[lang]}
      lead={
        en
          ? "A compact file field and a drop zone, both on the native file input: hidden, but reachable with the keyboard."
          : "Un champ fichier compact et une zone de dépôt, tous deux sur le champ fichier natif : masqué, mais atteignable au clavier."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "File *field*" : "Champ *fichier*"}
      </Heading>
      <Demo
        code={`<Field label="Resume" hint="PDF only.">
  <FileInput accept=".pdf" onFilesChange={(files) => …} />
</Field>`}
      >
        <FileDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("accept / multiple", "string / boolean", {
            en: "Native file input rules.",
            fr: "Règles du champ fichier natif.",
          }),
          p("onFilesChange", "(files) => void", { en: "Chosen files.", fr: "Les fichiers choisis." }),
          p("buttonLabel / placeholder / countLabel", "string / (n) => string", {
            en: "Texts, for translations.",
            fr: "Textes, pour la traduction.",
          }),
        ]}
      />

      <Heading as="h2" size="lg">
        {en ? "Drop *zone*" : "Zone de *dépôt*"}
      </Heading>
      <p>
        {en
          ? "Drop files on it, click it, or reach it with Tab and press Space. Accepted files are listed with their size; rejected ones are announced with their reason."
          : "Déposez-y des fichiers, cliquez-la, ou atteignez-la avec Tab et appuyez sur Espace. Les fichiers acceptés sont listés avec leur taille ; les refusés sont annoncés avec leur raison."}
      </p>
      <Demo
        code={`<Dropzone
  accept="image/*,.pdf"
  maxSize={5 * 1024 * 1024}
  maxFiles={4}
  hint="Images or PDF, up to 5 MB each, 4 files at most."
  onFilesChange={(files) => setFiles(files)}
/>`}
      >
        <DropzoneDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("accept", "string", {
            en: 'Extensions and types: ".pdf,image/*".',
            fr: 'Extensions et types : ".pdf,image/*".',
          }),
          p("maxSize / maxFiles", "number", {
            en: "Size in bytes, number of files.",
            fr: "Taille en octets, nombre de fichiers.",
          }),
          p(
            "multiple",
            "boolean",
            {
              en: "Several files, or one replaced each time.",
              fr: "Plusieurs fichiers, ou un seul remplacé à chaque fois.",
            },
            "true",
          ),
          p("onFilesChange", "(files) => void", {
            en: "Every accepted file after each change.",
            fr: "Tous les fichiers acceptés, à chaque changement.",
          }),
          p("title / browseLabel / hint", "ReactNode", { en: "Texts of the zone.", fr: "Textes de la zone." }),
          p("removeLabel / rejectionLabel", "(file) => string", {
            en: "Messages, for translations.",
            fr: "Messages, pour la traduction.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Slider ---------- */

export const sliderTitle = { en: "Slider", fr: "Curseur" };

export function SliderContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/slider/"
      title={sliderTitle[lang]}
      lead={
        en
          ? "A range slider on the native input: arrows, Page Up and Down, Home and End work as usual, and the track fills with the accent."
          : "Un curseur sur le champ natif : flèches, Page précédente et suivante, Début et Fin fonctionnent comme d'habitude, et la piste se remplit de l'accent."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "With a *value*" : "Avec sa *valeur*"}
      </Heading>
      <p>
        {en
          ? "formatValue formats both the value shown and the one announced to screen readers."
          : "formatValue met en forme à la fois la valeur affichée et celle annoncée aux lecteurs d'écran."}
      </p>
      <Demo
        code={`<Field label="Monthly budget">
  <Slider min={0} max={500} step={10} defaultValue={120} showValue formatValue={(v) => price.format(v)} />
</Field>`}
      >
        <SliderDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("value / defaultValue", "number", { en: "Value, controlled or not.", fr: "Valeur, contrôlée ou non." }),
          p("onValueChange", "(value) => void", { en: "Called with a number.", fr: "Appelé avec un nombre." }),
          p("min / max / step", "number", { en: "Range and step.", fr: "Bornes et pas." }, "0 / 100 / 1"),
          p("showValue / formatValue", "boolean / (v) => ReactNode", {
            en: "Shown and announced value.",
            fr: "Valeur affichée et annoncée.",
          }),
        ]}
      />
    </DocPage>
  );
}

/* ---------- Date picker ---------- */

export const datePickerTitle = { en: "Date picker", fr: "Sélecteur de date" };

export function DatePickerContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/date-picker/"
      title={datePickerTitle[lang]}
      lead={
        en
          ? "A date field that opens a calendar. Month and day names come from the browser in the language you choose."
          : "Un champ de date qui ouvre un calendrier. Les noms des mois et des jours viennent du navigateur, dans la langue choisie."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "With the *keyboard*" : "Au *clavier*"}
      </Heading>
      <p>
        {en
          ? "Arrows move by a day or a week, Home and End to the start and end of the week, Page Up and Page Down by a month (with Shift, a year), Enter chooses, Escape closes. Each day is announced in full, and today carries a small accent dot."
          : "Les flèches avancent d'un jour ou d'une semaine, Début et Fin vont au début et à la fin de la semaine, Page précédente et suivante changent de mois (avec Maj, d'année), Entrée choisit, Échap ferme. Chaque jour est annoncé en entier, et aujourd'hui porte un petit point d'accent."}
      </p>
      <Demo
        code={`<Field label="Arrival" hint="From today, within 3 months.">
  <DatePicker
    value={date}
    onValueChange={setDate}
    locale="en-GB"
    min={today}
    max={inThreeMonths}
    name="arrival"
  />
</Field>`}
      >
        <DatePickerDemo lang={lang} />
      </Demo>
      <PropsTable
        lang={lang}
        rows={[
          p("value / defaultValue", "Date | null", {
            en: "Chosen date, controlled or not.",
            fr: "Date choisie, contrôlée ou non.",
          }),
          p("onValueChange", "(date) => void", { en: "Called on choice.", fr: "Appelé au choix." }),
          p("min / max", "Date", { en: "Choosable range.", fr: "Dates possibles." }),
          p("locale", "string", { en: 'Language of the names: "fr-FR".', fr: 'Langue des noms : "fr-FR".' }),
          p("weekStartsOn", "number", { en: "0 for Sunday, 1 for Monday.", fr: "0 pour dimanche, 1 pour lundi." }, "1"),
          p("formatDate", "(date) => string", { en: "Format in the field.", fr: "Format dans le champ." }),
          p("name", "string", { en: "Submits YYYY-MM-DD with forms.", fr: "Envoie AAAA-MM-JJ avec le formulaire." }),
          p("placeholder / label / previousMonthLabel / nextMonthLabel", "string", {
            en: "Texts, for translations.",
            fr: "Textes, pour la traduction.",
          }),
        ]}
      />
    </DocPage>
  );
}
