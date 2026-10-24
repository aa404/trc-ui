import Link from "next/link";
import { Container, Heading, PillLink, Text } from "trc-ui";
import { DocsHeader } from "@/components/docs-header";
import { UI, localePath, type Lang } from "@/lib/i18n";

const TITLE = { en: "Interfaces in *deep black.*", fr: "Des interfaces en *noir profond.*" };

export function HomeContent({ lang }: { lang: Lang }) {
  const t = UI[lang];
  return (
    <>
      <DocsHeader lang={lang} />
      <Container as="main" style={{ paddingBlock: "200px 120px" }}>
        <Heading as="h1" size="display">
          {TITLE[lang]}
        </Heading>
        <Text size="lg" style={{ marginTop: 24, maxWidth: 640 }}>
          {t.tagline}
        </Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
          <PillLink as={Link} href={localePath(lang, "/docs/getting-started/")} solid>
            {t.getStarted}
          </PillLink>
          <PillLink as={Link} href={localePath(lang, "/docs/typography/")}>
            {t.browse}
          </PillLink>
        </div>
      </Container>
    </>
  );
}
