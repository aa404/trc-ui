import { RootDocument, rootMetadata } from "@/components/root-document";

export const metadata = rootMetadata("fr");

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="fr">{children}</RootDocument>;
}
