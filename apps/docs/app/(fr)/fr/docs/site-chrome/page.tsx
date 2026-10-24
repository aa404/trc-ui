import { SiteChromeContent, siteChromeTitle } from "@/content/site-chrome";

export const metadata = { title: siteChromeTitle.fr };

export default function Page() {
  return <SiteChromeContent lang="fr" />;
}
