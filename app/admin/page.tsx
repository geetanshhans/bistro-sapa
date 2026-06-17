"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  SiteData,
  MenuItem,
  MenuCategory,
  MenuCategoryId,
  Special,
  DayHours,
  Strength,
} from "@/types/data";
import styles from "@/styles/Admin.module.css";

type View = "menu" | "specials" | "info" | "hours";

const STORAGE_KEY = "bistro-sapa-admin-data";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className={styles.tooltip} tabIndex={0} aria-label={text}>
      ?<span className={styles.tooltipText}>{text}</span>
    </span>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [data, setData] = useState<SiteData | null>(null);
  const [view, setView] = useState<View>("menu");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2400);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (!authed) return;
    const cached = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (cached) {
      try {
        setData(JSON.parse(cached));
        return;
      } catch {
        /* fall through */
      }
    }
    fetch("/data.json")
      .then((r) => r.json())
      .then((d: SiteData) => setData(d))
      .catch(() => setToast("Could not load data.json"));
  }, [authed]);

  useEffect(() => {
    if (data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* ignore quota */
      }
    }
  }, [data]);

  function submitGate(e: React.FormEvent) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "bistro2025";
    if (pwd === expected) {
      setAuthed(true);
      setPwdError(false);
    } else {
      setPwdError(true);
    }
  }

  function exportJson() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("data.json downloaded — commit it to GitHub to publish");
  }

  function resetFromFile() {
    if (!confirm("Discard local edits and reload data.json from the site?")) return;
    localStorage.removeItem(STORAGE_KEY);
    fetch("/data.json")
      .then((r) => r.json())
      .then((d: SiteData) => {
        setData(d);
        setToast("Reloaded from data.json");
      });
  }

  if (!authed) {
    return (
      <div className={styles.page}>
        <div className={styles.gateWrap}>
          <form className={styles.gate} onSubmit={submitGate}>
            <h1>bistro.sapa</h1>
            <p>Admin · Enter password to continue</p>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            {pwdError && <p className={styles.gateError}>Incorrect password</p>}
            <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
              Sign in
            </button>
            <p className={styles.muted} style={{ marginTop: "1rem", fontSize: "0.78rem" }}>
              Lightweight gate — not a real auth system. See README to change the password.
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.gateWrap}>
          <p className={styles.muted}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <h1>bistro.sapa</h1>
          <div className={styles.sub}>Admin</div>
          <button
            className={`${styles.navBtn} ${view === "menu" ? styles.navBtnActive : ""}`}
            onClick={() => setView("menu")}
          >
            Menu
          </button>
          <button
            className={`${styles.navBtn} ${view === "specials" ? styles.navBtnActive : ""}`}
            onClick={() => setView("specials")}
          >
            Specials
          </button>
          <button
            className={`${styles.navBtn} ${view === "info" ? styles.navBtnActive : ""}`}
            onClick={() => setView("info")}
          >
            Bar Info
          </button>
          <button
            className={`${styles.navBtn} ${view === "hours" ? styles.navBtnActive : ""}`}
            onClick={() => setView("hours")}
          >
            Hours
          </button>
          <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              style={{ width: "100%", marginBottom: "0.5rem" }}
              onClick={exportJson}
            >
              ⬇ Export data.json
            </button>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              style={{ width: "100%" }}
              onClick={resetFromFile}
            >
              Reset to published
            </button>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.helper}>
            <strong>How publishing works:</strong> edits are saved in this browser only.
            When you're happy with changes, click <em>Export data.json</em>, then
            replace the file at <code>public/data.json</code> in your GitHub repo. Vercel
            will redeploy automatically.
            <Tooltip text="The site is statically built. Changes go live only after the new data.json is committed to your repo and Vercel rebuilds (usually under a minute)." />
          </div>

          {view === "menu" && (
            <MenuEditor data={data} setData={setData} setToast={setToast} />
          )}
          {view === "specials" && (
            <SpecialsEditor data={data} setData={setData} setToast={setToast} />
          )}
          {view === "info" && (
            <InfoEditor data={data} setData={setData} setToast={setToast} />
          )}
          {view === "hours" && (
            <HoursEditor data={data} setData={setData} setToast={setToast} />
          )}
        </main>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

/* ------------ Menu Editor ------------ */

