"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import styles from "./SecretTrack.module.css";

const AUDIO_SRC = "/audio/5. Efforts and Sincerity (SAM SUEN).mp3";

export default function SecretTrack() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = (Number(e.target.value) / 100) * duration;
  };

  const format = (s: number) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.eyebrow}>Unreleased</span>
      </div>

      <h2 className={styles.title}>Secret Track</h2>
      <p className={styles.copy}>Enjoy the drop. Don&apos;t share it.</p>

      <div className={styles.player}>
        <button
          type="button"
          className={styles.playBtn}
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
        </button>

        <div className={styles.progressWrap}>
          <input
            type="range"
            min={0}
            max={100}
            value={duration ? (progress / duration) * 100 : 0}
            onChange={handleSeek}
            className={styles.progress}
            style={{
              background: `linear-gradient(to right, #7b1f1f ${
                duration ? (progress / duration) * 100 : 0
              }%, rgba(255,255,255,0.1) ${
                duration ? (progress / duration) * 100 : 0
              }%)`,
            }}
            aria-label="Track progress"
          />
          <div className={styles.times}>
            <span>{format(progress)}</span>
            <span>{format(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) =>
          setProgress((e.target as HTMLAudioElement).currentTime)
        }
        onLoadedMetadata={(e) =>
          setDuration((e.target as HTMLAudioElement).duration)
        }
      />
    </div>
  );
}
