import Link from "next/link";
import type { CSSProperties } from "react";
import { BackToTop, Card, Container, Heading, PillLink, Section, Text } from "trc-ui";
import { CopyButton } from "@/components/copy-button";
import { Compass, Layers, Spark } from "@/components/demo-icons";
import { DocsFooter } from "@/components/docs-footer";
import { DocsHeader } from "@/components/docs-header";
import { UI, localePath, type Lang } from "@/lib/i18n";
import { DOCS_NAV, REPO_URL } from "@/lib/nav";

const T = {
  en: {
    title: "Interfaces in *deep black.*",
    pillars: "Calm by *design*",
    pillarsLead: "Three rules carry the whole library, so every page you build stays consistent.",
    items: [
      ["Sober", "Near-black backgrounds, graphite cards and a single accent color. Nothing shouts."],
      ["Thin", "Light Montserrat headings carry the page, with one accent word per title."],
      ["Alive", "Pills that stretch, cards that wake up: interactions you notice without distraction."],
    ],
    components: "Everything for a *showcase site*",
    componentsLead: "From the floating header to the card footer, with forms that are accessible out of the box.",
    descriptions: {
      "/docs/typography/": "Thin headings, accent words, step numbers.",
      "/docs/pill/": "The signature button, with its stretching dot.",
      "/docs/surfaces/": "Graphite cards, inset sections, containers.",
      "/docs/forms/": "Fields, select, checkbox and switch, wired for screen readers.",
      "/docs/site-chrome/": "Floating header with dropdowns, footer as a card.",
      "/docs/heroes/": "Photo and video heroes inset from the edges.",
    } as Record<string, string>,
    ctaTitle: "Make it *yours.*",
    ctaBody: "Pick your brand color, check its contrast on deep black and copy the code.",
    generator: "Open the colors generator",
  },
  fr: {
    title: "Des interfaces en *noir profond.*",
    pillars: "Calme par *conception*",
    pillarsLead: "Trois règles portent toute la bibliothèque : chaque page que vous construisez reste cohérente.",
    items: [
      ["Sobre", "Fonds quasi noirs, cartes graphite et une seule couleur d'accent. Rien ne crie."],
      ["Fin", "Des titres Montserrat légers portent la page, avec un mot d'accent par titre."],
      [
        "Vivant",
        "Des pilules qui s'étirent, des cartes qui s'éveillent : des interactions qui se remarquent sans distraire.",
      ],
    ],
    components: "Tout pour un *site vitrine*",
    componentsLead: "De l'en-tête flottant au pied de page en carte, avec des formulaires accessibles d'office.",
    descriptions: {
      "/docs/typography/": "Titres fins, mots d'accent, numéros d'étape.",
      "/docs/pill/": "Le bouton signature, avec sa pastille qui s'étire.",
      "/docs/surfaces/": "Cartes graphite, sections en retrait, conteneurs.",
      "/docs/forms/": "Champs, liste, case et interrupteur, reliés pour les lecteurs d'écran.",
      "/docs/site-chrome/": "En-tête flottant avec menus, pied de page en carte.",
      "/docs/heroes/": "Héros photo et vidéo, en retrait des bords.",
    } as Record<string, string>,
    ctaTitle: "À vos *couleurs.*",
    ctaBody: "Choisissez la couleur de votre marque, vérifiez son contraste sur le noir profond et copiez le code.",
    generator: "Ouvrir le générateur de couleurs",
  },
};

const ICONS = [Compass, Layers, Spark];
const enter = (ms: number) => ({ "--trc-delay": `${ms}ms` }) as CSSProperties;
const COMPONENTS = DOCS_NAV.find((section) => section.title.en === "Components")?.pages ?? [];

export function HomeContent({ lang }: { lang: Lang }) {
  const t = T[lang];
  const ui = UI[lang];
  return (
    <>
      <DocsHeader lang={lang} />
      <main>
        <Container className="home-hero">
          <Heading as="h1" size="display" className="trc-enter" style={enter(100)}>
            {t.title}
          </Heading>
          <Text size="lg" className="home-hero__lead trc-enter" style={enter(200)}>
            {ui.tagline}
          </Text>
          <div className="home-hero__actions trc-enter" style={enter(300)}>
            <PillLink as={Link} href={localePath(lang, "/docs/getting-started/")} solid>
              {ui.getStarted}
            </PillLink>
            <PillLink as={Link} href={REPO_URL}>
              GitHub
            </PillLink>
          </div>
          <div className="home-install trc-enter" style={enter(400)}>
            <code>
              <span aria-hidden className="home-install__prompt">
                $
              </span>{" "}
              npm install trc-ui
            </code>
            <CopyButton code="npm install trc-ui" />
          </div>
        </Container>

        <Section spacing="lg">
          <Container>
            <Heading>{t.pillars}</Heading>
            <Text size="lg" className="home-lead">
              {t.pillarsLead}
            </Text>
            <div className="home-grid home-grid--3">
              {t.items.map(([title, body], i) => {
                const Icon = ICONS[i]!;
                return (
                  <Card key={title} watermark={<Icon />} padding="lg">
                    <Heading as="h3" size="md">
                      {title}
                    </Heading>
                    <Text style={{ marginTop: 12 }}>{body}</Text>
                  </Card>
                );
              })}
            </div>
          </Container>
        </Section>

        <Section spacing="sm">
          <Container>
            <Heading>{t.components}</Heading>
            <Text size="lg" className="home-lead">
              {t.componentsLead}
            </Text>
            <div className="home-grid home-grid--3">
              {COMPONENTS.map((page) => (
                <Card key={page.href} as={Link} href={localePath(lang, page.href)} interactive className="home-link">
                  <Heading as="h3" size="sm">
                    {page.title[lang]}
                  </Heading>
                  <Text size="sm" style={{ marginTop: 8 }}>
                    {t.descriptions[page.href]}
                  </Text>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section inset spacing="lg">
          <Container size="narrow" className="home-cta">
            <Heading>{t.ctaTitle}</Heading>
            <Text size="lg">{t.ctaBody}</Text>
            <div className="home-hero__actions">
              <PillLink as={Link} href={localePath(lang, "/docs/colors-generator/")} solid>
                {t.generator}
              </PillLink>
              <PillLink as={Link} href={localePath(lang, "/docs/theming/")}>
                {DOCS_NAV[0]!.pages[1]!.title[lang]}
              </PillLink>
            </div>
          </Container>
        </Section>
        <div className="home-gap" />
      </main>
      <DocsFooter lang={lang} />
      <BackToTop label={lang === "en" ? "Back to top" : "Haut de page"} />
    </>
  );
}
