"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { Close } from "../utils/icons";
import { Portal } from "../utils/portal";

export type ToastTone = "default" | "success" | "error";

export type ToastOptions = {
  description?: ReactNode;
  tone?: ToastTone;
  /** Time on screen in milliseconds; `Infinity` keeps it until dismissed. */
  duration?: number;
  /** One action, such as "Undo"; choosing it also dismisses the toast. */
  action?: { label: ReactNode; onClick: () => void };
};

type ToastItem = ToastOptions & { id: number; title: ReactNode; leaving: boolean };

// A tiny store shared by `toast()` and every `<Toaster />`: toasts can be raised from anywhere.
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const EMPTY: ToastItem[] = [];

/** Leaves time for the exit animation before removing the toast. */
const LEAVE_MS = 200;

function dismiss(id?: number) {
  items = items.map((t) => (id === undefined || t.id === id ? { ...t, leaving: true } : t));
  emit();
  window.setTimeout(() => {
    items = items.filter((t) => !(t.leaving && (id === undefined || t.id === id)));
    emit();
  }, LEAVE_MS);
}

/**
 * Shows a short message in the `<Toaster />`. Returns its id, for `toast.dismiss(id)`.
 * `toast.success()` and `toast.error()` set the tone.
 */
export function toast(title: ReactNode, options: ToastOptions = {}) {
  const id = nextId++;
  items = [...items, { ...options, id, title, leaving: false }];
  emit();
  return id;
}
toast.success = (title: ReactNode, options: Omit<ToastOptions, "tone"> = {}) =>
  toast(title, { ...options, tone: "success" });
toast.error = (title: ReactNode, options: Omit<ToastOptions, "tone"> = {}) =>
  toast(title, { ...options, tone: "error" });
/** Dismisses one toast, or all of them without an id. */
toast.dismiss = dismiss;

export type ToasterProps = {
  position?: "bottom-right" | "bottom-center" | "top-right";
  /** Default time on screen, in milliseconds. */
  duration?: number;
  /** Accessible name of the notification area. */
  label?: string;
  closeLabel?: string;
};

/**
 * Notification area, placed once near the root of the app. New toasts are announced to screen
 * readers (errors right away); timers pause while the pointer or the keyboard focus is inside.
 */
export function Toaster({
  position = "bottom-right",
  duration = 5000,
  label = "Notifications",
  closeLabel = "Close",
}: ToasterProps) {
  const toasts = useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY,
  );
  const [paused, setPaused] = useState(false);

  return (
    <Portal>
      <section
        aria-label={label}
        className={cx("trc-toaster", `trc-toaster--${position}`)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      >
        <ol aria-live="polite" aria-relevant="additions" className="trc-toaster__list">
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} duration={t.duration ?? duration} paused={paused} closeLabel={closeLabel} />
          ))}
        </ol>
      </section>
    </Portal>
  );
}

function ToastCard({
  toast: t,
  duration,
  paused,
  closeLabel,
}: {
  toast: ToastItem;
  duration: number;
  paused: boolean;
  closeLabel: string;
}) {
  // Time left, kept across pauses.
  const remaining = useRef(duration);

  useEffect(() => {
    if (paused || t.leaving || !Number.isFinite(remaining.current)) return;
    const started = Date.now();
    const timer = window.setTimeout(() => dismiss(t.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, t.leaving, t.id]);

  const tone = t.tone ?? "default";
  return (
    <li className={cx("trc-toast", `trc-toast--${tone}`, t.leaving && "trc-toast--leaving")}>
      {/* The list is a polite live region; errors are announced right away. */}
      <div className="trc-toast__text" role={tone === "error" ? "alert" : undefined}>
        <p className="trc-toast__title">{t.title}</p>
        {t.description != null && <p className="trc-toast__description">{t.description}</p>}
      </div>
      {t.action && (
        <button
          type="button"
          className="trc-toast__action"
          onClick={() => {
            t.action?.onClick();
            dismiss(t.id);
          }}
        >
          {t.action.label}
        </button>
      )}
      <button type="button" className="trc-toast__close" aria-label={closeLabel} onClick={() => dismiss(t.id)}>
        <Close />
      </button>
    </li>
  );
}
