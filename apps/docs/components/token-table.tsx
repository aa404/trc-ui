import type { Lang } from "@/lib/i18n";

export type TokenRow = { name: string; value: string; swatch?: boolean; description: Record<Lang, string> };

const HEAD = { en: ["Token", "Default", "Use"], fr: ["Jeton", "Défaut", "Usage"] };

/** Design tokens with their default value and, for colors, a swatch. */
export function TokenTable({ lang, rows }: { lang: Lang; rows: TokenRow[] }) {
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
                <span className="docs-token">
                  {row.swatch && (
                    <span aria-hidden className="docs-token__swatch" style={{ background: `var(${row.name})` }} />
                  )}
                  <code className="docs-table__type">{row.value}</code>
                </span>
              </td>
              <td>{row.description[lang]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
