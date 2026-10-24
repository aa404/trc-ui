import { Heading, LanguageSwitcher } from "trc-ui";
import { Demo } from "@/components/demo";
import { LanguageButtonsDemo } from "@/components/demos/navigation";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const languageSwitcherTitle = { en: "Language switcher", fr: "Choix de la langue" };

const PROPS: PropRow[] = [
  {
    name: "languages",
    type: "{ code, name, href? }[]",
    description: {
      en: "Code shown in capitals, full name for screen readers, link to the same page in that language.",
      fr: "Code affiché en capitales, nom complet pour les lecteurs d'écran, lien vers la même page dans cette langue.",
    },
  },
  {
    name: "value",
    type: "string",
    description: { en: "Code of the current language.", fr: "Code de la langue courante." },
  },
  {
    name: "onChange",
    type: "(code) => void",
    description: { en: "Buttons mode, without href.", fr: "Mode boutons, sans href." },
  },
  {
    name: "label",
    type: "string",
    default: '"Language"',
    description: { en: "Accessible name.", fr: "Nom accessible." },
  },
  {
    name: "linkAs",
    type: "ElementType",
    default: '"a"',
    description: { en: "Router link component.", fr: "Composant de lien du routeur." },
  },
];

export function LanguageSwitcherContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/language-switcher/"
      title={languageSwitcherTitle[lang]}
      lead={
        en
          ? "The EN | FR pill of this site. Each language links to the same page in that language, with its full name for screen readers."
          : "La pilule EN | FR de ce site. Chaque langue mène à la même page dans cette langue, avec son nom complet pour les lecteurs d'écran."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "As *links*" : "En *liens*"}
      </Heading>
      <p>
        {en
          ? "Each link carries lang and hreflang, so that browsers, search engines and screen readers know the language behind it."
          : "Chaque lien porte lang et hreflang : navigateurs, moteurs de recherche et lecteurs d'écran savent quelle langue il cache."}
      </p>
      <Demo
        code={`<LanguageSwitcher
  value="en"
  linkAs={Link}
  languages={[
    { code: "en", name: "English", href: "/docs/" },
    { code: "fr", name: "Français", href: "/fr/docs/" },
  ]}
/>`}
      >
        <LanguageSwitcher
          label={en ? "Language" : "Langue"}
          value={lang}
          languages={[
            { code: "en", name: "English", href: "#" },
            { code: "fr", name: "Français", href: "#" },
          ]}
        />
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "As *buttons*" : "En *boutons*"}
      </Heading>
      <p>
        {en
          ? "Without href, the switch calls onChange: for apps that translate in place."
          : "Sans href, la bascule appelle onChange : pour les applications qui traduisent sur place."}
      </p>
      <Demo
        code={`const [language, setLanguage] = useState("fr");

<LanguageSwitcher
  value={language}
  onChange={setLanguage}
  languages={[
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ]}
/>`}
      >
        <LanguageButtonsDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={PROPS} />
    </DocPage>
  );
}
