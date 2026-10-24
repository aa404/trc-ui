import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeft = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const Spinner = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </svg>
);

export const ChevronDown = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Check = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Menu = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Close = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const ArrowUp = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
