/**
 * Fills a label template: "{count} more" with { count: 3 } gives "3 more".
 * Label props accept such a template (usable from a server component) or a function.
 */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
