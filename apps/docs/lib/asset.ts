/** Base path of the site (`/trc-ui` on GitHub Pages, empty locally). Next.js links add it on their own. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** URL of a file from `public/`, for elements that Next.js does not rewrite (`<img>`, `<video>`). */
export const asset = (path: string) => `${BASE_PATH}${path}`;
