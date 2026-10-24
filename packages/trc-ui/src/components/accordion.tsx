"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";
import { ChevronDown } from "../utils/icons";

export type AccordionItem = {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** `single`: one item open at a time. `multiple`: any number. */
  type?: "single" | "multiple";
  /** Open items. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Level of the heading wrapping each button, to fit the page outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
};

/**
 * Items that open and close, for FAQs and details. Each title is a button inside a heading; the
 * height animates; closed content is out of the accessibility tree. Up and Down arrows, Home and
 * End move between titles.
 */
export function Accordion({
  items,
  type = "single",
  value,
  defaultValue = [],
  onValueChange,
  headingLevel = 3,
  className,
}: AccordionProps) {
  const [open, setOpen] = useControllable(value, defaultValue, onValueChange);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const Heading = `h${headingLevel}` as const;
  const enabled = items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i >= 0);

  const toggle = (itemValue: string) => {
    const isOpen = open.includes(itemValue);
    if (type === "single") setOpen(isOpen ? [] : [itemValue]);
    else setOpen(isOpen ? open.filter((v) => v !== itemValue) : [...open, itemValue]);
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const position = enabled.indexOf(index);
    let target: number | undefined;
    if (e.key === "ArrowDown") target = enabled[(position + 1) % enabled.length];
    else if (e.key === "ArrowUp") target = enabled[(position - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") target = enabled[0];
    else if (e.key === "End") target = enabled[enabled.length - 1];
    if (target === undefined) return;
    e.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <div className={cx("trc-accordion", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(item.value);
        return (
          <div key={item.value} className={cx("trc-accordion__item", isOpen && "trc-accordion__item--open")}>
            <Heading className="trc-accordion__heading">
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                id={`${id}-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel-${i}`}
                disabled={item.disabled}
                className="trc-accordion__trigger"
                onClick={() => toggle(item.value)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span>{item.title}</span>
                <ChevronDown className="trc-accordion__chevron" />
              </button>
            </Heading>
            <div
              id={`${id}-panel-${i}`}
              role="region"
              aria-labelledby={`${id}-trigger-${i}`}
              className="trc-accordion__panel"
            >
              <div className="trc-accordion__inner">
                <div className="trc-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
