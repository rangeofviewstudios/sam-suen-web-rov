"use client";

import Image from "next/image";
import { useReveal } from "../hooks/useReveal";
import TextType from "./TextType";
import ScrollReveal from "./ScrollReveal";
import ShinyText from "./ShinyText";
import "./About.css";

const facts = [
  { label: "Origin",    value: "Philadelphia, PA" },
  { label: "Based",     value: "Atlanta, GA" },
  { label: "Debut",     value: "Age 19 · Opened for Ted Park" },
  { label: "Sound",     value: "Hip-hop · Emotional storytelling" },
];

export default function About() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r5 = useReveal();

  return (
    <section className="about" id="about">
      <div className="about-container">

        {/* Images */}
        <div className="about-image-col">
          <div ref={r1.ref} className={`about-image-shell reveal-up ${r1.isVisible ? "visible" : ""}`}>
            <div className="about-image-inner">
              <Image src="/images/samlake.webp" alt="Sam Suen by the lake framed by pines"
                width={480} height={640} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
          </div>
          <div ref={r2.ref} className={`about-image-accent reveal-up delay-3 ${r2.isVisible ? "visible" : ""}`}>
            <div className="about-image-shell small">
              <div className="about-image-inner">
                <Image src="/images/samlake2.webp" alt="Sam Suen by the lake"
                  width={260} height={340} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="about-text-col">
          <h2 ref={r3.ref} className={`about-headline reveal-up ${r3.isVisible ? "visible" : ""}`}>
            <TextType
              text={["Authenticity.", "Ambition.", "Resilience."]}
              as="span"
              typingSpeed={60}
              deletingSpeed={35}
              pauseDuration={2200}
              loop={true}
              showCursor={true}
              cursorCharacter="_"
              cursorClassName="about-headline-cursor"
              startOnVisible={true}
              className="about-headline-typer"
            />
          </h2>

          <ScrollReveal
            as="p"
            containerClassName="about-tagline"
            baseOpacity={0.05}
            enableBlur
            baseRotation={2}
            blurStrength={3}
            wordAnimationEnd="center center"
            rotationEnd="center center"
          >
            Korean Chinese hip-hop artist blending emotional storytelling with confident delivery.
          </ScrollReveal>

          <div ref={r5.ref} className={`about-facts reveal-up delay-2 ${r5.isVisible ? "visible" : ""}`}>
            {facts.map((f) => (
              <div key={f.label} className="about-fact">
                <ShinyText
                  text={f.label}
                  color="rgba(85,85,85,0.9)"
                  shineColor="rgba(160,160,160,0.95)"
                  speed={4}
                  spread={100}
                  className="fact-label"
                />
                <span className="fact-value">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
