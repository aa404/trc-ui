"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { useControllable } from "../hooks/use-controllable";
import { cx } from "../utils/cx";
import { useFieldProps } from "./field";

export type PinInputProps = {
  /** Number of characters. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every box is filled. */
  onComplete?: (value: string) => void;
  /** `numeric` opens the number keyboard on phones and accepts digits only. */
  type?: "numeric" | "alphanumeric";
  /** Hides the characters, like a password. */
  mask?: boolean;
  /** Accessible name of the group: "Verification code". */
  label?: string;
  /** Accessible name of each box: "Character 1 of 6". */
  charLabel?: (index: number, length: number) => string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
};

/**
 * One box per character for one-time codes. Typing moves forward, Backspace moves back, pasting a code
 * fills every box, and phones can fill it from a text message (`autocomplete="one-time-code"`).
 * Inside a `Field`, the label focuses the first box and the hint or error describes the group.
 */
export function PinInput({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  type = "numeric",
  mask = false,
  label = "Verification code",
  charLabel = (i, n) => `Character ${i + 1} of ${n}`,
  invalid,
  disabled,
  id,
  name,
  className,
}: PinInputProps) {
  const [code, setCode] = useControllable(value, defaultValue, onChange);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const field = useFieldProps({ id, invalid });
  const accepted = type === "numeric" ? /[0-9]/ : /[0-9a-z]/i;
  const clean = (text: string) => [...text].filter((c) => accepted.test(c)).join("");

  const update = (next: string) => {
    const trimmed = next.slice(0, length);
    setCode(trimmed);
    if (trimmed.length === length && !trimmed.includes(" ")) onComplete?.(trimmed);
  };
  const focus = (index: number) => {
    const target = inputs.current[Math.max(0, Math.min(index, length - 1))];
    target?.focus();
    target?.select();
  };
  // Characters are stored left to right; an empty box is a space while later boxes are filled.
  const charAt = (i: number) => (code[i] && code[i] !== " " ? code[i] : "");
  const setCharAt = (i: number, char: string) => {
    const chars = Array.from({ length }, (_, k) => code[k] ?? " ");
    chars[i] = char || " ";
    return chars.join("").replace(/\s+$/, "");
  };

  const onInput = (i: number, raw: string) => {
    const typed = clean(raw);
    if (!typed) return;
    if (typed.length > 1) {
      // Several characters at once (autofill from a message): fill from this box.
      const merged = (code.slice(0, i).padEnd(i, " ") + typed).slice(0, length);
      update(merged);
      focus(Math.min(i + typed.length, length - 1));
      return;
    }
    update(setCharAt(i, typed.slice(-1)));
    focus(i + 1);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (charAt(i)) update(setCharAt(i, ""));
      else if (i > 0) {
        update(setCharAt(i - 1, ""));
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(i + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focus(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focus(length - 1);
    }
  };

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onInput(i, e.clipboardData.getData("text"));
  };

  return (
    <div
      role="group"
      aria-label={label}
      aria-describedby={field["aria-describedby"]}
      className={cx("trc-pin", className)}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          id={i === 0 ? field.id : undefined}
          type={mask ? "password" : "text"}
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          aria-label={charLabel(i, length)}
          aria-invalid={field["aria-invalid"]}
          disabled={disabled}
          value={charAt(i)}
          onChange={(e) => onInput(i, e.target.value.replace(charAt(i), "") || e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={(e) => onPaste(i, e)}
          onFocus={(e) => e.target.select()}
          className="trc-control trc-pin__box"
        />
      ))}
      {name && <input type="hidden" name={name} value={code.replace(/\s/g, "")} />}
    </div>
  );
}
