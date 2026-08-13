import type { Metadata } from "next";
import "../components/LegalPage.css";

export const metadata: Metadata = {
  title: "Terms — Sam Suen",
  description:
    "Terms of use for the Sam Suen website and email list.",
};

const UPDATED = "August 10, 2026";

export default function TermsPage() {
  return (
    <main className="legal">
      <div className="legal-container">
        <a href="/" className="legal-back">
          ← Back to site
        </a>

        <h1 className="legal-title">Terms</h1>
        <p className="legal-updated">Last updated {UPDATED}</p>

        <div className="legal-body">
          <h2>Using this site</h2>
          <p>
            This is the official site of the recording artist Sam Suen.
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

          <h2>Email list</h2>
          <p>
            Submitting your email through the signup form adds you to the
            mailing list for new music releases and show announcements. Only
            enter an address that belongs to you.
          </p>

          <div className="legal-callout">
            <p>
              <strong>To unsubscribe,</strong> use the link at the bottom of
              any email, or email{" "}
              <a href="mailto:contact@rovstudios.com">contact@rovstudios.com</a>{" "}
              and ask to be removed.
            </p>
          </div>

          <p>
            Delivery is not guaranteed — messages can be delayed or filtered by
            your email provider.
          </p>

          <h2>Privacy</h2>
          <p>
            How we handle the information you submit is described in our{" "}
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
