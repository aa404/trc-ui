"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { splitPath } from "@/lib/i18n";

const LABELS = {
  en: { copy: "Copy code", copied: "Copied" },
  fr: { copy: "Copier le code", copied: "Copié" },
};

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

/** Copies a code block to the clipboard; the icon turns into an accent check for a moment. */
export function CopyButton({ code }: { code: string }) {
  const t = LABELS[splitPath(usePathname()).lang];
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" onClick={copy} className="docs-copy" aria-label={t.copy} title={t.copy} data-copied={copied}>
      {copied ? (
        <svg {...icon}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg {...icon}>
          <rect x="9" y="9" width="12" height="12" rx="2.5" />
          <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
        </svg>
      )}
      <span className="trc-visually-hidden" aria-live="polite">
        {copied ? t.copied : ""}
      </span>
    </button>
  );
}
