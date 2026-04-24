"use client";

import { Camera, ArrowUpRight, Instagram, ImagePlus } from "lucide-react";
import styles from "./PhotoUpload.module.css";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdutybBmBJ4j6I_vxIg6AZ4qGNNLx86ixqviW9f30-uFUKLdg/viewform";

export default function PhotoUpload() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <Camera size={20} />
        </div>
        <span className={styles.eyebrow}>Share The Night</span>
      </div>

      <h2 className={styles.title}>Send Sam Your Shots</h2>
      <p className={styles.copy}>
        Drop your best photos from tonight. Sam might repost you.
      </p>

      <ul className={styles.steps}>
        <li className={styles.step}>
          <span className={styles.stepIcon}>
            <ImagePlus size={14} />
          </span>
          Upload photos
        </li>
        <li className={styles.step}>
          <span className={styles.stepIcon}>
            <Instagram size={14} />
          </span>
          Tag your IG handle
        </li>
      </ul>

      <a
        href={GOOGLE_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.openBtn}
      >
        <span>Open Upload Form</span>
        <ArrowUpRight size={18} />
      </a>

      <p className={styles.footnote}>
        Opens in Google Forms &middot; no account needed
      </p>
    </div>
  );
}
