import { HeroesContent, heroesTitle } from "@/content/heroes";

export const metadata = { title: heroesTitle.en };

export default function Page() {
  return <HeroesContent lang="en" />;
}
