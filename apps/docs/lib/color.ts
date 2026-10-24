/**
 * Color math for the colors generator, without dependencies: hex ↔ OKLCH conversions,
 * 10-shade scales with even perceived lightness, and WCAG contrast ratios.
 */

export type Rgb = [number, number, number];
export type Oklch = { l: number; c: number; h: number };

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function parseHex(input: string): string | null {
  const match = HEX.exec(input.trim());
  if (!match?.[1]) return null;
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  return `#${hex.toLowerCase()}`;
}

export const hexToRgb = (hex: string): Rgb => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const rgbToHex = ([r, g, b]: Rgb) =>
  `#${[r, g, b]
    .map((v) =>
      Math.round(Math.min(255, Math.max(0, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;

const toLinear = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (v: number) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

/** sRGB → OKLCH (Björn Ottosson's OKLab, in polar form). */
export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as Rgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

/** OKLCH → linear sRGB, possibly out of gamut (values outside 0–1). */
function oklchToLinear({ l: L, c, h }: Oklch): Rgb {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** OKLCH → hex; out-of-gamut colors keep their lightness and hue and lose chroma until they fit. */
export function oklchToHex(color: Oklch): string {
  let rgb = oklchToLinear(color);
  if (!inGamut(rgb)) {
    let lo = 0;
    let hi = color.c;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear({ ...color, c: mid }))) lo = mid;
      else hi = mid;
    }
    rgb = oklchToLinear({ ...color, c: lo });
  }
  return rgbToHex(rgb.map((v) => fromLinear(Math.min(1, Math.max(0, v)))) as Rgb);
}

/** Lightness of each shade, from the lightest (0) to the darkest (9). */
const LIGHTNESS = [0.97, 0.92, 0.85, 0.77, 0.69, 0.61, 0.53, 0.45, 0.37, 0.29];
/** Relative chroma: soft at both ends, full in the middle. */
const CHROMA = [0.15, 0.32, 0.55, 0.78, 0.94, 1, 0.97, 0.88, 0.76, 0.64];

export type Scale = { shades: string[]; baseIndex: number };

/**
 * 10 shades with evenly spaced perceived lightness, same hue as the base color.
 * The base color itself sits, unchanged, at the shade whose lightness is the closest.
 */
export function generateScale(base: string): Scale {
  const color = hexToOklch(base);
  let baseIndex = 0;
  LIGHTNESS.forEach((l, i) => {
    if (Math.abs(l - color.l) < Math.abs((LIGHTNESS[baseIndex] ?? 0) - color.l)) baseIndex = i;
  });
  const peak = color.c / (CHROMA[baseIndex] ?? 1);
  // Near-grey colors have an unstable hue: keep them grey.
  const grey = color.c < 0.02;
  const shades = LIGHTNESS.map((l, i) =>
    i === baseIndex ? base : oklchToHex({ l, c: grey ? color.c : peak * (CHROMA[i] ?? 1), h: color.h }),
  );
  return { shades, baseIndex };
}

/** WCAG 2 relative luminance. */
export const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG 2 contrast ratio, from 1 to 21. */
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export const BACKGROUND = "#0b0c0f";
export const NEAR_BLACK = "#0b0c0f";
export const WHITE = "#ffffff";

/** Text color to put on the accent: near black or white, whichever reads better. */
export const onAccent = (accent: string) =>
  contrast(accent, NEAR_BLACK) >= contrast(accent, WHITE) ? NEAR_BLACK : WHITE;

export function randomColor() {
  return oklchToHex({ l: 0.62 + Math.random() * 0.18, c: 0.12 + Math.random() * 0.1, h: Math.random() * 360 });
}
