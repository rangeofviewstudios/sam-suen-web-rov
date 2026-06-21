"use client";

import Image from "next/image";
import { useReveal } from "../hooks/useReveal";
import "./MusicProjects.css";

interface Release {
  title: string;
  cover: string;
}

const releases: Release[] = [
  { title: "Twilight",          cover: "/images/songcoverarts/twilight official cover.webp" },
  { title: "Stars Collide",     cover: "/images/songcoverarts/stars collide cover.webp" },
  { title: "Love is War",       cover: "/images/songcoverarts/love is war cover art.webp" },
  { title: "Lost in Yesterday", cover: "/images/songcoverarts/lost in yesterday official cover.webp" },
  { title: "Call Me Baby",      cover: "/images/songcoverarts/call me baby official cover.webp" },
  { title: "Gone Girl",         cover: "/images/songcoverarts/gone girl.webp" },
  { title: "Joke",              cover: "/images/songcoverarts/joke official cover.webp" },
  { title: "Laugh Today",       cover: "/images/songcoverarts/laugh today.webp" },
];

export default function MusicProjects() {
  const head = useReveal();

  return (
    <section className="mp" id="music">
      <div className="mp-container">
        <div className="mp-header" ref={head.ref}>
          <span className={`section-eyebrow reveal-up ${head.isVisible ? "visible" : ""}`}>
            Discography
          </span>
          <h2 className={`section-title reveal-up delay-1 ${head.isVisible ? "visible" : ""}`}>
            Music
            <em>Projects.</em>
          </h2>
        </div>

        <div className="mp-grid">
          {releases.map((r, i) => (
            <ReleaseCard key={r.title} release={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  const { ref, isVisible } = useReveal();
  return (
    <article
      ref={ref}
      className={`mp-card reveal-up ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: `${(index % 4) * 0.06}s` }}
    >
      <div className="mp-cover-shell">
        <div className="mp-cover-inner">
          <Image
            src={encodeURI(release.cover)}
            alt={`${release.title} — cover art`}
            width={600}
            height={600}
            className="mp-cover-img"
          />
        </div>
      </div>
      <div className="mp-meta">
        <span className="mp-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="mp-title">{release.title}</span>
      </div>
    </article>
  );
}
