import { DONATION_INTERVAL_DAYS } from "@/lib/config";

/** Join class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function fullName(user: { first_name?: string | null; last_name?: string | null }): string {
  return [user.first_name, user.last_name].filter(Boolean).join(" ") || "Anonymous donor";
}

export function initials(user: { first_name?: string | null; last_name?: string | null }): string {
  const a = user.first_name?.trim()?.[0] ?? "";
  const b = user.last_name?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Date the donor becomes eligible again, or null if eligible now. */
export function nextEligibleDate(lastDonation: string | null | undefined): Date | null {
  if (!lastDonation) return null;
  const last = new Date(lastDonation);
  if (Number.isNaN(last.getTime())) return null;
  const next = new Date(last);
  next.setDate(next.getDate() + DONATION_INTERVAL_DAYS);
  return next > new Date() ? next : null;
}

export function daysUntil(date: Date): number {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000));
}

/** Today's date as YYYY-MM-DD in local time (for date input max/default). */
export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
