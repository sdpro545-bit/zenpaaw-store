import { pgTable, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  description: text('description').notNull(),
  petTypes: jsonb('pet_types').notNull().$type<string[]>(),
  categoryId: text('category_id').notNull(),
  playStyles: jsonb('play_styles').notNull().$type<string[]>(),
  chewStrength: text('chew_strength').notNull(), // gentle, moderate, power
  status: text('status').notNull().default('active'), // draft, active, archived
  brandLabel: text('brand_label').default(''),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const variants = pgTable('variants', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull().unique(),
  option1Name: text('option1_name'),
  option1Value: text('option1_value'),
  option2Name: text('option2_name'),
  option2Value: text('option2_value'),
  priceCents: integer('price_cents').notNull(),
  costCents: integer('cost_cents').notNull(),
  compareAtCents: integer('compare_at_cents'),
  weightG: integer('weight_g').notNull().default(200),
  supplierId: text('supplier_id'),
  supplierSku: text('supplier_sku'),
  supplierUrl: text('supplier_url'),
  leadTimeDaysMin: integer('lead_time_days_min').default(3),
  leadTimeDaysMax: integer('lead_time_days_max').default(7),
  available: boolean('available').notNull().default(true),
  imageId: text('image_id'),
});

export const productImages = pgTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: text('variant_id'),
  url: text('url').notNull(),
  alt: text('alt').notNull(),
  position: integer('position').notNull().default(0),
  width: integer('width'),
  height: integer('height'),
  phash: text('phash'),
  sourceUrl: text('source_url'),
  license: text('license'),
  reviewed: boolean('reviewed').notNull().default(true),
});

export const claims = pgTable('claims', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  key: text('key').notNull(), // material, size, weight, wash, age_range, safety_note
  value: text('value').notNull(),
  sourceUrl: text('source_url'),
  verified: boolean('verified').notNull().default(false),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  parentId: text('parent_id'),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  imageId: text('image_id'),
  position: integer('position').notNull().default(0),
});

export const collections = pgTable('collections', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  ruleType: text('rule_type').default('manual'), // manual, rule
});

export const collectionItems = pgTable('collection_items', {
  id: text('id').primaryKey(),
  collectionId: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
});

export const suppliers = pgTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contact: text('contact'),
  warehouseCountry: text('warehouse_country').notNull(),
  avgProcessingDays: integer('avg_processing_days').default(2),
  avgDeliveryDaysByRegion: jsonb('avg_delivery_days_by_region'),
  notes: text('notes'),
});

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  number: text('number').notNull().unique(), // ZP-100001
  email: text('email').notNull(),
  status: text('status').notNull().default('pending_payment'), // pending_payment, paid, sent_to_supplier, shipped, delivered, cancelled, refunded
  currency: text('currency').notNull().default('USD'),
  subtotalCents: integer('subtotal_cents').notNull(),
  shippingCents: integer('shipping_cents').notNull(),
  taxCents: integer('tax_cents').notNull().default(0),
  discountCents: integer('discount_cents').notNull().default(0),
  totalCents: integer('total_cents').notNull(),
  couponCode: text('coupon_code'),
  paymentProvider: text('payment_provider').notNull().default('stripe'),
  paymentRef: text('payment_ref'),
  shippingAddress: jsonb('shipping_address').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId: text('variant_id').notNull(),
  titleSnapshot: text('title_snapshot').notNull(),
  priceSnapshotCents: integer('price_snapshot_cents').notNull(),
  costSnapshotCents: integer('cost_snapshot_cents').notNull(),
  qty: integer('qty').notNull(),
  imageSnapshot: text('image_snapshot'),
});

export const shipments = pgTable('shipments', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  supplierId: text('supplier_id'),
  supplierOrderRef: text('supplier_order_ref'),
  carrier: text('carrier'),
  trackingNumber: text('tracking_number'),
  trackingUrl: text('tracking_url'),
  shippedAt: timestamp('shipped_at'),
  deliveredAt: timestamp('delivered_at'),
});

export const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // percentage, fixed
  valueCents: integer('value_cents').notNull(),
  minSubtotalCents: integer('min_subtotal_cents').default(0),
  freeShipping: boolean('free_shipping').default(false),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').notNull().default(0),
});

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  orderItemId: text('order_item_id'),
  rating: integer('rating').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  photos: jsonb('photos').$type<string[]>(),
  status: text('status').notNull().default('pending'), // pending, published
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const wishlists = pgTable('wishlists', {
  id: text('id').primaryKey(),
  customerId: text('customer_id'),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const subscribers = pgTable('subscribers', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  status: text('status').notNull().default('active'),
  subscribedAt: timestamp('subscribed_at').notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  eventName: text('event_name').notNull(),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  details: jsonb('details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const priceHistory = pgTable('price_history', {
  id: text('id').primaryKey(),
  variantId: text('variant_id').notNull(),
  oldPriceCents: integer('old_price_cents').notNull(),
  newPriceCents: integer('new_price_cents').notNull(),
  changedAt: timestamp('changed_at').notNull().defaultNow(),
});
