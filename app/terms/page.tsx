import type { Metadata } from "next";
import "../components/LegalPage.css";

export const metadata: Metadata = {
  title: "Terms — Sam Suen",
  description:
    "Terms of use for samsuen.com and the Sam Suen text message program.",
};

const UPDATED = "August 9, 2026";

export default function TermsPage() {
  return (
    <main className="legal">
      <div className="legal-container">
        <a href="/" className="legal-back">
          ← samsuen.com
        </a>

        <h1 className="legal-title">Terms</h1>
        <p className="legal-updated">Last updated {UPDATED}</p>

        <div className="legal-body">
          <h2>Using this site</h2>
          <p>
            samsuen.com is the official site of the recording artist Sam Suen.
            The music, photography, video, artwork, and written content on it
            belong to Sam Suen or the people credited, and may not be reused
            commercially without permission. Streaming and sharing links is
            welcome and encouraged.
          </p>

          <h2>Inquiries</h2>
          <p>
            Submitting the booking or inquiry form starts a conversation — it
            does not create a booking, a contract, or a commitment on either
            side. Anything agreed is confirmed separately in writing.
          </p>

          <h2>Text message program</h2>
          <p>
            The <strong>Sam Suen</strong> text message program sends music
            releases, early access links, and show announcements to fans who
            opt in.
          </p>

          <ul>
            <li>
              <strong>How to join:</strong> submit your mobile number through
              the signup form on this site and check the consent box. Consent
              is not a condition of any purchase.
            </li>
            <li>
              <strong>Message frequency:</strong> varies — generally around 2 to
              6 messages per month, more in a release week.
            </li>
            <li>
              <strong>Cost:</strong> message and data rates may apply. We do not
              charge for the messages; your mobile carrier may.
            </li>
          </ul>

          <div className="legal-callout">
            <p>
              <strong>To stop receiving messages,</strong> reply{" "}
              <strong>STOP</strong> to any message from us. You will get one
              final message confirming you have been unsubscribed, and no
              further messages after that.
            </p>
            <p>
              <strong>For help,</strong> reply <strong>HELP</strong> to any
              message, or email{" "}
              <a href="mailto:contact@rovstudios.com">contact@rovstudios.com</a>.
            </p>
          </div>

          <p>
            You can rejoin at any time by submitting the signup form again.
            Carriers are not liable for delayed or undelivered messages.
            Delivery is not guaranteed on every carrier or device.
          </p>

          <p>
            Only enter a phone number that belongs to you and that you are
            authorized to enroll. If your number changes or is reassigned,
            please reply STOP or let us know so we do not message someone else.
          </p>

          <h2>Privacy</h2>
          <p>
            How we handle the information you submit — including the commitment
            that mobile information is never sold or shared with third parties
            for marketing — is described in our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <h2>Changes</h2>
          <p>
            These terms may be updated; the &ldquo;last updated&rdquo; date
            above will change when they are. Continuing to use the site or stay
            subscribed after a change means the updated terms apply.
          </p>

          <h2>Contact</h2>
          <p>
            <a href="mailto:contact@rovstudios.com">contact@rovstudios.com</a>
          </p>
        </div>

        <p className="legal-footer">&copy; 2026 Sam Suen</p>
      </div>
    </main>
  );
}
