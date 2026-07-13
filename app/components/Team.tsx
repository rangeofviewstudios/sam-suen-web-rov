"use client";

import { useState } from "react";
import { Space_Mono } from "next/font/google";
import TeamPhoto from "./TeamPhoto";
import ShinyText from "./ShinyText";
import styles from "./Team.module.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

interface TeamMember {
  name: string;
  funFact: string;
  role: string;
  imageSrc: string;
  link?: string;
}

const members: TeamMember[] = [
  {
    name: "Granger Wang",
    funFact: "Shoots on film too",
    role: "Photographer / Media",
    imageSrc: "/images/grangerheadshot.webp",
  },
  {
    name: "Rana Arshad",
    funFact: "Makes the moves happen",
    role: "Manager / Operations",
    imageSrc: "/images/rana headshot.webp",
  },
  {
    name: "Ayush Basu",
    funFact: "Mixes in the dark",
    role: "Mixing / Mastering / Recording",
    imageSrc: "/images/basuteampic.webp",
    link: "https://www.ayushbasu.com/",
  },
  {
    name: "Chandra",
    funFact: "Sees the whole board",
    role: "Director / Strategist",
    imageSrc: "/images/chandra.jpg",
  },
  {
    name: "Krina",
    funFact: "Catches the moment",
    role: "Photographer",
    imageSrc: "/images/krinapic.jpg",
  },
];

export default function Team() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className={`${styles.section} ${spaceMono.variable}`} id="team">
      <div className={styles.edgeLine} />
      <div className={styles.edgeDot} />

      <div className={styles.inner}>
        {/* Header row */}
        <div className={styles.header}>
          <div className={styles.label}>
            <span className={styles.labelNum}>03.</span>
            <span className={styles.labelText}>Our Team</span>
          </div>

          {/* Member nav pills */}
          <nav className={styles.nav}>
            {members.map((m, i) => (
              <button
                key={m.name}
                className={`${styles.navBtn} ${active === i ? styles.navBtnActive : ""}`}
                onClick={() => setActive(active === i ? null : i)}
              >
                <span className={styles.navIndex}>0{i + 1}</span>
                {m.name.split(" ")[0]}
              </button>
            ))}
          </nav>
        </div>

        {/* Staggered card row */}
        <div className={styles.row}>
          {members.map((m, i) => {
            const isActive = active === i;
            const isDimmed = active !== null && !isActive;
            return (
              <div
                key={m.name}
                className={`${styles.cardSlot} ${isActive ? styles.cardSlotActive : ""} ${isDimmed ? styles.cardSlotDimmed : ""}`}
                style={{ marginTop: i % 2 === 1 ? "120px" : "0px" }}
                onClick={() => setActive(active === i ? null : i)}
              >
                {m.link ? (
                  <a href={m.link} target="_blank" rel="noopener noreferrer">
                    <TeamPhoto imageSrc={m.imageSrc} name={m.name} width={220} height={290} />
                  </a>
                ) : (
                  <TeamPhoto imageSrc={m.imageSrc} name={m.name} width={220} height={290} />
                )}
                <div className={styles.cardInfo}>
                  <p className={styles.cardName}>{m.name}</p>
                  <p className={styles.cardMeta}>
                    <ShinyText
                      text={`[${m.role}]`}
                      color="rgba(201,168,76,0.9)"
                      shineColor="rgba(224,122,42,0.98)"
                      speed={3.5}
                      spread={90}
                      delay={i * 0.4 + 0.2}
                      className={styles.cardRole}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
