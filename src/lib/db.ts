// ZenPaaw Database Export
// Backed by the unified relational database engine (src/lib/db/index.ts)
// All in-memory module-level arrays, seeded fake customers, fake orders, and fake reviews have been permanently deleted.

export { db, default } from './db/index';
export type {
  ProductRecord,
  VariantRecord,
  ProductImageRecord,
  ClaimRecord,
  OrderRecord,
  OrderItemRecord,
  ShipmentRecord,
  CouponRecord,
  CategoryRecord,
} from './db/index';
