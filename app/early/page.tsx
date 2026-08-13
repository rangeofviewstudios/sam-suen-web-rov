import type { Metadata } from "next";
import Image from "next/image";
import { SiSpotify, SiApplemusic, SiSoundcloud, SiInstagram } from "react-icons/si";
import { FiArrowUpRight } from "react-icons/fi";
import FanSignup from "../components/FanSignup";
import { LINKS, NEW_RELEASE } from "../lib/links";
import "./early.css";

export const metadata: Metadata = {
  title: "Early Access — Sam Suen",
  description:
    "Sam Suen's new single, every place to listen, and sign-up for a text when the next song drops.",
  // This page is a destination for text messages, not something we want
  // competing with the homepage in search results.
  robots: { index: false, follow: true },
};

interface ListenLink {
  label: string;
  sublabel: string;
  href: string;
  icon: React.ReactNode;
}

export default function EarlyAccessPage() {
  const releaseLinks: ListenLink[] = [
    NEW_RELEASE.spotify && {
      label: "Spotify",
      sublabel: "Stream",
      href: NEW_RELEASE.spotify,
      icon: <SiSpotify />,
    },
    NEW_RELEASE.appleMusic && {
      label: "Apple Music",
      sublabel: "Stream",
      href: NEW_RELEASE.appleMusic,
      icon: <SiApplemusic />,
    },
    {
      label: "SoundCloud",
      sublabel: "Listen",
      href: NEW_RELEASE.soundcloud,
      icon: <SiSoundcloud />,
    },
  ].filter(Boolean) as ListenLink[];

  const catalogLinks: ListenLink[] = [
    {
      label: "Spotify",
      sublabel: "All songs",
      href: LINKS.spotify,
      icon: <SiSpotify />,
    },
    {
      label: "Apple Music",
      sublabel: "All songs",
      href: LINKS.appleMusic,
      icon: <SiApplemusic />,
    },
    {
      label: "Instagram",
      sublabel: "@samsuenofficial",
      href: LINKS.instagram,
      icon: <SiInstagram />,
    },
  ];

  return (
    <main className="ea">
      <div className="ea-glow" aria-hidden="true" />

      <div className="ea-container">
        <header className="ea-header">
          <Image
            src="/suenlogo.png"
            alt="Sam Suen"
            width={180}
            height={38}
            className="ea-logo"
            priority
          />
        </header>

        {/* ── New release ── */}
        <section className="ea-release">
          <span className="ea-tag">New single</span>
          <h1 className="ea-title">{NEW_RELEASE.title}</h1>
          <p className="ea-date">
            Out <time dateTime={NEW_RELEASE.releaseDate}>August 14</time>
          </p>

          {/* Pre-save is the single most valuable action before release day:
              it counts toward first-day streams on the platforms. Everything
              else on this page is secondary to it. */}
          <a
            href={NEW_RELEASE.presave}
            target="_blank"
            rel="noopener noreferrer"
            className="ea-presave"
          >
            <span className="ea-presave-label">Pre-save the single</span>
            <span className="ea-presave-sub">
              Spotify, Apple Music &amp; more — one tap
            </span>
          </a>

          <div className="ea-links">
            {releaseLinks.map((link) => (
              <ListenButton key={link.label} link={link} />
            ))}
          </div>
        </section>

        {/* ── Signup ── */}
        <FanSignup
          variant="inline"
          heading="Get the next one first."
          copy="An email when a song drops or a show goes on sale. Nothing else."
        />

        {/* ── Everything else ── */}
        <section className="ea-more">
          <h2 className="ea-more-title">More</h2>
          <div className="ea-links">
            {catalogLinks.map((link) => (
              <ListenButton key={`${link.label}-${link.sublabel}`} link={link} />
            ))}
          </div>
        </section>

        <footer className="ea-footer">
          {/* Label stays domain-agnostic: the href is relative and works
              anywhere, whereas a hardcoded domain would read as a broken
              promise while samsuen.com is unresolved. */}
          <a href="/" className="ea-home">
            Sam Suen
          </a>
          <p className="ea-legal">
            <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a>
          </p>
          <p className="ea-copy">&copy; 2026 Sam Suen</p>
        </footer>
      </div>
    </main>
  );
}

function ListenButton({
  link,
  primary,
}: {
  link: ListenLink;
  primary?: boolean;
}) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`ea-link ${primary ? "is-primary" : ""}`}
    >
      <span className="ea-link-icon">{link.icon}</span>
      <span className="ea-link-text">
        <span className="ea-link-label">{link.label}</span>
        <span className="ea-link-sub">{link.sublabel}</span>
      </span>
      <FiArrowUpRight className="ea-link-arrow" />
    </a>
  );
}
