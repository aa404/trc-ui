import type { CSSProperties } from "react";
import { BackToTop, Heading, HeroVideo, PageHero, PillLink, Text } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import { asset } from "@/lib/asset";
import type { Lang } from "@/lib/i18n";

export const heroesTitle = { en: "Heroes", fr: "Héros" };

const PAGE_HERO_PROPS: PropRow[] = [
  {
    name: "title",
    type: "string",
    description: {
      en: "Title; *asterisks* mark the accent, otherwise the last words take it.",
      fr: "Titre ; les *astérisques* marquent l'accent, sinon ce sont les derniers mots.",
    },
  },
  {
    name: "accentLast",
    type: "number",
    default: "1 or 2",
    description: {
      en: "Trailing words in the accent when there are no asterisks (2 for titles over three words).",
      fr: "Derniers mots en accent sans astérisques (2 pour les titres de plus de trois mots).",
    },
  },
  {
    name: "description",
    type: "ReactNode",
    description: { en: "Lead under the title.", fr: "Chapeau sous le titre." },
  },
  {
    name: "meta",
    type: "ReactNode",
    description: { en: "Discreet line: date, breadcrumb…", fr: "Ligne discrète : date, fil d'Ariane…" },
  },
  {
    name: "image",
    type: "string | ReactNode",
    description: {
      en: "Background photo URL, or a ready element such as Next.js <Image fill />. Without it, a subtle accent glow.",
      fr: "URL de la photo de fond, ou un élément prêt comme <Image fill /> de Next.js. Sans elle, un halo d'accent discret.",
    },
  },
  {
    name: "imagePosition",
    type: "string",
    default: '"50% 50%"',
    description: { en: "object-position of the photo.", fr: "object-position de la photo." },
  },
  { name: "children", type: "ReactNode", description: { en: "Pills under the text.", fr: "Pilules sous le texte." } },
];

const HERO_VIDEO_PROPS: PropRow[] = [
  {
    name: "clips",
    type: "{ webm?, mp4?, poster? }[]",
    description: {
      en: "Muted videos played in turn with a crossfade; the first one is picked at random.",
      fr: "Vidéos muettes jouées à tour de rôle en fondu enchaîné ; la première est tirée au hasard.",
    },
  },
  {
    name: "children",
    type: "ReactNode",
    description: { en: "Hero text, bottom left.", fr: "Texte du héros, en bas à gauche." },
  },
  {
    name: "aside",
    type: "ReactNode",
    description: {
      en: "Optional block, bottom right on large screens.",
      fr: "Bloc facultatif, en bas à droite sur grand écran.",
    },
  },
  {
    name: "fade",
    type: "number",
    default: "1.2",
    description: { en: "Crossfade duration in seconds.", fr: "Durée du fondu, en secondes." },
  },
  {
    name: "parallax",
    type: "boolean",
    default: "true",
    description: { en: "The video moves slower than the page.", fr: "La vidéo descend moins vite que la page." },
  },
];

const BACK_PROPS: PropRow[] = [
  {
    name: "label",
    type: "string",
    default: '"Back to top"',
    description: { en: "Accessible name.", fr: "Nom accessible." },
  },
  {
    name: "threshold",
    type: "number",
    default: "0.8",
    description: {
      en: "Scroll, in viewport heights, before it appears.",
      fr: "Défilement, en hauteurs d'écran, avant qu'il apparaisse.",
    },
  },
];

const T = {
  en: {
    lead: "Large rounded cards inset from the screen edges: a photo hero for inner pages, a video hero for the home page.",
    pageTitle: "An inner page, inset from the edges",
    pageDesc: "Darkened background photo, thin title whose last words take the accent.",
    meta: "Updated on October 24, 2026",
    noPhoto: "Without a photo, a subtle glow",
    noPhotoDesc: "The default background when no image is given.",
    videoTitle: "Interfaces in *deep black.*",
    videoDesc: "Muted videos crossfade behind dark veils that keep the text readable.",
    start: "Get started",
    more: "Learn more",
  },
  fr: {
    lead: "De grandes cartes arrondies en retrait des bords : un héros photo pour les pages intérieures, un héros vidéo pour l'accueil.",
    pageTitle: "Une page intérieure, en retrait des bords",
    pageDesc: "Photo de fond assombrie, titre fin dont les derniers mots prennent l'accent.",
    meta: "Mis à jour le 24 octobre 2026",
    noPhoto: "Sans photo, un halo discret",
    noPhotoDesc: "Le fond par défaut quand aucune image n'est fournie.",
    videoTitle: "Des interfaces en *noir profond.*",
    videoDesc: "Des vidéos muettes s'enchaînent en fondu derrière des voiles sombres qui gardent le texte lisible.",
    start: "Commencer",
    more: "En savoir plus",
  },
};

