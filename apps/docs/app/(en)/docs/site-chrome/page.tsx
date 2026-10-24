import { SiteChromeContent, siteChromeTitle } from "@/content/site-chrome";

export const metadata = { title: siteChromeTitle.en };

export default function Page() {
  return <SiteChromeContent lang="en" />;
}
