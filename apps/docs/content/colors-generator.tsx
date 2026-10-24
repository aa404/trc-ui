import { ColorsGenerator } from "@/components/colors-generator";
import { DocPage } from "@/components/doc-page";
import type { Lang } from "@/lib/i18n";

export const colorsGeneratorTitle = { en: "Colors generator", fr: "Générateur de couleurs" };

export function ColorsGeneratorContent({ lang }: { lang: Lang }) {
  return (
    <DocPage
      lang={lang}
      href="/docs/colors-generator/"
      title={colorsGeneratorTitle[lang]}
      lead={
        lang === "en"
          ? "Pick your brand color: get a 10-shade scale, check that it reads well on deep black, preview it on real components and copy the code."
          : "Choisissez la couleur de votre marque : obtenez une gamme de 10 nuances, vérifiez qu'elle se lit bien sur le noir profond, voyez-la sur de vrais composants et copiez le code."
      }
    >
      <ColorsGenerator lang={lang} />
    </DocPage>
  );
}
