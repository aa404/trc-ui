"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { AccentText } from "./typography";

/** Delay of an entrance (`.trc-enter`) in milliseconds. */
const delay = (ms: number) => ({ "--trc-delay": `${ms}ms` }) as CSSProperties;

export type PageHeroProps = {
  /** Title; the words between *asterisks* take the accent, otherwise the last words (`accentLast`). */
  title: string;
  /** Number of trailing words in the accent color when the title has no asterisks (2 for a long title, 1 otherwise). */
  accentLast?: number;
  description?: ReactNode;
  /** Discreet line under the description (last updated date, breadcrumb…). */
  meta?: ReactNode;
  /**
   * Background photo, heavily darkened: a URL, or a ready-made element (Next.js `<Image fill />`…).
   * Without a photo, a subtle accent glow on a graphite background.
   */
  image?: string | ReactNode;
  /** Photo position (`object-position`). */
  imagePosition?: string;
  /** Content under the text (pills…). */
  children?: ReactNode;
  className?: string;
};

/**
 * Header of inner pages: rounded card inset from the edges, darkened background photo,
 * thin title whose last words take the accent. Leaves room for the floating header above.
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
  /** Muted video, 1280 px, without an audio track. Provide WebM and/or MP4. */
  webm?: string;
  mp4?: string;
  /** Image shown before playback, and alone when the user prefers reduced motion. */
  poster?: string;
};

export type HeroVideoProps = {
  /** Videos played one after another with a crossfade; the first one is picked at random. */
  clips: HeroClip[];
  /** Hero text (title, description, pills), pinned to the bottom left. */
  children: ReactNode;
  /** Optional block pinned to the bottom right on large screens. */
  aside?: ReactNode;
  /** Crossfade duration, in seconds. */
  fade?: number;
  /** Soft parallax: the video moves down slower than the page. */
  parallax?: boolean;
  className?: string;
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Home page hero: rounded card inset from the edges, muted background videos that alternate with
 * a crossfade, dark veils for legibility. No video in the server render: the pick happens
 * after hydration, then the video fades in. Reduced motion: the still image only.
 */
export function HeroVideo({ clips, children, aside, fade = 1.2, parallax = true, className }: HeroVideoProps) {
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  // -1 until the pick is made: same render on the server and on the client.
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (clips.length === 0) return;
    const start = Math.floor(Math.random() * clips.length);
    // Element captured here: in strict mode, React detaches refs before the cleanup runs.
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
              // Shortly before the active video ends, the next one restarts and comes to the front.
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (i === active && v.duration && v.duration - v.currentTime <= fade) playNext(i);
              }}
              // Safety net when `timeupdate` did not trigger the switch (background tab…).
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
