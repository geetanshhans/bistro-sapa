"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { LOCALES } from "@/lib/i18n";
import type { Locale } from "@/types/data";
import styles from "@/styles/Nav.module.css";

const LINKS: { href: string; id: string; key: "nav.menu" | "nav.specials" | "nav.story" | "nav.gallery" | "nav.visit" }[] = [
  { href: "#menu", id: "menu", key: "nav.menu" },
  { href: "#specials", id: "specials", key: "nav.specials" },
  { href: "#about", id: "about", key: "nav.story" },
  { href: "#gallery", id: "gallery", key: "nav.gallery" },
  { href: "#contact", id: "contact", key: "nav.visit" },
];

export default function Nav({ barName }: { barName: string }) {
  const { t, locale, setLocale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          <a href="#top" className={styles.brand} aria-label={barName}>
            <span className={styles.brandMark} />
            {barName}
          </a>
          <nav aria-label="Primary">
            <ul className={styles.links}>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={active === l.id ? styles.linkActive : ""}
                  >
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.right}>
            <div className={styles.langSwitch} role="group" aria-label="Language">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`${styles.langBtn} ${locale === l.code ? styles.langBtnActive : ""}`}
                  onClick={() => setLocale(l.code as Locale)}
                  aria-pressed={locale === l.code}
                  aria-label={l.label}
                >
                  {l.short}
                </button>
              ))}
            </div>
            <a href="#contact" className={styles.reserve}>
              {t("nav.reserve")}
            </a>
          </div>

          <button
            type="button"
            aria-label={t("nav.toggleMenu")}
            aria-expanded={open}
            className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
        aria-hidden={!open}
      >
        <ul className={styles.mobileLinks}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {t(l.key)}
              </a>
            </li>
          ))}
          <li>
            <a href="#contact" onClick={() => setOpen(false)}>
              {t("nav.reserve")}
            </a>
          </li>
        </ul>
        <div className={styles.mobileLang}>
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`${styles.langBtn} ${locale === l.code ? styles.langBtnActive : ""}`}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
