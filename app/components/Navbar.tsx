"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { User, Users, Home, Disc3, Camera } from "lucide-react";
import "./Navbar.css";

const NAV_ITEMS = [
  { name: "Home",   url: "#hero",       icon: Home },
  { name: "About",  url: "#about",      icon: User },
  { name: "Team",   url: "#team",       icon: Users },
  { name: "Music",  url: "#music",      icon: Disc3 },
  { name: "Photos", url: "#shows-gigs", icon: Camera },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState("Home");
  const [hovered, setHovered]   = useState<string | null>(null);
  const [mounted, setMounted]   = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const map: Record<string, string> = {
      hero: "Home", about: "About", team: "Team",
      music: "Music", "shows-gigs": "Photos",
    };
    const observers: IntersectionObserver[] = [];
    Object.keys(map).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(map[id]); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const indicator = hovered ?? active;

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div className="nav-progress" style={{ scaleX }} />

      {/* Main nav pill */}
      <motion.nav
        className="nav"
        style={{ x: "-50%" }}
        initial={{ y: -72, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Wordmark */}
        <a href="#hero" className="nav-logo" aria-label="Sam Suen — home">
          <Image
            src="/suenlogo.png"
            alt="Sam Suen"
            width={174}
            height={36}
            className="nav-logo-img"
            priority
          />
        </a>
        <span className="nav-divider" />

        {/* Links */}
        <div className="nav-links" onMouseLeave={() => setHovered(null)}>
          {NAV_ITEMS.map(({ name, url, icon: Icon }) => (
            <a
              key={name}
              href={url}
              className={`nav-link ${active === name ? "nav-link--active" : ""}`}
              onMouseEnter={() => setHovered(name)}
            >
              {/* Sliding pill + tubelight */}
              {indicator === name && (
                <motion.span
                  layoutId="nav-lamp"
                  className="nav-lamp"
                  transition={{ type: "spring", stiffness: 360, damping: 34 }}
                >
                  {/* Glow bar only shows on the active (not just hovered) item */}
                  {active === name && (
                    <span className="nav-lamp-glow" />
                  )}
                </motion.span>
              )}

              {/* Desktop: text */}
              <span className="nav-link-label">{name}</span>

              {/* Mobile: icon */}
              <span className="nav-link-icon">
                <Icon size={16} strokeWidth={2.5} />
              </span>
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className={`nav-toggle ${menuOpen ? "nav-toggle--active" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span />
        </button>
      </motion.nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-bg" />
            <motion.a
              href="#hero"
              className="mobile-menu-logo"
              aria-label="Sam Suen — home"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setMenuOpen(false)}
            >
              <Image src="/suenlogo.png" alt="Sam Suen" width={174} height={36} className="mobile-menu-logo-img" />
            </motion.a>
            <nav className="mobile-menu-inner">
              {NAV_ITEMS.map(({ name, url }, i) => (
                <motion.a
                  key={name}
                  href={url}
                  className="mobile-link"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => { setMenuOpen(false); setActive(name); }}
                >
                  <span className="mobile-link-num">0{i + 1}</span>
                  {name}
                </motion.a>
              ))}
            </nav>
            <motion.p
              className="mobile-menu-footer"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            >
              Atlanta, GA · Hip-Hop · Est. 2024
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
