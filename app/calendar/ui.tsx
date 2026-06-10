"use client";

import { format } from "date-fns";
import styles from "./calendar.module.css";

/** First letters of up to two words, uppercased. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Muted, desaturated palette — tasteful on the dark surface, avatars don't
// fight the maroon accent.
const AVATAR_COLORS = [
  "#6b5b73",
  "#4f6b5e",
  "#6b5f4f",
  "#5b6472",
  "#5e5b6b",
  "#6b4f57",
  "#4f5d6b",
  "#5f6b4f",
];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function avatarColor(name: string): string {
  return AVATAR_COLORS[hash(name) % AVATAR_COLORS.length];
}

export function Avatar({
  name,
  size = 22,
}: {
  name: string | null;
  size?: number;
}) {
  if (!name) {
    return (
      <span
        className={styles.avatarEmpty}
        style={{ width: size, height: size }}
        title="Unassigned"
        aria-label="Unassigned"
      >
        ?
      </span>
    );
  }
  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        background: avatarColor(name),
        fontSize: Math.round(size * 0.42),
      }}
      title={name}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}

export const DATETIME_LOCAL = "yyyy-MM-dd'T'HH:mm";
export const nowLocal = () => format(new Date(), DATETIME_LOCAL);
export const toLocal = (iso: string) => format(new Date(iso), DATETIME_LOCAL);
export const shortDate = (iso: string) =>
  format(new Date(iso), "MMM d, h:mm a");
