"use client";

import {
  cloneElement,
  useId,
  useRef,
  useState,
  type ElementType,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { useAnchoredPosition, useDismiss, type Align } from "../hooks/use-floating";
import { callAll, getElementRef, mergeRefs } from "../utils/compose";
import { cx } from "../utils/cx";
import { Portal } from "../utils/portal";

export type MenuAction = {
  label: ReactNode;
  /** Called when the item is chosen with a click, Enter or Space. */
  onSelect?: () => void;
  /** Turns the item into a link. */
  href?: string;
  /** Hint shown on the right, such as a keyboard shortcut. */
  hint?: ReactNode;
  disabled?: boolean;
  /** Destructive action (delete, leave…), in the error color. */
  danger?: boolean;
  /** Text used for typeahead when the label is not a string. */
  textValue?: string;
};

export type MenuItem = MenuAction | "separator";

type TriggerProps = {
  ref?: Ref<HTMLElement>;
  id?: string;
  onClick?: (e: unknown) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
};

export type DropdownMenuProps = {
  /** Element that opens the menu, usually a pill or an icon button. */
  trigger: ReactElement<TriggerProps>;
  items: MenuItem[];
  align?: Align;
  /** Link component of your router, for items with an `href`. */
  linkAs?: ElementType;
  className?: string;
};

const isAction = (item: MenuItem): item is MenuAction => item !== "separator";
const textOf = (item: MenuAction) => (item.textValue ?? (typeof item.label === "string" ? item.label : "")).toLowerCase();

/**
 * Menu of actions opened from a trigger. Keyboard: Enter, Space or the arrows open it; the arrows,
 * Home and End move between items; typing a letter jumps to the next item starting with it;
 * Escape closes and returns focus to the trigger; Tab closes and moves on.
 */
export function DropdownMenu({ trigger, items, align = "start", linkAs: LinkTag = "a", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const generatedId = useId();
  const triggerId = trigger.props.id ?? `${generatedId}-trigger`;
  const menuId = `${generatedId}-menu`;

  const enabled = items.map((item, i) => (isAction(item) && !item.disabled ? i : -1)).filter((i) => i >= 0);
  const focusItem = (index: number | undefined) => index !== undefined && itemRefs.current[index]?.focus();

  const openMenu = (focus: "first" | "last") => {
    setOpen(true);
    // The items exist once the menu is rendered.
    requestAnimationFrame(() => focusItem(focus === "first" ? enabled[0] : enabled[enabled.length - 1]));
  };
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  useAnchoredPosition(open, triggerRef, menuRef, { side: "bottom", align });
  useDismiss(open, [triggerRef, menuRef], (reason) => close(reason === "escape"));

  const select = (item: MenuAction) => {
    item.onSelect?.();
    close();
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    const position = enabled.indexOf(current);
    const move = (to: number) => {
      e.preventDefault();
      focusItem(enabled[(to + enabled.length) % enabled.length]);
    };
    if (e.key === "ArrowDown") move(position + 1);
    else if (e.key === "ArrowUp") move(position - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(enabled.length - 1);
    else if (e.key === "Tab") close(false);
    else if (e.key.length === 1 && /\S/.test(e.key)) {
      // Typeahead: next enabled item whose text starts with the typed letter.
      const letter = e.key.toLowerCase();
      const order = [...enabled.slice(position + 1), ...enabled.slice(0, position + 1)];
      const match = order.find((i) => textOf(items[i] as MenuAction).startsWith(letter));
      if (match !== undefined) focusItem(match);
    }
  };

  const triggerElement = cloneElement(trigger, {
    ref: mergeRefs(triggerRef, getElementRef(trigger)),
    id: triggerId,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: callAll(trigger.props.onClick, () => (open ? close() : openMenu("first"))),
    onKeyDown: callAll(trigger.props.onKeyDown, (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openMenu(e.key === "ArrowDown" ? "first" : "last");
      }
    }),
  } as TriggerProps);

  return (
    <>
      {triggerElement}
      {open && (
        <Portal>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            className={cx("trc-floating", "trc-menu", className)}
            onKeyDown={onMenuKeyDown}
          >
            {items.map((item, i) => {
              if (!isAction(item)) return <div key={i} role="separator" className="trc-menu__separator" />;
              const shared = {
                ref: (el: HTMLElement | null) => {
                  itemRefs.current[i] = el;
                },
                role: "menuitem",
                tabIndex: -1,
                "aria-disabled": item.disabled || undefined,
                className: cx("trc-menu__item", item.danger && "trc-menu__item--danger"),
                onMouseMove: (e: { currentTarget: HTMLElement }) => !item.disabled && e.currentTarget.focus(),
                children: (
                  <>
                    <span className="trc-menu__label">{item.label}</span>
                    {item.hint != null && <span className="trc-menu__hint">{item.hint}</span>}
                  </>
                ),
              };
              return item.href && !item.disabled ? (
                <LinkTag key={i} href={item.href} {...shared} onClick={() => select(item)} />
              ) : (
                <div
                  key={i}
                  {...shared}
                  onClick={() => !item.disabled && select(item)}
                  onKeyDown={(e: KeyboardEvent) => {
                    if ((e.key === "Enter" || e.key === " ") && !item.disabled) {
                      e.preventDefault();
                      select(item);
                    }
                  }}
                />
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}
