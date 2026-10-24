import { ArrowLeft, Heading, PillButton, PillLink } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const pillTitle = { en: "Pill buttons", fr: "Boutons pilule" };

const SHARED_PROPS: PropRow[] = [
  {
    name: "solid",
    type: "boolean",
    default: "false",
    description: {
      en: "White background: the main action of a screen. Use one per screen at most.",
      fr: "Fond blanc : l'action principale d'un écran. Une seule par écran au plus.",
    },
  },
  {
    name: "size",
    type: '"md" | "sm"',
    default: '"md"',
    description: {
      en: "56 px, or 40 px for headers and toolbars.",
      fr: "56 px, ou 40 px pour les en-têtes et barres d'outils.",
    },
  },
  {
    name: "icon",
    type: "ReactNode",
    description: {
      en: "Replaces the arrow in the dot. Reserved for “Back” (left arrow).",
      fr: "Remplace la flèche de la pastille. Réservé à « Retour » (flèche vers la gauche).",
    },
  },
];

const BUTTON_PROPS: PropRow[] = [
  ...SHARED_PROPS,
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: {
      en: "Shows a spinner in the dot, disables the button and sets aria-busy.",
      fr: "Affiche un indicateur dans la pastille, désactive le bouton et pose aria-busy.",
    },
  },
  {
    name: "type",
    type: '"button" | "submit" | "reset"',
    default: '"button"',
    description: {
      en: "Defaults to button: a pill never submits a form by accident.",
      fr: "button par défaut : une pilule n'envoie jamais un formulaire par accident.",
    },
  },
  {
    name: "…props",
    type: 'ComponentProps<"button">',
    description: { en: "Any native button attribute, and a ref.", fr: "Tout attribut natif de bouton, et une ref." },
  },
];

const LINK_PROPS: PropRow[] = [
  ...SHARED_PROPS,
  {
    name: "as",
    type: "ElementType",
    default: '"a"',
    description: {
      en: "Your router's link component (Next.js, React Router…).",
      fr: "Le composant de lien de votre routeur (Next.js, React Router…).",
    },
  },
  {
    name: "…props",
    type: "ComponentProps<typeof as>",
    description: { en: "Props of the rendered element: href, target…", fr: "Props de l'élément rendu : href, target…" },
  },
];

const T = {
  en: {
    lead: "The signature interaction of trc-ui: a thin pill with a round accent dot. On hover, the dot stretches until it fills the pill and the label turns dark.",
    start: "Get started",
    account: "Create an account",
    signIn: "Sign in",
    docs: "Read the docs",
    back: "Back",
    sending: "Sending",
    disabled: "Unavailable",
    pricing: "See pricing",
  },
  fr: {
    lead: "L'interaction signature de trc-ui : une pilule fine avec une pastille ronde d'accent. Au survol, la pastille s'étire jusqu'à remplir la pilule et le libellé fonce.",
    start: "Commencer",
    account: "Créer un compte",
    signIn: "Se connecter",
    docs: "Lire la documentation",
    back: "Retour",
    sending: "Envoi",
    disabled: "Indisponible",
    pricing: "Voir les tarifs",
  },
};

