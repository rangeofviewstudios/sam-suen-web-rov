"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FiArrowUpRight, FiCheck } from "react-icons/fi";
import { submitBookingInquiry } from "../actions/booking";
import {
  BUDGET_OPTIONS,
  INQUIRY_TYPES,
  initialBookingState,
} from "../actions/booking-types";
import { useReveal } from "../hooks/useReveal";
import "./BookingForm.css";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="bf-submit" disabled={pending}>
      <span>{pending ? "Sending…" : "Send inquiry"}</span>
      {!pending && <FiArrowUpRight className="bf-submit-icon" />}
    </button>
  );
}

export default function BookingForm() {
  const head = useReveal();
  const body = useReveal();
  const [state, formAction] = useActionState(
    submitBookingInquiry,
    initialBookingState
  );

  // Stamped on mount so the server can reject sub-2s bot submissions.
  // Set in an effect rather than at render so SSR and client markup agree.
  const [renderedAt, setRenderedAt] = useState("");
  useEffect(() => setRenderedAt(String(Date.now())), []);

  const err = state.fieldErrors ?? {};
  const prev = state.values ?? {};

  if (state.status === "success") {
    return (
      <section className="bf" id="booking">
        <div className="bf-container">
          <div className="bf-success">
            <div className="bf-success-mark">
              <FiCheck />
            </div>
            <h2 className="bf-success-title">Sent</h2>
            <p className="bf-success-copy">{state.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bf" id="booking">
      <div className="bf-container">
        <div className="bf-header" ref={head.ref}>
          <span
            className={`section-eyebrow reveal-up ${head.isVisible ? "visible" : ""}`}
          >
            Contact
          </span>
          <h2
            className={`section-title reveal-up delay-1 ${head.isVisible ? "visible" : ""}`}
          >
            Booking
            <em>&amp; inquiries.</em>
          </h2>
        </div>

        <div
          ref={body.ref}
          className={`bf-body reveal-up delay-2 ${body.isVisible ? "visible" : ""}`}
        >
          <p className="bf-intro">
            Shows, features, press. Send the details and we&apos;ll reply.
          </p>

          <form action={formAction} className="bf-form" noValidate>
            {/* Honeypot: hidden from people, tempting to bots. */}
            <div className="bf-hp" aria-hidden="true">
              <label htmlFor="bf-company">Company</label>
              <input
                id="bf-company"
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input type="hidden" name="renderedAt" value={renderedAt} />

            <div className="bf-grid">
              <Field
                label="Name"
                name="name"
                required
                error={err.name}
                defaultValue={prev.name}
                autoComplete="name"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                error={err.email}
                defaultValue={prev.email}
                autoComplete="email"
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                optional
                error={err.phone}
                defaultValue={prev.phone}
                autoComplete="tel"
              />

              <div className="bf-field">
                <label className="bf-label" htmlFor="bf-inquiryType">
                  What&apos;s this about <span className="bf-req">*</span>
                </label>
                <select
                  id="bf-inquiryType"
                  name="inquiryType"
                  className={`bf-input bf-select ${err.inquiryType ? "has-error" : ""}`}
                  defaultValue={prev.inquiryType ?? ""}
                  aria-invalid={Boolean(err.inquiryType)}
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {INQUIRY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {err.inquiryType && (
                  <span className="bf-error">{err.inquiryType}</span>
                )}
              </div>

              <Field
                label="Event date"
                name="eventDate"
                optional
                placeholder="Aug 14, or flexible"
                defaultValue={prev.eventDate}
              />
              <Field
                label="Venue / city"
                name="venue"
                optional
                placeholder="Believe Music Hall, Atlanta"
                defaultValue={prev.venue}
              />

              <div className="bf-field bf-field-full">
                <label className="bf-label" htmlFor="bf-budget">
                  Budget <span className="bf-opt">optional</span>
                </label>
                <select
                  id="bf-budget"
                  name="budget"
                  className="bf-input bf-select"
                  defaultValue={prev.budget ?? ""}
                >
                  <option value="">Prefer not to say</option>
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bf-field bf-field-full">
                <label className="bf-label" htmlFor="bf-message">
                  Details <span className="bf-req">*</span>
                </label>
                <textarea
                  id="bf-message"
                  name="message"
                  rows={5}
                  maxLength={4000}
                  className={`bf-input bf-textarea ${err.message ? "has-error" : ""}`}
                  placeholder="Date, venue, who else is playing, what you're offering."
                  defaultValue={prev.message}
                  aria-invalid={Boolean(err.message)}
                />
                {err.message && <span className="bf-error">{err.message}</span>}
              </div>
            </div>

            {state.status === "error" && state.message && (
              <p className="bf-form-error" role="alert">
                {state.message}
              </p>
            )}

            <div className="bf-actions">
              <SubmitButton />
              <p className="bf-fallback">
                Or email{" "}
                <a href="mailto:contact@rovstudios.com">contact@rovstudios.com</a>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  label,
  name,
  type = "text",
  required,
  optional,
  error,
  defaultValue,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div className="bf-field">
      <label className="bf-label" htmlFor={`bf-${name}`}>
        {label}{" "}
        {required && <span className="bf-req">*</span>}
        {optional && <span className="bf-opt">optional</span>}
      </label>
      <input
        id={`bf-${name}`}
        type={type}
        name={name}
        className={`bf-input ${error ? "has-error" : ""}`}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="bf-error">{error}</span>}
    </div>
  );
}
