import type { ElementType } from "react";
import { cx } from "../utils/cx";

export type Language = {
  /** Language code, shown in capitals: "en", "fr"… */
  code: string;
  /** Full name in that language ("English", "Français"), for screen readers. */
  name: string;
  /** Same page in that language; without it, the switch calls `onChange`. */
  href?: string;
};

export type LanguageSwitcherProps = {
  languages: Language[];
  /** Code of the current language. */
  value: string;
  onChange?: (code: string) => void;
  label?: string;
  linkAs?: ElementType;
  className?: string;
};

/** EN | FR pill: links to the same page in each language (or buttons), the current one in the accent. */
export function LanguageSwitcher({
  languages,
  value,
  onChange,
  label = "Language",
  linkAs: LinkTag = "a",
  className,
}: LanguageSwitcherProps) {
  return (
    <nav aria-label={label} className={cx("trc-languages", className)}>
      {languages.map((language) => {
        const common = {
          lang: language.code,
          "aria-label": language.name,
          "aria-current": language.code === value ? ("true" as const) : undefined,
          className: "trc-languages__item",
          children: language.code.toUpperCase(),
        };
        return language.href ? (
          <LinkTag key={language.code} href={language.href} hrefLang={language.code} {...common} />
        ) : (
          <button key={language.code} type="button" onClick={() => onChange?.(language.code)} {...common} />
        );
      })}
    </nav>
  );
}
