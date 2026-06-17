"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { MenuCategory, MenuItem, Strength } from "@/types/data";
import { useLocale } from "@/components/LocaleProvider";
import styles from "@/styles/Menu.module.css";

function formatPrice(price: string) {
  const trimmed = price.trim();
  if (/^[\d,]/.test(trimmed)) {
    return (
      <>
        <span className={styles.priceCurrency}>₫</span>
        {trimmed}
        <span className={styles.priceCurrency}>k</span>
      </>
    );
  }
  return trimmed;
}

const STRENGTH_KEYS: { key: keyof Strength; labelKey: "menu.strength.bitter" | "menu.strength.sweet" | "menu.strength.sour" | "menu.strength.strong" }[] = [
  { key: "bitter", labelKey: "menu.strength.bitter" },
  { key: "sweet", labelKey: "menu.strength.sweet" },
  { key: "sour", labelKey: "menu.strength.sour" },
  { key: "strong", labelKey: "menu.strength.strong" },
];

function StrengthBars({ strength }: { strength: Strength }) {
  const { t } = useLocale();
  return (
    <div className={styles.strength} role="list">
      {STRENGTH_KEYS.map(({ key, labelKey }) => (
        <div key={key} className={styles.strengthRow} role="listitem">
          <span className={styles.strengthLabel}>{t(labelKey)}</span>
          <div className={styles.strengthTrack} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`${styles.strengthDot} ${i < strength[key] ? styles.strengthDotOn : ""}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Menu({ categories }: { categories: MenuCategory[] }) {
  const { t, tr } = useLocale();
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const current = categories.find((c) => c.id === active) ?? categories[0];

  // Group items by `group` field, preserving order of first appearance
  const grouped = useMemo(() => {
    if (!current) return [];
    const groups: { name: string | null; items: MenuItem[] }[] = [];
    for (const item of current.items) {
      const groupName = item.group ?? null;
      const last = groups[groups.length - 1];
      if (last && last.name === groupName) {
        last.items.push(item);
      } else {
        groups.push({ name: groupName, items: [item] });
      }
    }
    return groups;
  }, [current]);

  return (
    <section id="menu" aria-labelledby="menu-heading">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">{t("menu.eyebrow")}</p>
            <hr className="divider" />
            <h2 id="menu-heading" className="section-heading">
              {t("menu.headingA")} <em>{t("menu.headingItalic")}</em>{t("menu.headingB")}
            </h2>
          </div>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Menu categories">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              aria-controls={`panel-${c.id}`}
              id={`tab-${c.id}`}
              className={`${styles.tab} ${active === c.id ? styles.tabActive : ""}`}
              onClick={() => setActive(c.id)}
            >
              {tr(c.label, c.label_vi)}
            </button>
          ))}
        </div>

        {current && (
          <div
            key={current.id}
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
          >
            <p className={styles.blurb}>{tr(current.blurb, current.blurb_vi)}</p>

            {grouped.map((group, gi) => (
              <div key={gi} className={styles.group}>
                {group.name && <h3 className={styles.groupHeading}>{group.name}</h3>}
                <div className={styles.panel}>
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className={`${styles.item} ${!item.available ? styles.unavailable : ""}`}
                    >
                      <div className={styles.itemMain}>
                        <div className={styles.itemRow}>
                          <h4 className={styles.itemName}>
                            {item.name}
                            {item.image && (
                              <span className={styles.signatureMark} title={t("menu.signature")}>★</span>
                            )}
                          </h4>
                          <span className={styles.dots} aria-hidden="true" />
                          <span className={styles.price}>{formatPrice(item.price)}</span>
                        </div>
                        <p className={styles.desc}>{item.description}</p>
                        {item.strength && <StrengthBars strength={item.strength} />}
                      </div>
                      {item.image && (
                        <button
                          type="button"
                          className={styles.itemThumb}
                          onClick={() => setLightbox({ src: item.image!, alt: item.name })}
                          aria-label={`View ${item.name}`}
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={160}
                            height={160}
                            sizes="160px"
                            className={styles.itemThumbImg}
                          />
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            ✕
          </button>
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={1200}
            height={1200}
            className={styles.lightboxImg}
            style={{ width: "auto", height: "auto" }}
          />
          <p className={styles.lightboxCaption}>{lightbox.alt}</p>
        </div>
      )}
    </section>
  );
}
