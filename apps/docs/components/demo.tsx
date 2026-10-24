import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";

/**
 * Live preview of a component, with its source code underneath.
 * `frame`: a full-bleed preview that contains `position: fixed` elements (floating header, hero).
 */
export function Demo({
  children,
  code,
  center = false,
  frame = false,
  title = "Demo.tsx",
}: {
  children: ReactNode;
  code: string;
  center?: boolean;
  frame?: boolean;
  title?: string;
}) {
  return (
    <div className="docs-demo">
      <div
        className={["docs-demo__preview", center && "docs-demo__preview--center", frame && "docs-demo__preview--frame"]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
      <CodeBlock code={code} title={title} />
    </div>
  );
}
