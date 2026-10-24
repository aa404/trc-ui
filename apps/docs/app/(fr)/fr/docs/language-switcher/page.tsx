import { LanguageSwitcherContent, languageSwitcherTitle } from "@/content/language-switcher";

export const metadata = { title: languageSwitcherTitle.fr };

export default function Page() {
  return <LanguageSwitcherContent lang="fr" />;
}
