"use client";

import Image from "next/image";
import styles from "@/styles/Hero.module.css";
import { useLocale } from "@/components/LocaleProvider";
import type { BarInfo } from "@/types/data";

export default function Hero({ info }: { info: BarInfo }) {
  const { t, tr } = useLocale();
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <Image
        src="/images/exterior-night.webp"
        alt="The bistro.sapa brick-and-timber exterior at night with a Live Jazz chalkboard out front"
        fill
        sizes="100vw"
        priority
        className={styles.heroImg}
      />
      <div className={styles.heroScrim} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <div>
          <p className={`eyebrow ${styles.eyebrowRow}`}>{t("hero.eyebrow")}</p>
          <h1 id="hero-title" className={styles.title}>
            bistro<span className={styles.dot}>.</span>
            <em>sapa</em>
          </h1>
          <p className={styles.tagline}>{tr(info.tagline, info.tagline_vi)}</p>
          <div className={styles.ctas}>
            <a className={styles.primary} href="#menu">
              {t("hero.exploreMenu")}
            </a>
            <a className={styles.secondary} href="#about">
              {t("hero.ourStory")}
            </a>
          </div>
        </div>

        <aside className={styles.meta}>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>{t("hero.today")}</div>
            <div className={styles.metaValue}>{t("hero.openHours")}</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>{t("hero.findUs")}</div>
            <div className={styles.metaValue}>7 Mường Hoa, Sa Pa</div>
          </div>
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>{t("hero.happyHour")}</div>
            <div className={styles.metaValue}>{t("hero.happyHourValue")}</div>
          </div>
        </aside>
      </div>

      <a className={styles.scrollHint} href="#menu" aria-label={t("hero.scrollHint")}>
        {t("hero.scrollHint")}
      </a>
    </section>
  );
}
