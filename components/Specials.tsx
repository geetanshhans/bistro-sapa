"use client";

import type { Special } from "@/types/data";
import { useLocale } from "@/components/LocaleProvider";
import styles from "@/styles/Specials.module.css";

export default function Specials({ specials }: { specials: Special[] }) {
  const { t, tr } = useLocale();
  const active = specials.filter((s) => s.active);
  if (active.length === 0) return null;

  return (
    <section id="specials" className={styles.section} aria-labelledby="specials-heading">
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">{t("specials.eyebrow")}</p>
          <hr className="divider" />
          <h2 id="specials-heading" className="section-heading">
            {t("specials.headingA")} <em>{t("specials.headingItalic")}</em>
          </h2>
          <p className="section-blurb">{t("specials.blurb")}</p>
        </div>

        <div className={styles.grid}>
          {active.map((s) => (
            <article
              key={s.id}
              className={`${styles.card} ${s.featured ? styles.cardFeatured : ""}`}
            >
              <span className={styles.corner} aria-hidden="true" />
              <span className={styles.badge}>{tr(s.badge, s.badge_vi)}</span>
              <h3 className={styles.title}>{tr(s.title, s.title_vi)}</h3>
              <p className={styles.desc}>{tr(s.description, s.description_vi)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
