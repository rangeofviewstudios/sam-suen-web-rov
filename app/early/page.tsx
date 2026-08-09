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
    "Hear Sam Suen's new music first. Early access, show announcements, and every place to listen — in one place.",
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
    {
      label: "SoundCloud",
      sublabel: "Listen now",
      href: NEW_RELEASE.soundcloud,
      icon: <SiSoundcloud />,
    },
    NEW_RELEASE.spotify && {
      label: "Spotify",
      sublabel: "Stream & save",
      href: NEW_RELEASE.spotify,
      icon: <SiSpotify />,
    },
    NEW_RELEASE.appleMusic && {
      label: "Apple Music",
      sublabel: "Stream & save",
      href: NEW_RELEASE.appleMusic,
      icon: <SiApplemusic />,
    },
  ].filter(Boolean) as ListenLink[];

  const catalogLinks: ListenLink[] = [
    {
      label: "Spotify",
      sublabel: "Full catalog",
      href: LINKS.spotify,
      icon: <SiSpotify />,
    },
    {
      label: "Apple Music",
      sublabel: "Full catalog",
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
            <time dateTime={NEW_RELEASE.releaseDate}>August 14, 2026</time>
          </p>

          <div className="ea-links">
            {releaseLinks.map((link) => (
              <ListenButton key={link.label} link={link} primary />
            ))}
          </div>
        </section>

        {/* ── Signup ── */}
        <FanSignup
          variant="inline"
          heading="Get it first."
          copy="New songs and show announcements, sent straight to you before they go public."
        />

        {/* ── Everything else ── */}
        <section className="ea-more">
          <h2 className="ea-more-title">More from Sam</h2>
          <div className="ea-links">
            {catalogLinks.map((link) => (
              <ListenButton key={`${link.label}-${link.sublabel}`} link={link} />
            ))}
          </div>
        </section>

        <footer className="ea-footer">
          <a href="/" className="ea-home">
            samsuen.com
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
