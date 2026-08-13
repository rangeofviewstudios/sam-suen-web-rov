"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FiCheck } from "react-icons/fi";
import { subscribeFan } from "../actions/subscribe";
import { initialSubscribeState } from "../actions/subscribe-types";
import "./FanSignup.css";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="fs-submit" disabled={pending}>
      {pending ? "Signing up…" : "Sign up"}
    </button>
  );
}

interface FanSignupProps {
  /** `section` renders the full homepage block; `inline` is the slim /early variant. */
  variant?: "section" | "inline";
  heading?: string;
  copy?: string;
}

export default function FanSignup({
  variant = "section",
  heading = "New music first.",
  copy = "An email when a song drops or a show goes on sale. Nothing else. Unsubscribe any time.",
}: FanSignupProps) {
  const [state, formAction] = useActionState(
    subscribeFan,
    initialSubscribeState
  );

  const err = state.fieldErrors ?? {};
  const prev = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className={`fs fs-${variant}`}>
        <div className="fs-inner fs-done">
          <div className="fs-done-mark">
            <FiCheck />
          </div>
          <p className="fs-done-copy">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fs fs-${variant}`} id="early-access">
      <div className="fs-inner">
        <h2 className="fs-heading">{heading}</h2>
        <p className="fs-copy">{copy}</p>

        <form action={formAction} className="fs-form" noValidate>
          {/* Honeypot */}
          <div className="fs-hp" aria-hidden="true">
            <label htmlFor="fs-website">Website</label>
            <input
              id="fs-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="fs-field">
            <label className="fs-label" htmlFor="fs-email">
              Email
            </label>
            <input
              id="fs-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@email.com"
              defaultValue={prev.email}
              className={`fs-input ${err.email ? "has-error" : ""}`}
              aria-invalid={Boolean(err.email)}
            />
            {err.email && <span className="fs-error">{err.email}</span>}
          </div>

          {state.status === "error" && state.message && (
            <p className="fs-form-error" role="alert">
              {state.message}
            </p>
          )}

          <SubmitButton />

          <p className="fs-fineprint">
            We&apos;ll only email about new music and shows. See our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
