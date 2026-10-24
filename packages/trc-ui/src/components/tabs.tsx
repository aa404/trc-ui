"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";

export type TabItem = {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the tab list. */
  label?: string;
  /**
   * `automatic`: the arrows select the tab they move to. `manual`: they only move the focus,
   * Enter or Space selects (for panels that are slow to render).
   */
  activation?: "automatic" | "manual";
  className?: string;
};

/**
 * Tabs: thin labels, the selected one underlined with the accent. Keyboard: Left and Right arrows,
 * Home and End; only the selected tab is in the Tab order (roving tabindex).
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  label,
  activation = "automatic",
  className,
}: TabsProps) {
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? "";
  const [selected, setSelected] = useControllable(value, defaultValue ?? firstEnabled, onValueChange);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const position = enabled.indexOf(index);
    let target: number | undefined;
    if (e.key === "ArrowRight") target = enabled[(position + 1) % enabled.length];
    else if (e.key === "ArrowLeft") target = enabled[(position - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") target = enabled[0];
    else if (e.key === "End") target = enabled[enabled.length - 1];
    if (target === undefined) return;
    e.preventDefault();
    tabRefs.current[target]?.focus();
    if (activation === "automatic") setSelected(items[target]!.value);
  };

  return (
    <div className={cx("trc-tabs", className)}>
      <div role="tablist" aria-label={label} className="trc-tabs__list">
        {items.map((item, i) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={isSelected}
              aria-controls={`${id}-panel-${i}`}
              disabled={item.disabled}
              tabIndex={isSelected ? 0 : -1}
              className="trc-tabs__tab"
              onClick={() => setSelected(item.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, i) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={item.value !== selected}
          tabIndex={0}
          className="trc-tabs__panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
