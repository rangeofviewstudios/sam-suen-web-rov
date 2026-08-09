"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import {
  renderBookingInquiryHtml,
  renderBookingInquiryText,
  type BookingInquiry,
} from "@/app/lib/emails/booking-inquiry";
import {
  INQUIRY_TYPES,
  type BookingState,
  type InquiryType,
} from "./booking-types";

const MAX_MESSAGE = 4000;
const MAX_FIELD = 200;

/**
 * Naive per-IP throttle. This is intentionally in-memory: the form is
 * low-volume and a shared Redis store isn't worth the operational weight.
 *
 * Caveat worth knowing: serverless instances don't share this map, so a
 * determined attacker spread across cold starts gets more than 3 sends.
 * It stops casual double-submits and drive-by bots, not a real flood.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recentSubmissions.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (hits.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(ip, hits);
    return true;
  }

  hits.push(now);
  recentSubmissions.set(ip, hits);

  // Opportunistic cleanup so the map can't grow without bound.
  if (recentSubmissions.size > 500) {
    for (const [key, times] of recentSubmissions) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(key);
      }
    }
  }

  return false;
}

function clean(value: FormDataEntryValue | null, max = MAX_FIELD): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/**
 * Deliberately permissive — the goal is catching typos like a missing "@",
 * not adjudicating RFC 5322. Over-strict email regexes reject real addresses.
 */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function submitBookingInquiry(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const values = {
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    phone: clean(formData.get("phone"), 40),
    inquiryType: clean(formData.get("inquiryType")),
    eventDate: clean(formData.get("eventDate"), 60),
    venue: clean(formData.get("venue")),
    budget: clean(formData.get("budget"), 60),
    message: clean(formData.get("message"), MAX_MESSAGE),
  };

  // ── Spam guard 1: honeypot. Real users never see or fill this. ──
  if (clean(formData.get("company"))) {
    // Report success so bots don't learn they were caught.
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  // ── Spam guard 2: submitted implausibly fast after render. ──
  const renderedAt = Number(formData.get("renderedAt"));
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < 2000) {
    return { status: "success", message: "Thanks — your message is on its way." };
  }

  // ── Validation ──
  const fieldErrors: Record<string, string> = {};

  if (!values.name) fieldErrors.name = "Let us know who you are.";
  if (!values.email) fieldErrors.email = "We need an email to reply to.";
  else if (!looksLikeEmail(values.email))
    fieldErrors.email = "That email doesn't look right.";
  if (!values.inquiryType || !INQUIRY_TYPES.includes(values.inquiryType as InquiryType))
    fieldErrors.inquiryType = "Pick what this is about.";
  if (!values.message) fieldErrors.message = "Tell us a little about it.";
  else if (values.message.length < 10)
    fieldErrors.message = "A bit more detail helps.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  // ── Spam guard 3: per-IP throttle ──
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return {
      status: "error",
      message:
        "That's a few messages in a short window. Give it a few minutes, or email contact@rovstudios.com directly.",
      values,
    };
  }

  // ── Send ──
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[booking] Missing env config — need RESEND_API_KEY, BOOKING_TO_EMAIL, BOOKING_FROM_EMAIL."
    );
    return {
      status: "error",
      message:
        "The form isn't accepting messages right now. Please email contact@rovstudios.com and we'll pick it up there.",
      values,
    };
  }

  const inquiry: BookingInquiry = { ...values, submittedAt: new Date() };
  const subjectDate = values.eventDate ? ` · ${values.eventDate}` : "";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: values.email,
      subject: `New ${values.inquiryType.toLowerCase()} — ${values.name}${subjectDate}`,
      html: renderBookingInquiryHtml(inquiry),
      text: renderBookingInquiryText(inquiry),
    });

    if (error) {
      // Log the full payload: with no database, this console entry is the
      // only surviving record of a lead whose email failed to send.
      console.error("[booking] Resend rejected the send:", error, inquiry);
      return {
        status: "error",
        message:
          "That didn't go through. Please email contact@rovstudios.com directly — we don't want to lose your message.",
        values,
      };
    }
  } catch (err) {
    console.error("[booking] Unexpected send failure:", err, inquiry);
    return {
      status: "error",
      message:
        "That didn't go through. Please email contact@rovstudios.com directly — we don't want to lose your message.",
      values,
    };
  }

  return {
    status: "success",
    message: "Got it. Sam will get back to you soon.",
  };
}
