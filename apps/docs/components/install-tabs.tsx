import { Tabs } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import type { Lang } from "@/lib/i18n";

const MANAGERS = [
  { value: "npm", command: "npm install trc-ui" },
  { value: "yarn", command: "yarn add trc-ui" },
  { value: "pnpm", command: "pnpm add trc-ui" },
  { value: "bun", command: "bun add trc-ui" },
];

/** Install command for each package manager, in tabs. */
export function InstallTabs({ lang }: { lang: Lang }) {
  return (
    <Tabs
      className="docs-install-tabs"
      label={lang === "en" ? "Package manager" : "Gestionnaire de paquets"}
      items={MANAGERS.map(({ value, command }) => ({
        value,
        label: value,
        content: <CodeBlock lang="bash" code={command} />,
      }))}
    />
  );
}
