"use client";

import styles from "./SectionDivider.module.css";

/** A single autumn leaf (brand-kit ellipse-blade style) */
function Leaf({ className, fill, stroke }: { className?: string; fill: string; stroke: string }) {
  return (
    <svg className={className} viewBox="0 0 40 52" fill="none" aria-hidden>
      <ellipse cx="20" cy="18" rx="14" ry="8.5" transform="rotate(-14 20 18)" fill={fill} />
      <line x1="20" y1="25" x2="22.5" y2="48" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="20.8" y1="33" x2="13" y2="29" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      <line x1="21.4" y1="39" x2="29" y2="36" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/**
 * Decorative fall-themed divider used to break up the negative space
 * between sections. Purely ornamental (aria-hidden).
 */
export default function SectionDivider() {
  return (
    <div className={styles.divider} aria-hidden>
      {/* Ambient drifting leaves filling the negative space */}
      <span className={`${styles.drift} ${styles.drift1}`}>
        <Leaf className={styles.driftLeaf} fill="rgba(201,168,76,0.30)" stroke="rgba(201,168,76,0.35)" />
      </span>
      <span className={`${styles.drift} ${styles.drift2}`}>
        <Leaf className={styles.driftLeaf} fill="rgba(212,98,42,0.26)" stroke="rgba(212,98,42,0.3)" />
      </span>
      <span className={`${styles.drift} ${styles.drift3}`}>
        <Leaf className={styles.driftLeaf} fill="rgba(61,122,26,0.26)" stroke="rgba(61,122,26,0.3)" />
      </span>
      <span className={`${styles.drift} ${styles.drift4}`}>
        <Leaf className={styles.driftLeaf} fill="rgba(201,168,76,0.22)" stroke="rgba(201,168,76,0.28)" />
      </span>

      {/* Center emblem: hairline — leaf — hairline */}
      <span className={`${styles.rule} ${styles.ruleLeft}`} />
      <Leaf className={styles.emblem} fill="url(#divLeafGrad)" stroke="rgba(245,240,224,0.45)" />
      <span className={`${styles.rule} ${styles.ruleRight}`} />

      {/* Shared gradient def */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="divLeafGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d7a1a" />
            <stop offset="55%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#d4622a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
