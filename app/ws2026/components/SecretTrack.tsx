"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Unlock, Play, Pause } from "lucide-react";
import styles from "./SecretTrack.module.css";

/**
 * SHA-256 hash of the unlock password.
 * TODO: Replace with the real hash. Generate via:
 *   node -e "require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex')"
 *
 * Current value hashes the word "dreamasia" as a placeholder so dev can test.
 */
const EXPECTED_HASH =
  "73aea6f36123aba890ebe6c821410b529a2ad9a3daa30cad7daa1e28097c58b6";
// Password: "samasiafest" (case-insensitive)

const AUDIO_SRC = "/audio/cantkeepwaitingsnip.mp3";
const UNLOCK_KEY = "ws2026-unlocked";

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function SecretTrack() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setChecking(true);
    setError(false);
    const hash = await sha256(password.trim().toLowerCase());
    setChecking(false);
    if (hash === EXPECTED_HASH) {
      sessionStorage.setItem(UNLOCK_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
    } else {
      el.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const pct = Number(e.target.value) / 100;
    el.currentTime = pct * duration;
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
        <div className={styles.iconWrap}>
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div
                key="unlock"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Unlock size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="lock"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Lock size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className={styles.eyebrow}>Unreleased</span>
      </div>

      <h2 className={styles.title}>Secret Track</h2>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="locked"
            className={styles.lockedBody}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className={styles.copy}>
              Drop the code to unlock. Only shared at the show.
            </p>

            <form
              onSubmit={handleSubmit}
              className={`${styles.form} ${error ? styles.shake : ""}`}
            >
              <input
                type="text"
                inputMode="text"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                placeholder="Enter code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                aria-label="Unlock code"
              />
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={checking}
              >
                {checking ? "..." : "Unlock"}
              </button>
            </form>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.errorMsg}
              >
                Wrong code. Try again.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            className={styles.unlockedBody}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <p className={styles.copy}>Enjoy the drop. Don't share it.</p>

            <div className={styles.player}>
              <button
                type="button"
                className={styles.playBtn}
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
