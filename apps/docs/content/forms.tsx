import { Checkbox, Field, Heading, Input, Select, Switch, Textarea } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const formsTitle = { en: "Forms", fr: "Formulaires" };

const FIELD_PROPS: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    description: { en: "Visible label, tied to the control.", fr: "Libellé visible, relié au champ." },
  },
  {
    name: "hint",
    type: "ReactNode",
    description: { en: "Help shown under the control.", fr: "Aide affichée sous le champ." },
  },
  {
    name: "error",
    type: "ReactNode",
    description: {
      en: "Replaces the hint and marks the control as invalid.",
      fr: "Remplace l'aide et marque le champ comme invalide.",
    },
  },
  {
    name: "required",
    type: "boolean",
    default: "false",
    description: {
      en: "Adds an accent asterisk and sets required on the control.",
      fr: "Ajoute un astérisque d'accent et pose required sur le champ.",
    },
  },
  {
    name: "id",
    type: "string",
    description: { en: "Control id; generated when omitted.", fr: "Identifiant du champ ; généré sinon." },
  },
];

const CONTROL_PROPS: PropRow[] = [
  {
    name: "invalid",
    type: "boolean",
    description: {
      en: "Forces the error style; set automatically by a Field with an error.",
      fr: "Force le style d'erreur ; posé automatiquement par un Field en erreur.",
    },
  },
  {
    name: "placeholder",
    type: "string",
    description: {
      en: "On Select: an empty option shown, in grey, until something is chosen.",
      fr: "Sur Select : une option vide affichée en gris tant que rien n'est choisi.",
    },
  },
  {
    name: "…props",
    type: "native attributes",
    description: {
      en: "Every attribute of input, textarea or select, and a ref.",
      fr: "Tous les attributs de input, textarea ou select, et une ref.",
    },
  },
];

const TOGGLE_PROPS: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    description: { en: "Label; the whole block is clickable.", fr: "Libellé ; tout le bloc est cliquable." },
  },
  {
    name: "description",
    type: "ReactNode",
    description: { en: "Extra detail under the label.", fr: "Précision sous le libellé." },
  },
  {
    name: "…props",
    type: 'ComponentProps<"input">',
    description: {
      en: "checked, defaultChecked, onChange, disabled, name… and a ref.",
      fr: "checked, defaultChecked, onChange, disabled, name… et une ref.",
    },
  },
];

const T = {
  en: {
    lead: "Native form controls dressed in deep black: thin borders that take the accent on focus, labels and messages wired for screen readers automatically.",
    name: "Name",
    email: "Email",
    emailError: "This address is not valid.",
    subject: "Subject",
    subjectHint: "We reply within two business days.",
    choose: "Choose a subject",
    quote: "Quote request",
    support: "Support",
    other: "Other",
    message: "Message",
    messagePh: "Your message",
    terms: "I accept the terms of use",
    news: "Receive the newsletter",
    newsDesc: "One email a month, no ads.",
    notif: "Notifications",
    notifDesc: "Get notified of replies.",
    compact: "Compact mode",
  },
  fr: {
    lead: "Des champs natifs habillés en noir profond : bordures fines qui prennent l'accent au focus, libellés et messages reliés automatiquement pour les lecteurs d'écran.",
    name: "Nom",
    email: "E-mail",
    emailError: "Cette adresse n'est pas valide.",
    subject: "Sujet",
    subjectHint: "Nous répondons sous deux jours ouvrés.",
    choose: "Choisir un sujet",
    quote: "Demande de devis",
    support: "Assistance",
    other: "Autre",
    message: "Message",
    messagePh: "Votre message",
    terms: "J'accepte les conditions d'utilisation",
    news: "Recevoir la lettre d'information",
    newsDesc: "Un e-mail par mois, sans publicité.",
    notif: "Notifications",
    notifDesc: "Être prévenu des réponses.",
    compact: "Mode compact",
  },
};

const column = { display: "grid", gap: 20, width: "100%", maxWidth: 420 } as const;
const twoCols = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  width: "100%",
} as const;

