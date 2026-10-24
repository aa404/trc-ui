import type { NextConfig } from "next";

const config: NextConfig = {
  // Fully static site: can be hosted on GitHub Pages, Vercel or any file server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
