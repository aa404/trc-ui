"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Checkbox, Field, Heading, Input, PillButton, StepNumber, Switch, Text } from "trc-ui";
import { BACKGROUND, contrast, generateScale, onAccent, parseHex, randomColor } from "@/lib/color";
import type { Lang } from "@/lib/i18n";

const DEFAULT = "#08c8d8";

const PRESETS = [
  { hex: "#08c8d8", name: { en: "Cyan", fr: "Cyan" } },
  { hex: "#d41367", name: { en: "Magenta", fr: "Magenta" } },
  { hex: "#f5c518", name: { en: "Amber", fr: "Ambre" } },
  { hex: "#10b981", name: { en: "Emerald", fr: "Émeraude" } },
  { hex: "#8b5cf6", name: { en: "Violet", fr: "Violet" } },
  { hex: "#ff7a59", name: { en: "Coral", fr: "Corail" } },
  { hex: "#3b82f6", name: { en: "Blue", fr: "Bleu" } },
  { hex: "#a3e635", name: { en: "Lime", fr: "Citron vert" } },
];

const T = {
  en: {
    base: "Base color",
    hex: "Hex value",
    invalid: "Enter a hex color, such as #08c8d8.",
    random: "Random",
    presets: "Presets",
    scale: "Generated scale",
    scaleHint: "Click a shade to use it as the accent. The base color keeps its exact value in the scale.",
    shade: "Shade",
    base_: "base",
    checks: "Contrast checks",
    onBg: "Accent words on the background",
    onAccent: "Text on the accent",
    aa: "AA",
    aaLarge: "AA large text only",
    fail: "Not readable",
    useShade: (i: number) => `Use shade ${i}`,
    preview: "Live preview",
    previewTitle: "Your accent, *in place.*",
    previewBody: "Pills, accent words, step numbers and controls all follow the same variable.",
    primary: "Get started",
    secondary: "Learn more",
    check: "Checked option",
    toggle: "Notifications",
    field: "Email",
    code: "Code",
    tabs: { css: "CSS variables", scale: "Full scale", ts: "TypeScript" },
    copy: "Copy",
    copied: "Copied",
    scaleComment: "/* Optional: the full scale, for your own components. */",
  },
  fr: {
    base: "Couleur de base",
    hex: "Valeur hexadécimale",
    invalid: "Saisissez une couleur hexadécimale, comme #08c8d8.",
    random: "Au hasard",
    presets: "Couleurs prédéfinies",
    scale: "Gamme générée",
    scaleHint: "Cliquez une nuance pour en faire l'accent. La couleur de base garde sa valeur exacte dans la gamme.",
    shade: "Nuance",
    base_: "base",
    checks: "Contrastes",
    onBg: "Mots d'accent sur le fond",
    onAccent: "Texte posé sur l'accent",
    aa: "AA",
    aaLarge: "AA grands textes seulement",
    fail: "Illisible",
    useShade: (i: number) => `Utiliser la nuance ${i}`,
    preview: "Aperçu en direct",
    previewTitle: "Votre accent, *en situation.*",
    previewBody: "Pilules, mots d'accent, numéros d'étape et contrôles suivent tous la même variable.",
    primary: "Commencer",
    secondary: "En savoir plus",
    check: "Option cochée",
    toggle: "Notifications",
    field: "E-mail",
    code: "Code",
    tabs: { css: "Variables CSS", scale: "Gamme complète", ts: "TypeScript" },
    copy: "Copier",
    copied: "Copié",
    scaleComment: "/* Facultatif : la gamme complète, pour vos propres composants. */",
  },
};

type Tab = "css" | "scale" | "ts";

/** Level of a contrast ratio for text: AA (4.5), AA for large text only (3), or not readable. */
const level = (ratio: number) => (ratio >= 4.5 ? "aa" : ratio >= 3 ? "aaLarge" : "fail");

