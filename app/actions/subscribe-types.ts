/**
 * Shared types for the fan email signup.
 *
 * Separate from subscribe.ts because a "use server" module may only
 * export async functions.
 *
 * SMS was deliberately removed: sending marketing texts requires carrier
 * toll-free verification (1-3+ weeks), which couldn't clear before the
 * release. See docs/sms-funnel-setup.md if it gets picked back up.
 */

export interface SubscribeState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
}

export const initialSubscribeState: SubscribeState = { status: "idle" };
