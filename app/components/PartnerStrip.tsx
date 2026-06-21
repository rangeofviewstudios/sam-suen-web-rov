import Image from "next/image";
import styles from "./PartnerStrip.module.css";

/** Subtle "creative partners with ROV" lead-in just above the footer. */
export default function PartnerStrip() {
  return (
    <div className={styles.wrap}>
      <a
        href="https://www.rovstudios.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.strip}
      >
        <span className={styles.label}>Creative partners with</span>
        <Image
          src="/images/rovbrownlogo.png"
          alt="Range of View"
          width={120}
          height={120}
          className={styles.logo}
        />
      </a>
    </div>
  );
}
