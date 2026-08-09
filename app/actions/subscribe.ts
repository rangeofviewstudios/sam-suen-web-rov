"use server";

import type { SubscribeState } from "./subscribe-types";

/**
 * Klaviyo Bulk Subscribe Profiles.
 *
 * Docs: https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles
 *
 * This specific endpoint is used (rather than a plain profile create)
 * because it is the one that records an auditable CONSENT record with a
 * timestamp and source. Carriers ask for that during toll-free
 * verification, and a profile created any other way won't have it.
 *
 * Three details that are easy to get wrong:
 *  - Content-Type must be application/vnd.api+json, not application/json.
 *  - The `revision` header is required and pinned; bumping it may change
 *    the payload shape, so treat it as a deliberate upgrade.
 *  - Success is 202 Accepted with an EMPTY body — do not try to parse it.
 */
const KLAVIYO_ENDPOINT =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs";
const KLAVIYO_REVISION = "2026-07-15";

function clean(value: FormDataEntryValue | null, max = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * Normalise a typed phone number to E.164, which Klaviyo requires.
 *
 * Scope is deliberately US/Canada (+1): that's the audience, and guessing
 * a country code for an arbitrary 9-digit string would silently create
 * unreachable profiles. International numbers must be typed with a
 * leading + and are passed through as-is.
 */
function toE164(raw: string): string | null {
  const trimmed = raw.trim();

  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export async function subscribeFan(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const values = {
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone"), 40),
  };
  const consented = formData.get("consent") === "on";

  // Honeypot — bots fill it, people never see it.
  if (clean(formData.get("website"))) {
    return { status: "success", message: "You're on the list." };
  }

  const fieldErrors: Record<string, string> = {};

  if (!values.email && !values.phone) {
    fieldErrors.email = "Enter an email or a phone number.";
  }
  if (values.email && !looksLikeEmail(values.email)) {
    fieldErrors.email = "That email doesn't look right.";
  }

  const phoneE164 = values.phone ? toE164(values.phone) : null;
  if (values.phone && !phoneE164) {
    fieldErrors.phone = "Use a 10-digit US number, or +country code.";
  }

  // Consent is only required when a phone number is actually being
  // subscribed — this is the TCPA-relevant gate.
  if (phoneE164 && !consented) {
    fieldErrors.consent = "Please agree to receive texts.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_SMS_LIST_ID;

  if (!apiKey || !listId) {
    console.error(
      "[subscribe] Missing env config — need KLAVIYO_PRIVATE_API_KEY and KLAVIYO_SMS_LIST_ID."
    );
    return {
      status: "error",
      message: "Signup isn't available right now. Try again shortly.",
      values,
    };
  }

  const subscriptions: Record<string, unknown> = {};
  if (values.email) {
    subscriptions.email = { marketing: { consent: "SUBSCRIBED" } };
  }
  if (phoneE164) {
    subscriptions.sms = { marketing: { consent: "SUBSCRIBED" } };
  }

  const profileAttributes: Record<string, unknown> = { subscriptions };
  if (values.email) profileAttributes.email = values.email;
  if (phoneE164) profileAttributes.phone_number = phoneE164;

  const payload = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        // Surfaces in Klaviyo as the consent source — useful evidence
        // if a carrier or complaint ever asks where a number came from.
        custom_source: "samsuen.com signup form",
        profiles: {
          data: [{ type: "profile", attributes: profileAttributes }],
        },
      },
      relationships: {
        list: { data: { type: "list", id: listId } },
      },
    },
  };

  try {
    const res = await fetch(KLAVIYO_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: KLAVIYO_REVISION,
        "Content-Type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Error responses DO have a body; success (202) does not.
      const detail = await res.text().catch(() => "");
      console.error(
        `[subscribe] Klaviyo returned ${res.status}:`,
        detail.slice(0, 500)
      );
      return {
        status: "error",
        message: "That didn't go through. Please try again in a moment.",
        values,
      };
    }
  } catch (err) {
    console.error("[subscribe] Network failure calling Klaviyo:", err);
    return {
      status: "error",
      message: "That didn't go through. Please try again in a moment.",
      values,
    };
  }

  return {
    status: "success",
    message: phoneE164
      ? "You're in. Watch your texts for early access."
      : "You're in. Watch your inbox for early access.",
  };
}
