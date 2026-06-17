"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/data";
import { useLocale } from "@/components/LocaleProvider";
import styles from "@/styles/Gallery.module.css";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const { t, tr } = useLocale();
  const [idx, setIdx] = useState<number | null>(null);
  const open = idx !== null;

  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(
    () => setIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, prev, next]);

  const current = idx !== null ? images[idx] : null;

  return (
    <section id="gallery" aria-labelledby="gallery-heading">
      <div className="container">
        <div className={styles.head}>
          <p className="eyebrow">{t("gallery.eyebrow")}</p>
          <hr className="divider" />
          <h2 id="gallery-heading" className="section-heading">
            {t("gallery.headingA")} <em>{t("gallery.headingItalic")}</em>
          </h2>
        </div>

        <div className={styles.grid}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={styles.tile}
              onClick={() => setIdx(i)}
              aria-label={`Open ${tr(img.caption, img.caption_vi)}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={900}
                height={1200}
                sizes="(min-width: 980px) 33vw, (min-width: 600px) 50vw, 100vw"
                className={styles.tileImg}
                style={{ height: "auto" }}
              />
              <span className={styles.caption}>{tr(img.caption, img.caption_vi)}</span>
            </button>
          ))}
        </div>
      </div>

      {open && current && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={tr(current.caption, current.caption_vi)}
          onClick={close}
        >
          <button
            type="button"
            className={styles.close}
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label={t("gallery.close")}
          >
            ✕
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label={t("gallery.prev")}
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label={t("gallery.next")}
          >
            ›
          </button>
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              width={1400}
              height={1000}
              className={styles.lightboxImg}
              style={{ width: "auto", height: "auto" }}
            />
            <p className={styles.lightboxCaption}>{tr(current.caption, current.caption_vi)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
