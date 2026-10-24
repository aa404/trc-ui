import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";

/** Live preview of a component, with its source code underneath. */
export function Demo({ children, code, center = false }: { children: ReactNode; code: string; center?: boolean }) {
  return (
    <div className="docs-demo">
      <div className={center ? "docs-demo__preview docs-demo__preview--center" : "docs-demo__preview"}>{children}</div>
      <CodeBlock code={code} />
    </div>
  );
}
