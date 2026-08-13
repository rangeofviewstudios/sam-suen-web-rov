"use server";

import type { SubscribeState } from "./subscribe-types";

/**
 * Klaviyo Bulk Subscribe Profiles — email only.
 *
 * Docs: https://developers.klaviyo.com/en/reference/bulk_subscribe_profiles
 *
 * This endpoint is used rather than a plain profile-create because it
 * records an auditable consent record with a timestamp and source.
 *
 * Two details that are easy to get wrong:
 *  - Content-Type must be application/vnd.api+json, not application/json.
 *  - Success is 202 Accepted with an EMPTY body — do not try to parse it.
 *
 * The `revision` header is pinned; bumping it may change the payload
 * shape, so treat it as a deliberate upgrade rather than maintenance.
 */
const KLAVIYO_ENDPOINT =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs";
const KLAVIYO_REVISION = "2026-07-15";

function clean(value: FormDataEntryValue | null, max = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/**
 * Deliberately permissive — catching a missing "@", not adjudicating
 * RFC 5322. Over-strict email regexes reject real addresses.
 */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

const SUCCESS_MESSAGE =
  "You're on the list. We'll email you when the next song drops.";

export async function subscribeFan(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const values = { email: clean(formData.get("email")) };

  // Honeypot — bots fill it, people never see it. The message matches the
  // real success text exactly so a bot can't tell it was caught.
  if (clean(formData.get("website"))) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const fieldErrors: Record<string, string> = {};

  if (!values.email) {
    fieldErrors.email = "Add your email.";
  } else if (!looksLikeEmail(values.email)) {
    fieldErrors.email = "That email isn't valid.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    console.error(
      "[subscribe] Missing env config — need KLAVIYO_PRIVATE_API_KEY and KLAVIYO_LIST_ID."
    );
    return {
      status: "error",
      message: "Signup is down right now. Try again shortly.",
      values,
    };
  }

  const payload = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        // Surfaces in Klaviyo as the consent source.
        custom_source: "Website signup form",
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email: values.email,
                subscriptions: {
                  email: { marketing: { consent: "SUBSCRIBED" } },
                },
              },
            },
          ],
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
        message: "That didn't send. Try again in a moment.",
        values,
      };
    }
  } catch (err) {
    console.error("[subscribe] Network failure calling Klaviyo:", err);
    return {
      status: "error",
      message: "That didn't send. Try again in a moment.",
      values,
    };
  }

  return { status: "success", message: SUCCESS_MESSAGE };
}
