import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    // Les composants utilisent des hooks : utilisables tels quels dans l'App Router de Next.js.
    banner: { js: '"use client";' },
  },
  {
    // Feuille de style unique : les @import de src/styles sont regroupés par esbuild.
    entry: { styles: "src/styles/index.css" },
    minify: true,
  },
]);
