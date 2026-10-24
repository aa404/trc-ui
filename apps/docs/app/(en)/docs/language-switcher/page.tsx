import { LanguageSwitcherContent, languageSwitcherTitle } from "@/content/language-switcher";

export const metadata = { title: languageSwitcherTitle.en };

export default function Page() {
  return <LanguageSwitcherContent lang="en" />;
}
