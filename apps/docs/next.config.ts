import type { NextConfig } from "next";

const config: NextConfig = {
  // Site entièrement statique : hébergeable sur GitHub Pages, Vercel ou n'importe quel serveur de fichiers.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
