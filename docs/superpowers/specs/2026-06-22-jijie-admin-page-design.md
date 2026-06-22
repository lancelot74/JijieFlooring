# Jijie Floor — Secret Admin Page (add / delete products)

**Date:** 2026-06-22
**Status:** Approved design, pending spec review

## Goal

Give a (likely non-technical) admin a private, password-gated page that can **add** and **delete**
catalogue products — including uploading the product photo — with changes going **live on the public
site on their own**, without help from a developer.

## Hard constraints (the site is purely static)

- No server, no build step. Deployed via GitHub (`lancelot74/JijieFlooring`) → Vercel (auto-redeploys on push).
- Therefore:
  - A client-side passphrase is **obscurity, not real security**. It hides the UI; it is not authentication.
  - Persistence must get changes **back into the git repo**. We do this from the browser via the GitHub API,
    using a token the admin pastes (stored only in their browser — never committed).

## Decisions (locked during brainstorming)

1. **Publish target:** live on the site directly, by committing to the GitHub repo from the admin page.
2. **Access model:** a passphrase unlocks the UI (kept secret), then the admin pastes a GitHub token once
   (remembered in `localStorage`) to publish.
3. **Obscure URL:** the page is `jiadminjie123.html` (not linked anywhere) for extra secrecy.
4. **Delete = hide-list**, not editing the auto-generated data files (see below).
5. **Optional 中文 name** field on add (site is bilingual).
6. **Scope: add + delete only.** No editing existing products, no reordering, no "featured" management.

## Architecture

### New / changed files

| File | Purpose |
|---|---|
| `jiadminjie123.html` | The admin page (unlisted). Passphrase gate → add/delete UI. |
| `assets/js/jiadminjie123.js` | All admin logic: passphrase, token, image resize, GitHub commits. |
| `assets/js/products-admin.js` | **New data file, hand-managed, never auto-generated.** Holds admin-added products + hidden-slug list. |
| `assets/css/styles.css` | Small additive block for admin-page styling (scoped, e.g. under `.admin` / `body.admin-page`). |
| `assets/js/catalogue.js` | **One-line change:** filter out hidden slugs. |
| `catalogue.html` | Add `<script src="assets/js/products-admin.js">` before `catalogue.js`. |

### Data file shape (`assets/js/products-admin.js`)

```js
// Hand-managed by the admin page (jiadminjie123.html). Not auto-generated — safe to edit/commit from the browser.
window.PRODUCTS = (window.PRODUCTS || []).concat([
  // admin-added products, same shape as products.js entries (+ optional size, name_zh)
]);
window.HIDDEN_PRODUCTS = (window.HIDDEN_PRODUCTS || []).concat([
  // slugs to hide from the catalogue (delete = append here)
]);
```

On first use this file may not exist yet → the admin page creates it.

### Product object (unchanged model, two optional adds)

```js
{ slug, name, code, collection, family, species, size?, name_zh? }
```

- `collection` ∈ `geometric | artistic | plank`
- Image paths the site expects (named by slug): `assets/img/grid/<slug>.jpg`, `assets/img/detail/<slug>.jpg`
- `name_zh` (optional): used by the catalogue in Chinese mode, falls back to `name` if blank.

### Catalogue load order (all catalogue-bearing pages)

`products.js → products-online.js → products-admin.js → catalogue.js`

### `catalogue.js` change

At the top, replace the source array with a hidden-filtered one:

```js
var HIDDEN = window.HIDDEN_PRODUCTS || [];
var P = (window.PRODUCTS || []).filter(function (p) { return HIDDEN.indexOf(p.slug) === -1; });
```

`name_zh` support in `nameOf(p)`: in zh mode, prefer `p.name_zh` when present
(only affects admin-added products; existing zh logic for generated products unchanged).

## Flows

### Unlock
1. Visit `jiadminjie123.html`. Only a passphrase prompt is shown.
2. Enter passphrase → compared against a stored hash (SHA-256, computed via `crypto.subtle`) → UI revealed.
   The plaintext passphrase is never in the code.
