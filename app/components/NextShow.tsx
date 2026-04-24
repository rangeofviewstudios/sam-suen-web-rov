"use client";

import Image from "next/image";
import { useReveal } from "../hooks/useReveal";
import ScrollReveal from "./ScrollReveal";
import "./NextShow.css";

export default function NextShow() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  return (
    <section className="next-show" id="next-show">
      <div className="next-show-container">
        <div className="next-show-bg">
          <Image
            src="/images/districtfisheye.jpeg"
            alt="Sam Suen performing at District venue with fisheye lens"
            fill
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
          <div className="next-show-overlay" />
        </div>
        <div className="next-show-content">
          <span
            ref={r1.ref}
            className={`section-eyebrow next-show-eyebrow reveal-up ${r1.isVisible ? "visible" : ""}`}
          >
            Headlining · This Sunday
          </span>
          <h2
            ref={r2.ref}
            className={`next-show-title reveal-up delay-1 ${r2.isVisible ? "visible" : ""}`}
          >
            Dream Asia Fest
          </h2>
          <ScrollReveal
            as="p"
            containerClassName={`next-show-details reveal-up delay-2 ${r3.isVisible ? "visible" : ""}`}
            baseOpacity={0.08}
            enableBlur
            baseRotation={2}
            blurStrength={4}
            wordAnimationEnd="center center"
            rotationEnd="center center"
          >
            Sam headlines Dream Asia Fest this Sunday. Scan the QR at the show for an exclusive fan drop.
          </ScrollReveal>
          <div
            ref={r4.ref}
            className={`next-show-info reveal-up delay-3 ${r4.isVisible ? "visible" : ""}`}
          >
            <div className="show-info-item">
              <span className="show-info-label">Status</span>
              <span className="show-info-value">
                <span className="pulse-dot" />
                Headlining
              </span>
            </div>
            <div className="show-info-item">
              <span className="show-info-label">Venue</span>
              {/* TODO: replace with exact venue + city once confirmed */}
              <span className="show-info-value">TBA</span>
            </div>
            <div className="show-info-item">
              <span className="show-info-label">Tickets</span>
              <a
                href="https://www.dreamasiafest.com/ws2026"
                className="show-info-value show-info-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                dreamasiafest.com &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
