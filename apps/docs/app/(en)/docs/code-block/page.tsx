import { CodeBlockContent, codeBlockTitle } from "@/content/data-pages";

export const metadata = { title: codeBlockTitle.en };

export default function Page() {
  return <CodeBlockContent lang="en" />;
}
