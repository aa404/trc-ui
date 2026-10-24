import { MenuContent, menuTitle } from "@/content/menu";

export const metadata = { title: menuTitle.en };

export default function Page() {
  return <MenuContent lang="en" />;
}
