/**
 * Booking inquiry notification email.
 *
 * Rendered as table-based HTML with fully inlined styles — Gmail strips
 * <style> blocks and ignores flex/grid, so everything here is deliberately
 * old-fashioned. Palette mirrors the autumn-forest tokens in globals.css.
 *
 * A plaintext alternative ships alongside; some clients prefer it, and it
 * keeps the message out of "this is only HTML" spam heuristics.
 */

export interface BookingInquiry {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  eventDate?: string;
  venue?: string;
  budget?: string;
  message: string;
  submittedAt: Date;
}

const BG = "#08110b";
const CARD = "#0e1d13";
const BORDER = "#1d3324";
const TEXT = "#f0ebe0";
const MUTED = "#9aa396";
const EMBER = "#d4622a";
const GOLD = "#c9a84c";

/** Escape user input before it lands in an HTML email body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One label/value row. Skipped entirely when the value is empty. */
function row(label: string, value?: string): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:0 0 2px 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};">
        ${esc(label)}
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 20px 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:${TEXT};">
        ${esc(value)}
      </td>
    </tr>`;
}

export function renderBookingInquiryHtml(inquiry: BookingInquiry): string {
  const stamp = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(inquiry.submittedAt);

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background-color:${BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:${CARD};border:1px solid ${BORDER};border-radius:14px;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px 32px;border-bottom:1px solid ${BORDER};">
              <p style="margin:0 0 10px 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${GOLD};">
                New Inquiry
              </p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:26px;font-weight:bold;color:${TEXT};">
                ${esc(inquiry.inquiryType)}
              </p>
              <p style="margin:8px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${MUTED};">
                ${esc(stamp)} ET
              </p>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row("From", inquiry.name)}
                ${row("Email", inquiry.email)}
                ${row("Phone", inquiry.phone)}
                ${row("Event date", inquiry.eventDate)}
                ${row("Venue / city", inquiry.venue)}
                ${row("Budget", inquiry.budget)}
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <p style="margin:0 0 10px 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};">
                Message
              </p>
              <div style="padding:18px 20px;background-color:#122618;border-left:2px solid ${EMBER};border-radius:6px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:${TEXT};white-space:pre-wrap;">${esc(inquiry.message)}</div>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:0 32px 32px 32px;">
              <a href="mailto:${encodeURIComponent(inquiry.email).replace(/%40/g, "@")}"
                 style="display:inline-block;padding:13px 26px;background-color:${EMBER};border-radius:999px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">
                Reply to ${esc(inquiry.name)}
              </a>
              <p style="margin:14px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${MUTED};">
                Replying to this email reaches them directly.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;border-top:1px solid ${BORDER};font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${MUTED};">
              Sent by the booking form &middot; built by Range Of View
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderBookingInquiryText(inquiry: BookingInquiry): string {
  const stamp = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(inquiry.submittedAt);

  const line = (label: string, value?: string) =>
    value ? `${label}: ${value}\n` : "";

  return (
    `NEW INQUIRY — ${inquiry.inquiryType}\n` +
    `${stamp} ET\n\n` +
    line("From", inquiry.name) +
    line("Email", inquiry.email) +
    line("Phone", inquiry.phone) +
    line("Event date", inquiry.eventDate) +
    line("Venue / city", inquiry.venue) +
    line("Budget", inquiry.budget) +
    `\nMESSAGE\n${inquiry.message}\n\n` +
    `--\nSent by the booking form.\nReply to this email to reach them directly.`
  );
}
