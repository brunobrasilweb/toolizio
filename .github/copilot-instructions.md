## Quick orientation

This is a Next.js 15 + TypeScript project (app router) that bundles 20+ small tools under `src/app/`. It uses TailwindCSS for styling and central UI primitives in `src/components/`. The repo expects a standard Next build pipeline and is deployed to platforms like Vercel or Netlify (see `netlify.toml`).

Keep the guidance below short and actionable — every instruction references concrete files or patterns found in the codebase.

## Key files and patterns (essential)

- App router (server components by default): `src/app/layout.tsx` — global metadata, fonts and theme bootstrapping live here.
- Tools are organized as feature folders under `src/app/<tool>/` (each usually contains `layout.tsx` and `page.tsx`). Treat each folder as a self-contained route.
- API routes (server functions): `src/app/api/**/route.ts`. Example: `src/app/api/instagram-proxy/route.ts` — uses Next's `NextResponse`/Response and streams upstream responses.
- Global CSS & Tailwind: `src/app/globals.css` and `tailwind.config.js` (content paths include `src/app`, `src/components`).
- Reusable components: `src/components/*` (e.g. `GoogleAnalytics.tsx`, `ThemeProvider.tsx`, `Header.tsx`, `ToolCard.tsx`). Client components use the `"use client"` directive.
- Hooks and small utilities: `src/hooks/useToolSearch.ts`, `src/lib/iconMap.tsx`, `src/utils/*`.
- TypeScript paths alias: `@/*` maps to `./src/*` (see `tsconfig.json`).
- Environment variable used by analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (see `README.md` and `src/components/GoogleAnalytics.tsx`). Note: `src/app/layout.tsx` also includes a hardcoded GA snippet — be careful when changing analytics setup.

## How to run, build and debug (concrete commands)

- Install: `npm install`
- Dev server (local): `npm run dev` — this runs `next dev --turbopack` (turbopack enabled). Use this for iterative development.
- Production build: `npm run build` (invokes `next build`). Netlify is configured to run the same command (`netlify.toml`).
- Start production server locally: `npm run start`
- Lint: `npm run lint`

Notes for debugging:
- The project uses the Next app router; server components are default. Components with client behavior must include `"use client"` at the top (see `src/components/GoogleAnalytics.tsx`).
- API routes live under `src/app/api`. They return `NextResponse`/node `Response` and often forward headers; check `instagram-proxy/route.ts` for a representative pattern.

## Project-specific conventions and gotchas

- One tool per folder: Feature pages follow the pattern `src/app/<tool>/page.tsx` and optionally `layout.tsx`. Add new tools by creating a folder with `page.tsx` and a `layout.tsx` if you need per-tool layout.
- Global fonts use `next/font/google` variables in `src/app/layout.tsx` (e.g., Geist fonts are attached as CSS variables `--font-geist-sans` / `--font-geist-mono`).
- Theme: `next-themes` is used via `src/components/ThemeProvider.tsx`. The layout also contains a small inline script to apply the preferred theme quickly — when editing theme logic, update both `ThemeProvider` and the layout snippet.
- Analytics: The repo expects `NEXT_PUBLIC_GA_MEASUREMENT_ID` for GA4, but a GA script is also inlined in `src/app/layout.tsx`. If you change analytics, update both `layout.tsx` and `src/components/GoogleAnalytics.tsx`.
- TypeScript: `strict: true` is enabled. Add types for new APIs and components; prefer small, explicit interfaces (see `src/hooks/useToolSearch.ts`).
- Tailwind: ensure new file paths are included if you add different locations (see `tailwind.config.js` content globs).
- Playwright is present in `package.json` (installed as a dependency). There are no test scripts in package.json by default — add a `test` or `e2e` script if you introduce automated tests.

## Integration points & external services

