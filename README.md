# bistro.sapa — Bar & Eatery

The official website for **bistro.sapa**, a rustic neighbourhood bar and kitchen on Mường Hoa street in the heart of Sa Pa, Vietnam. Vietnamese craft beer, proper cocktails, Australian pastries, and live music — open all day.

Built as a production-quality, fully static Next.js site (App Router, TypeScript). Single-page marketing site plus a lightweight admin panel for the owner.

## Stack

- **Next.js 14** App Router, TypeScript, static export (`output: 'export'`)
- **CSS Modules** — bespoke styling, no utility frameworks
- **`next/font`** — Playfair Display (display) + DM Sans (UI)
- **`next/image`** — lazy-loaded images
- All content driven by `public/data.json`

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To produce the static export (output in `/out`):

```bash
npm run build
```

## Update content with the admin panel

1. Go to **`/admin`** on the site (e.g. <http://localhost:3000/admin>).
2. Enter the admin password. The default is `bistro2025`.
3. Edit menu items, specials, bar info, and hours. All edits are auto-saved to your browser's `localStorage` — they are not yet live.
4. Click **Export `data.json`**. A new `data.json` file will be downloaded.
5. Replace the file at `public/data.json` in your GitHub repo with the downloaded one and commit. Vercel will auto-deploy within ~60 seconds.

The admin password is intentionally lightweight (a client-side env check). It exists to keep casual eyes away — not as real auth. The admin route is also excluded via `robots.txt`.

### Change the admin password

Create a `.env.local` file at the project root:

```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your-new-password-here
```

Then re-run `npm run dev` (or redeploy on Vercel — add the same env var in **Project Settings → Environment Variables**).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repo.
3. Framework preset will auto-detect as **Next.js**. Leave defaults; build command is `next build` and output is `out/`.
4. Add `NEXT_PUBLIC_ADMIN_PASSWORD` under **Environment Variables** (otherwise the default `bistro2025` is used).
5. Click **Deploy**. Every push to `main` will redeploy automatically.

The Hobby (free) tier is plenty for a static site at this scale.

## Project structure

```
.
├── app/
│   ├── layout.tsx        — fonts, metadata, JSON-LD
│   ├── page.tsx          — single-page bar site
│   ├── admin/page.tsx    — owner content editor
│   └── globals.css
├── components/           — Nav, Hero, Menu, Specials, About, Gallery, Contact, Footer
├── styles/               — CSS Modules
├── public/
│   ├── data.json         — single source of truth for site content
│   ├── robots.txt
│   └── sitemap.xml
├── types/data.ts         — TypeScript interfaces for data.json
├── next.config.mjs       — static export config (Next 14 doesn't yet support .ts config)
└── README.md
```

## SEO

- Semantic HTML, single `<h1>`, logical heading hierarchy.
- Full Open Graph + Twitter metadata in `app/layout.tsx`.
- Schema.org `BarOrPub` JSON-LD with address, opening hours, phone, menu.
- `public/robots.txt` and `public/sitemap.xml` ready to ship — edit the URL to your real domain before launch.

## Notes

- Update `metadataBase` and the URLs in `robots.txt` / `sitemap.xml` once you've decided on your domain.
- Gallery uses Unsplash placeholders — swap for the bar's own photography before launch.
- The Google Maps embed URL in `data.json` is a placeholder. Get a real one by going to Google Maps → Share → Embed a map → copy the URL from the `src="..."` attribute.
