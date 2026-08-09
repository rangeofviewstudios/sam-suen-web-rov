/**
 * Shared types for the fan SMS/email signup.
 *
 * Separate from subscribe.ts because a "use server" module may only
 * export async functions.
 */

export interface SubscribeState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

export const initialSubscribeState: SubscribeState = { status: "idle" };

/**
 * The consent language shown next to the checkbox. Kept here as a single
 * source of truth: carriers audit this wording during toll-free
 * verification, and it must match what Klaviyo has on file.
 */
export const SMS_CONSENT_COPY =
  "By checking this box, you agree to receive recurring automated marketing text messages from Sam Suen at the number provided. Consent is not a condition of any purchase. Msg & data rates may apply. Msg frequency varies. Reply STOP to unsubscribe or HELP for help.";
