import type { Lang } from "@/lib/i18n";

export type PropRow = { name: string; type: string; default?: string; description: Record<Lang, string> };

const HEAD = {
  en: ["Prop", "Type", "Default", "Description"],
  fr: ["Prop", "Type", "Défaut", "Description"],
};

/** Props of a component: name, type, default value and a short description. */
export function PropsTable({ lang, rows }: { lang: Lang; rows: PropRow[] }) {
  return (
    <div className="docs-table">
      <table>
        <thead>
          <tr>
            {HEAD[lang].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <code className="docs-table__type">{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : "–"}</td>
              <td>{row.description[lang]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
