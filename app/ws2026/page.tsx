"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SecretTrack from "./components/SecretTrack";
import PhotoUpload from "./components/PhotoUpload";
import styles from "./WS2026.module.css";

export default function WS2026Page() {
  return (
    <main className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src="/images/rapred.jpeg"
            alt="Sam Suen performing live"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
          <div className={styles.heroOverlay} aria-hidden />
        </div>

        <div className={styles.grain} aria-hidden />

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} />
            DREAM ASIA FEST
          </div>
          <h1 className={styles.title}>
            Fan<br />Access
          </h1>
          <div className={styles.rule} />
          <p className={styles.subtitle}>
            Exclusive drop for fans at the show. Tap in below.
          </p>
        </motion.div>
      </section>

      {/* ── Secret Track ── */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        <SecretTrack />
      </motion.section>

      {/* ── Photo Upload ── */}
      <motion.section
        className={styles.section}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      >
        <PhotoUpload />
      </motion.section>

      {/* ── Outro ── */}
      <footer className={styles.footer}>
        <Link href="/" className={styles.backLink}>
          &larr; samsuen.com
        </Link>
        <div className={styles.rovLockup}>
          <span className={styles.rovText}>Curated with intention by</span>
          <a
            href="https://www.rovstudios.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Range of View Studios"
          >
            <Image
              src="/images/rovbrownlogo.png"
              alt="Range of View Studios"
              width={52}
              height={52}
              className={styles.rovLogo}
            />
          </a>
        </div>
      </footer>
    </main>
  );
}
