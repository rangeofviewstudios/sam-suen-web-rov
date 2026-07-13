"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useReveal } from "../hooks/useReveal";
import "./ShowsGigs.css";

interface Show {
  year: string;
  title: string;
  venue: string;
  image: string;
}

// Chronological tour history, oldest → newest.
const shows: Show[] = [
  {
    year: "2023",
    title: "Ted Park × Parlay Pass",
    venue: "Glam 104",
    image: "/images/images2/oct 2024 ted park x parlay pass.webp",
  },
  {
    year: "2024",
    title: "Hanyang Society",
    venue: "Believe Music Hall",
    image: "/images/images2/hanyang believe hall nov 2024.webp",
  },
  {
    year: "2025",
    title: "Invasian Labubu Rave",
    venue: "District Atlanta",
    image: "/images/images2/district labubu rave 2025.webp",
  },
  {
    year: "2026",
    title: "Justin Park × Junoflo & Friends",
    venue: "Rendezvous",
    image: "/images/images2/justin park x junoflo with friend hanyang society jan 2026.webp",
  },
  {
    year: "2026",
    title: "Dream Asia Fest",
    venue: "NC + GA",
    image: "/images/images2/dream asia fest ga 2026.webp",
  },
];

export default function ShowsGigs() {
  const head = useReveal();

  return (
    <section className="sg" id="shows-gigs">
      <div className="sg-container">
        <div className="sg-header" ref={head.ref}>
          <span className={`section-eyebrow reveal-up ${head.isVisible ? "visible" : ""}`}>
            Live
          </span>
          <h2 className={`section-title reveal-up delay-1 ${head.isVisible ? "visible" : ""}`}>
            Shows
            <em>&amp; gigs.</em>
          </h2>
        </div>

        <div className="sg-timeline">
          <div className="sg-track">
            {shows.map((s) => (
              <TimelineEntry key={`${s.year}-${s.title}`} show={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ show }: { show: Show }) {
  const { ref, isVisible } = useReveal();
  // Hover on fine pointers; tap toggles as a fallback on touch devices.
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      ref={ref}
      className={`sg-entry reveal-up ${isVisible ? "visible" : ""} ${active ? "active" : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="sg-node" aria-hidden>
        <span className="sg-node-dot" />
      </div>

      <button
        type="button"
        className="sg-info"
        onClick={() => setActive((o) => !o)}
        aria-expanded={active}
      >
        <span className="sg-year">{show.year}</span>
        <span className="sg-title">{show.title}</span>
        <span className="sg-venue">{show.venue}</span>
        <span className="sg-toggle">
          <span className="sg-toggle-icon">{active ? "×" : "+"}</span>
          {active ? "Hide" : "View"}
        </span>
      </button>

      {/* Full-size preview — portaled to <body> so it escapes the timeline's
          transforms/overflow and fills the viewport. Fades in/out on hover. */}
      {mounted &&
        createPortal(
          <div className={`sg-popup ${active ? "show" : ""}`} aria-hidden={!active}>
            <div className="sg-popup-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={encodeURI(show.image)}
                alt={`${show.title} — ${show.venue}, ${show.year}`}
                className="sg-popup-img"
                draggable={false}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
