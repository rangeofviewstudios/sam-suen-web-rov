"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SiSpotify, SiApplemusic } from "react-icons/si";
import { FiInstagram, FiMail } from "react-icons/fi";
import { LINKS } from "../lib/links";
import styles from "./StreamingDrawer.module.css";

interface StreamingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const streamingLinks = [
  {
    name: "Spotify",
    href: LINKS.spotify,
    icon: SiSpotify,
    brandColor: "#1DB954",
  },
  {
    name: "Apple Music",
    href: LINKS.appleMusic,
    icon: SiApplemusic,
    brandColor: "#FA243C",
  },
];

const socialLinks = [
  { name: "Instagram", href: LINKS.instagram, icon: FiInstagram },
  { name: "Email", href: LINKS.email, icon: FiMail },
];

export default function StreamingDrawer({ isOpen, onClose }: StreamingDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className={styles.sheet}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
          >
            {/* Drag handle */}
            <div className={styles.handle}>
              <div className={styles.handleBar} />
            </div>

            {/* Artist header */}
            <div className={styles.artistHeader}>
              <div className={styles.artistPhoto}>
                <Image
                  src="/images/rapping1.jpeg"
                  alt="Sam Suen"
                  width={48}
                  height={48}
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              </div>
              <div className={styles.artistInfo}>
                <span className={styles.eyebrow}>Listen Now</span>
                <span className={styles.artistName}>SAM SUEN</span>
              </div>
            </div>

            {/* Streaming links */}
            <div className={styles.links}>
              {streamingLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBtn}
                  style={{ "--brand-color": link.brandColor } as React.CSSProperties}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                >
                  <link.icon className={styles.linkIcon} />
                  <span className={styles.linkName}>{link.name}</span>
                  <span className={styles.linkArrow}>&#8599;</span>
                </motion.a>
              ))}
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Social row */}
            <div className={styles.socials}>
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target={link.name === "Email" ? undefined : "_blank"}
                  rel={link.name === "Email" ? undefined : "noopener noreferrer"}
                  className={styles.socialBtn}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.35 }}
                >
                  <link.icon className={styles.socialIcon} />
                  <span className={styles.socialName}>{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