/**
 * Accent colors generator: pick a color, get a 10-shade scale, check WCAG contrast
 * against the deep black background, preview real components and copy the code.
 */
export function ColorsGenerator({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [base, setBase] = useState(DEFAULT);
  const [draft, setDraft] = useState(DEFAULT);
  const [selected, setSelected] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("css");
  const [copied, setCopied] = useState(false);

  // Shared link: `?color=` and `&shade=` are read after hydration (same first render as the server).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseHex(params.get("color") ?? "");
    if (!fromUrl) return;
    setBase(fromUrl);
    setDraft(fromUrl);
    const shade = Number(params.get("shade"));
    if (params.has("shade") && Number.isInteger(shade) && shade >= 0 && shade <= 9) setSelected(shade);
  }, []);

  /** Keeps the shareable link in sync, without adding history entries. */
  const syncUrl = (hex: string, shade: number | null) => {
    const url = new URL(window.location.href);
    url.searchParams.set("color", hex.slice(1));
    if (shade === null) url.searchParams.delete("shade");
    else url.searchParams.set("shade", String(shade));
    window.history.replaceState(null, "", url);
  };

  const { shades, baseIndex } = useMemo(() => generateScale(base), [base]);
  const accentIndex = selected ?? baseIndex;
  const accent = shades[accentIndex] ?? base;
  const textOnAccent = onAccent(accent);
  const ratioBg = contrast(accent, BACKGROUND);
  const ratioText = contrast(textOnAccent, accent);
  // First lighter shade that reads well on the background, when the accent does not.
  let suggestion = -1;
  for (let i = accentIndex - 1; ratioBg < 4.5 && i >= 0 && suggestion < 0; i--) {
    if (contrast(shades[i] ?? "", BACKGROUND) >= 4.5) suggestion = i;
  }

  const choose = (hex: string, { keepDraft = false } = {}) => {
    setBase(hex);
    if (!keepDraft) setDraft(hex);
    setSelected(null);
    syncUrl(hex, null);
  };

  const selectShade = (i: number) => {
    setSelected(i);
    syncUrl(base, i);
  };

  const code = {
    css: `:root {\n  --trc-accent: ${accent};\n  --trc-on-accent: ${textOnAccent};\n}`,
    scale: `${t.scaleComment}\n:root {\n${shades.map((s, i) => `  --brand-${i}: ${s};`).join("\n")}\n}`,
    ts: `export const brand = [\n${shades.map((s) => `  "${s}",`).join("\n")}\n] as const;`,
  }[tab];

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const draftValid = parseHex(draft) !== null;

  return (
    <div className="cg">
      <section className="cg-panel" aria-labelledby="cg-base">
        <Heading as="h2" size="md" id="cg-base">
          {t.base}
        </Heading>
        <div className="cg-controls">
          <label className="cg-picker" style={{ background: base }}>
            <span className="trc-visually-hidden">{t.base}</span>
            <input type="color" value={base} onChange={(e) => choose(e.target.value)} />
          </label>
          <Field label={t.hex} error={draftValid ? undefined : t.invalid} className="cg-hex">
            <Input
              value={draft}
              spellCheck={false}
              autoComplete="off"
              onChange={(e) => {
                setDraft(e.target.value);
                // Applied once six digits are typed, so that "#08c" does not jump to "#0088cc" mid-typing.
                const hex = parseHex(e.target.value);
                if (hex && e.target.value.replace("#", "").trim().length === 6) choose(hex, { keepDraft: true });
              }}
              onBlur={() => {
                const hex = parseHex(draft);
                if (hex) choose(hex);
              }}
            />
          </Field>
          <PillButton size="sm" onClick={() => choose(randomColor())} className="cg-random">
            {t.random}
          </PillButton>
        </div>
        <div className="cg-presets" role="group" aria-label={t.presets}>
          {PRESETS.map((p) => (
            <button
              key={p.hex}
              type="button"
              className="cg-preset"
              style={{ background: p.hex }}
              aria-label={`${p.name[lang]} ${p.hex}`}
              aria-pressed={base === p.hex}
              title={p.name[lang]}
              onClick={() => choose(p.hex)}
            />
          ))}
        </div>
      </section>

      <section className="cg-panel" aria-labelledby="cg-scale">
        <Heading as="h2" size="md" id="cg-scale">
          {t.scale}
        </Heading>
        <Text size="sm" tone="subtle">
          {t.scaleHint}
        </Text>
        <div className="cg-scale">
          {shades.map((shade, i) => (
            <button
              key={i}
              type="button"
              className="cg-shade"
              aria-pressed={i === accentIndex}
              aria-label={`${t.shade} ${i}, ${shade}${i === baseIndex ? `, ${t.base_}` : ""}`}
              onClick={() => selectShade(i)}
            >
              <span className="cg-shade__swatch" style={{ background: shade, color: onAccent(shade) }}>
                {i === baseIndex && <span className="cg-shade__base">{t.base_}</span>}
              </span>
              <span className="cg-shade__index">{i}</span>
              <span className="cg-shade__hex">{shade}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cg-panel" aria-labelledby="cg-checks">
        <Heading as="h2" size="md" id="cg-checks">
          {t.checks}
        </Heading>
        <ul className="cg-checks">
          {[
            { label: t.onBg, ratio: ratioBg, fg: accent, bg: BACKGROUND },
            { label: t.onAccent, ratio: ratioText, fg: textOnAccent, bg: accent },
          ].map((row) => {
            const l = level(row.ratio);
            return (
              <li key={row.label} className="cg-check">
                <span className="cg-check__sample" style={{ color: row.fg, background: row.bg }}>
                  Aa
                </span>
                <span className="cg-check__label">{row.label}</span>
                <span className="cg-check__ratio">{row.ratio.toFixed(2)} : 1</span>
                <span className={`cg-check__level cg-check__level--${l}`}>{t[l]}</span>
              </li>
            );
          })}
        </ul>
        {suggestion >= 0 && (
          <PillButton size="sm" onClick={() => selectShade(suggestion)}>
            {t.useShade(suggestion)}
          </PillButton>
        )}
      </section>

      <section className="cg-panel" aria-labelledby="cg-preview">
        <Heading as="h2" size="md" id="cg-preview">
          {t.preview}
        </Heading>
        <div
          className="cg-preview"
          style={{ "--trc-accent": accent, "--trc-on-accent": textOnAccent } as CSSProperties}
        >
          <div className="cg-preview__text">
            <StepNumber n={1} size="sm" />
            <Heading as="p" size="lg">
              {t.previewTitle}
            </Heading>
            <Text>{t.previewBody}</Text>
          </div>
          <div className="cg-preview__row">
            <PillButton solid>{t.primary}</PillButton>
            <PillButton>{t.secondary}</PillButton>
          </div>
          <div className="cg-preview__row">
            <Checkbox label={t.check} defaultChecked />
            <Switch label={t.toggle} defaultChecked />
          </div>
          <Field label={t.field} className="cg-preview__field">
            <Input placeholder="name@example.com" />
          </Field>
        </div>
      </section>

      <section className="cg-panel" aria-labelledby="cg-code">
        <div className="cg-code__head">
          <Heading as="h2" size="md" id="cg-code">
            {t.code}
          </Heading>
          <div className="cg-tabs" role="tablist" aria-label={t.code}>
            {(Object.keys(t.tabs) as Tab[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className="cg-tab"
                onClick={() => setTab(key)}
              >
                {t.tabs[key]}
              </button>
            ))}
          </div>
        </div>
        <div className="cg-code">
          <pre role="tabpanel">
            <code>{code}</code>
          </pre>
          <PillButton size="sm" onClick={copy} className="cg-copy" aria-live="polite">
            {copied ? t.copied : t.copy}
          </PillButton>
        </div>
      </section>
    </div>
  );
}
