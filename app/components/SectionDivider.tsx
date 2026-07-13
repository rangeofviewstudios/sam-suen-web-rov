"use client";

import styles from "./SectionDivider.module.css";

/**
 * Decorative divider used to break up the negative space
 * between sections. Purely ornamental (aria-hidden).
 */
export default function SectionDivider() {
  return (
    <div className={styles.divider} aria-hidden>
      {/* Center emblem: hairline — dot — hairline */}
      <span className={`${styles.rule} ${styles.ruleLeft}`} />
      <span className={styles.dot} />
      <span className={`${styles.rule} ${styles.ruleRight}`} />
    </div>
  );
}
