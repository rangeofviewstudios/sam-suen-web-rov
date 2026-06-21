"use client";

import { useState } from "react";
import Image from "next/image";
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

function LeafNode() {
  return (
    <svg className="sg-node-leaf" viewBox="0 0 40 52" fill="none" aria-hidden>
      <ellipse cx="20" cy="18" rx="13" ry="8" transform="rotate(-14 20 18)" fill="url(#sgLeafGrad)" />
      <line x1="20" y1="25" x2="22" y2="46" stroke="rgba(245,240,224,0.5)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
          <p className={`sg-intro reveal-up delay-2 ${head.isVisible ? "visible" : ""}`}>
            A trail of stages, one season at a time.
          </p>
        </div>

        <div className="sg-timeline">
          <div className="sg-track">
            {shows.map((s) => (
              <TimelineEntry key={`${s.year}-${s.title}`} show={s} />
            ))}
          </div>
        </div>
      </div>

      {/* Shared leaf gradient def */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="sgLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d7a1a" />
            <stop offset="55%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#d4622a" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
}

function TimelineEntry({ show }: { show: Show }) {
  const { ref, isVisible } = useReveal();
  const [open, setOpen] = useState(false);

  return (
    <div
      ref={ref}
      className={`sg-entry reveal-up ${isVisible ? "visible" : ""} ${open ? "open" : ""}`}
    >
      <div className="sg-node" aria-hidden>
        <LeafNode />
      </div>

      <button
        type="button"
        className="sg-info"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="sg-year">{show.year}</span>
        <span className="sg-title">{show.title}</span>
        <span className="sg-venue">{show.venue}</span>
        <span className="sg-toggle">
          <span className="sg-toggle-icon">{open ? "×" : "+"}</span>
          {open ? "Close" : "View"}
        </span>
      </button>

      <div className="sg-media">
        <div className="sg-media-inner">
          {open && (
            <Image
              src={encodeURI(show.image)}
              alt={`${show.title} — ${show.venue}, ${show.year}`}
              width={760}
              height={500}
              className="sg-media-img"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          )}
        </div>
      </div>
    </div>
  );
}
