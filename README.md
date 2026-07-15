# Candor Concrete — Website

Marketing site for **Candor Concrete Company LLC** (Greenville, SC). Built with
[Astro](https://astro.build), Tailwind CSS v4, and a git-based CMS, optimized for
local SEO.

## Tech stack

| Concern | Tool |
| --- | --- |
| Framework | Astro 5 (static output) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Fonts | Self-hosted via `@fontsource` (Anton, Work Sans, Kaushan Script) |
| Content editing | [Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin` |
| Google reviews | [Featurable](https://featurable.com) widget (daily auto-sync) |
| Lead form | [Formspree](https://formspree.io) → emails `Info@candorcrete.com` |
| Hosting | Vercel (static) |

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in ./dist
npm run preview    # preview the production build
```

## Editing content (no code)

Content lives in `src/content/` and is edited through the CMS at **`/admin`**:

- **Services** — `src/content/services/*.md`
- **Testimonials** — `src/content/testimonials/*.md`
- **Gallery** — `src/content/gallery/*.md` (images stored in `public/uploads/`)

Site-wide business info (phone, email, hours, service areas, integration IDs)
lives in `src/data/site.ts`.

## Configuration checklist (before launch)

Edit `src/data/site.ts`:

- [ ] `featurableWidgetId` — create a free widget at featurable.com, connect the
      Google Business Profile, paste the widget ID. Reviews then auto-sync daily.
- [ ] `formspreeId` — create a free Formspree form pointed at `Info@candorcrete.com`
      and paste its ID (the part after `/f/`).
- [ ] Confirm `hours` (business hours were not on the old site).

Other:

- [ ] Add the real logo to `/public` and swap the wordmark in
      `src/components/Logo.astro` for an `<img>`.
- [ ] Add a social share image at `public/og-default.jpg` (1200×630).
- [ ] Set the production domain in `astro.config.mjs` (`SITE_URL`) and
      `public/robots.txt` if different from `www.candorcrete.com`.

## CMS auth on Vercel (Sveltia + GitHub)

Vercel has no built-in identity, so the CMS uses GitHub OAuth:

1. Push this repo to GitHub.
2. Deploy the free [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth)
   OAuth relay to Cloudflare Workers.
3. Register a **GitHub OAuth App** with the callback URL from that relay.
4. In `public/admin/config.yml`, set `backend.repo` (`owner/repo`) and
   `backend.base_url` (the relay URL).

Editors then visit `/admin`, log in with a GitHub account that has write access,
and their edits commit to the repo — Vercel redeploys automatically (~1 min).

> Tip: to test the CMS locally without GitHub, uncomment `local_backend: true`
> in `config.yml` and run `npx @sveltia/cms proxy-server` alongside `npm run dev`.

## Deploying to Vercel

1. Import the GitHub repo in Vercel. Framework preset **Astro** is auto-detected
   (build: `astro build`, output: `dist`). No adapter needed for static output.
2. Deploy. Add the custom domain (`candorcrete.com`) in Vercel → Domains and
   update DNS.

## SEO notes

- `LocalBusiness` (GeneralContractor) JSON-LD is emitted site-wide; `Service` +
  `FAQPage` schema on service pages; local `Service` schema on service-area pages.
- Per-city service-area pages target local keywords (e.g. "concrete contractor
  Easley SC").
- `@astrojs/sitemap` generates `sitemap-index.xml`; `robots.txt` points to it and
  disallows `/admin`.
- Unique title/description/canonical/OG per page via `src/components/SEO.astro`.
