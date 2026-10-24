import { codeToHtml } from "shiki";
import { noirProfond } from "@/lib/code-theme";

/** Code block highlighted at build time (no JavaScript sent to the browser). */
export async function CodeBlock({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  const html = await codeToHtml(code.trim(), { lang, theme: noirProfond });
  return (
    <div className="docs-code">
      {title && <div className="docs-code__title">{title}</div>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