const enter = (ms: number) => ({ "--trc-delay": `${ms}ms` }) as CSSProperties;

export function HeroesContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  return (
    <DocPage lang={lang} href="/docs/heroes/" title={heroesTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "Page *hero*" : "Héros de *page*"}
      </Heading>
      <p>
        {en
          ? "The header of inner pages. It leaves room at the top for the floating header, and its title takes the accent on its last words."
          : "L'en-tête des pages intérieures. Il laisse la place à l'en-tête flottant en haut, et son titre prend l'accent sur ses derniers mots."}
      </p>
      <Demo
        frame
        code={`<PageHero
  title="${t.pageTitle}"
  description="${t.pageDesc}"
  meta="${t.meta}"
  image="/media/page.webp"
/>`}
      >
        <PageHero title={t.pageTitle} description={t.pageDesc} meta={t.meta} image={asset("/media/page.webp")} />
      </Demo>
      <Demo frame code={`<PageHero title="${t.noPhoto}" description="${t.noPhotoDesc}" />`}>
        <PageHero title={t.noPhoto} description={t.noPhotoDesc} />
      </Demo>
      <PropsTable lang={lang} rows={PAGE_HERO_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Video *hero*" : "Héros *vidéo*"}
      </Heading>
      <p>
        {en
          ? "For the home page: muted videos that take turns with a crossfade, a soft parallax and dark veils. No video is chosen in the server render, so server and client match; the video fades in after hydration. With reduced motion, only the still poster shows."
          : "Pour l'accueil : des vidéos muettes qui se relaient en fondu enchaîné, une parallaxe douce et des voiles sombres. Aucune vidéo n'est choisie au rendu serveur, pour que serveur et client concordent ; la vidéo apparaît en fondu après l'hydratation. Avec le mouvement réduit, seule l'image fixe s'affiche."}
      </p>
      <Demo
        frame
        code={`<HeroVideo
  clips={[
    { webm: "/videos/hero.webm", mp4: "/videos/hero.mp4", poster: "/videos/hero.jpg" },
    { webm: "/videos/hero-2.webm", mp4: "/videos/hero-2.mp4", poster: "/videos/hero-2.jpg" },
  ]}
>
  <Heading as="h1" size="display" className="trc-enter">${t.videoTitle}</Heading>
  <Text size="lg">${t.videoDesc}</Text>
  <PillLink href="/start" solid>${t.start}</PillLink>
</HeroVideo>`}
      >
        <HeroVideo
          clips={[1, 2].map((n) => ({
            webm: asset(`/media/hero-${n}.webm`),
            mp4: asset(`/media/hero-${n}.mp4`),
            poster: asset(`/media/hero-${n}-poster.jpg`),
          }))}
        >
          <Heading as="p" size="display" className="trc-enter" style={enter(150)}>
            {t.videoTitle}
          </Heading>
          <Text size="lg" className="trc-enter" style={{ ...enter(250), marginTop: 24, maxWidth: 560 }}>
            {t.videoDesc}
          </Text>
          <div
            className="trc-enter"
            style={{ ...enter(350), display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}
          >
            <PillLink href="#" solid>
              {t.start}
            </PillLink>
            <PillLink href="#">{t.more}</PillLink>
          </div>
        </HeroVideo>
      </Demo>
      <p>
        {en
          ? "Prepare each video muted, 1280 px wide, 24–30 fps and under 25 seconds; aim for 1.5–2.5 MB per file:"
          : "Préparez chaque vidéo muette, en 1280 px de large, 24 à 30 images par seconde et moins de 25 secondes ; visez 1,5 à 2,5 Mo par fichier :"}
      </p>
      <CodeBlock
        lang="bash"
        code={`ffmpeg -i src.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i src.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 hero.webm
ffmpeg -ss 1 -i src.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 5 hero.jpg`}
      />
      <PropsTable lang={lang} rows={HERO_VIDEO_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Back to *top*" : "Haut de *page*"}
      </Heading>
      <p>
        {en
          ? "A floating accent button that appears once the first screen is scrolled past. This page has one: scroll down and look at the bottom right corner."
          : "Une pastille d'accent flottante qui apparaît une fois le premier écran dépassé. Cette page en a une : faites défiler et regardez en bas à droite."}
      </p>
      <CodeBlock code={en ? `<BackToTop />` : `<BackToTop label="Haut de page" />`} />
      <PropsTable lang={lang} rows={BACK_PROPS} />
      <BackToTop label={en ? "Back to top" : "Haut de page"} />
    </DocPage>
  );
}
