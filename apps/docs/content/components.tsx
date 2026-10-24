import Link from "next/link";
import { Card, Heading, Text } from "trc-ui";
import { DocPage } from "@/components/doc-page";
import { localePath, type Lang } from "@/lib/i18n";
import { COMPONENT_SECTIONS } from "@/lib/nav";

export const componentsTitle = { en: "All components", fr: "Tous les composants" };

const LEAD = {
  en: "Every trc ui component, by category. Each page has live demos, the code and a props table.",
  fr: "Tous les composants de trc ui, par catégorie. Chaque page propose des démos en direct, le code et une table de props.",
};

export function ComponentsContent({ lang }: { lang: Lang }) {
  return (
    <DocPage lang={lang} href="/docs/components/" title={componentsTitle[lang]} lead={LEAD[lang]}>
      {COMPONENT_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="docs-overview">
          <Heading as="h2" size="lg">
            {section.title[lang]}
          </Heading>
          {section.description && <Text className="docs-overview__lead">{section.description[lang]}</Text>}
          <div className="docs-overview__grid">
            {section.pages.map((page) => (
              <Card key={page.href} as={Link} href={localePath(lang, page.href)} interactive padding="sm">
                <Heading as="h3" size="sm">
                  {page.title[lang]}
                </Heading>
                {page.description && (
                  <Text size="sm" style={{ marginTop: 6 }}>
                    {page.description[lang]}
                  </Text>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}
    </DocPage>
  );
}
