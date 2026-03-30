"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones } from "lucide-react";
import StreamingDrawer from "./StreamingDrawer";
import styles from "./FloatingListenPill.module.css";

export default function FloatingListenPill() {
  const [visible, setVisible] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && !drawerOpen && (
          <div className={styles.pillWrap}>
            <motion.button
              className={styles.pill}
              onClick={() => setDrawerOpen(true)}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              type="button"
            >
              <Headphones size={15} />
              <span className={styles.pillText}>Listen</span>
              <span className={styles.pillDot} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <StreamingDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
