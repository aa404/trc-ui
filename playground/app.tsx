import { useState } from "react";
import { ArrowLeft, Heading, PillButton, PillLink, StepNumber, Text } from "../src";

export function App() {
  const [loading, setLoading] = useState(false);
  return (
    <main className="pg">
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
    </main>
  );
}
