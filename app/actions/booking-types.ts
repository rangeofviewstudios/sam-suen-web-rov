/**
 * Shared types and constants for the booking form.
 *
 * These live outside booking.ts because a "use server" module is only
 * allowed to export async functions — exporting a const or a type from
 * there is a build error.
 */

export interface BookingState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Echoed back on failure so a rejected submit doesn't wipe what they typed. */
  values?: Record<string, string>;
}

export const initialBookingState: BookingState = { status: "idle" };

export const INQUIRY_TYPES = [
  "Booking / live show",
  "Feature / collaboration",
  "Press / interview",
  "Something else",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const BUDGET_OPTIONS = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000+",
  "Not sure yet",
] as const;
