import { DocsFrame } from "@/components/docs-frame";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsFrame lang="en">{children}</DocsFrame>;
}
