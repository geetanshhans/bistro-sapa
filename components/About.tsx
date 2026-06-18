"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { AboutBlock } from "@/types/data";
import { useLocale } from "@/components/LocaleProvider";
import styles from "@/styles/About.module.css";

export default function About({ about }: { about: AboutBlock }) {
  const { t, tr } = useLocale();
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    // Safety: if anything goes wrong with the observer, show content after a beat.
    const fallback = window.setTimeout(() => setVisible(true), 600);
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return () => window.clearTimeout(fallback);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            window.clearTimeout(fallback);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const body = tr(about.body, about.body_vi);

  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="container">
        <div ref={ref} className={styles.wrap}>
          <div className={`${styles.content} ${visible ? styles.visible : ""}`}>
            <p className="eyebrow">{tr(about.eyebrow, about.eyebrow_vi)}</p>
            <hr className="divider" />
            <h2 id="about-heading" className="section-heading">
              {tr(about.heading, about.heading_vi)}
            </h2>
            <div className={styles.body}>
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {about.facts && about.facts.length > 0 && (
              <ul className={styles.facts}>
                {about.facts.map((f) => (
                  <li key={f.label} className={styles.fact}>
                    <span className={styles.factLabel}>{tr(f.label, f.label_vi)}</span>
                    <span className={styles.factValue}>{tr(f.value, f.value_vi)}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className={styles.signature}>{t("about.signature")}</p>
          </div>

          <div className={`${styles.imageWrap} ${visible ? styles.visible : ""}`}>
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              sizes="(min-width: 920px) 50vw, 100vw"
              className={styles.img}
            />
            <div className={styles.imageFrame} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
