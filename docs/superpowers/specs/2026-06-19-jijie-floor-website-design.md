# Jijie Floor — Website Design Spec

**Date:** 2026-06-19
**Status:** Approved design, pending spec review

## 1. Overview

A multi-page catalogue/marketing website for **Jijie Floor**, a China-based sourcing
company selling engineered multilayer solid-wood **parquet flooring**. The site
showcases a diverse range of decorative patterns to international buyers and converts
them into direct inquiries via WeChat and Instagram. English only. No e-commerce, no
prices, no inquiry form.

## 2. Audience & Goal

- **Audience:** both volume buyers (importers, distributors, contractors) and the
  design trade (architects, interior designers) — served equally, catalogue-forward.
- **Primary conversion goal:** get a qualified buyer to message the company on
  **WeChat (`13819223555`)** or **Instagram (`@chinajijiefloor`)** with a pattern/species
  in mind.
- **Secondary goal:** establish credibility as a serious export-capable supplier.

## 3. Brand & Art Direction (locked)

**Direction:** Warm Minimal with editorial bones — calm, airy, gallery-like, but
disciplined enough to not read generic.

- **Palette:** warm cream/oat paper (`#F2ECE2`), espresso ink (`#2A2620`), soft muted
  text (`~#6A6458`), single **clay/terracotta accent** (`#AE6A4A`) used sparingly. The
  wood photography supplies the real color.
- **Type:** **Fraunces** (light, high-contrast serif) for display headlines, including
  occasional italic emphasis; **Hanken Grotesk** (300–600) for all body, labels, UI.
- **Signature device:** hairline rules + small two-digit **section indices**
  (`01 — Collections`, `02 — …`) and uppercase letter-spaced labels. Treats the
  catalogue like a specimen library.
- **Brand name:** "Jijie Floor" (derived from IG handle `chinajijiefloor`). Wordmark set
  in Fraunces. Replaceable if the client supplies an official logo.
- **Motion:** restrained — gentle fades / hover lifts only. No gimmick micro-interactions.

## 4. Sitemap

| Page | Path | Purpose |
|------|------|---------|
| Home | `index.html` | Hero + overview + funnel to catalogue and inquiry |
| Collections | `collections.html` | The two product lines, side by side |
| Catalogue | `catalogue.html` | All 43 patterns, filterable grid + lightbox detail |
| About / Capabilities | `about.html` | Company story + sourcing/export capabilities (placeholder copy) |
| Contact | `contact.html` | WeChat (number + QR), Instagram, direct inquiry guidance |

Shared header (wordmark + nav: Collections · Catalogue · About · Contact) and footer on
every page.

### Home sections
1. **Hero** — full-bleed immersive styled floor photo; wordmark + nav float on top;
   headline low-left ("Floors with a quiet pedigree."); clay CTA → Catalogue.
2. `02` **Collections** — two large tiles: *Classic Geometric Parquet* / *Artistic
   Shaped Inlay (异型拼花)*.
3. `03` **Featured patterns** — 4–8 hand-picked tiles → "Browse all 43".
4. `04` **By species** — filter chips: Oak · Teak · Black Walnut · Ash · Wenge ·
   Rosewood · Birch (each links into Catalogue pre-filtered).
5. `05` **Why source from Jijie** — capability cards: OEM/ODM, export-ready, multilayer
   build, samples & MOQ (placeholder copy).
6. `06` **Inquiry** — "Tell us your project" + WeChat number/QR + Instagram.
7. **Footer** — espresso block, wordmark, nav, handle.

## 5. Technical Architecture

**Plain static site — no build step, no npm.** Hostable by opening files directly or on
any static host (Netlify, GitHub Pages, Vercel).

```
flooring-site/
├── index.html
├── collections.html
├── catalogue.html
├── about.html
├── contact.html
├── assets/
│   ├── css/styles.css          # single shared stylesheet, CSS custom properties for tokens
│   ├── js/products.js          # const PRODUCTS = [...]  (data, loaded via <script src>)
│   ├── js/catalogue.js         # render grid + filter + lightbox
│   ├── img/grid/<slug>.jpg      # ~600px web-optimized thumbnails
│   ├── img/detail/<slug>.jpg    # ~1200px web-optimized detail images
│   └── img/qr-wechat.png        # placeholder until client supplies real QR
├── _source_images/             # untouched originals (gitignored from web deploy)
└── docs/…
```

- **Why `products.js` (a JS file) not `products.json`:** a `<script src>` works on the
  `file://` protocol, whereas `fetch('products.json')` is blocked by CORS when the page
  is opened directly. This keeps "double-click index.html" working.
- **Catalogue rendering:** `catalogue.js` reads `PRODUCTS`, renders the grid, wires up
  filter chips (Collection / Family / Species — combinable) and the lightbox. Filters
  reflect in the URL hash (e.g. `catalogue.html#species=oak`) so the homepage species
  chips can deep-link.
- **No framework, no dependencies.** Vanilla JS only.

## 6. Catalogue Data Model

Each product object:

```js
{
  slug: "oak-versailles-5106",
  name: "Oak · Versailles",          // display
  code: "5106",                       // original catalogue number
  collection: "geometric",            // "geometric" | "artistic"
  family: "Versailles",               // pattern family
  species: "Oak",                     // wood species
  grid: "assets/img/grid/oak-versailles-5106.jpg",
  detail: "assets/img/detail/oak-versailles-5106.jpg"
}
```

**Facets**
- **Collections:** Classic Geometric Parquet (`geometric`), Artistic Shaped Inlay (`artistic`).
- **Families:** Versailles, Princess Anne, Octagon Star, Diamond, Checkerboard, Lotus,
  Leaf, Chinese Knot, Pentagon, Floral.