export function FormsContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  return (
    <DocPage lang={lang} href="/docs/forms/" title={formsTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "Fields and *labels*" : "Champs et *libellés*"}
      </Heading>
      <p>
        {en ? (
          <>
            Wrap a control in <code>Field</code>: it renders the label, the hint or the error, and passes{" "}
            <code>id</code>, <code>aria-describedby</code> and <code>aria-invalid</code> to the control. Nothing to wire
            by hand.
          </>
        ) : (
          <>
            Placez un champ dans <code>Field</code> : il affiche le libellé, l&apos;aide ou l&apos;erreur, et transmet{" "}
            <code>id</code>, <code>aria-describedby</code> et <code>aria-invalid</code> au champ. Rien à relier à la
            main.
          </>
        )}
      </p>
      <Demo
        code={`<Field label="${t.name}" required>
  <Input autoComplete="name" />
</Field>
<Field label="${t.email}" error="${t.emailError}">
  <Input type="email" defaultValue="name@" />
</Field>`}
      >
        <div style={column}>
          <Field label={t.name} required>
            <Input autoComplete="name" />
          </Field>
          <Field label={t.email} error={t.emailError}>
            <Input type="email" defaultValue="name@" />
          </Field>
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Select and *textarea*" : "Liste et *zone de texte*"}
      </Heading>
      <p>
        {en ? (
          <>
            <code>Select</code> is the native list, accessible and mobile friendly, with a thin chevron. Its{" "}
            <code>placeholder</code> stays grey until something is chosen.
          </>
        ) : (
          <>
            <code>Select</code> est la liste native, accessible et adaptée au mobile, avec un chevron fin. Son{" "}
            <code>placeholder</code> reste en gris tant que rien n&apos;est choisi.
          </>
        )}
      </p>
      <Demo
        code={`<Field label="${t.subject}" hint="${t.subjectHint}">
  <Select placeholder="${t.choose}">
    <option value="quote">${t.quote}</option>
    <option value="support">${t.support}</option>
    <option value="other">${t.other}</option>
  </Select>
</Field>
<Field label="${t.message}">
  <Textarea placeholder="${t.messagePh}" />
</Field>`}
      >
        <div style={column}>
          <Field label={t.subject} hint={t.subjectHint}>
            <Select placeholder={t.choose}>
              <option value="quote">{t.quote}</option>
              <option value="support">{t.support}</option>
              <option value="other">{t.other}</option>
            </Select>
          </Field>
          <Field label={t.message}>
            <Textarea placeholder={t.messagePh} />
          </Field>
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Checkbox and *switch*" : "Case et *interrupteur*"}
      </Heading>
      <p>
        {en
          ? "Both are native checkboxes: forms, keyboard and screen readers work as usual. The switch is announced as a switch. Use a checkbox for a choice that is submitted, a switch for a setting that applies right away."
          : "Les deux sont des cases à cocher natives : formulaires, clavier et lecteurs d'écran fonctionnent comme d'habitude. L'interrupteur est annoncé comme tel. Une case pour un choix envoyé avec le formulaire, un interrupteur pour un réglage qui s'applique tout de suite."}
      </p>
      <Demo
        code={`<Checkbox label="${t.terms}" defaultChecked />
<Checkbox label="${t.news}" description="${t.newsDesc}" />
<Switch label="${t.notif}" description="${t.notifDesc}" defaultChecked />
<Switch label="${t.compact}" disabled />`}
      >
        <div style={twoCols}>
          <Checkbox label={t.terms} defaultChecked />
          <Checkbox label={t.news} description={t.newsDesc} />
          <Switch label={t.notif} description={t.notifDesc} defaultChecked />
          <Switch label={t.compact} disabled />
        </div>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Controlled *fields*" : "Champs *contrôlés*"}
      </Heading>
      <p>
        {en
          ? "Controls forward every native attribute and their ref: they work with React state, form libraries (React Hook Form, Formik) and server actions alike."
          : "Les champs transmettent tous les attributs natifs et leur ref : ils fonctionnent avec un état React, les bibliothèques de formulaires (React Hook Form, Formik) comme avec les actions serveur."}
      </p>
      <CodeBlock
        code={`const [email, setEmail] = useState("");
const error = email && !email.includes("@") ? "${t.emailError}" : undefined;

<Field label="${t.email}" error={error}>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</Field>`}
      />

      <Heading as="h2" size="lg">
        Field
      </Heading>
      <PropsTable lang={lang} rows={FIELD_PROPS} />

      <Heading as="h2" size="lg">
        Input, Textarea, Select
      </Heading>
      <PropsTable lang={lang} rows={CONTROL_PROPS} />

      <Heading as="h2" size="lg">
        Checkbox, Switch
      </Heading>
      <PropsTable lang={lang} rows={TOGGLE_PROPS} />
    </DocPage>
  );
}
