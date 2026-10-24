import { useState } from "react";
import { ArrowLeft, Card, Container, Heading, PillButton, PillLink, Section, StepNumber, Text } from "../src";

const Compass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
  </svg>
);

const PILLARS = [
  ["Sobre", "Beaucoup de noir, une seule couleur d'accent, rien qui crie."],
  ["Fin", "Une typographie légère qui porte la page à elle seule."],
  ["Vivant", "Des interactions qui se remarquent sans jamais distraire."],
];

export function App() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Container as="main" className="pg">
        <Heading as="h1" size="display">
          Des interfaces en *noir profond.*
        </Heading>
        <Text size="lg" style={{ marginTop: 24, maxWidth: 640 }}>
          Fonds quasi noirs, cartes graphite, titres fins et une seule couleur d'accent.
        </Text>

        <section className="pg-section">
          <Heading>Comment ça *marche*</Heading>
          <Heading size="lg" accentLast={2}>
            La réalité du terrain en données
          </Heading>
          <Heading size="md">Titre de carte</Heading>
          <div className="pg-row">
            <StepNumber n={1} />
            <StepNumber n={2} />
            <StepNumber n={3} size="sm" />
          </div>
        </section>

        <section className="pg-section">
          <Heading size="lg">Boutons *pilule*</Heading>
          <div className="pg-row">
            <PillButton>Commencer</PillButton>
            <PillButton solid>Créer un compte</PillButton>
            <PillLink href="#">Voir la documentation</PillLink>
            <PillButton size="sm">Se connecter</PillButton>
            <PillButton icon={<ArrowLeft />}>Retour</PillButton>
            <PillButton
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
            >
              Envoyer
            </PillButton>
            <PillButton disabled>Désactivé</PillButton>
          </div>
        </section>

        <section className="pg-section">
          <Heading size="lg">Cartes *graphite*</Heading>
          <div className="pg-grid">
            {PILLARS.map(([title, body]) => (
              <Card key={title} watermark={<Compass />} padding="lg">
                <Heading as="h3" size="md">
                  {title}
                </Heading>
                <Text style={{ marginTop: 12 }}>{body}</Text>
              </Card>
            ))}
          </div>
          <div className="pg-grid pg-grid--2">
            <Card padding="lg">
              <Heading as="h3" size="md">
                Pour les organisations
              </Heading>
              <Text style={{ marginTop: 12 }}>Carte par défaut, surface graphite.</Text>
            </Card>
            <Card tone="alt" padding="lg">
              <Heading as="h3" size="md">
                Pour les équipes
              </Heading>
              <Text style={{ marginTop: 12 }}>Deuxième niveau, un gris un peu plus clair.</Text>
            </Card>
          </div>
          <div className="pg-grid">
            {["Démarrer", "Composer", "Publier"].map((title, i) => (
              <Card key={title} as="a" href="#" interactive>
                <StepNumber n={i + 1} />
                <Heading as="h3" size="sm" style={{ marginTop: 24 }}>
                  {title}
                </Heading>
              </Card>
            ))}
          </div>
        </section>
      </Container>
      <Section inset spacing="lg">
        <Container size="narrow" style={{ textAlign: "center" }}>
          <Heading>Prêt à *commencer* ?</Heading>
          <Text size="lg" style={{ marginTop: 20 }}>
            Une section en retrait des bords : la page respire.
          </Text>
          <PillButton solid style={{ marginTop: 32 }}>
            Installer trc-ui
          </PillButton>
        </Container>
      </Section>
      <div style={{ height: 16 }} />
    </>
  );
}
