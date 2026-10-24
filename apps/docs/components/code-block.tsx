import { codeToHtml } from "shiki";
import { CopyButton } from "@/components/copy-button";
import { noirProfond } from "@/lib/code-theme";

const LANG_BADGE: Record<string, string> = { tsx: "TS", ts: "TS", css: "CSS", bash: "SH", html: "HTML" };

/**
 * Code block highlighted at build time (no JavaScript sent to the browser, except the copy button).
 * With a `title`, a file tab shows the file name and its language.
 */
export async function CodeBlock({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  const source = code.trim();
  const html = await codeToHtml(source, { lang, theme: noirProfond });
  return (
    <div className={title ? "docs-code" : "docs-code docs-code--bare"}>
      {title ? (
        <div className="docs-code__bar">
          <span className="docs-code__file">
            <span className="docs-code__lang">{LANG_BADGE[lang] ?? lang.toUpperCase()}</span>
            {title}
          </span>
          <CopyButton code={source} />
        </div>
      ) : (
        <CopyButton code={source} />
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
