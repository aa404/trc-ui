import { Heading, Steps } from "trc-ui";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const stepsTitle = { en: "Steps", fr: "Étapes" };

const PROPS: PropRow[] = [
  {
    name: "items",
    type: "{ title, description? }[]",
    description: { en: "Steps, in their real order.", fr: "Les étapes, dans leur ordre réel." },
  },
  {
    name: "current",
    type: "number",
    description: {
      en: "Index of the step in progress, from 0: earlier ones are complete, later ones upcoming.",
      fr: "Index de l'étape en cours, à partir de 0 : les précédentes sont faites, les suivantes à venir.",
    },
  },
];

const ITEMS = {
  en: [
    ["Create your account", "Name, email and a password. It takes a minute."],
    ["Connect your domain", "Point a CNAME record to the address we give you."],
    ["Publish", "Your site goes online with HTTPS."],
  ],
  fr: [
    ["Créez votre compte", "Nom, e-mail et mot de passe. Une minute suffit."],
    ["Connectez votre domaine", "Faites pointer un enregistrement CNAME vers l'adresse donnée."],
    ["Publiez", "Votre site passe en ligne, en HTTPS."],
  ],
};

export function StepsContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const items = ITEMS[lang].map(([title, description]) => ({ title, description }));
  return (
    <DocPage
      lang={lang}
      href="/docs/steps/"
      title={stepsTitle[lang]}
      lead={
        en
          ? "A vertical timeline for steps in a real order: large thin numbers in the accent, joined by a hairline."
          : "Une frise verticale pour des étapes dans un ordre réel : de grands numéros fins en accent, reliés par un trait fin."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "A *process*" : "Un *parcours*"}
      </Heading>
      <p>
        {en
          ? "Numbers are for steps only: a list without an order gets no numbers."
          : "Les numéros sont réservés aux étapes : une liste sans ordre n'a pas de numéros."}
      </p>
      <Demo
        code={`<Steps
  items={[
    { title: "Create your account", description: "Name, email and a password." },
    { title: "Connect your domain", description: "Point a CNAME record to the address we give you." },
    { title: "Publish", description: "Your site goes online with HTTPS." },
  ]}
/>`}
      >
        <Steps items={items} />
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "With *progress*" : "Avec la *progression*"}
      </Heading>
      <p>
        {en
          ? 'With current, the step in progress is announced to screen readers (aria-current="step") and the upcoming ones fade.'
          : "Avec current, l'étape en cours est annoncée aux lecteurs d'écran (aria-current=\"step\") et les suivantes s'estompent."}
      </p>
      <Demo code={`<Steps items={items} current={1} />`}>
        <Steps items={items} current={1} />
      </Demo>
      <PropsTable lang={lang} rows={PROPS} />
    </DocPage>
  );
}