- **Species:** Oak, Teak, Black Walnut, Ash, Wenge, Rosewood, Birch.

**Filename → product translation (43 items)**

*Collection: Classic Geometric Parquet (多层实木拼花地板, 27)*

| File | Species | Family | Code |
|------|---------|--------|------|
| 大叶花梨16凡尔赛 | Rosewood | Versailles | 16 |
| 柚木15凡尔赛 | Teak | Versailles | 15 |
| 柚木25 安妮公主 | Teak | Princess Anne | 25 |
| 柚木66八角星 | Teak | Octagon Star | 66 |
| 柚木977钻石 | Teak | Diamond | 977 |
| 棋盘格2 | Oak* | Checkerboard | 2 |
| 棋盘格3 | Oak* | Checkerboard | 3 |
| 棋盘格6 | Oak* | Checkerboard | 6 |
| 棋盘格7 | Oak* | Checkerboard | 7 |
| 棋盘格9 | Oak* | Checkerboard | 9 |
| 橡木10凡尔赛 (1) | Oak | Versailles | 10 |
| 橡木11凡尔赛 (2) | Oak | Versailles | 11 |
| 橡木21安妮公主 | Oak | Princess Anne | 21 |
| 橡木5106凡尔赛 | Oak | Versailles | 5106 |
| 橡木61钻石 | Oak | Diamond | 61 |
| 橡木62钻石 | Oak | Diamond | 62 |
| 橡木975八角星 | Oak | Octagon Star | 975 |
| 橡木976八角星 | Oak | Octagon Star | 976 |
| 橡木977八角星 | Oak | Octagon Star | 977 |
| 橡木棋盘01 | Oak | Checkerboard | 01 |
| 白蜡木18凡尔赛 | Ash | Versailles | 18 |
| 鸡翅木20凡尔赛 | Wenge | Versailles | 20 |
| 黑胡桃12凡尔赛 | Black Walnut | Versailles | 12 |
| 黑胡桃22安妮公主 | Black Walnut | Princess Anne | 22 |
| 黑胡桃23安妮公主 | Black Walnut | Princess Anne | 23 |
| 黑胡桃978八角星 | Black Walnut | Octagon Star | 978 |
| 黑胡桃989钻石 | Black Walnut | Diamond | 989 |

*`棋盘格2/3/6/7/9` filenames omit species; tentatively tagged **Oak** — **confirm with client.**

*Collection: Artistic Shaped Inlay (异型拼花, 16)*

| File | Species | Family | Code |
|------|---------|--------|------|
| 30橡木橡木树叶 | Oak | Leaf | 30 |
| 60橡木花样 | Oak | Floral | 60 |
| 61黑胡桃花样 | Black Walnut | Floral | 61 |
| 62柚木花样 | Teak | Floral | 62 |
| 63桦木花样 | Birch | Floral | 63 |
| 708橡木小树叶 | Oak | Leaf | 708 |
| 716橡木五边形 | Oak | Pentagon | 716 |
| 71橡木荷花 (2) | Oak | Lotus | 71 |
| 720橡木中国结 | Oak | Chinese Knot | 720 |
| 75橡木树叶 | Oak | Leaf | 75 |
| 81黑胡桃荷花 | Black Walnut | Lotus | 81 |
| 82黑胡桃中国结 | Black Walnut | Chinese Knot | 82 |
| 87黑胡桃树叶 | Black Walnut | Leaf | 87 |
| 91柚木荷花 | Teak | Lotus | 91 |
| 92柚木中国结 | Teak | Chinese Knot | 92 |
| 95柚木树叶 | Teak | Leaf | 95 |

## 7. Image Pipeline

- Source: 43 JPEGs, 800×800, ~33 MB total, in `_source_images/`.
- Process with **ImageMagick** (`convert`): generate `detail/` (~1200px long edge — note
  originals are 800px, so detail = 800px max, no upscaling) and `grid/` (~600px),
  quality ~82, strip metadata. Expected total well under ~1 MB.
- Originals are left untouched; only generated derivatives ship in `assets/img/`.
- Lazy-load grid images (`loading="lazy"`).

## 8. Inquiry / Contact

No form. Conversion is direct messaging:
- **WeChat:** ID/phone `13819223555` + a scannable QR (placeholder QR until client sends real one).
- **Instagram:** `@chinajijiefloor` (link to `https://instagram.com/chinajijiefloor`).
- Inquiry CTAs appear in: homepage `06`, the lightbox detail ("Inquire about this pattern"),
  the footer, and the Contact page.

## 9. Placeholder Content (client to supply)

Clearly marked with a comment convention so it's easy to find later:
- Company blurb / story (About)
- Real capabilities: OEM/ODM details, MOQ, lead times, certifications, factory facts
- Year established, city/region
- Real WeChat QR image, optional official logo
- Optional: hero room photo selection preference

## 10. Out of Scope (v1)

- Prices / e-commerce / cart
- Inquiry form, CRM, analytics
- CMS / admin
- Bilingual content (English only)
- Project gallery, FAQ, downloadable PDF (declined for v1; easy to add later)

## 11. Success Criteria

1. All 5 pages render correctly opened directly (`file://`) and when served.
2. Catalogue shows all 43 patterns; Collection/Family/Species filters combine correctly;
   lightbox opens with correct image + metadata + inquiry CTAs.
3. Homepage species chips deep-link into the pre-filtered catalogue.
4. Total optimized image payload < ~1.5 MB; pages responsive on mobile and desktop.
5. WeChat/Instagram contact points present and correct on every relevant surface.
6. Art direction matches the locked Warm Minimal / editorial direction.
7. All placeholder content is clearly marked.
