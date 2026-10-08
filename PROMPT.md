# ZENPAAW MASTER BUILD PROMPT

Paste this whole file into Antigravity as the task. Keep it in the repo root as `PROMPT.md` so the agent can re-read it between phases.

---

## 0. Role and operating rules

You are a principal full-stack engineer, a dropshipping operator, and a motion designer in one. You are taking over an existing Next.js project (`zenpaaw-store`) that was generated quickly and has serious problems. Your job is to audit it, fix everything listed below, and deliver a complete, working pet-toy dropshipping marketplace that a real customer can browse, buy from, and receive an order from.

How you work:

1. **Plan first, code second.** Produce a written plan (as an artifact) covering the phases in section 16. Then execute phase by phase.
2. **After every phase** run `npm run typecheck`, `npm run lint`, `npm run build`, and the audit scripts defined in section 15. Fix failures before moving on. Commit once per phase with a plain commit message (no emoji).
3. **This repo uses a newer Next.js than your training data.** `AGENTS.md` says so. Before writing any code, read the docs in `node_modules/next/dist/docs/` (caching, `proxy`/`middleware` naming, `next/image`, fonts, metadata, view transitions). When the bundled docs disagree with your memory, the docs win. Do the same for Tailwind 4, React 19.3, and the `motion` library.
4. **No fake functionality.** Nothing may look like it works when it does not. If an integration needs credentials you do not have, build it fully behind an environment flag with a clearly labelled test mode, and list the missing keys in `docs/SETUP.md`.
5. **Never invent facts.** No made-up prices, specs, certifications, review counts, ratings, stock numbers, or testimonials. Section 5 explains what to do instead.
6. **Do not stop to ask questions** unless you are completely blocked. Make the decision, record it in `docs/DECISIONS.md` with one line of reasoning, and continue.
7. **Finish with** `docs/AUDIT_REPORT.md`: every finding in section 3, what you changed, and the proof (test name, script output, or screenshot path).

---

## 1. Mission and definition of done

Build ZenPaaw into a functional dropshipping store for pet toys with:

- A real catalog of at least 60 distinct toys across dogs, puppies, and cats, each with its own photos (section 8).
- A marketplace-grade shopping experience: mega-menu, faceted filters, instant search, category and collection pages, variant-aware product pages, wishlist, recently viewed, bundles (section 9).
- A layout that switches automatically between mobile, tablet, and desktop patterns (section 10).
- A text-reveal transition on every page, smooth page transitions, and a complete set of micro-interactions (section 11).
- A working cart and add-to-cart flow, with a real payment flow, server-verified totals, and order emails (section 14).
- An admin area that runs the dropshipping operation: fulfilment queue, supplier fields, tracking, CSV import and export, margin controls (section 13).
- The correct ZenPaaw logo everywhere, built from the supplied artwork (section 4).
- Professional, plain, honest copy (section 5).

The project is done only when every box in section 17 is ticked and demonstrated.

---

## 2. Inputs

- **Brand folder.** The owner created a folder of logo assets. Search the workspace for `ZenPaaw_Logo*`, `brand/`, and `assets/`. The primary reference is `ZenPaaw_Logo_colored.png` (5435 x 4480, RGBA, teal background baked in). If SVG or other variants exist, prefer them. Do not redraw the logo from the text description below. The description exists so you can check your result, not so you can recreate it.
- **Layout reference.** The owner supplied a screenshot of a dog-training site ("3 Pups Dog Training"). Use it only for composition and rhythm (section 12). Do not copy its text, images, icons, or brand.
- **Existing repo.** Next 16.4.0, React 19.3.0, Tailwind 4, lucide-react. All dependencies resolve on npm.

---

## 3. Confirmed audit findings (fix every one)

These were verified by reading the code. File paths are relative to the repo root.

### Critical: money and security

