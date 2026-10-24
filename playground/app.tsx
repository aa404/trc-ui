import { useState } from "react";
import {
  ArrowLeft,
  Card,
  Checkbox,
  Container,
  Field,
  Heading,
  Input,
  PillButton,
  PillLink,
  Section,
  Select,
  SiteFooter,
  SiteHeader,
  StepNumber,
  Switch,
  Text,
  Textarea,
} from "../src";

const Compass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
  </svg>
);

const Logo = () => <span className="pg-logo">trc</span>;

const NAV = [
  {
    label: "Composants",
    items: [
      { label: "Typographie", href: "#", description: "Titres fins et mot d'accent." },
      { label: "Boutons pilule", href: "#", description: "L'interaction signature." },
      { label: "Formulaires", href: "#", description: "Champs, cases et interrupteurs." },
    ],
  },
  { label: "Démarrer", href: "#", active: true },
  { label: "Thème", href: "#" },
  { label: "GitHub", href: "#" },
];

const PILLARS = [
  ["Sobre", "Beaucoup de noir, une seule couleur d'accent, rien qui crie."],
  ["Fin", "Une typographie légère qui porte la page à elle seule."],
  ["Vivant", "Des interactions qui se remarquent sans jamais distraire."],
];

export function App() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <SiteHeader logo={<Logo />} logoLabel="trc-ui" nav={NAV} cta={{ label: "Installer", href: "#" }} />
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

        <section className="pg-section">
          <Heading size="lg">Champs de *formulaire*</Heading>
          <Card padding="lg" className="pg-form">
            <div className="pg-grid pg-grid--2">
              <Field label="Nom" required>
                <Input placeholder="Aurel Agbado" autoComplete="name" />
              </Field>
              <Field label="E-mail" error="Cette adresse n'est pas valide.">
                <Input type="email" defaultValue="aurel@" />
              </Field>
              <Field label="Sujet" hint="Nous répondons sous 48 heures.">
                <Select placeholder="Choisir un sujet">
                  <option value="devis">Demande de devis</option>
                  <option value="support">Assistance</option>
                  <option value="autre">Autre</option>
                </Select>
              </Field>
              <Field label="Désactivé">
                <Input disabled defaultValue="Lecture seule" />
              </Field>
            </div>
            <Field label="Message">
              <Textarea placeholder="Votre message" />
            </Field>
            <div className="pg-grid pg-grid--2">
              <Checkbox label="J'accepte les conditions d'utilisation" defaultChecked />
              <Checkbox label="Recevoir les nouveautés" description="Une lettre par mois, sans publicité." />
              <Switch label="Notifications" description="Être prévenu des réponses." defaultChecked />
              <Switch label="Mode compact" disabled />
            </div>
            <PillButton solid type="submit" style={{ justifySelf: "start" }}>
              Envoyer le message
            </PillButton>
          </Card>
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
      <SiteFooter
        logo={<Logo />}
        logoLabel="trc-ui"
        tagline="Des composants React au design noir profond, sobres et soignés."
        columns={[
          {
            title: "Composants",
            links: [
              { label: "Typographie", href: "#" },
              { label: "Boutons", href: "#" },
              { label: "Formulaires", href: "#" },
            ],
          },
          {
            title: "Ressources",
            links: [
              { label: "Démarrer", href: "#" },
              { label: "Thème", href: "#" },
            ],
          },
          {
            title: "Projet",
            links: [
              { label: "GitHub", href: "#" },
              { label: "npm", href: "#" },
            ],
          },
        ]}
        copyright="© 2026 trc-ui. Licence MIT."
        legal={[{ label: "Licence", href: "#" }]}
      >
        <PillLink href="#">Commencer</PillLink>
      </SiteFooter>
    </>
  );
}
