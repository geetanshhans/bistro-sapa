"use client";

import { useMemo, useState } from "react";
import type { BarInfo, DayHours } from "@/types/data";
import { useLocale } from "@/components/LocaleProvider";
import styles from "@/styles/Contact.module.css";

function fmt(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 && h < 24 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
}

export default function Contact({
  info,
  hours,
}: {
  info: BarInfo;
  hours: DayHours[];
}) {
  const { t, tr } = useLocale();
  const [form, setForm] = useState({ name: "", party: "2", date: "", note: "" });

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Reservation request — ${form.name || "(no name)"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nParty size: ${form.party}\nDate & time: ${form.date}\n\nNote: ${form.note}\n\n— sent from bistrosapa.com`
    );
    return `mailto:${info.email}?subject=${subject}&body=${body}`;
  }, [form, info.email]);

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">{t("contact.eyebrow")}</p>
          <hr className="divider" />
          <h2 id="contact-heading" className="section-heading">
            {t("contact.headingA")} <em>{t("contact.headingItalic")}</em>
          </h2>
          <p className="section-blurb">{t("contact.blurb")}</p>
        </div>

        <div className={styles.wrap}>
          <div>
            <ul className={styles.hoursList}>
              {hours.map((h) => (
                <li key={h.day} className={styles.hourRow}>
                  <span className={styles.day}>{tr(h.day, h.day_vi)}</span>
                  <span className={`${styles.hours} ${h.closed ? styles.closed : ""}`}>
                    {h.closed ? t("contact.closed") : `${fmt(h.open)} — ${fmt(h.close)}`}
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.detailsGrid}>
              <div className={styles.detail}>
                <div className={styles.label}>{t("contact.address")}</div>
                <div className={styles.value}>{info.address}</div>
                {info.mapsDirectionsUrl && (
                  <a
                    href={info.mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.inlineLink}
                  >
                    {t("contact.directions")} →
                  </a>
                )}
              </div>
              <div className={styles.detail}>
                <div className={styles.label}>{t("contact.reservations")}</div>
                <div className={styles.value}>
                  <a href={`tel:${info.phone.replace(/\s+/g, "")}`}>{info.phone}</a>
                  <br />
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                </div>
              </div>
            </div>

            <div className={styles.socials}>
              <a
                className={styles.socialBtn}
                href={info.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contact.instagram")}
              </a>
              <a
                className={styles.socialBtn}
                href={info.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contact.facebook")}
              </a>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.mapWrap}>
              <iframe
                title={`Map showing the location of ${info.name}`}
                src={info.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className={styles.mapFrame} aria-hidden="true" />
            </div>

            <form
              className={styles.reserveForm}
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailto;
              }}
            >
              <h3 className={styles.reserveTitle}>{t("reserve.title")}</h3>
              <div className={styles.reserveGrid}>
                <label className={styles.reserveField}>
                  <span>{t("reserve.name")}</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label className={styles.reserveField}>
                  <span>{t("reserve.party")}</span>
                  <input
                    required
                    type="number"
                    min={1}
                    max={20}
                    value={form.party}
                    onChange={(e) => setForm({ ...form, party: e.target.value })}
                  />
                </label>
                <label className={`${styles.reserveField} ${styles.reserveFieldFull}`}>
                  <span>{t("reserve.date")}</span>
                  <input
                    required
                    type="datetime-local"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </label>
                <label className={`${styles.reserveField} ${styles.reserveFieldFull}`}>
                  <span>{t("reserve.note")}</span>
                  <textarea
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                  />
                </label>
              </div>
              <button type="submit" className={styles.reserveBtn}>
                {t("reserve.send")}
              </button>
              <p className={styles.reserveHelper}>{t("reserve.note_helper")}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
