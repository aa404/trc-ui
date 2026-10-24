import { HeroesContent, heroesTitle } from "@/content/heroes";

export const metadata = { title: heroesTitle.fr };

export default function Page() {
  return <HeroesContent lang="fr" />;
}
