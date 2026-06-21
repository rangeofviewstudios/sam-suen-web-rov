import Image from "next/image";
import styles from "./TeamPhoto.module.css";

interface TeamPhotoProps {
  imageSrc: string;
  name: string;
  width?: number;
  height?: number;
}

export default function TeamPhoto({ imageSrc, name, width = 300, height = 400 }: TeamPhotoProps) {
  return (
    <div className={styles.shell} style={{ width: "100%", aspectRatio: `${width} / ${height}` }}>
      <span className={`${styles.corner} ${styles.tl}`} />
      <span className={`${styles.corner} ${styles.tr}`} />
      <span className={`${styles.corner} ${styles.bl}`} />
      <span className={`${styles.corner} ${styles.br}`} />
      <div className={styles.imageWrap}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          className={styles.photo}
          sizes="300px"
          unoptimized
        />
        <div className={styles.halftone} />
      </div>
    </div>
  );
}
