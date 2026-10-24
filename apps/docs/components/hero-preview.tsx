"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Card,
  Field,
  Input,
  PillButton,
  Progress,
  SegmentedControl,
  Stat,
  Switch,
  Tag,
  toast,
} from "trc-ui";
import { ACCENTS, DEFAULT_ACCENT, applyAccent, storeAccent, storedAccent } from "@/lib/accent";
import { localePath, type Lang } from "@/lib/i18n";

const T = {
  en: {
    preview: "Live preview of trc ui components",
    visitors: "Visitors",
    vsLast: "vs last month",
    goal: "Monthly goal",
    email: "Email",
    subscribe: "Subscribe",
    subscribed: "You are on the list.",
    period: "Period",
    day: "Day",
    week: "Week",
    month: "Month",
    alerts: "Notifications",
    alertsDesc: "Replies and mentions",
    team: "Team",
    more: "{count} more",
    live: "Live",
    accent: "Accent color",
    generator: "Colors generator",
  },
  fr: {
    preview: "Aperçu vivant des composants trc ui",
    visitors: "Visiteurs",
    vsLast: "sur un mois",
    goal: "Objectif du mois",
    email: "E-mail",
    subscribe: "S'abonner",
    subscribed: "Vous êtes inscrit.",
    period: "Période",
    day: "Jour",
    week: "Semaine",
    month: "Mois",
    alerts: "Notifications",
    alertsDesc: "Réponses et mentions",
    team: "Équipe",
    more: "{count} de plus",
    live: "En direct",
    accent: "Couleur d'accent",
    generator: "Générateur de couleurs",
  },
};

/**
 * Home page preview: a small dashboard built with the real components, and swatches that change
 * its accent live, to show at a glance that one variable themes everything.
 */
export function HeroPreview({ lang }: { lang: Lang }) {
  const t = T[lang];
  // Same first render as the server, then the remembered accent (already applied by the boot script).
  const [accent, setAccent] = useState<string>(DEFAULT_ACCENT);
  useEffect(() => {
    const stored = storedAccent();
    if (stored && ACCENTS.some((a) => a.hex === stored)) setAccent(stored);
  }, []);
  const choose = (hex: string) => {
    setAccent(hex);
    applyAccent(hex);
    storeAccent(hex);
  };

  return (
    <div className="home-preview">
      <section aria-label={t.preview} className="home-preview__stack">
        <Card padding="sm" className="home-preview__card home-preview__card--stat">
          <div className="home-preview__row">
            <Stat label={t.visitors} value="12 480" change="+12 %" changeTone="positive" description={t.vsLast} />
            <Tag tone="accent">{t.live}</Tag>
          </div>
          <Progress label={t.goal} value={72} showValue />
        </Card>

        <Card padding="sm" className="home-preview__card home-preview__card--form">
          <form
            className="home-preview__form"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(t.subscribed);
            }}
          >
            <Field label={t.email}>
              <Input type="email" placeholder="ama@example.com" autoComplete="off" />
            </Field>
            <PillButton type="submit" solid size="sm">
              {t.subscribe}
            </PillButton>
          </form>
        </Card>

        <Card padding="sm" className="home-preview__card home-preview__card--settings">
          <SegmentedControl
            size="sm"
            label={t.period}
            defaultValue="week"
            options={[
              { value: "day", label: t.day },
              { value: "week", label: t.week },
              { value: "month", label: t.month },
            ]}
          />
          <Switch label={t.alerts} description={t.alertsDesc} defaultChecked />
          <div className="home-preview__row">
            <span className="home-preview__muted">{t.team}</span>
            <AvatarGroup max={3} size="sm" moreLabel={t.more}>
              <Avatar name="Ama Mensah" size="sm" />
              <Avatar name="Koffi Adjovi" size="sm" />
              <Avatar name="Sena Houngbo" size="sm" />
              <Avatar name="Yao Kouassi" size="sm" />
              <Avatar name="Fifi Ahouansou" size="sm" />
            </AvatarGroup>
          </div>
        </Card>
      </section>

      <div className="home-preview__accents">
        <div role="radiogroup" aria-label={t.accent} className="home-preview__swatches">
          {ACCENTS.map((option) => (
            <label
              key={option.hex}
              className="home-preview__swatch"
              style={{ background: option.hex }}
              title={option.name[lang]}
            >
              <input
                type="radio"
                name="home-accent"
                value={option.hex}
                checked={accent === option.hex}
                onChange={() => choose(option.hex)}
                aria-label={option.name[lang]}
              />
            </label>
          ))}
        </div>
        <Link href={localePath(lang, "/docs/colors-generator/")} className="home-preview__link">
          {t.generator}
        </Link>
      </div>
    </div>
  );
}
