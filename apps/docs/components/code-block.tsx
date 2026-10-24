import { codeToHtml } from "shiki";
import { noirProfond } from "@/lib/code-theme";

/** Bloc de code coloré au moment du build (aucun JavaScript envoyé au navigateur). */
export async function CodeBlock({ code, lang = "tsx", title }: { code: string; lang?: string; title?: string }) {
  const html = await codeToHtml(code.trim(), { lang, theme: noirProfond });
  return (
    <div className="docs-code">
      {title && <div className="docs-code__title">{title}</div>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