- Google Analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID` (env). Check `src/components/GoogleAnalytics.tsx` for the client-side pageview logic.
- Ads: `src/app/layout.tsx` includes an AdSense script tag — be mindful when changing `<head>` content.
- Upstream proxies: several API endpoints proxy third-party resources (see `src/app/api/*`). They validate `url` query/body and forward the response. Follow their error handling pattern (return JSON errors with status codes) for consistency.

## Small examples to copy/paste

- Create a simple API route that validates a `url` param and forwards the response (pattern): `src/app/api/<name>/route.ts` — see `instagram-proxy/route.ts`.
- Client component pattern with GA pageview: `src/components/GoogleAnalytics.tsx` (uses `usePathname` + `window.gtag` in an effect).

## New tool template — how to add a new tool (copyable)

When adding a new tool, follow these concrete steps and checks so the feature integrates smoothly with the site.

- Files to create
	- `src/app/[slug]/page.tsx` — required. English content, server-rendered where possible; mark client components with `'use client'` only when needed.
	- `src/app/[slug]/layout.tsx` — optional, only if the tool needs a per-tool wrapper.
	- Optional: `src/app/[slug]/head.tsx` for separate meta tags.

- Files to edit
	- Update the homepage tool list (e.g. `src/app/page.tsx` or the data source used to render `ToolCard`s) so the new tool appears as a card.
	- Add metadata to `data/categories/<category>.json` (or the repository's categories source) to include title, description, slug, thumbnail, and icon key.
	- Update `public/sitemap.xml` with a new `<url>` entry for `https://<YOUR_DOMAIN>/<slug>` (keep XML valid).

- Minimal contract (inputs / outputs / errors)
	- Inputs: file(s), text, or other user-provided values defined by the tool's UI.
	- Outputs: processed file for download, preview UI, or transformed text returned to the user.
	- Error modes: invalid file type, file too large, processing failure. Show friendly messages and never crash SSR.

- Implementation notes & constraints
	- Reuse components from `src/components` (Header, Footer, ToolCard, CategoryHeader, ToolIcons, GoogleAnalytics).
	- Use icons via `lib/iconMap.tsx` and `components/ToolIcons.tsx` for visual consistency.
	- Keep dependencies minimal; prefer browser-native APIs (Blob, FileReader, Canvas, Web APIs) where possible.
	- TypeScript: add explicit types for props and return values; avoid `any`.
	- Analytics: fire a specific GA event on the main CTA using the existing `GoogleAnalytics.tsx` helper (client-side only). Example event name: `tool_[slug]_used`.

- SEO & accessibility
	- Provide title, meta description, canonical URL and JSON-LD (structured data) — prefer server-rendered meta for SEO.
	- Use `next/image` for optimized images when appropriate.
	- Ensure key content (title, short description) is server-rendered for non-JS crawlers.
	- Add ARIA attributes and semantic HTML for accessibility.

- Sitemap quick update example
	- Add this node to `public/sitemap.xml`:
		<url>
			<loc>https://<YOUR_DOMAIN>/<slug></loc>
			<lastmod>YYYY-MM-DD</lastmod>
		</url>

- QA commands (PowerShell)
```powershell
npm install
npm run dev   # run dev server
npm run build # run production build (must succeed)
```
Manual smoke test: open `http://localhost:3000/<slug>`, verify rendering, click CTA to trigger analytics, ensure card appears on homepage and sitemap contains route.

- Branch/commit/PR conventions
	- Branch name: `feat/tool/<slug>`
	- Commit message: `feat: add <ToolName> page (/<slug>)`
	- PR description: summary, files changed, QA steps, and checklist below.

- PR checklist (copy into PR body)
	- [ ] Build passes: `npm run build`
	- [ ] Dev server runs: `npm run dev`
	- [ ] New tool appears on homepage or category listing
	- [ ] Sitemap updated (`public/sitemap.xml`)
	- [ ] Analytics event fired on CTA (client-side)


## When to ask the repo owner

- If you need to change global analytics or ad IDs (they appear in `layout.tsx` and the GA component).
- If you plan to add server-side cron jobs, third-party server credentials, or background workers — those are not currently in the repo; discuss preferred hosting/deployment.

## Final notes

Keep changes minimal in `src/app/layout.tsx` (it contains global metadata, fonts, ads and theme bootstrapping). When adding features, follow the folder-per-tool convention and prefer small, focused components in `src/components`. If you'd like, I can also add a lightweight CONTRIBUTING or developer-setup doc describing environment variable examples and a recommended test script.

---
If anything above is unclear or you want additional patterns included (e.g., example component skeleton, suggested test setup using Playwright), tell me which area to expand and I will iterate.
