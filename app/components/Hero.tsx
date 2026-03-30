"use client";

import { useState } from "react";
import Image from "next/image";
import { SiSpotify, SiApplemusic } from "react-icons/si";
import { Headphones } from "lucide-react";
import { useReveal } from "../hooks/useReveal";
import { LINKS } from "../lib/links";
import SplitText from "./SplitText";
import StreamingDrawer from "./StreamingDrawer";
import styles from "./Hero.module.css";

export default function Hero() {
  const r3 = useReveal();
  const r4 = useReveal();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className={styles.hero} id="hero">
      {/* Grain overlay */}
      <div className={styles.grain} aria-hidden />

      {/* Vertical side label */}
      <span className={styles.sideLabel} aria-hidden>
        Atlanta, GA
      </span>

      {/* ── Left: text content ── */}
      <div className={styles.content}>
        <div className={styles.vignette} aria-hidden />

        <div className={styles.text}>
          <h1 className={styles.title}>
            <SplitText
              text="SAM"
              tag="span"
              className={styles.titleSam}
              splitType="chars"
              from={{ opacity: 0, y: 80 }}
              to={{ opacity: 1, y: 0 }}
              delay={55}
              duration={0.85}
              ease="power3.out"
              textAlign="left"
              rootMargin="0px"
              threshold={0}
            />
            <SplitText
              text="SUEN"
              tag="span"
              className={styles.titleSuen}
              splitType="chars"
              from={{ opacity: 0, y: 80 }}
              to={{ opacity: 1, y: 0 }}
              delay={55}
              duration={0.85}
              ease="power3.out"
              textAlign="left"
              rootMargin="0px"
              threshold={0}
            />
          </h1>

          <div className={styles.rule} aria-hidden />

          <p
            ref={r3.ref}
            className={`${styles.subtitle} reveal-up delay-3 ${r3.isVisible ? "visible" : ""}`}
          >
            Korean Chinese hip-hop artist blending emotional
            storytelling with confident delivery.
          </p>

          <div
            ref={r4.ref}
            className={`${styles.cta} reveal-up delay-4 ${r4.isVisible ? "visible" : ""}`}
          >
            <button
              className={styles.listenBtn}
              onClick={() => setDrawerOpen(true)}
              type="button"
            >
              <Headphones size={16} />
              <span>Listen Now</span>
            </button>

            <div className={styles.platformIcons}>
              <a
                href={LINKS.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformIcon}
                aria-label="Spotify"
              >
                <SiSpotify size={16} />
              </a>
              <a
                href={LINKS.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformIcon}
                aria-label="Apple Music"
              >
                <SiApplemusic size={16} />
              </a>
            </div>

            <a href="#portfolio" className={styles.btnCircle} aria-label="View Portfolio">
              ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── Right: hero image ── */}
      <div className={styles.imageCol}>
        <div className={styles.imageWrapper}>
          <div className={styles.imageInner}>
            <Image
              src="/images/rapred.jpeg"
              alt="Sam Suen performing live on stage under red lights"
              fill
              priority
              sizes="45vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden>
        <div className={styles.scrollLine} />
      </div>

      {/* Streaming drawer */}
      <StreamingDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
}
