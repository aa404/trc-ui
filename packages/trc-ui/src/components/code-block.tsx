"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { Check } from "../utils/icons";

const BADGES: Record<string, string> = {
  tsx: "TS",
  ts: "TS",
  jsx: "JS",
  js: "JS",
  css: "CSS",
  bash: "SH",
  sh: "SH",
  html: "HTML",
  json: "JSON",
};

export type CodeBlockProps = {
  /** Source code, also what the copy button copies. */
  code: string;
  /** File name shown in a tab: "app/layout.tsx". */
  title?: ReactNode;
  /** Language, shown as a small badge next to the title. */
  language?: string;
  /** Highlighted rendering of the code, from your own highlighter; plain text by default. */
  children?: ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
};

const CopyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
  </svg>
);

/**
 * Code block with an optional file tab and a copy button that turns into an accent check for a
 * moment. Bring your own highlighting through `children`; the copied text is always `code`.
 */
export function CodeBlock({
  code,
  title,
  language,
  children,
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  const button = (
    <button
      type="button"
      onClick={copy}
      className="trc-code__copy"
      aria-label={copyLabel}
      title={copyLabel}
      data-copied={copied}
    >
      {copied ? <Check /> : <CopyIcon />}
      <span className="trc-visually-hidden" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );

  return (
    <div className={cx("trc-code", title == null && "trc-code--bare", className)}>
      {title != null ? (
        <div className="trc-code__bar">
          <span className="trc-code__file">
            {language && <span className="trc-code__lang">{BADGES[language] ?? language.toUpperCase()}</span>}
            {title}
          </span>
          {button}
        </div>
      ) : (
        button
      )}
      <pre className="trc-code__pre">
        <code>{children ?? code}</code>
      </pre>
    </div>
  );
}
