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
