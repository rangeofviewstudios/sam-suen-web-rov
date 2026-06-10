import styles from "./GradientBackground.module.css";

/**
 * Fixed, full-viewport ember gradient backdrop (brand tones) used behind
 * the login and team-board pages. Pure markup — safe in server or client
 * trees. Place page content above it with `position: relative; z-index: 1`.
 */
export default function GradientBackground() {
  return (
    <div className={styles.bg} aria-hidden="true">
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />
      <div className={styles.grain} />
    </div>
  );
}
