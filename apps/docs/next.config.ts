import type { NextConfig } from "next";

// Set when the site is served from a sub-path, such as GitHub Pages (`/trc-ui`); empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const config: NextConfig = {
  // Fully static site: can be hosted on GitHub Pages, Vercel or any file server.
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