export function PillContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  return (
    <DocPage lang={lang} href="/docs/pill/" title={pillTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "Outline and *solid*" : "Bordée et *pleine*"}
      </Heading>
      <p>
        {en
          ? "Hover the pills, or reach them with the Tab key: keyboard focus plays the same animation. The solid pill marks the main action; keep it to one per screen."
          : "Survolez les pilules, ou atteignez-les avec la touche Tab : le focus clavier joue la même animation. La pilule pleine marque l'action principale ; une seule par écran."}
      </p>
      <Demo code={`<PillButton solid>${t.account}</PillButton>\n<PillButton>${t.start}</PillButton>`}>
        <PillButton solid>{t.account}</PillButton>
        <PillButton>{t.start}</PillButton>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Compact *size*" : "Taille *compacte*"}
      </Heading>
      <Demo
        code={`<PillButton size="sm">${t.signIn}</PillButton>\n<PillButton size="sm" solid>${t.start}</PillButton>`}
      >
        <PillButton size="sm">{t.signIn}</PillButton>
        <PillButton size="sm" solid>
          {t.start}
        </PillButton>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "As a *link*" : "En *lien*"}
      </Heading>
      <p>
        {en ? (
          <>
            <code>PillLink</code> renders the same pill as an <code>&lt;a&gt;</code>. Pass your router&apos;s link
            component with <code>as</code> to keep client-side navigation.
          </>
        ) : (
          <>
            <code>PillLink</code> rend la même pilule sous forme de <code>&lt;a&gt;</code>. Passez le composant de lien
            de votre routeur avec <code>as</code> pour garder la navigation côté client.
          </>
        )}
      </p>
      <Demo code={`<PillLink href="#">${t.docs}</PillLink>`}>
        <PillLink href="#">{t.docs}</PillLink>
      </Demo>
      <CodeBlock
        code={`import Link from "next/link";
import { PillLink } from "trc-ui";

<PillLink as={Link} href="/pricing">${t.pricing}</PillLink>`}
      />

      <Heading as="h2" size="lg">
        {en ? "The *Back* exception" : "L'exception *Retour*"}
      </Heading>
      <p>
        {en
          ? "Pills carry no icon other than their arrow. The only exception is going back, with a left arrow."
          : "Les pilules ne portent pas d'autre icône que leur flèche. Seule exception : revenir en arrière, avec une flèche vers la gauche."}
      </p>
      <Demo
        code={`import { ArrowLeft, PillButton } from "trc-ui";\n\n<PillButton icon={<ArrowLeft />}>${t.back}</PillButton>`}
      >
        <PillButton icon={<ArrowLeft />}>{t.back}</PillButton>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "Loading and *disabled*" : "Chargement et *désactivé*"}
      </Heading>
      <p>
        {en ? (
          <>
            <code>loading</code> replaces the arrow with a spinner, disables the button and announces it as busy. A
            disabled pill does not stretch on hover.
          </>
        ) : (
          <>
            <code>loading</code> remplace la flèche par un indicateur, désactive le bouton et l&apos;annonce comme
            occupé. Une pilule désactivée ne s&apos;étire pas au survol.
          </>
        )}
      </p>
      <Demo code={`<PillButton loading>${t.sending}</PillButton>\n<PillButton disabled>${t.disabled}</PillButton>`}>
        <PillButton loading>{t.sending}</PillButton>
        <PillButton disabled>{t.disabled}</PillButton>
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "How the *stretch* works" : "Comment marche l'*étirement*"}
      </Heading>
      <p>
        {en
          ? "The dot and the fill are a single shape that grows from the dot's width to the full pill, under the border, with an ease-in-out-quart curve over 500 ms. The label darkens 150 ms after the fill starts, and lightens right away when it leaves, so it stays readable at every frame. On touch screens there is no hover: the pill stays at rest. With reduced motion, the change is instant."
          : "La pastille et le remplissage sont une seule forme, qui grandit de la largeur de la pastille jusqu'à toute la pilule, sous la bordure, avec une courbe ease-in-out-quart en 500 ms. Le libellé fonce 150 ms après le départ du remplissage, et s'éclaircit tout de suite à la sortie : il reste lisible à chaque image. Sur écran tactile, pas de survol : la pilule reste au repos. Avec le mouvement réduit, le changement est instantané."}
      </p>
      <CodeBlock
        lang="css"
        title={en ? "Tune the motion" : "Régler le mouvement"}
        code={`:root {\n  --trc-ease: cubic-bezier(0.77, 0, 0.175, 1);\n  --trc-duration: 500ms;\n}`}
      />

      <Heading as="h2" size="lg">
        PillButton
      </Heading>
      <PropsTable lang={lang} rows={BUTTON_PROPS} />

      <Heading as="h2" size="lg">
        PillLink
      </Heading>
      <PropsTable lang={lang} rows={LINK_PROPS} />
    </DocPage>
  );
}
