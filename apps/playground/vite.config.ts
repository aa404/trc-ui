import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const lib = (path: string) => fileURLToPath(new URL(`../../packages/trc-ui/src/${path}`, import.meta.url));

export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  // The playground reads the library sources directly: every change shows up right away.
  resolve: {
    alias: [
      { find: /^trc-ui\/styles\.css$/, replacement: lib("styles/index.css") },
      { find: /^trc-ui$/, replacement: lib("index.ts") },
    ],
  },
});
