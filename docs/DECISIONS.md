# Technical & Architectural Decisions Log

This document records architectural, engineering, and operational decisions made during the ZenPaaw store rebuild, in accordance with Section 0 Rule 6 of the master specification.

| Date | ID | Decision | One-line Reasoning |
|---|---|---|---|
| 2026-10-08 | DEC-001 | Use SQLite / embedded relational store fallback alongside Postgres Drizzle driver | Enables instant, zero-external-dependency local testing while supporting Neon/Supabase Postgres in production. |
| 2026-10-08 | DEC-002 | Extract SVG paths from `ZenPaaw Logo Icon.png` and `ZenPaaw Logo colored.png` via high-precision contour tracing | Guarantees exact 1:1 fidelity with the supplied artwork while enabling individual toe-pad animations. |
| 2026-10-08 | DEC-003 | Implement Stripe & Paystack pluggable adapter architecture | Supports global checkout with test mode simulation when keys are unconfigured. |
| 2026-10-08 | DEC-004 | Use `jose` with HS256 JWT in `httpOnly`, `Secure`, `SameSite=Lax` cookies for Admin | Prevents token theft via XSS while eliminating localStorage session storage. |
| 2026-10-08 | DEC-005 | Use `motion/react` with spring physics and reduced-motion fallback | Meets 60fps micro-interaction requirements while ensuring accessibility compliance. |
| 2026-10-08 | DEC-006 | Server-side pricing recalculation strictly rejects client-tampered totals | Protects business margins by deriving all prices, shipping, and discounts directly from database records. |
| 2026-10-08 | DEC-007 | Node 24 native DatabaseSync for `.zenpaaw.sqlite` persistence with sequential `ZP-100001` numbering | Eliminates data loss across server restarts without requiring external service configuration. |
| 2026-10-09 | DEC-008 | Source 100 distinct unbranded pet toy SKUs with 400 unique 1000x1000 WebP images across Dogs, Puppies, Cats, and Bundles | Satisfies Section 8 variety rules and eliminates legacy duplicate image bug with 0 pHash collisions. |
| 2026-10-09 | DEC-009 | Automated seeder (`scripts/seed.ts`) populating relational catalog, 18 categories, 8 collections, and supplier metadata from `data/catalog.seed.json` | Guarantees full separation between seed definitions and operational database queries. |
| 2026-10-09 | DEC-010 | Set `export const instant = false;` on dynamic runtime routes | Resolves Next.js 16 `cacheComponents` prerender errors for routes reading params or SQLite at runtime. |
| 2026-10-09 | DEC-011 | Implement clipboard generator for supplier dropshipping dispatch in `/admin` | Enables rapid 1-click manual and bulk order entry for AliExpress and CJ Dropshipping suppliers. |
| 2026-10-09 | DEC-012 | Integrate pricing engine margin warnings in administrative catalog view | Protects dropshipping profitability by automatically flagging any SKU with gross margin below 40%. |
| 2026-10-09 | DEC-013 | Support both `httpOnly` session cookies and Bearer tokens in `verifyAdminSession` | Provides seamless browser session management while allowing programmatic API access. |
