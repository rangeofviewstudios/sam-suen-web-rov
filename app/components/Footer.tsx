"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiInstagram, FiMail } from "react-icons/fi";
import { SiSpotify, SiApplemusic, SiDiscord } from "react-icons/si";
import { LINKS } from "../lib/links";
import Ribbons from "./Ribbons";
import "./Footer.css";

function AtlantaClock() {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const atl = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(now);

      const get = (t: string) => atl.find((p) => p.type === t)?.value ?? "00";
      const date = `D${get("year")}-${get("month")}-${get("day")}`;
      const time = `T${get("hour")}:${get("minute")}:${get("second")}`;
      setDisplay(`${date} ${time}`);
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="footer-clock">{display}</span>;
}

export default function Footer() {
  return (
    <footer className="footer">
      {/* Ribbon background — design-system colours, subtle opacity */}
      <Ribbons
        colors={["#3d7a1a", "#c9a84c"]}
        baseSpring={0.025}
        baseFriction={0.88}
        baseThickness={22}
        offsetFactor={0.06}
        maxAge={420}
        pointCount={40}
        speedMultiplier={0.45}
        enableFade
        enableShaderEffect
        effectAmplitude={2.5}
      />
      <div className="footer-container">

        {/* Top row: nav left, contact right */}
        <div className="footer-top">
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#team">Team</a>
            <a href="#music">Music</a>
            <a href="#music-video">Video</a>
            <a href="#shows-gigs">Photos</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#booking">Booking</a>
          </nav>
          <div className="footer-contact">
            <a
              href="https://www.instagram.com/samsuenofficial/"
              className="footer-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiInstagram className="footer-contact-icon" />
              Instagram
            </a>
            <a
              href="https://open.spotify.com/artist/0xXkuHzIgsvT7a00POWMIK?si=E4RShAnQTe6HyvLjyAuZuA"
              className="footer-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiSpotify className="footer-contact-icon" />
              Spotify
            </a>
            <a
              href="https://music.apple.com/us/artist/sam-suen/1561994926"
              className="footer-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiApplemusic className="footer-contact-icon" />
              Apple Music
            </a>
            <a
              href={LINKS.discord}
              className="footer-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiDiscord className="footer-contact-icon" />
              Discord
            </a>
            <div className="footer-contact-divider" />
            <a
              href="mailto:contact@rovstudios.com"
              className="footer-contact-link"
            >
              <FiMail className="footer-contact-icon" />
              contact@rovstudios.com
            </a>
          </div>
        </div>

        {/* Live Atlanta clock */}
        <div className="footer-clock-row">
          <AtlantaClock />
        </div>

        {/* Giant name */}
        <div className="footer-bigname-wrap">
          <span className="footer-bigname">SAM SUEN</span>
        </div>

        {/* Divider + bottom bar */}
        <div className="footer-divider" />
        <div className="footer-bottom">
          <div className="footer-mark">
            <Image
              src="/suenlogo.png"
              alt="Sam Suen"
              width={174}
              height={36}
              className="footer-wordmark"
            />
            <p className="footer-copy">&copy; 2026 Sam Suen. All rights reserved.</p>
            {/* Required by carriers: consent terms must be reachable sitewide. */}
            <p className="footer-legal">
              <a href="/privacy">Privacy</a>
              <span aria-hidden="true"> · </span>
              <a href="/terms">Terms</a>
            </p>
          </div>
          <a href="https://www.rovstudios.com/" target="_blank" rel="noopener noreferrer" className="footer-rov">
            <span className="footer-rov-text">Curated with intention by</span>
            <Image
              src="/images/rovbrownlogo.png"
              alt="ROV"
              width={200}
              height={80}
              className="footer-rov-logo"
            />
          </a>
        </div>

      </div>
    </footer>
  );
}
