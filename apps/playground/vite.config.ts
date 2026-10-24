import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const lib = (path: string) => fileURLToPath(new URL(`../../packages/trc-ui/src/${path}`, import.meta.url));

export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  // Le bac à sable lit directement les sources : chaque modification de la bibliothèque est visible tout de suite.
  resolve: {
    alias: [
      { find: /^trc-ui\/styles\.css$/, replacement: lib("styles/index.css") },
      { find: /^trc-ui$/, replacement: lib("index.ts") },
    ],
  },
});
