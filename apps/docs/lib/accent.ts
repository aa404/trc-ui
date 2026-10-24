/** Accent colors offered on the site, and how the chosen one is applied and remembered. */
export const ACCENTS = [
  { hex: "#08c8d8", onAccent: "#0b0c0f", name: { en: "Cyan", fr: "Cyan" } },
  { hex: "#d41367", onAccent: "#ffffff", name: { en: "Magenta", fr: "Magenta" } },
  { hex: "#f5c518", onAccent: "#0b0c0f", name: { en: "Amber", fr: "Ambre" } },
  { hex: "#10b981", onAccent: "#0b0c0f", name: { en: "Emerald", fr: "Émeraude" } },
  { hex: "#8b5cf6", onAccent: "#ffffff", name: { en: "Violet", fr: "Violet" } },
] as const;

export const DEFAULT_ACCENT = ACCENTS[0].hex;
export const ACCENT_STORAGE_KEY = "trc-docs-accent";

/** Sets the accent on the whole page: every component reads `--trc-accent`. */
export function applyAccent(hex: string) {
  const accent = ACCENTS.find((a) => a.hex === hex) ?? ACCENTS[0];
  const root = document.documentElement.style;
  root.setProperty("--trc-accent", accent.hex);
  root.setProperty("--trc-on-accent", accent.onAccent);
}

/** Remembered accent, if any (storage can be unavailable in private modes). */
export function storedAccent() {
  try {
    return localStorage.getItem(ACCENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeAccent(hex: string) {
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, hex);
  } catch {
    // Not remembered, but still applied to the current page.
  }
}

/**
 * Inline script run before the page paints: applies the remembered accent, so that a reload
 * never flashes the default color first.
 */
export const ACCENT_BOOT_SCRIPT = `try{var h=localStorage.getItem(${JSON.stringify(ACCENT_STORAGE_KEY)});var a=${JSON.stringify(
  ACCENTS.map((a) => [a.hex, a.onAccent]),
)};for(var i=0;i<a.length;i++){if(a[i][0]===h){var s=document.documentElement.style;s.setProperty("--trc-accent",a[i][0]);s.setProperty("--trc-on-accent",a[i][1]);}}}catch(e){}`;
