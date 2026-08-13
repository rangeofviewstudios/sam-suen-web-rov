import type { Metadata } from "next";
import "../components/LegalPage.css";

export const metadata: Metadata = {
  title: "Privacy Policy — Sam Suen",
  description:
    "How Sam Suen collects, uses, and protects information submitted through this site.",
};

const UPDATED = "August 10, 2026";

export default function PrivacyPage() {
  return (
    <main className="legal">
      <div className="legal-container">
        <a href="/" className="legal-back">
          ← Back to site
        </a>

        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated {UPDATED}</p>

        <div className="legal-body">
          <p>
            This policy explains what information this site collects, why it is
            collected, and what is done with it. It covers the booking form and
            the email list.
          </p>

          <h2>What we collect</h2>
          <p>We only collect information you type in and submit yourself:</p>
          <ul>
            <li>
              <strong>Booking &amp; inquiry form:</strong> your name, email
              address, and optionally your phone number, event date, venue or
              city, budget range, and the details of your message.
            </li>
            <li>
              <strong>Email signup:</strong> your email address, and the date
              and time you signed up.
            </li>
          </ul>
          <p>
            We do not run advertising trackers or third-party analytics
            profiling on this site, and we do not buy contact information from
            data brokers.
          </p>

          <h2>How we use it</h2>
          <ul>
            <li>
              Inquiry form submissions are emailed directly to Sam Suen so he
              can reply to you. They are not added to any marketing list.
            </li>
            <li>
              Email addresses submitted through the signup form are used to
              send you music releases and show announcements.
            </li>
          </ul>

          <h2>Third parties</h2>
          <div className="legal-callout">
            <p>
              <strong>
                We do not sell your information, and we do not share it with
                third parties for their own marketing or promotional purposes.
              </strong>
            </p>
          </div>
          <p>
            We use service providers to operate the site and deliver messages.
            They process your information only to provide their service to us,
            and may not use it for their own marketing:
          </p>
          <ul>
            <li>
              <strong>Klaviyo</strong> — stores the email list and sends those
              messages.
            </li>
            <li>
              <strong>Resend</strong> — delivers booking form submissions to
              Sam&apos;s inbox.
            </li>
            <li>
              <strong>Vercel</strong> — hosts the website and keeps standard
              server logs.
            </li>
          </ul>

          <h2>Opting out</h2>
          <p>
            Every email includes an unsubscribe link at the bottom. You can
            also email us and ask to be removed, or ask what information we
            hold about you and request that we delete it.
          </p>

          <h2>How long we keep it</h2>
          <p>
            List subscriptions are kept until you unsubscribe. A record of the
            unsubscribe is retained so we don&apos;t email you again by
            mistake. Inquiry emails live in Sam&apos;s inbox and are kept as
            ordinary business correspondence.
          </p>

          <h2>Children</h2>
          <p>
            This site is not directed at children under 13, and we do not
            knowingly collect their information. If you believe a child has
            submitted information to us, contact us and we will delete it.
          </p>

          <h2>Changes</h2>
          <p>
            If this policy changes, the &ldquo;last updated&rdquo; date above
            will change with it. Material changes affecting the email list
            will be communicated to subscribers.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy or your information:{" "}
            <a href="mailto:contact@rovstudios.com">contact@rovstudios.com</a>.
          </p>
        </div>

        <p className="legal-footer">&copy; 2026 Sam Suen</p>
      </div>
    </main>
  );
}
