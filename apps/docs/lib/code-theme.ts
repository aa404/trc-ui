import type { ThemeRegistration } from "shiki";

/**
 * Deep black syntax theme: shades of grey and a single accent color
 * (keywords, tags), like the rest of the site.
 */
export const noirProfond: ThemeRegistration = {
  name: "noir-profond",
  type: "dark",
  colors: { "editor.background": "#151618", "editor.foreground": "#c9cacc" },
  settings: [
    { settings: { foreground: "#c9cacc" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6b6c70", fontStyle: "italic" } },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "entity.name.tag"],
      settings: { foreground: "#08c8d8" },
    },
    { scope: ["string", "string.quoted", "markup.inline.raw"], settings: { foreground: "#ffffff" } },
    {
      scope: ["entity.name.function", "support.function", "entity.name.type", "support.class.component"],
      settings: { foreground: "#ffffff" },
    },
    {
      scope: ["entity.other.attribute-name", "variable.parameter", "support.type.property-name"],
      settings: { foreground: "#9fa0a4" },
    },
    { scope: ["constant", "constant.numeric", "constant.language"], settings: { foreground: "#e2e2e4" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#7d7e82" } },
  ],
};
