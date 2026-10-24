import Link from "next/link";
import { Container, Heading, PillLink, Text } from "trc-ui";
import { DocsHeader } from "@/components/docs-header";

export default function HomePage() {
  return (
    <>
      <DocsHeader />
      <Container as="main" style={{ paddingBlock: "200px 120px" }}>
        <Heading as="h1" size="display">
          Des interfaces en *noir profond.*
        </Heading>
        <Text size="lg" style={{ marginTop: 24, maxWidth: 640 }}>
          Composants React open source : fonds quasi noirs, cartes graphite, titres fins et une seule couleur
          d&apos;accent.
        </Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
          <PillLink as={Link} href="/docs/getting-started/" solid>
            Démarrer
          </PillLink>
          <PillLink as={Link} href="/docs/typography/">
            Voir les composants
          </PillLink>
        </div>
      </Container>
    </>
  );
}
