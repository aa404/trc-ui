import { LoadingContent, loadingTitle } from "@/content/data-pages";

export const metadata = { title: loadingTitle.en };

export default function Page() {
  return <LoadingContent lang="en" />;
}
