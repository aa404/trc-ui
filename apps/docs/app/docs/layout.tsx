import { DocsHeader } from "@/components/docs-header";
import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocsHeader />
      <div className="docs-shell">
        <DocsSidebar />
        <main>{children}</main>
      </div>
    </>
  );
}
