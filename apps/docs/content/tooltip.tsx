import { Heading } from "trc-ui";
import { Demo } from "@/components/demo";
import { TooltipDemo } from "@/components/demos/overlays";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const tooltipTitle = { en: "Tooltip", fr: "Infobulle" };

const PROPS: PropRow[] = [
  {
    name: "label",
    type: "ReactNode",
    description: { en: "Short text describing the element.", fr: "Texte court qui décrit l'élément." },
  },
  {
    name: "children",
    type: "ReactElement",
    description: { en: "One focusable element.", fr: "Un seul élément focalisable." },
  },
  {
    name: "side",
    type: '"top" | "bottom"',
    default: '"top"',
    description: {
      en: "Preferred side; flips when there is no room.",
      fr: "Côté préféré ; se retourne s'il manque de place.",
    },
  },
  {
    name: "delay",
    type: "number",
    default: "300",
    description: {
      en: "Hover delay in ms; keyboard focus shows it at once.",
      fr: "Délai au survol en ms ; le focus clavier l'affiche tout de suite.",
    },
  },
];

export function TooltipContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/tooltip/"
      title={tooltipTitle[lang]}
      lead={
        en
          ? "A short label on hover and keyboard focus, tied to its element with aria-describedby."
          : "Un court libellé au survol et au focus clavier, relié à son élément par aria-describedby."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Hover or *focus*" : "Survol ou *focus*"}
      </Heading>
      <p>
        {en
          ? "Hover the pill or reach it with Tab. The tooltip stays open while the pointer moves onto it, and Escape hides it, as WCAG 1.4.13 asks. Never put essential information only in a tooltip: touch screens have no hover."
          : "Survolez la pilule ou atteignez-la avec Tab. L'infobulle reste ouverte quand le pointeur passe dessus, et Échap la cache, comme le demande le WCAG 1.4.13. Ne mettez jamais une information essentielle seulement dans une infobulle : les écrans tactiles n'ont pas de survol."}
      </p>
      <Demo
        center
        code={`<Tooltip label="Copy the install command">
  <PillButton size="sm">Copy</PillButton>
</Tooltip>

<Tooltip label="Opens the documentation in a new tab" side="bottom">
  <a href="/docs">Help</a>
</Tooltip>`}
      >
        <TooltipDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={PROPS} />
    </DocPage>
  );
}
