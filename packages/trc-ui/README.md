# trc ui

React components with a deep black design: near-black backgrounds, graphite cards, thin headings, a single accent color and pill buttons whose dot stretches on hover.

[![npm](https://img.shields.io/npm/v/trc-ui?color=08c8d8&label=npm)](https://www.npmjs.com/package/trc-ui)
[![license](https://img.shields.io/badge/license-MIT-08c8d8)](https://github.com/aa404/trc-ui/blob/main/LICENSE)

- **Sober.** Near-black backgrounds, graphite cards, one accent color. Depth comes from shades of grey, not shadows.
- **Thin.** Light Montserrat headings carry the page, with one accent word per title.
- **Alive.** Pills that stretch, cards that wake up on hover, a header that blurs as you scroll.
- **Accessible.** Native form controls, labels and messages wired automatically, keyboard focus everywhere, reduced motion respected.
- **Light.** No runtime dependency besides React. One stylesheet, themable with CSS variables.

**Documentation and live demos: [ui.theringconcept.com](https://ui.theringconcept.com)**

## Installation

```bash
npm install trc-ui
# or
yarn add trc-ui
pnpm add trc-ui
bun add trc-ui
```

React 18 or later is required.

## Setup

Import the stylesheet once, at the root of your app, and add the `trc` class to `<body>`:

```tsx
import "trc-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="trc">{children}</body>
    </html>
  );
}
```

The design relies on [Montserrat](https://fonts.google.com/specimen/Montserrat) (weights 300, 400 and 500), which is not bundled. Load it, then point trc ui to it:

```tsx
// Next.js
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-montserrat" });
// <html className={montserrat.variable}>
```

```css
:root {
  --trc-font: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
}
```

Without Next.js, a Google Fonts `<link>` is enough: trc ui uses `"Montserrat"` by default.

## Usage

```tsx
import { Heading, PillButton, Text } from "trc-ui";

export function Welcome() {
  return (
    <section>
      <Heading as="h1" size="display">
        Welcome to *deep black.*
      </Heading>
      <Text size="lg">The words between asterisks take the accent color.</Text>
      <PillButton solid>Get started</PillButton>
    </section>
  );
}
```

## Components

| Component | What it is |
| --- | --- |
| `Heading`, `Text`, `AccentText`, `StepNumber` | Thin headings with an accent word, body text, large thin step numbers. |
| `PillButton`, `PillLink` | The signature pill: a round accent dot that stretches to fill the pill on hover. |
| `Card`, `Section`, `Container` | Graphite cards (with an optional watermark icon), inset sections, centered containers. |
| `Field`, `Input`, `Textarea`, `Select` | Native controls; `Field` wires the label, hint and error for screen readers. |
| `Checkbox`, `Switch` | Native checkboxes, the switch announced as a switch. |
| `SiteHeader`, `SiteFooter` | Floating header with dropdowns and a mobile side panel; footer as a graphite card. |
| `PageHero`, `HeroVideo`, `BackToTop` | Photo and video heroes inset from the screen edges; a floating back-to-top button. |

## With a router

Links accept your router's link component: `as` on `PillLink` and `Card`, `linkAs` on `SiteHeader` and `SiteFooter`.

```tsx
import Link from "next/link";
import { PillLink, SiteHeader } from "trc-ui";

<PillLink as={Link} href="/pricing">See pricing</PillLink>
<SiteHeader linkAs={Link} logo={<Logo />} logoLabel="Home" nav={nav} />
```

Components ship with the `"use client"` directive and work as-is in the Next.js App Router.

## Theming

Every color, radius and motion setting is a CSS variable prefixed with `--trc-`. Change the accent once:

```css
:root {
  --trc-accent: #d41367;
  --trc-on-accent: #ffffff; /* text on the accent: near black by default */
}
```

Variables cascade, so you can also theme a single area: `<div style={{ "--trc-accent": "#d41367" }}>`.

The documentation includes a [colors generator](https://ui.theringconcept.com/docs/colors-generator/) that builds a 10-shade scale from your brand color, checks WCAG contrast on deep black and gives you the code.

## Browser support

trc ui uses `color-mix()` and `:has()`: Chrome and Edge 111+, Safari 16.2+, Firefox 121+.

## License

[MIT](https://github.com/aa404/trc-ui/blob/main/LICENSE), by Aurel Agbado, [The Ring Concept](https://www.theringconcept.com/).
