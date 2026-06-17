"use client";

import { useEffect, useState } from "react";
import type { BarInfo } from "@/types/data";
import { useLocale } from "@/components/LocaleProvider";
import styles from "@/styles/ActionBar.module.css";

export default function ActionBar({ info }: { info: BarInfo }) {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = () =>
      Math.max(window.innerHeight * 0.85, 480);
    const onScroll = () => setVisible(window.scrollY > threshold());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`${styles.bar} ${visible ? styles.barVisible : ""}`}
      aria-hidden={!visible}
    >
      <a href={`tel:${info.phone.replace(/\s+/g, "")}`} className={styles.btn}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>{t("actionBar.call")}</span>
      </a>
      {info.mapsDirectionsUrl && (
        <a
          href={info.mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btn}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{t("actionBar.directions")}</span>
        </a>
      )}
      <a href="#menu" className={styles.btn}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        <span>{t("actionBar.menu")}</span>
      </a>
    </div>
  );
}
