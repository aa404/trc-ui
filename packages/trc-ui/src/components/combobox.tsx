"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useAnchoredPosition, useDismiss, useIsomorphicLayoutEffect } from "../hooks/use-floating";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";
import { ChevronDown } from "../utils/icons";
import { Portal } from "../utils/portal";
import { useFieldProps } from "./field";

export type ComboboxOption = { value: string; label: string; description?: ReactNode; disabled?: boolean };

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** Shown when nothing matches the search. */
  emptyText?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  /** Form field name: the chosen value is submitted. */
  name?: string;
  className?: string;
};

/** Case and accent insensitive text, for matching "Bénin" with "benin". */
const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Search field with a list of suggestions. Typing filters (ignoring case and accents); the arrows
 * move the active option while focus stays in the field; Enter chooses; Escape closes; leaving the
 * field restores the chosen label. Works inside `Field` like `Input`.
 */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onValueChange,
  placeholder,
  emptyText = "No results",
  invalid,
  disabled,
  required,
  id,
  name,
  className,
}: ComboboxProps) {
  const [selected, setSelected] = useControllable<string | null>(value, defaultValue, onValueChange);
  const selectedOption = options.find((o) => o.value === selected) ?? null;
  const [query, setQuery] = useState(selectedOption?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const a11y = useFieldProps({ id, invalid, required });

  // While the field shows the chosen label, the list shows every option.
  const searching = query !== (selectedOption?.label ?? "");
  const visible = searching ? options.filter((o) => normalize(o.label).includes(normalize(query))) : options;
  const enabled = visible.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  // Keep the field in sync when the value changes from outside.
  useEffect(() => {
    if (!open) setQuery(selectedOption?.label ?? "");
  }, [selectedOption?.label, open]);

  useAnchoredPosition(open, wrapperRef, listRef, { side: "bottom", align: "start", offset: 6 });
  // The list is as wide as the field.
  useIsomorphicLayoutEffect(() => {
    if (open && listRef.current && wrapperRef.current)
      listRef.current.style.width = `${wrapperRef.current.offsetWidth}px`;
  }, [open]);
  useDismiss(open, [wrapperRef, listRef], () => close());

  // Keep the active option in view.
  useEffect(() => {
    if (open && active >= 0)
      listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = (index?: number) => {
    setOpen(true);
    const current = visible.findIndex((o) => o.value === selected);
    setActive(index ?? (current >= 0 ? current : (enabled[0] ?? -1)));
  };
  const close = () => {
    setOpen(false);
    setActive(-1);
    setQuery(selectedOption?.label ?? "");
  };
  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setSelected(option.value);
    setQuery(option.label);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const position = enabled.indexOf(active);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) openList();
      else setActive(enabled[(position + 1) % enabled.length] ?? -1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openList(enabled[enabled.length - 1]);
      else setActive(enabled[(position - 1 + enabled.length) % enabled.length] ?? -1);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      const option = visible[active];
      if (option) choose(option);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      } else if (query) {
        setQuery(selectedOption?.label ?? "");
      }
    } else if (e.key === "Tab" && open) {
      close();
    }
  };

  return (
    <div ref={wrapperRef} className={cx("trc-combobox", className)}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className="trc-control trc-combobox__input"
        {...a11y}
      />
      <ChevronDown aria-hidden className="trc-combobox__chevron" />
      {name && <input type="hidden" name={name} value={selected ?? ""} />}
      {open && (
        <Portal>
          <ul ref={listRef} id={listId} role="listbox" className="trc-floating trc-listbox">
            {visible.length === 0 && (
              <li role="presentation" className="trc-listbox__empty">
                {emptyText}
              </li>
            )}
            {visible.map((option, i) => (
              <li
                key={option.value}
                id={`${listId}-${i}`}
                data-index={i}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={option.disabled || undefined}
                className={cx("trc-listbox__option", i === active && "trc-listbox__option--active")}
                // Keep the focus in the field while clicking.
                onMouseDown={(e) => e.preventDefault()}
                onMouseMove={() => !option.disabled && setActive(i)}
                onClick={() => choose(option)}
              >
                <span className="trc-listbox__label">{option.label}</span>
                {option.description != null && <span className="trc-listbox__description">{option.description}</span>}
              </li>
            ))}
          </ul>
        </Portal>
      )}
    </div>
  );
}
