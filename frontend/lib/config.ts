/**
 * Central place for branding and environment wiring.
 * Brand values are fallbacks — live values come from the site-settings API.
 */

export const SITE = {
  name: "Rokto",
  tagline: "Find a blood donor near you, when every minute counts.",
  description:
    "A community blood donation platform for Bangladesh — search verified donors by blood group, district and upazila.",
} as const;

/** Base URL for API calls made from the browser (same origin through nginx). */
export const CLIENT_API_BASE =
  `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/v1`;

/** Base URL for API calls made from the Next.js server (inside Docker network). */
export const SERVER_API_BASE =
  `${process.env.INTERNAL_API_URL ?? "http://backend:8000"}/api/v1`;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

/** Minimum days between two whole-blood donations (matches the backend rule). */
export const DONATION_INTERVAL_DAYS = 120;
