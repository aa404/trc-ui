"use client";

import { Children, useState, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { fill } from "../utils/label";

/** Up to two initials from a name: "Aurel Agbado" → "AA", "trc" → "T". */
export function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0]![0], words[words.length - 1]![0]] : [words[0]?.[0]];
  return letters.filter(Boolean).join("").toUpperCase();
}

export type AvatarProps = {
  /** Person or organization shown: the accessible name, and the source of the initials. */
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/** Round picture of a person, falling back to their initials on graphite when there is no image or it fails. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  return (
    <span className={cx("trc-avatar", `trc-avatar--${size}`, className)}>
      {showImage ? (
        <img src={src} alt={name} className="trc-avatar__image" onError={() => setFailed(true)} />
      ) : (
        <span role="img" aria-label={name} className="trc-avatar__initials">
          {initials(name)}
        </span>
      )}
    </span>
  );
}

export type AvatarGroupProps = {
  children: ReactNode;
  /** Avatars shown before the "+n" counter. */
  max?: number;
  /** Accessible name of the counter: a template such as "{count} more", or a function. */
  moreLabel?: string | ((count: number) => string);
  size?: AvatarProps["size"];
  className?: string;
};

/** Overlapping avatars, the rest summed up in a "+n" counter. */
export function AvatarGroup({
  children,
  max = 4,
  moreLabel = "{count} more",
  size = "md",
  className,
}: AvatarGroupProps) {
  const items = Children.toArray(children);
  const hidden = items.length - max;
  return (
    <span className={cx("trc-avatar-group", className)}>
      {items.slice(0, max)}
      {hidden > 0 && (
        <span className={cx("trc-avatar", `trc-avatar--${size}`, "trc-avatar--more")}>
          <span
            role="img"
            aria-label={typeof moreLabel === "string" ? fill(moreLabel, { count: hidden }) : moreLabel(hidden)}
            className="trc-avatar__initials"
          >
            +{hidden}
          </span>
        </span>
      )}
    </span>
  );
}