function MenuEditor({
  data,
  setData,
  setToast,
}: {
  data: SiteData;
  setData: (d: SiteData) => void;
  setToast: (s: string) => void;
}) {
  const [activeCat, setActiveCat] = useState<MenuCategoryId>(data.menu[0]?.id ?? "cocktails");
  const category = useMemo(
    () => data.menu.find((c) => c.id === activeCat) ?? data.menu[0],
    [data.menu, activeCat]
  );

  function updateCategory(updater: (c: MenuCategory) => MenuCategory) {
    setData({
      ...data,
      menu: data.menu.map((c) => (c.id === activeCat ? updater(c) : c)),
    });
  }

  function addItem() {
    const item: MenuItem = {
      id: uid(),
      name: "New item",
      description: "Description",
      price: "0",
      available: true,
    };
    updateCategory((c) => ({ ...c, items: [...c.items, item] }));
    setToast("Item added");
  }

  function updateItem(id: string, patch: Partial<MenuItem>) {
    updateCategory((c) => ({
      ...c,
      items: c.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));
  }

  function removeItem(id: string) {
    if (!confirm("Delete this item?")) return;
    updateCategory((c) => ({ ...c, items: c.items.filter((i) => i.id !== id) }));
    setToast("Item deleted");
  }

  if (!category) return null;

  return (
    <>
      <div className={styles.toolbar}>
        <h2>Menu</h2>
        <div className={styles.toolbarActions}>
          <select
            className={styles.select}
            value={activeCat}
            onChange={(e) => setActiveCat(e.target.value as MenuCategoryId)}
          >
            {data.menu.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.items.length})
              </option>
            ))}
          </select>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={addItem}>
            + Add item
          </button>
        </div>
      </div>

      <div className={styles.layoutTwoCol}>
        <div>
          {category.items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              categoryId={activeCat}
              onChange={(patch) => updateItem(item.id, patch)}
              onDelete={() => removeItem(item.id)}
            />
          ))}
        </div>

        <div>
          <div className={styles.preview}>
            <h4>Live preview — {category.label}</h4>
            {category.items.filter((i) => i.available).map((item) => (
              <div className={styles.previewItem} key={item.id}>
                <div style={{ flex: 1 }}>
                  <div className={styles.previewName}>
                    {item.name}
                    {item.image && <span style={{ color: "#c9a84c", marginLeft: 6 }}>★</span>}
                  </div>
                  <div className={styles.previewDesc}>{item.description}</div>
                  {item.strength && (
                    <div style={{ marginTop: 8 }}>
                      {(["bitter", "sweet", "sour", "strong"] as const).map((k) => (
                        <span key={k} style={{
                          display: "inline-block", marginRight: 10, fontSize: 11,
                          color: "#a89f94", letterSpacing: "0.12em", textTransform: "uppercase",
                        }}>
                          {k} <span style={{ color: "#c9a84c" }}>{"●".repeat(item.strength![k])}</span>
                          <span style={{ opacity: 0.25 }}>{"●".repeat(3 - item.strength![k])}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.previewPrice}>
                  {/^[\d,]/.test(item.price.trim()) ? `₫${item.price}k` : item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------ Menu Item Card ------------ */

const STRENGTH_KEYS: (keyof Strength)[] = ["bitter", "sweet", "sour", "strong"];
const EMPTY_STRENGTH: Strength = { bitter: 0, sweet: 0, sour: 0, strong: 0 };

function MenuItemCard({
  item,
  categoryId,
  onChange,
  onDelete,
}: {
  item: MenuItem;
  categoryId: MenuCategoryId;
  onChange: (patch: Partial<MenuItem>) => void;
  onDelete: () => void;
}) {
  const isCocktail = categoryId === "cocktails";
  const isSpiritsWine = categoryId === "spirits-wine";
  const fileRef = useRef<HTMLInputElement | null>(null);

  function pickFile() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.2 * 1024 * 1024) {
      alert("Image is over 1.2MB — please use a smaller file, or commit it to /public/images/ and paste the path instead.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange({ image: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function setStrength(key: keyof Strength, value: number) {
    const current = item.strength ?? EMPTY_STRENGTH;
    onChange({ strength: { ...current, [key]: value } });
  }

  function clearStrength() {
    onChange({ strength: undefined });
  }

  return (
    <div className={styles.card}>
      <div className={styles.itemHead}>
        <span className={styles.itemTitle}>
          {item.name || "Untitled"}
          {item.image && <span style={{ color: "#c9a84c", marginLeft: 6 }} title="Has photo — shown as ★ on site">★</span>}
        </span>
        <button className={styles.btnDanger} onClick={onDelete} type="button">
          Delete
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Name</label>
          <input
            className={styles.input}
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Price</label>
          <input
            className={styles.input}
            value={item.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="e.g. 150 or 145 / 850"
          />
        </div>
      </div>

      <div className={styles.field} style={{ marginTop: "0.85rem" }}>
        <label>Description</label>
        <textarea
          className={styles.textarea}
          value={item.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      {isSpiritsWine && (
        <div className={styles.field} style={{ marginTop: "0.85rem" }}>
          <label>
            Sub-group
            <Tooltip text="Groups items under a small heading on the site (e.g. Whisky, Gin, Red Wine). Items with the same group appear together. Leave blank to skip." />
          </label>
          <input
            className={styles.input}
            value={item.group ?? ""}
            onChange={(e) => onChange({ group: e.target.value || undefined })}
            placeholder="e.g. Whisky, Gin, Red Wine"
          />
        </div>
      )}

      {/* Image */}
      <div style={{ marginTop: "1rem", padding: "0.85rem", background: "#faf7ef", borderRadius: 4 }}>
        <label style={{
          fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase",
          color: "#666", fontWeight: 500, display: "block", marginBottom: "0.5rem",
        }}>
          Photo
          <Tooltip text='Items with a photo show a thumbnail on the site and earn a "signature" ★ next to their name. Best workflow: drop the image file into /public/images/ in your GitHub repo, then paste its path here (e.g. /images/burger.webp). The file picker option converts to inline base64 — fine for previews, but it inflates data.json so avoid for many items.' />
        </label>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
          {item.image && (
            <img
              src={item.image}
              alt=""
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 3, border: "1px solid #ddd" }}
            />
          )}
          <div style={{ flex: 1 }}>
            <input
              className={styles.input}
              value={item.image ?? ""}
              onChange={(e) => onChange({ image: e.target.value || undefined })}
              placeholder="/images/burger.webp"
              style={{ marginBottom: "0.5rem" }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={pickFile}>
                Pick file
              </button>
              {item.image && (
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => onChange({ image: undefined })}
                >
                  Remove photo
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFile}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Strength (cocktails only) */}
      {isCocktail && (
        <div style={{ marginTop: "1rem", padding: "0.85rem", background: "#faf7ef", borderRadius: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <label style={{
              fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase",
              color: "#666", fontWeight: 500,
            }}>
              Strength profile
              <Tooltip text="Four indicators (0–3) for how Bitter, Sweet, Sour and Strong the cocktail tastes. Shown as little gold dots under the description on the site." />
            </label>
            {item.strength && (
              <button type="button" className={styles.btnDanger} onClick={clearStrength}>
                Clear
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem 1rem" }}>
            {STRENGTH_KEYS.map((k) => {
              const val = item.strength?.[k] ?? 0;
              return (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem" }}>
                  <span style={{
                    flex: "0 0 56px", textTransform: "capitalize",
                    color: "#444", letterSpacing: "0.04em",
                  }}>{k}</span>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    value={val}
                    onChange={(e) => setStrength(k, Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{
                    flex: "0 0 16px", textAlign: "right", color: "#c9a84c", fontWeight: 500,
                  }}>{val}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <label className={styles.checkRow} style={{ marginTop: "0.75rem" }}>
        <input
          type="checkbox"
          checked={item.available}
          onChange={(e) => onChange({ available: e.target.checked })}
        />
        Available on the menu
      </label>
    </div>
  );
}

/* ------------ Specials Editor ------------ */

function SpecialsEditor({
  data,
  setData,
  setToast,
}: {
  data: SiteData;
  setData: (d: SiteData) => void;
  setToast: (s: string) => void;
}) {
  function add() {
    const s: Special = {
      id: uid(),
      title: "New special",
      description: "Describe it.",
      badge: "Limited",
      active: true,
    };
    setData({ ...data, specials: [...data.specials, s] });
    setToast("Special added");
  }

  function update(id: string, patch: Partial<Special>) {
    setData({
      ...data,
      specials: data.specials.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  function remove(id: string) {
    if (!confirm("Delete this special?")) return;
    setData({ ...data, specials: data.specials.filter((s) => s.id !== id) });
    setToast("Special deleted");
  }

  return (
    <>
      <div className={styles.toolbar}>
        <h2>Specials & Events</h2>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={add}>
          + Add special
        </button>
      </div>

      {data.specials.map((s) => (
        <div className={styles.card} key={s.id}>
          <div className={styles.itemHead}>
            <span className={styles.itemTitle}>{s.title}</span>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {s.active ? (
                <span className={styles.tagBadge}>Live</span>
              ) : (
                <span className={styles.muted}>Hidden</span>
              )}
              <button className={styles.btnDanger} onClick={() => remove(s.id)}>
                Delete
              </button>
            </div>
          </div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Title</label>
              <input
                className={styles.input}
                value={s.title}
                onChange={(e) => update(s.id, { title: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>Badge label</label>
              <input
                className={styles.input}
                value={s.badge}
                onChange={(e) => update(s.id, { badge: e.target.value })}
                placeholder="e.g. Every Sunday"
              />
            </div>
          </div>
          <div className={styles.field} style={{ marginTop: "0.85rem" }}>
            <label>Description</label>
            <textarea
              className={styles.textarea}
              value={s.description}
              onChange={(e) => update(s.id, { description: e.target.value })}
            />
          </div>
          <label className={styles.checkRow} style={{ marginTop: "0.75rem" }}>
            <input
              type="checkbox"
              checked={s.active}
              onChange={(e) => update(s.id, { active: e.target.checked })}
            />
            Show on the website
          </label>
        </div>
      ))}
    </>
  );
}

/* ------------ Info Editor ------------ */

function InfoEditor({
  data,
  setData,
  setToast,
}: {
  data: SiteData;
  setData: (d: SiteData) => void;
  setToast: (s: string) => void;
}) {
  function update<K extends keyof SiteData["info"]>(key: K, value: SiteData["info"][K]) {
    setData({ ...data, info: { ...data.info, [key]: value } });
  }
  function updateSocial(key: "instagram" | "facebook", value: string) {
    setData({
      ...data,
      info: { ...data.info, social: { ...data.info.social, [key]: value } },
    });
  }

  return (
    <>
      <div className={styles.toolbar}>
        <h2>Bar Info</h2>
        <span className={styles.muted}>Auto-saves locally</span>
      </div>
      <div className={styles.card}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Bar name</label>
            <input
              className={styles.input}
              value={data.info.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Tagline</label>
            <input
              className={styles.input}
              value={data.info.tagline}
              onChange={(e) => update("tagline", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Phone</label>
            <input
              className={styles.input}
              value={data.info.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              className={styles.input}
              value={data.info.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Instagram URL</label>
            <input
              className={styles.input}
              value={data.info.social.instagram}
              onChange={(e) => updateSocial("instagram", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label>Facebook URL</label>
            <input
              className={styles.input}
              value={data.info.social.facebook}
              onChange={(e) => updateSocial("facebook", e.target.value)}
            />
          </div>
        </div>
        <div className={styles.field} style={{ marginTop: "0.85rem" }}>
          <label>Address</label>
          <textarea
            className={styles.textarea}
            value={data.info.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        <div className={styles.field} style={{ marginTop: "0.85rem" }}>
          <label>
            Google Maps embed URL
            <Tooltip text="In Google Maps, click Share → Embed a map → copy only the value inside src=&quot;...&quot;" />
          </label>
          <textarea
            className={styles.textarea}
            value={data.info.mapsEmbedUrl}
            onChange={(e) => update("mapsEmbedUrl", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

/* ------------ Hours Editor ------------ */

function HoursEditor({
  data,
  setData,
  setToast,
}: {
  data: SiteData;
  setData: (d: SiteData) => void;
  setToast: (s: string) => void;
}) {
  function update(day: string, patch: Partial<DayHours>) {
    setData({
      ...data,
      hours: data.hours.map((h) => (h.day === day ? { ...h, ...patch } : h)),
    });
  }

  return (
    <>
      <div className={styles.toolbar}>
        <h2>Opening Hours</h2>
      </div>
      <div className={styles.card}>
        {data.hours.map((h) => (
          <div
            key={h.day}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 1fr auto",
              gap: "0.85rem",
              alignItems: "center",
              padding: "0.75rem 0",
              borderBottom: "1px solid #f0ebe0",
            }}
          >
            <div style={{ fontWeight: 500 }}>{h.day}</div>
            <input
              className={styles.input}
              type="time"
              value={h.open}
              disabled={h.closed}
              onChange={(e) => update(h.day, { open: e.target.value })}
            />
            <input
              className={styles.input}
              type="time"
              value={h.close}
              disabled={h.closed}
              onChange={(e) => update(h.day, { close: e.target.value })}
            />
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={!!h.closed}
                onChange={(e) => update(h.day, { closed: e.target.checked })}
              />
              Closed
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
