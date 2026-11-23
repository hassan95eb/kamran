# Figma visual baseline

This directory records the approved starting point before the Vite application is migrated to Next.js. The screenshots are comparison artifacts, not the final SEO implementation.

## Capture matrix

Each viewport contains the same 12 routes: six English pages and their Persian equivalents.

| Viewport | Size | Folder |
| --- | ---: | --- |
| Desktop | 1440 × 1000 | `screenshots/desktop/` |
| Tablet | 768 × 1024 | `screenshots/tablet/` |
| Mobile | 390 × 844 | `screenshots/mobile/` |

Captured routes:

- `/` and `/fa`
- `/works` and `/fa/works`
- `/works/latent-for-her` and `/fa/works/latent-for-her`
- `/about` and `/fa/about`
- `/credits` and `/fa/credits`
- `/contact` and `/fa/contact`

Regenerate all screenshots while the local site is running at `http://127.0.0.1:4173`:

```sh
pnpm baseline:capture
```

The capture script also accepts a custom local URL through `KAMRAN_BASE_URL` and a custom Chrome path through `KAMRAN_CHROME_PATH`.

## Design tokens

The canonical values currently live in `src/index.css`. New UI must reuse these tokens unless the Figma design is explicitly revised.

### Colour

| Role | Token | Value |
| --- | --- | --- |
| Main background | `--color-ink` | `#101213` |
| Raised surface | `--color-graphite` | `#25292b` |
| Muted rule/text | `--color-steel` | `#4c5356` |
| Secondary text | `--color-mist` | `#c4cbcc` |
| Primary text | `--color-bone` | `#f0f2f1` |
| Signal/accent | `--color-signal` | `#ff0000` |

The visual language is near-monochrome. Red is a sparse signal colour for active states, markers and short rules; it should not become a broad decorative fill.

### Typography

| Role | Latin | Persian | Token |
| --- | --- | --- | --- |
| Display | Instrument Serif | Gulzar / Noto Naskh Arabic | `--font-display`, `--font-fa-display` |
| Interface/body | Instrument Sans | Noto Naskh Arabic | `--font-sans`, `--font-fa` |
| Metadata | JetBrains Mono | Noto Naskh Arabic fallback | `--font-mono` |

Language-specific rhythm is intentional:

- Display leading: English `0.9`, Persian `1.5`
- Body leading: English `1.6`, Persian `1.85`
- Metadata tracking: English `0.04em`, Persian `0`

### Motion

| Role | Token/value |
| --- | --- |
| Cinematic movement | `--motion-cinema: cubic-bezier(0.3, 0, 0.1, 1)` |
| Editorial reveal | `--motion-editorial: cubic-bezier(0.22, 1, 0.36, 1)` |
| Standard reveal | 900 ms rise and fade |
| Image treatment | slow scale/clip transitions, usually 700–1400 ms |

Every animation must have a usable `prefers-reduced-motion` state. Motion should feel patient and editorial, not springy or application-like.

### Layout breakpoints

- `1280px`: pointer/hover-enhanced cinematic interactions
- `1024px`: reduced chapter movement
- `768px`: primary desktop/mobile layout and navigation boundary
- `640px`: further reduced chapter movement for narrow screens
- Content width: `1400px` maximum on standard inner pages

## Reusable component inventory

| Component/pattern | Current source | Responsibility |
| --- | --- | --- |
| Global shell | `src/components/Layout.tsx` | Header, navigation, mobile menu, footer and language-aware document settings |
| Language switch | `src/i18n.tsx` | Preserves the current path while switching English/Persian |
| Project card | `src/components/ProjectCard.tsx` | Cover, project number, title, year, role and category treatment |
| Reveal | `src/components/Reveal.tsx` | One-time viewport fade/rise with reduced-motion support |
| Home title sequence | `src/pages/Home.tsx` | Bespoke cinematic opening, chapters and closing frame |
| Inner-page header | Page-local pattern | Eyebrow, red rule, display title and supporting copy |
| Hairline section | Global CSS utilities | Low-contrast editorial section boundaries |

Before adding a new section, prefer composing these patterns. If a new primitive is necessary, define its colours, typography, spacing, direction behaviour and motion once, then reuse it.

## Direction and language rules

- English is LTR at `/...`; Persian is RTL at `/fa/...`.
- The language switch must keep the user on the equivalent page.
- Latin titles, email addresses and timecodes inside Persian content use directional isolation.
- Persian display typography is not a mirrored copy of the English layout; its line height and composition are intentionally adapted.
- New components must be checked in both directions at all three baseline widths.

## Visual acceptance gate

A migrated or newly added section is acceptable when:

1. Its desktop, tablet and mobile captures match the established composition or an approved Figma revision.
2. Both languages preserve hierarchy, spacing and direction.
3. Colour and typography come from the documented tokens.
4. Focus, hover and reduced-motion states remain usable.
5. No element clips, overlaps or creates unintended horizontal scrolling.

## Known baseline limitations

- The About portrait currently loads from Unsplash rather than the repository. Offline or restricted capture environments show the graphite placeholder. This dependency should be replaced with an approved local asset during implementation.
- Screenshots capture the initial viewport after fonts and visible assets settle; they do not record scroll-driven animation states.
- The current Vite application still lacks per-page server-rendered SEO metadata. That is intentionally deferred to the Next.js migration phase.
