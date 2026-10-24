<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/brand/trc-mark-white.svg" />
    <img src="assets/brand/trc-mark-black.svg" alt="" width="72" height="72" />
  </picture>
</p>

<h1 align="center">trc ui</h1>

<p align="center">
  React components with a deep black design: near-black backgrounds, graphite cards,<br />
  thin headings, a single accent color and pill buttons whose dot stretches on hover.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/trc-ui"><img src="https://img.shields.io/npm/v/trc-ui?color=08c8d8&label=npm" alt="npm version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-08c8d8" alt="MIT license" /></a>
</p>

```bash
npm install trc-ui
# or
yarn add trc-ui
pnpm add trc-ui
bun add trc-ui
```

**Documentation and live demos: [ui.theringconcept.com](https://ui.theringconcept.com)**

See the [package README](packages/trc-ui/README.md) for setup, usage, components and theming.

## Repository

This repository is a monorepo with npm workspaces:

| Folder | Contents |
| --- | --- |
| [`packages/trc-ui`](packages/trc-ui) | The library published on npm. |
| [`apps/docs`](apps/docs) | The documentation site (Next.js, static export), in English and French, with live demos and a colors generator. |
| [`apps/playground`](apps/playground) | A Vite playground to try components quickly. |
| [`assets/brand`](assets/brand) | The trc ui mark. |

## Development

Requires Node.js 20 or later.

```bash
npm install
npm run dev:docs        # documentation site on http://localhost:3000
npm run dev:playground  # Vite playground
npm run typecheck       # all workspaces
npm run build           # build the library into packages/trc-ui/dist
npm run build:docs      # build the library, then the static docs into apps/docs/out
```

Every push to `main` deploys the documentation to GitHub Pages (`.github/workflows/docs.yml`).

The docs and the playground read the library sources directly: every change shows up right away, without a rebuild.

## Contributing

Issues and pull requests are welcome. trc ui follows a few design rules on purpose: a single accent color, no shadows, thin headings with one accent word, no icons in badges and no icons in buttons other than the pill arrow. Please keep new components within these rules.

## License

[MIT](LICENSE), by Aurel Agbado, [The Ring Concept](https://www.theringconcept.com/).
