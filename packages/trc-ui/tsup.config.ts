import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ["react", "react-dom"],
    // Components use hooks: usable as-is in the Next.js App Router.
    banner: { js: '"use client";' },
  },
  {
    // Single stylesheet: esbuild inlines the @imports of src/styles.
    entry: { styles: "src/styles/index.css" },
    minify: true,
  },
]);
