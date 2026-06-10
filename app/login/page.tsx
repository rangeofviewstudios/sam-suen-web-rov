"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";
import AnimatedGenerateButton from "@/app/components/ui/animated-generate-button-shadcn-tailwind";
import GradientBackground from "@/app/components/GradientBackground";
import styles from "./login.module.css";

type Mode = "signin" | "signup";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Created here (in the browser), not during render, so a missing env
    // var at build time can't crash the static prerender of this page.
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (!data.session) {
        setMessage("Check your email to confirm your account, then sign in.");
        setMode("signin");
        setLoading(false);
        return;
      }
    }

    router.push("/calendar");
    router.refresh();
  }

  return (
    <main className={styles.page}>
      <GradientBackground />

      <motion.div
        className={styles.card}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          variants={item}
          src="/suenlogo.png"
          alt="Sam Suen"
          width={174}
          height={36}
          className={styles.logo}
        />

        <motion.h1 variants={item} className={styles.title}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </motion.h1>
        <motion.p variants={item} className={styles.subtitle}>
          Studio Access
        </motion.p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <motion.div variants={item} className={styles.glassInput}>
            <span className={styles.inputIcon}>
              <Mail size={17} strokeWidth={1.8} />
            </span>
            <input
              className={styles.glassField}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Email"
            />
          </motion.div>

          <motion.div variants={item} className={styles.glassInput}>
            <span className={styles.inputIcon}>
              <Lock size={17} strokeWidth={1.8} />
            </span>
            <input
              className={styles.glassField}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              placeholder="Password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={17} strokeWidth={1.8} />
              ) : (
                <Eye size={17} strokeWidth={1.8} />
              )}
            </button>
          </motion.div>

          <motion.div variants={item} className={styles.submitRow}>
            <AnimatedGenerateButton
              type="submit"
              generating={loading}
              disabled={loading}
              labelIdle={mode === "signin" ? "Sign in" : "Sign up"}
              labelActive={mode === "signin" ? "Signing in" : "Signing up"}
            />
          </motion.div>
        </form>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}

        <motion.p variants={item} className={styles.toggle}>
          {mode === "signin" ? "No account? " : "Already have an account? "}
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setMessage(null);
            }}
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </motion.p>
      </motion.div>
    </main>
  );
}
