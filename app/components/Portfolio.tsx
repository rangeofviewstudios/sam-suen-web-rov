"use client";

import { useReveal } from "../hooks/useReveal";
import ThreeDMarquee from "./ui/3d-marquee";
import ShinyText from "./ShinyText";
import "./Portfolio.css";

const photos = [
  // New media interleaved with stage shots — 15 total, 5 per column
  "/images/samlake.webp",
  "/images/district2.jpeg",
  "/images/samtrash1.webp",
  "/images/rappingstage.jpeg",
  "/images/samlake2.webp",
  "/images/fisheyefootup.jpg",
  "/images/samdump.webp",
  "/images/fistbumplandscape.jpg",
  "/images/samtrash3.jpeg",
  "/images/rapred.jpeg",
  "/images/samlake3.webp",
  "/images/districtfisheye.jpeg",
  "/images/samlake4.webp",
  "/images/rapping1.jpeg",
  "/images/rapstage2.jpeg",
];

export default function Portfolio() {
  const r2 = useReveal();
  const r3 = useReveal();

  return (
    <section className="portfolio" id="portfolio">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h2
            ref={r2.ref}
            className={`section-title reveal-up ${r2.isVisible ? "visible" : ""}`}
          >
            Captured
            <br />
            <em>in motion.</em>
          </h2>
          <p
            ref={r3.ref}
            className={`portfolio-credit reveal-up delay-2 ${r3.isVisible ? "visible" : ""}`}
          >
            <ShinyText
              text="Photography by Granger Wang"
              color="rgba(160,160,160,0.85)"
              shineColor="rgba(245,240,232,0.95)"
              speed={4}
              spread={110}
              delay={0.5}
            />
          </p>
        </div>
        <ThreeDMarquee images={photos} />
      </div>
    </section>
  );
}