| ID | Finding | Required fix |
|---|---|---|
| C1 | `src/app/api/checkout/route.ts` sets `isPaymentAuthorized = Boolean(paymentToken \|\| true)`. Payment is always approved and orders are saved as "Paid" with no charge. | Real payment provider flow. Orders start as `pending_payment` and become `paid` only from a verified provider webhook. |
| C2 | Same file trusts client-sent `items[].price` and `discount`. The free-shipping threshold (35) is hard-coded here and in `CartContext.tsx`, and ignores the FREESHIP coupon. | Server recomputes everything from the database: variant price, coupon, shipping, tax. Thresholds live in one config. |
| C3 | `src/app/checkout/page.tsx` collects raw card number, expiry, and CVC in its own inputs and shows "Stripe Protected" and "256-bit encryption". Both claims are false, and handling raw card data is a PCI problem. | Delete the card inputs. Use the provider's hosted checkout or embedded payment element. Remove false security claims. |
| C4 | `src/app/api/admin/login/route.ts` has credentials in source, accepts `admin` / `admin`, and returns a timestamp string as a "token" that nothing verifies. The admin page stores it in `localStorage`. | Hashed password from env, signed `httpOnly` `Secure` `SameSite=Lax` session cookie (use `jose`), login rate limit, logout, optional TOTP. |
| C5 | No authentication on `GET /api/orders` (public list of every customer's name, phone, email, and address), `GET /api/orders/[id]`, `POST` and `PATCH /api/products`, `/api/content`, and the coupon list. | Every admin route verifies the session. Public order lookup requires order number plus email, or a signed token. Add tests that prove anonymous requests get 401. |
| C6 | `src/lib/db.ts` keeps data in module-level arrays. Everything is lost on restart or serverless cold start. It also seeds fake orders (`ZP-10829`, `ZP-10830`) and fake reviews as if they were real. | Postgres with migrations. Delete the in-memory store and all seeded customers, orders, and reviews. |
| C7 | Order IDs are `Math.random()` five-digit numbers. They collide. | Sequential order numbers from the database (`ZP-100001` onward), unique constraint. |
| C8 | The storefront never reads the database. Home, shop, product, header search, cart drawer, and sitemap import `initialProducts` directly, so admin edits never reach customers. The product page falls back to `initialProducts[0]` for unknown slugs. | All storefront data comes from the database through server code. Unknown slug returns a real 404. |
| C9 | The cart stores whole `Product` objects in `localStorage`, so prices go stale. There are no variants and items are keyed by product ID only. | Cart stores `{variantId, qty}` only. Prices and availability are re-fetched and re-validated on every load and at checkout. |

### Catalog

| ID | Finding | Required fix |
|---|---|---|
| K1 | Five products and four image files for the whole store. `toy-isolated.jpg` is referenced 11 times, `hero-dog.jpg` 9, `packaging-box.jpg` 5, `packaging-concepts.png` 3. Four different "products" show the same photo. | 60+ products, each with its own images (section 8). A script fails the build if two products share an image. |
| K2 | `toy-isolated.jpg` shows another company's name embossed on the green roller ("DURAPET"). It cannot be sold under the ZenPaaw name. `packaging-box.jpg` shows a different toy (teal disc) than `toy-isolated.jpg` (blue ball, green roller, rope) and has garbled printed text. `packaging-concepts.png` is a concept sheet and is used as the `logo` in the site's JSON-LD. | Remove all three from product galleries. Fix the JSON-LD logo. |
| K3 | `src/types/index.ts` treats "Best Sellers" as a product category. It is a collection. "Cat Toys" exists as a type but no cat product exists, while copy says toys suit "curious cats". | Proper taxonomy (section 8): pet type, category, collections, play style. |
| K4 | No variants, no SKU, no supplier fields, no pet-type facet. | Full schema in section 7. |

### Brand

| ID | Finding | Required fix |
|---|---|---|
| B1 | `src/components/ZenPaawLogo.tsx` draws an invented mark: four circles in an arc above a hand-built Z with a small ellipse. | Replace with the real mark built from the supplied artwork (section 4). |
| B2 | The wordmark is rendered two-tone ("Zen" in one colour, "Paaw" in another). The real wordmark is one solid colour. The tagline is written "Happy Pets. Happier Lives." The real one uses a comma. | Match the artwork exactly. |
| B3 | Favicon is the default. No `apple-icon`, web manifest, or Open Graph image. | Generate the full icon set (section 4). |

### Copy and claims

| ID | Finding | Required fix |
|---|---|---|
| P1 | Filler marketing language throughout: "thoughtfully selected", "engineered", "ergonomic", "curated", "premium", "effortless", "no friction", "looks premium under the tree", "multi-sensory". An emoji sits in the announcement bar and in analytics logs. | Rewrite using section 5. Add the `audit:copy` script. |
| P2 | Fabricated proof: ratings of 4.7 to 4.9 with review counts, three invented reviews with pet names flagged "verified buyer", stock counts like "142", a pulsing "In Stock" dot on every card, compare-at prices that were never real, a "Flagship Launch Offer". | Remove. Section 5.3 defines what is allowed. |
| P3 | Unsupported claims: "Registered Trademark" beside a ™ in the footer (™ is not ®), "256-bit encryption", "BPA-free", "food-grade", "dishwasher safe", "scrapes plaque", and a "3 to 5 business days" delivery promise with no fulfilment source. | Remove or replace with supplier-verified facts (section 5.4). |
| P4 | Footer newsletter form: confirm it posts to a real list. | Wire to a real provider (Resend audiences, Mailchimp, or Brevo) with double opt-in, or remove it. |

### Engineering and UX

| ID | Finding | Required fix |
|---|---|---|
| M1 | No motion library, no `IntersectionObserver`, no scroll reveals, no text reveal, no page transitions. The only motion is hover transitions, `animate-pulse`, and one float keyframe. | Section 11. |
| M2 | Home, shop, and product pages are `'use client'` at the top, so catalog content is not server-rendered. This hurts SEO and load speed. | Server Components for data and layout. Client components only for interactive islands. |
| M3 | Six uses of `any` (`admin/page.tsx`, `admin/login/route.ts`, `checkout/route.ts` twice, `checkout/page.tsx`, `shop/page.tsx`). Errors are swallowed. | `strict` TypeScript, `zod` validation on every API input, typed error responses. |
| M4 | Links to `/admin` appear in the public header and mobile menu. | Remove. Admin is reachable only by URL and behind login. |
| M5 | README is stock `create-next-app`. | Replace with real setup and operations documentation. |

---

## 4. Brand system and the logo

### 4.1 The logo (from `ZenPaaw_Logo_colored.png`)

The supplied artwork is the only source of truth. Description for verification:

- **Symbol.** A solid yellow (`#FFC800`) paw print: four oval toe pads (two taller ones at the top centre, two lower ones angled outward on each side) above one large rounded heel pad that is wider at the bottom. Inside the heel pad is a negative-space (background-coloured) bold slanted Z-like stroke with a doubled diagonal.
- **Wordmark.** "ZenPaaw" in a heavy, rounded, geometric sans with single-storey "a" shapes, solid white on teal, tight tracking. A small "TM" mark sits at the top right. The wordmark is one colour only.
- **Tagline.** "Happy Pets, Happier Lives." in yellow, regular weight, same rounded geometric family. It has a comma after "Pets".
- **Lockup.** Stacked: symbol, then wordmark, then tagline, centred.
- **Background.** Teal `#0C534E` with large, very subtle darker-teal organic blobs (about `#0C4F48`).

### 4.2 What to build

1. Create `/public/brand/` with these files, all traced or exported from the supplied artwork:
   - `zenpaaw-lockup-stacked.svg` (symbol, wordmark, tagline)
   - `zenpaaw-symbol.svg` (yellow paw with transparent Z cut-out, not a filled teal Z)
   - `zenpaaw-wordmark-white.svg` and `zenpaaw-wordmark-teal.svg` (the teal version, `#0C534E`, for light backgrounds)
   - `zenpaaw-horizontal.svg` (symbol left, wordmark right, built from the same paths, no redraw)
2. If only the PNG exists, vectorise it: separate the yellow and white layers by colour threshold, trace each with `potrace` or `vtracer`, then overlay the SVG on the PNG at 400% and confirm the difference is under 1% of pixels. Save the comparison image to `docs/logo-diff.png`.
3. Replace `ZenPawLogo.tsx` with a component that renders the real inline SVG (so the toes can animate) and supports `variant` (`stacked`, `horizontal`, `symbol`), `tone` (`onTeal`, `onLight`), and `size`. Delete the old hand-drawn paths.
4. Generate: `app/icon.svg` (symbol on a teal rounded square), `favicon.ico`, `apple-icon.png` (180), `icon-192.png`, `icon-512.png`, `manifest.webmanifest`, and a 1200 x 630 `opengraph-image` using the stacked lockup on the teal background.
5. Fix the JSON-LD `logo` URL to point at the real asset.
6. Clear space around the logo equals the height of the "Z". Minimum sizes: symbol 20 px, horizontal lockup 112 px wide, tagline shown only when the lockup is at least 220 px wide.
7. Never stretch, recolour, outline, add shadows, or swap the wordmark font.

### 4.3 Design tokens

```
--teal-950: #093B37   --teal-700: #0C534E (brand)   --teal-500: #14726B
--mint-100: #F0F7F6   --mint-300: #A3D2CD
--yellow-500: #FFC800 --yellow-600: #E5B400   --yellow-100: #FFF6D6
--ink: #162624        --gray-600: #596A68     --line: #E2EBEA   --bg: #FAFBF9
--blob-dark: #0C4F48
```

- Yellow is for fills, icons, and large display text on teal only. Never yellow text on a light background (fails contrast).
- Radius scale: 12, 20, 28, 40, pill. Cards use 28. Buttons are pills.
- Fonts via `next/font`: **Outfit** for display (its single-storey "a" matches the wordmark) and **Plus Jakarta Sans** for body. Two families maximum.
- Shape language from the reference: soft organic blobs behind cut-out photos, paw-print watermarks at 4 to 6% opacity, thick friendly icons, generous whitespace.

---

## 5. Voice, content rules, and claims

### 5.1 Voice

Plain, specific, and calm. Write like a good shop assistant: say what the thing is, what it is made of, who it suits, and what to do if it does not work out. Sentence-case headings. Reading level around grade 7. No exclamation marks in UI copy. No emoji anywhere (UI, logs, commit messages, comments). Avoid em dashes in UI copy; use full stops or commas.

Banned words and phrases (the `audit:copy` script fails on these): thoughtfully, engineered (unless literally about engineering), ergonomic (unless a measurement is given), curated, premium, elevate, unleash, seamless, effortless, game-changer, revolutionary, cutting-edge, state-of-the-art, next-level, ultimate, bespoke, world-class, crafted, journey, tailored, "no friction", "zero spam", "furry friend".

Before and after:

| Current | Replace with |
|---|---|
| "Thoughtfully selected pet toys designed to keep dogs engaged, active, and ready to play." | "Chew toys, fetch toys, tug ropes, and puzzle feeders for dogs and cats. Every order ships with tracking." |
| "Experience the flagship 3-in-1 toy that combines play, chew, and fetch in one durable design." | "A rubber ball, a chew roller, and a knotted rope on one cord. Use it for fetch, chewing, or tug." |
| "🐾 FREE U.S. SHIPPING ON ORDERS OVER $35 • 30-DAY SATISFACTION GUARANTEE" | "Free shipping over $35. 30-day returns." (only if both are true in `store.config.ts`) |
| "...we will provide a full refund or exchange—no friction." | "Contact us within 30 days of delivery and we will refund or exchange it." |

### 5.2 Product copy template

Two-sentence summary (what it is, who it suits). Then a spec list taken from the supplier data. Then a "Safety and supervision" note chosen by category. No adjective appears without a fact behind it.

### 5.3 Social proof policy

- Launch with zero reviews. Show no star rating and no count until a product has at least three real reviews from delivered orders.
- Reviews are requested by email 7 days after the delivered status. Only matched orders can post. Mark them "Verified purchase" automatically.
- No stock numbers, countdowns, "X people are viewing", or fake scarcity. Show "Out of stock" or "Ships in N days" only when real.
- "Sale" and compare-at prices appear only when the item was actually sold at the higher price for at least 14 days. Store `priceHistory` and enforce this in code.
- No "Best seller" badge until sales data supports it. Before that, use editor picks, labelled "Staff pick".

### 5.4 Claims policy

Every factual product claim (material, size, weight, washability, safety rating) is stored with `source` (supplier spec URL or document) and `verified: boolean`. The storefront renders only verified claims. Health claims (dental cleaning, plaque, calming, anxiety) are not allowed. Describe the feature instead: "Raised ridges on the surface." Use "eco-friendly" only with documentation. The footer says "ZenPaaw" with a ™ only if the owner confirms use; never "Registered" unless a registration number is supplied in config.

### 5.5 Legal pages

Privacy, terms, returns, and shipping pages are generated from `store.config.ts` (business name, address, support email, return window, processing and delivery times by region). A `launch:check` script fails while any config value is still a placeholder.

---

## 6. Stack and architecture

- Next.js 16 App Router, React 19, TypeScript `strict`, Tailwind 4 using the officially documented setup from the bundled docs (verify the current `next.config.ts` Turbopack CSS rule is the supported one, otherwise replace it).
- Database: Postgres (Neon or Supabase) with **Drizzle ORM** and migrations. Local dev uses a Docker Postgres or the provider's dev branch.
- Validation: `zod` on every API input and on all environment variables (`src/env.ts`, fail fast at boot).
- Payments: provider adapter interface `PaymentProvider` with two implementations. **Stripe** (Checkout Session or Payment Element) and **Paystack** (inline or redirect). Selected by `PAYMENT_PROVIDER`. Use Stripe if the business entity is in a Stripe-supported country. Use Paystack or Flutterwave if the business is registered in Nigeria or elsewhere in Africa. Add PayPal as an optional second method. Webhook signature verification is mandatory.
- Email: Resend with React Email templates in brand colours.
- Images: Vercel Blob or Cloudinary for uploads. `next/image` with AVIF and WebP, correct `sizes`, blur placeholders, and configured `remotePatterns`.
- Motion: the `motion` package (import from `motion/react`; verify the API in its docs). Optional Lenis smooth scroll, off when `prefers-reduced-motion` is set.
- Auth: `jose` signed session cookie for admin. Optional TOTP.
- Rate limiting: Upstash Redis or an in-database token bucket for login, coupon, review, newsletter, and contact endpoints.
- Tests: Vitest for pricing and tax logic, Playwright for end-to-end, `@axe-core/playwright` for accessibility, Lighthouse CI.
- Hosting target: Vercel + Neon. Document every environment variable in `.env.example` and `docs/SETUP.md`.
- Server Components fetch data. `'use client'` is limited to interactive islands (gallery, filters, cart, forms, motion wrappers). Use the caching model from the bundled docs: cached product and category queries with tag-based revalidation when the admin saves.
- Every route has `loading.tsx` (skeletons), `error.tsx`, and the app has a branded `not-found.tsx`.

---

## 7. Data model (Drizzle)

- `products`: id, slug, title, summary, description, pet_types[], category_id, play_styles[], chew_strength, status (`draft` / `active` / `archived`), brand_label (default none), seo_title, seo_description, created_at, updated_at.
- `variants`: id, product_id, sku (unique), option1_name/value (e.g. Size: M), option2_name/value (e.g. Colour: Blue), price_cents, cost_cents, compare_at_cents (nullable), weight_g, supplier_id, supplier_sku, supplier_url, lead_time_days_min/max, available (boolean from supplier sync), image_id.
- `product_images`: id, product_id, variant_id (nullable), url, alt, position, width, height, phash, source_url, license, reviewed (boolean).
- `claims`: id, product_id, key (material, size, weight, wash, age_range, safety_note), value, source_url, verified.
- `categories`: id, parent_id, slug, name, description, image_id, position. `collections` and `collection_items` (manual or rule-based).
- `suppliers`: id, name, contact, warehouse_country, avg_processing_days, avg_delivery_days_by_region (jsonb), notes.
- `customers` (guest by default), `addresses`.
- `orders`: id, number (unique sequence), email, status (`pending_payment`, `paid`, `sent_to_supplier`, `shipped`, `delivered`, `cancelled`, `refunded`), currency, subtotal, shipping, tax, discount, total, coupon_code, payment_provider, payment_ref, shipping_address (jsonb), created_at.
- `order_items`: order_id, variant_id, title_snapshot, price_snapshot, cost_snapshot, qty, image_snapshot.
- `shipments`: order_id, supplier_id, supplier_order_ref, carrier, tracking_number, tracking_url, shipped_at, delivered_at.
- `coupons`: code, type, value, min_subtotal, free_shipping, starts_at, ends_at, usage_limit, used_count.
- `reviews`: id, product_id, order_item_id, rating, title, body, photos[], status (`pending` / `published`), created_at. Only creatable through a signed email link.
- `wishlists` (server copy for logged-in users, `localStorage` for guests), `subscribers`, `events` (analytics), `audit_log`, `price_history`.
- Prices are stored as integer minor units. Currency and locale come from `store.config.ts`.

---

## 8. Catalog: variety, real products, real images

### 8.1 Sourcing rules

- Use real, purchasable products from dropshipping suppliers that publish merchant-usable images and specs (for example CJ Dropshipping, Zendrop, Spocket, BigBuy, Syncee, or a direct manufacturer). Prefer suppliers with a warehouse in the customer's region so delivery times are honest.
- Sell **unbranded or white-label items only.** Do not list items carrying third-party brand marks or trademarked names (Kong, Chuckit!, Nylabone, Outward Hound, Petstages, and similar). Reject any image where a third-party brand is visible on the product (this is exactly what is wrong with the current "DURAPET" photo).
- Product names are descriptive ("Knotted Cotton Rope Tug, 3 Knot"). Use the ZenPaaw name on a product only for items that are genuinely private-label.
- For each product record `source_url`, `supplier_cost`, `supplier_sku`, and the date it was checked. Mark each entry `needs_owner_approval: true` in `data/catalog.seed.json`. The owner reviews and approves in admin before it goes live.
- Order samples of the top 8 SKUs and note in `docs/SETUP.md` that real photos of these should replace supplier images when available.

### 8.2 Taxonomy

**Pet type:** Dogs, Puppies, Cats.

**Dog categories** (minimum six products each):
Chew Toys; Fetch and Outdoor; Tug and Rope; Plush and Squeaky; Puzzle and Treat Toys (treat balls, snuffle mats, lick mats, slow-feed puzzles); Water and Floating Toys; Interactive and Electronic.

**Puppy categories:** Teething Toys; Soft Starter Toys; Starter Sets.

**Cat categories** (minimum six products each):
Wands and Teasers; Kickers and Catnip; Balls and Tracks; Electronic and Motion Toys; Tunnels and Hideouts; Scratchers; Plush Mice and Small Toys.

**Collections (rule-based):** New Arrivals; Staff Picks; Under $15; Power Chewers; Puppy Starter; Indoor Play; Outdoor and Water; Gift Sets; Bundles.

**Facets:** pet type, category, price range, play style (chew, fetch, tug, solo, puzzle, chase), size (with weight ranges for dogs), chew strength (gentle, moderate, power), material, colour, availability, on sale, rating (only shown when at least 3 reviews exist).

### 8.3 Variety rules

- Minimum **60 distinct products**. No two products may be the same archetype in a different colour. A colour or size difference is a variant of one product, not a separate product.
- Every category in 8.2 meets its minimum count. Spread price points from about $6 to $60 and include at least 6 multi-item bundles.
- At least 40% of products have two or more variants with their own price or image.
- Generate `data/catalog.seed.json` and a `scripts/seed.ts` that loads it. Include `slug`, `pet_types`, `category`, `play_styles`, `materials`, `variants[]`, `images[]`, `claims[]`, `supplier`.

### 8.4 Image rules (the repeated-image bug must not return)

- Every product has **at least 4 distinct images**: (1) clean cut-out on a neutral background, (2) in-use or lifestyle, (3) detail or texture, (4) scale reference or alternate angle. Every variant with a different colour has its own primary image.
- No image file or perceptual hash is shared between two different products. Hero and lifestyle images on marketing pages may be reused only on other marketing pages, never as a product gallery image.
- Minimum 1200 px on the long edge, square or 4:5, stored as AVIF or WebP at 250 KB or less, with descriptive alt text ("Blue rubber treat ball with a small opening on one side").
- Lifestyle and hero photography: licensed photos (Unsplash or Pexels licences, confirm per image) of real dogs and cats, background-removed for cut-outs (`rembg`). Log each in `docs/IMAGE_LOG.csv` with source URL, licence, and `reviewed`.
- **Do not use AI-generated images as product photos** for items that will be shipped. AI imagery is allowed only for abstract decorative backgrounds that show no product.
- `scripts/audit-images.ts` runs in CI: computes pHash for every catalog image and exits non-zero on near-duplicates across different products (Hamming distance 6 or less), fewer than 4 images, small dimensions, missing alt text, or an unreviewed row in the image log.
- Delete `public/images/hero-dog.jpg`, `packaging-box.jpg`, `packaging-concepts.png`, and `toy-isolated.jpg` from product use. Keep only what is licensed and correct for marketing sections.

---

## 9. Marketplace experience

### 9.1 Navigation and structure

- **Header** (sticky, shrinks on scroll): logo left, mega-menu centre, search (opens with Cmd/Ctrl+K), wishlist, cart on the right. Mega-menu columns: Dogs, Puppies, Cats (each with category links and a feature tile), Collections, and a "Find a toy" link.
- **Announcement bar** (one line, dismissible, from `store.config.ts`).
- **Mobile:** hamburger opens a full-screen menu. A bottom tab bar holds Home, Shop, Search, Wishlist, Cart.
- **Footer:** shop links, help (shipping, returns, track order, contact, FAQ), company, newsletter, payment icons that match what is actually enabled, legal.
- **Routes:** `/`, `/shop`, `/c/[pet]`, `/c/[pet]/[category]`, `/collections/[slug]`, `/product/[slug]`, `/search`, `/wishlist`, `/cart`, `/checkout`, `/order/[number]` (confirmation), `/track`, `/about`, `/faq`, `/contact`, `/shipping`, `/returns`, `/privacy`, `/terms`, `/admin/*`.

### 9.2 Shop and listing pages

- Server-rendered listing with URL-synced filters and sort (`?pet=dogs&play=chew&price=5-20&sort=new`), so every filtered view is shareable and indexable where useful.
- Desktop: sticky left filter sidebar. Mobile and tablet: filter button opens a bottom sheet with an "Apply (N results)" button. Active filters appear as removable chips.
- Sort: featured, newest, price low to high, price high to low, top rated (only among products with enough reviews).
- Grid and list view toggle plus density toggle (comfortable and compact), persisted.
- Pagination with a "Load more" button that updates the URL, plus numbered pages for crawlers.
- Product card: primary image with hover image swap (desktop) or swipe dots (touch), pet-type tag, title, price (and compare-at only when allowed by 5.3), colour swatches, wishlist heart, quick add (single variant) or "Choose options" (multi-variant), quick view modal.
- Empty state with suggestions. Skeleton cards while loading.

### 9.3 Search

- Instant search modal: product, category, and collection suggestions with thumbnails, recent searches, typo tolerance (Postgres trigram or Meilisearch), keyboard navigation. Full `/search` page with the same filters.

### 9.4 Product page

- Gallery: 5 to 8 images, thumbnails, swipe on touch, hover zoom on desktop, full-screen lightbox, variant swatch click swaps the image.
- Buy box (sticky on desktop): title, price, variant selectors with disabled states for unavailable combinations, quantity stepper, **Add to cart** (states in 11.4), wishlist, delivery estimate from supplier lead time plus region config, return window, accurate payment methods.
- Below: specs table (verified claims only), size guide drawer (dog weight chart), "Safety and supervision" block, per-product FAQ, reviews (only if any), shipping and returns summary.
- "Frequently bought together" with a one-click add-all, "You may also like" (same category, different product), and "Recently viewed".
- Sticky bottom add-to-cart bar on mobile once the main button scrolls out of view.
- `Product` JSON-LD with `offers`; `aggregateRating` only when real.

### 9.5 Find-a-toy guide

A three-step interactive picker (pet and size, how hard they chew, how they like to play) that routes to a pre-filtered shop view. Pure client island, no data collection required.

### 9.6 Wishlist, recently viewed, compare

Wishlist (heart on cards and product page), `/wishlist` page with add-all-to-cart, recently viewed strip. Skip product compare unless time remains.

---

## 10. Adaptive layout system (automatic switching)

The layout must reconfigure itself to the device without manual toggles. Build it on fluid grids, container queries, and capability queries.

- **Breakpoints:** 360, 640, 768, 1024, 1280, 1536. Test matrix: 360x640, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080.
- **Product grids** use `grid-template-columns: repeat(auto-fill, minmax(clamp(150px, 22vw, 280px), 1fr))` and container queries inside cards, so cards adapt to the space they get, not the viewport.
- **Pattern switches:**
  - Phone: bottom tab bar, filters in a bottom sheet, 2-column grid, swipe gallery with dots, sticky add bar, cart as a full-height sheet.
  - Tablet: 3-column grid, filters in a side drawer, two-column product page.
  - Desktop: left filter sidebar, 4-column grid, mega-menu, sticky buy box, right-side cart drawer.
- **Capability queries:** hover effects only inside `@media (hover: hover)`. Touch devices get active-state feedback instead. Tap targets are at least 44 px. Respect `env(safe-area-inset-*)` for notched phones.
- **No horizontal scroll** at any width (except intentional carousels). No layout shift when fonts or images load (reserve aspect ratios).
- User toggles (grid or list, density) persist, but the default is chosen from the device class.

---

## 11. Motion and micro-interaction system

### 11.1 Principles

- Animate `transform` and `opacity` only. Never animate layout properties.
- Tokens: ease-out `cubic-bezier(0.16, 1, 0.3, 1)`; soft spring `{ stiffness: 380, damping: 34 }`; durations 120 / 240 / 480 / 720 ms.
- `prefers-reduced-motion: reduce` replaces all movement with a 160 ms fade. The cart, filters, and checkout must work fully without motion.
- Performance budget: no animation may drop interactions below 60 fps on a mid-range phone. INP under 200 ms, CLS under 0.05.

### 11.2 Text reveal (every page, every heading)

Build `<RevealText as="h1" by="lines | words" stagger={0.045}>` and `<RevealBlock>` for paragraphs and cards.

- Real text is rendered on the server and stays in the DOM. The wrapper carries `aria-label` with the full string. Split child spans are `aria-hidden`. Screen readers and crawlers see normal text.
- Each word or line sits inside an `overflow: clip` mask with 0.12 em bottom padding (so descenders are not cut). Enter animation: `translateY(105%) rotate(2deg)` to `0`, 720 ms ease-out, 45 ms stagger per word. For text over 12 words, switch to line mode. Total reveal never exceeds 900 ms.
- Trigger with `IntersectionObserver` (`rootMargin: -10%`, once). The hero heading waits for `document.fonts.ready` so there is no jump.
- Progressive enhancement: text is visible without JavaScript. Hide-then-reveal only starts after a `js` class is set on `<html>`.
- Key words in headings get a yellow hand-drawn underline that draws on (SVG stroke-dashoffset).
- Numbers count up when they enter view. Paragraph blocks fade up 16 px in 480 ms. Cards stagger 60 ms.
- **Coverage:** apply to every page's `h1`, section headings, and lead paragraphs: home, shop, category, collection, product, cart, checkout, order confirmation, track, about, FAQ, contact, legal, 404, admin login. The Playwright test `motion.spec.ts` visits every route and asserts the `h1` has the reveal attribute, finishes within 1.2 s, and causes no layout shift.

### 11.3 Page transitions

- `app/template.tsx` animates main content on every navigation (opacity and 12 px rise, 320 ms). The header and cart stay mounted.
- Shared-element transition for the product image from card to product page using the View Transitions API (`view-transition-name: product-{id}`), following the bundled Next docs for the supported flag. Fall back to the fade if unsupported.
- A thin yellow route progress bar at the top during navigation.
- First visit per session: a logo intro under 1.2 s (toes pop in with 60 ms stagger, heel pad scales up, the Z cut-out wipes in, wordmark reveals through a mask). Skippable by click and never shown again in the same session.

### 11.4 Micro-interaction catalogue (all required)

1. **Add to cart button states:** idle, then spinner on press, then a check that morphs from the label, then reverts after 1.4 s. Disabled and out-of-stock states are visible and accessible.
2. **Fly-to-cart:** a clone of the product image arcs into the header cart icon (FLIP technique, 600 ms). Mobile flies to the tab-bar cart.
3. **Cart badge:** bounces once and the number rolls like an odometer.
4. **Cart drawer:** slides in with a spring, backdrop blur fades in, focus is trapped, Escape closes, items stagger in.
5. **Line items:** quantity stepper with rolling numbers, swipe-to-remove on touch, 5-second undo toast.
6. **Free-shipping progress bar:** fills smoothly, a paw icon rides the leading edge, and a subtle paw-print burst fires once when the threshold is crossed. Threshold and copy come from config.
7. **Wishlist heart:** pops, fills yellow, tiny particle burst, toast with undo.
8. **Product cards:** image swap on hover, 4 degree magnetic tilt on desktop only, price and button lift 2 px, quick-add slides up.
9. **Primary buttons:** magnetic pull toward the cursor on desktop (max 6 px), pressed scale 0.97, a soft yellow glow ring on focus.
10. **Nav:** sliding pill indicator under the active link, mega-menu opens with a clip-path reveal, underline sweep on links.
11. **Header:** compresses on scroll, with a scroll-progress hairline.
12. **Swatches:** selected ring animates, the gallery cross-fades to the variant image.
13. **Gallery:** inertial swipe, pinch zoom, thumbnail strip follows the active image.
14. **Filters:** chips animate in and out, result count rolls, grid reflows with layout animation, skeleton shimmer while loading.
15. **Accordions (FAQ):** smooth height, rotating plus icon, the open row turns teal with a yellow marker (as in the reference).
16. **Forms:** floating labels, inline validation with a gentle shake on error, success tick draws on.
17. **Toasts:** stack from the bottom on mobile and the top right on desktop, with swipe-to-dismiss.
18. **Search modal:** scales from the search icon, results stagger in, the active row slides a highlight.
19. **Images:** blur-up on load, then a soft scale from 1.04 to 1.
20. **Scroll effects:** gentle parallax on hero cut-outs and blobs (max 24 px), marquee of true trust points, paw-print trail following the cursor on the hero only (desktop, under 8 elements, off for reduced motion).
21. **Checkout:** step indicator with animated progress, the order summary stays sticky, a branded success screen with a paw-print stamp animation.
22. **Empty states:** a small looping illustration of a paw tapping the glass (CSS only, under 3 KB).
23. **Back to top:** appears after 1.5 screens with a ring showing scroll progress.
24. **Skeletons** for every data-driven section, matching final layout dimensions.
25. **Cursor feedback:** pointer changes to a paw-shaped "View" label over product images (desktop only).

---

## 12. Page designs

Use the reference screenshot for rhythm. Teal dominant, yellow organic blobs behind cut-out photos, rounded pill buttons, numbered feature lists, an icon ring, a teal CTA banner with a yellow corner blob, and a yellow-row FAQ accordion.

### Home

1. **Hero** (teal): small eyebrow, large Outfit headline with text reveal, two buttons ("Shop dog toys", "Shop cat toys"), a row of three true trust points (only ones that are true in config). Right side: a cut-out dog and cat on a yellow organic blob with two floating product cards that parallax. Paw watermarks in the background.
2. **Shop by pet** (Dogs, Puppies, Cats): three large rounded tiles, each with a cut-out pet on a blob, hover lifts and the blob morphs.
3. **Six ways to play** (reference's icon-ring layout): central cut-out image with Chew, Fetch, Tug, Puzzle, Plush, and Chase icons on both sides. Each links to a pre-filtered shop view.
4. **Staff picks** carousel (products with real images).
5. **Why shop at ZenPaaw** (reference's numbered 01 to 04 list beside a blob and dog): sorted by play style, honest specs from the supplier, tracked delivery, 30-day returns. Use only claims that are true in config.
6. **Category grid** with a product image per tile.
7. **New arrivals** grid.
8. **Find a toy** guide (9.5).
9. **CTA banner**: teal with a yellow corner blob, "Not sure what to pick? Answer three questions."
10. **Reviews** section: only renders when real reviews exist.
11. **FAQ** accordion in the reference style.
12. **Newsletter** and footer.

All other pages follow the same system: teal page headers with a reveal heading, white content sections, rounded cards, yellow accents.

---

## 13. Dropshipping operations (admin)

Admin lives at `/admin`, behind the session from C4. Not linked from the public site.

- **Dashboard:** revenue, orders, average order value, gross margin (revenue minus supplier cost minus payment fees), top products, conversion funnel from `events`, orders awaiting fulfilment, low-margin alerts.
- **Orders:** list with filters, detail view, status pipeline (`paid` to `sent_to_supplier` to `shipped` to `delivered`, plus cancel and refund). Each order shows a **supplier panel**: items grouped by supplier, supplier SKU, supplier cost, a one-click "Copy supplier order details", and a "Mark sent to supplier" action with a supplier reference field.
- **Tracking:** entering a tracking number and carrier sends the shipped email automatically and updates `/track`.
- **Refunds:** issue full or partial refund through the payment provider and log it.
- **Products:** create, edit, duplicate, archive. Variant matrix editor, image upload with drag-to-reorder, alt text required, claims editor with `verified` toggle and source URL, SEO fields, live preview.
- **Bulk tools:** CSV and JSON import and export for products and orders (include a mapper for CJ and Shopify-style product CSVs). Export unfulfilled orders as a supplier-ready CSV.
- **Pricing engine:** rule per supplier or category (cost multiplier, minimum margin percent, rounding to .95 or .99). Block saving a variant with margin below the configured floor unless overridden with a reason. Warn when supplier cost changes.
- **Collections editor:** manual and rule-based.
- **Coupons:** CRUD with limits, dates, and usage counts.
- **Site settings:** announcement bar, free-shipping threshold, return window, shipping rate table by region, tax settings. Everything the storefront reads from `store.config.ts` can be overridden here.
- **Reviews moderation, subscribers list, audit log.**
- **Supplier sync stub:** an adapter interface (`SupplierAdapter`) with a CSV-based implementation that updates `available` and `cost_cents`, plus a documented place to plug in a supplier API.

---

## 14. Cart, checkout, payments, email

### Cart
- Add to cart from card, quick view, and product page. Cart state keys are `{variantId, qty}`. On load and before checkout, revalidate against the server and show a clear notice if a price or availability changed.
- Cart drawer plus `/cart` page. Coupon field validated on the server. Free-shipping bar. Estimated delivery. Cross-sell chosen from a different category than the cart contents.
- Cart persists in `localStorage` and syncs to an `abandoned_carts` table if the visitor gives an email at checkout (for recovery emails, opt-in only).

### Checkout
- Guest checkout. Contact, shipping address (country list from config, basic address validation), shipping method (from rate table), review, then pay through the provider's hosted or embedded element. No card fields in our code.
- Server endpoint creates the order as `pending_payment` from DB prices, creates the provider session with an idempotency key, and returns the redirect or client secret.
- Webhook endpoint (signature verified) marks the order `paid`, decrements nothing (dropship), writes `shipments` placeholders, and sends the confirmation email. Handle retries idempotently.
- Order confirmation at `/order/[number]` requires a signed token or email match.
- `/track`: order number plus email shows status, tracking link, and timeline.

### Emails (React Email, brand styled)
Order confirmation, shipped with tracking, delivered with review request, refund issued, abandoned cart (opt-in), contact form receipt.

### Tax and shipping
Shipping rate table by region with estimated delivery windows taken from the supplier's real lead times. Tax via Stripe Tax or a configurable rate table. Display "Taxes calculated at checkout" only if that is true.

---

## 15. Quality gates and scripts

Add to `package.json`:

- `typecheck`, `lint`, `test` (Vitest), `e2e` (Playwright), `lighthouse`.
- `audit:images` (section 8.4).
- `audit:copy`: fails on banned words (5.1), any emoji in `src/`, `content/`, and commit message templates, the words "Registered Trademark", and any rating or review markup without database-backed reviews.
- `audit:claims`: fails if a storefront component renders a product claim whose `verified` is false.
- `audit:security`: asserts every `/api/admin/*` and order-listing route returns 401 without a session; asserts no secrets in the client bundle.
- `launch:check`: fails while `store.config.ts` has placeholders or required env vars are missing.

**Performance and accessibility targets** on Home, Shop, and a product page, mobile profile: Lighthouse Performance 90 or above, Accessibility 100, Best Practices 100, SEO 100. LCP under 2.5 s, CLS under 0.05, INP under 200 ms. Zero axe violations. Full keyboard operation, visible focus rings, correct landmarks, labelled form fields, and `aria-live` announcements for cart changes.

**SEO:** metadata per page, canonical URLs, sitemap generated from the database (including categories and collections), `robots.ts`, structured data (`Organization`, `WebSite` with search action, `BreadcrumbList`, `Product`, `FAQPage`), Open Graph images per product.

**Analytics:** keep the dispatcher, remove emoji logs, fire GA4 ecommerce events (`view_item_list`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`) with consent gating. Add a cookie consent banner when the target market requires it.

---

## 16. Phases

1. **Phase 0, recon.** Read the bundled Next docs. Run the audit scripts you create against the current repo to prove each finding. Write the plan.
2. **Phase 1, brand foundation.** Logo files, tokens, fonts, icon set, logo component, logo intro.
3. **Phase 2, data layer.** Drizzle schema, migrations, services, admin auth, remove the in-memory store, env validation.
4. **Phase 3, catalog.** Build `catalog.seed.json` with 60+ products, source and process images, image log, `audit:images` passing.
5. **Phase 4, storefront.** Shell, navigation, home, shop, category, collection, product, search, wishlist, find-a-toy. Adaptive layout.
6. **Phase 5, cart, checkout, payments, email.**
7. **Phase 6, motion pass.** Reveal system on all pages, transitions, full micro-interaction catalogue.
8. **Phase 7, admin and dropship operations.**
9. **Phase 8, SEO, performance, accessibility, legal, analytics.**
10. **Phase 9, QA and report.** Run every script, the full Playwright suite on the viewport matrix, and Lighthouse. Write `docs/AUDIT_REPORT.md` and `docs/SETUP.md` (env vars, supplier workflow, how to add products, how to go live).

---

## 17. Final acceptance checklist

- [ ] Logo matches the supplied artwork (diff under 1%), comma in the tagline, one-colour wordmark, full icon set, correct JSON-LD logo.
- [ ] 60+ distinct products, every category minimum met, no shared images between products, `audit:images` passes.
- [ ] No third-party brand visible on any product photo.
- [ ] Storefront reads only from the database. Editing a product in admin updates the shop.
- [ ] Unknown product slug returns 404.
- [ ] Full purchase works in provider test mode: browse, filter, choose variant, add to cart, checkout, pay, webhook marks paid, email arrives, order appears in admin supplier panel, tracking number triggers shipped email, `/track` shows status.
- [ ] Totals are computed on the server. Tampering with price or discount in the request has no effect (test included).
- [ ] No raw card inputs anywhere in the codebase.
- [ ] Every admin route returns 401 without a session. Public order lookup needs order number plus email.
- [ ] No seeded fake orders, reviews, ratings, stock numbers, urgency, or invented discounts.
- [ ] `audit:copy` passes: zero banned words, zero emoji, no "Registered Trademark".
- [ ] Text reveal runs on every page's headings and respects reduced motion. Page transitions work. All 25 micro-interactions are present.
- [ ] Layout switches correctly across the six-viewport matrix with no horizontal scroll.
- [ ] Lighthouse, axe, and Core Web Vitals targets met.
- [ ] `docs/AUDIT_REPORT.md`, `docs/SETUP.md`, `docs/DECISIONS.md`, `docs/IMAGE_LOG.csv` exist and are accurate.

When all boxes are ticked, summarise what you built, list anything that still needs the owner (supplier approvals, API keys, business details), and stop.
