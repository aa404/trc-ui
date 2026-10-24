"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { AccentText } from "./typography";

/** Délai d'une apparition (`.trc-enter`) en millisecondes. */
const delay = (ms: number) => ({ "--trc-delay": `${ms}ms` }) as CSSProperties;

export type PageHeroProps = {
  /** Titre ; le passage entre *astérisques* est en accent, sinon les derniers mots (`accentLast`). */
  title: string;
  /** Nombre de derniers mots en accent quand le titre n'a pas d'astérisques (2 pour un titre long, 1 sinon). */
  accentLast?: number;
  description?: ReactNode;
  /** Ligne discrète sous la description (date de mise à jour, fil d'Ariane…). */
  meta?: ReactNode;
  /**
   * Photo de fond, très assombrie : une URL, ou un élément déjà prêt (`<Image fill />` de Next.js…).
   * Sans photo, un halo d'accent discret sur fond graphite.
   */
  image?: string | ReactNode;
  /** Position de la photo (`object-position`). */
  imagePosition?: string;
  /** Contenu sous le texte (pilules…). */
  children?: ReactNode;
  className?: string;
};

/**
 * En-tête des pages intérieures : carte arrondie en retrait des bords, photo de fond assombrie,
 * titre fin dont les derniers mots prennent l'accent. Laisse la place à l'en-tête flottant au-dessus.
 */
export function PageHero({
  title,
  accentLast,
  description,
  meta,
  image,
  imagePosition = "50% 50%",
  children,
  className,
}: PageHeroProps) {
  const words = title.split(" ").length;
  return (
    <section className={cx("trc-hero-inset", className)}>
      <div className="trc-page-hero">
        <div aria-hidden className="trc-hero__media">
          {typeof image === "string" ? (
            <img src={image} alt="" className="trc-hero__image" style={{ objectPosition: imagePosition }} />
          ) : image != null ? (
            image
          ) : (
            <div className="trc-page-hero__glow" />
          )}
        </div>
        <div aria-hidden className="trc-page-hero__veil" />
        <div className="trc-page-hero__content">
          <h1 className="trc-display trc-page-hero__title trc-enter" style={delay(150)}>
            <AccentText text={title} accentLast={accentLast ?? (words > 3 ? 2 : 1)} />
          </h1>
          {description != null && (
            <p className="trc-page-hero__description trc-enter" style={delay(250)}>
              {description}
            </p>
          )}
          {meta != null && (
            <div className="trc-page-hero__meta trc-enter" style={delay(350)}>
              {meta}
            </div>
          )}
          {children != null && (
            <div className="trc-page-hero__actions trc-enter" style={delay(450)}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export type HeroClip = {
  /** Vidéo muette, 1280 px, sans piste audio. Fournir WebM et/ou MP4. */
  webm?: string;
  mp4?: string;
  /** Image affichée avant la lecture, et seule si l'utilisateur limite les animations. */
  poster?: string;
};

export type HeroVideoProps = {
  /** Vidéos jouées l'une après l'autre en fondu enchaîné ; la première est tirée au hasard. */
  clips: HeroClip[];
  /** Texte du héros (titre, description, pilules), calé en bas à gauche. */
  children: ReactNode;
  /** Bloc facultatif calé en bas à droite sur grand écran. */
  aside?: ReactNode;
  /** Durée du fondu enchaîné, en secondes. */
  fade?: number;
  /** Parallaxe douce : la vidéo descend moins vite que la page. */
  parallax?: boolean;
  className?: string;
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Héros d'accueil : carte arrondie en retrait des bords, vidéos muettes en fond qui alternent en
 * fondu enchaîné, voiles sombres pour la lisibilité. Aucune vidéo au rendu serveur : le choix
 * se fait après l'hydratation, puis la vidéo apparaît en fondu. Mouvement réduit : l'image fixe seule.
 */
export function HeroVideo({ clips, children, aside, fade = 1.2, parallax = true, className }: HeroVideoProps) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  // -1 tant que le choix n'est pas fait : même rendu côté serveur et côté client.
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (clips.length === 0) return;
    const start = Math.floor(Math.random() * clips.length);
    // Élément capturé ici : en mode strict, React détache les refs avant le nettoyage.
    const video = videos.current[start];
    if (!prefersReducedMotion()) void video?.play().catch(() => {});
    const frame = requestAnimationFrame(() => setActive(start));
    return () => {
      cancelAnimationFrame(frame);
      video?.pause();
    };
  }, [clips.length]);

  useEffect(() => {
    const el = section.current;
    const layer = media.current;
    if (!parallax || !el || !layer || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
      layer.style.transform = `translate3d(0, ${progress * 120}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [parallax]);

  const playNext = (i: number) => {
    const next = videos.current[(i + 1) % clips.length];
    if (!next) return;
    next.currentTime = 0;
    void next.play().catch(() => {});
    setActive((i + 1) % clips.length);
  };

  return (
    <section ref={section} className={cx("trc-hero-inset", className)}>
      <div className="trc-hero-video">
        <div ref={media} aria-hidden className="trc-hero__media trc-hero-video__media">
          {clips.map((clip, i) => (
            <video
              key={i}
              ref={(el) => {
                videos.current[i] = el;
              }}
              className={cx("trc-hero__image", "trc-hero-video__clip", i === active && "trc-hero-video__clip--active")}
              style={{ transitionDuration: `${fade}s` }}
              muted
              playsInline
              preload="metadata"
              poster={clip.poster}
              // Peu avant la fin de la vidéo active, la suivante repart du début et passe au premier plan.
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (i === active && v.duration && v.duration - v.currentTime <= fade) playNext(i);
              }}
              // Filet de sécurité si `timeupdate` n'a pas déclenché l'enchaînement (onglet en arrière-plan…).
              onEnded={() => i === active && playNext(i)}
            >
              {clip.webm && <source src={clip.webm} type="video/webm" />}
              {clip.mp4 && <source src={clip.mp4} type="video/mp4" />}
            </video>
          ))}
        </div>
        <div aria-hidden className="trc-hero-video__veil" />
        <div className="trc-hero-video__content">
          <div className="trc-hero-video__main">{children}</div>
          {aside != null && <div className="trc-hero-video__aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