3. If a GitHub token is already in `localStorage`, go straight to the tools; otherwise prompt for it once.

### Add a product
1. Upload one photo. A `<canvas>` produces:
   - grid: 500×500, center-cropped, JPEG (~0.82 quality)
   - detail: longest side ≤ 1000, JPEG
2. Fill: name (req), collection (req, dropdown), family (dropdown of existing + free text), species
   (dropdown + free text, may be blank), size (optional), code (optional → auto), 中文 name (optional).
3. Slug auto-generated (`slugify(name)+'-'+code`), checked unique against all loaded products; refuse/auto-suffix on collision.
4. "Publish" → 3 GitHub commits (grid jpg, detail jpg, updated `products-admin.js` with the new entry appended).
5. Success message + link; Vercel redeploys (~1 min).

### Delete / restore a product
1. Tools show a searchable, thumbnail list of **all** loaded products (grid image + name + code + collection),
   with a Hidden indicator.
2. Delete → append slug to `HIDDEN_PRODUCTS`; if the product is admin-added, also remove it from the admin array.
   Restore → remove slug from `HIDDEN_PRODUCTS`.
3. "Publish" → 1 GitHub commit (updated `products-admin.js`).

## GitHub publish mechanism

- Endpoint: `https://api.github.com/repos/lancelot74/JijieFlooring/contents/<path>`
- Headers: `Authorization: Bearer <token>`, `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`
- Read current file (for SHA): `GET .../contents/<path>?ref=main` → `{ content (base64), sha }`. 404 ⇒ file is new.
- Write: `PUT .../contents/<path>` with body `{ message, content: <base64>, branch: "main", sha?: <if updating> }`.
- Images committed as base64 of the binary; text files as base64 of UTF-8.
- Multi-file add = sequential PUTs (images first, then `products-admin.js`). Atomicity not required — Vercel
  redeploys on the final push.
- Conflict handling: on `409`/stale SHA for `products-admin.js`, re-fetch SHA and retry once.
- Commit message style (terse): e.g. `Add product oak-versailles-77`, `Hide product q4NKZiA`.

## Security & setup notes (to document in-page)

- Passphrase = obscurity only (client-side hash). Keeps the page hidden from anyone who finds the URL.
- The GitHub token is the real credential. Recommend a **fine-grained PAT scoped to only `JijieFlooring`,
  permission Contents: Read & Write**. Stored only in the admin's browser `localStorage`; never committed.
- Anyone with the token (or repo write access) can publish — inherent to self-service. A leaked token is
  revocable in GitHub settings; blast radius is one repo.
- The page must never write the token or passphrase into any committed file.

## Edge cases

- `products-admin.js` doesn't exist yet → create it (PUT without `sha`).
- Slug collision → auto-suffix `-2`, `-3`… or reject with a message.
- Oversized image → warn if a generated JPEG exceeds a sane threshold (e.g. > 1.5 MB).
- Invalid/expired token → surface the GitHub error and a "re-enter token" affordance.
- Hidden product that's later un-hidden (restore) must reappear; count in catalogue reflects filtered total.

## Out of scope (v1)

- Editing existing products; reordering; managing the homepage "Featured" cards.
- Real authentication / server-side login.
- Bulk import (that's what the existing `tools/*.sh` scripts are for).
- Deleting the underlying image files on hide (orphaned images are harmless; can revisit later).

## Success criteria

1. Visiting `jiadminjie123.html` shows only a passphrase prompt; correct passphrase reveals the tools.
2. Adding a product with a photo results in a live catalogue entry (grid + lightbox image) after redeploy.
3. Deleting any product removes it from the live catalogue; restoring brings it back.
4. No token or passphrase plaintext is ever committed to the repo.
5. The auto-generator scripts (`build-images.sh`, `online-build-js.sh`) can be re-run without losing admin changes.
