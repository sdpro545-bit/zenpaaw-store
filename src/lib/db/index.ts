import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { storeConfig } from '@/store.config';

// Unified Database Layer for ZenPaaw Store
// Supports local file-persisted relational SQLite store (zero-config, survives restarts),
// Vercel serverless /tmp persistence with in-memory fallback, and auto-seeding.

function getDbPath(): string {
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.NODE_ENV === 'production' && !process.env.LOCAL_DEV
  );
  if (isServerless) {
    return path.join('/tmp', '.zenpaaw.sqlite');
  }
  try {
    const testFile = path.resolve(process.cwd(), '.write_test');
    fs.writeFileSync(testFile, '1');
    fs.unlinkSync(testFile);
    return path.resolve(process.cwd(), '.zenpaaw.sqlite');
  } catch {
    return path.join('/tmp', '.zenpaaw.sqlite');
  }
}

let sqliteDb: DatabaseSync | null = null;

function getSqlite(): DatabaseSync {
  if (!sqliteDb) {
    try {
      const dbPath = getDbPath();
      sqliteDb = new DatabaseSync(dbPath);
    } catch (err) {
      console.warn('SQLite filesystem init failed, falling back to memory:', err);
      sqliteDb = new DatabaseSync(':memory:');
    }
    initSqliteSchema(sqliteDb);
    seedIfEmpty(sqliteDb);
  }
  return sqliteDb;
}

function initSqliteSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      pet_types TEXT NOT NULL,
      category_id TEXT NOT NULL,
      play_styles TEXT NOT NULL,
      chew_strength TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      brand_label TEXT DEFAULT '',
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      option1_name TEXT,
      option1_value TEXT,
      option2_name TEXT,
      option2_value TEXT,
      price_cents INTEGER NOT NULL,
      cost_cents INTEGER NOT NULL,
      compare_at_cents INTEGER,
      weight_g INTEGER NOT NULL DEFAULT 200,
      supplier_id TEXT,
      supplier_sku TEXT,
      supplier_url TEXT,
      lead_time_days_min INTEGER DEFAULT 3,
      lead_time_days_max INTEGER DEFAULT 7,
      available INTEGER NOT NULL DEFAULT 1,
      image_id TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      url TEXT NOT NULL,
      alt TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      width INTEGER,
      height INTEGER,
      phash TEXT,
      source_url TEXT,
      license TEXT,
      reviewed INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS claims (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      source_url TEXT,
      verified INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      image_id TEXT,
      position INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      rule_type TEXT DEFAULT 'manual'
    );

    CREATE TABLE IF NOT EXISTS collection_items (
      id TEXT PRIMARY KEY,
      collection_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT,
      warehouse_country TEXT NOT NULL,
      avg_processing_days INTEGER DEFAULT 2,
      avg_delivery_days_by_region TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      number TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      currency TEXT NOT NULL DEFAULT 'USD',
      subtotal_cents INTEGER NOT NULL,
      shipping_cents INTEGER NOT NULL,
      tax_cents INTEGER NOT NULL DEFAULT 0,
      discount_cents INTEGER NOT NULL DEFAULT 0,
      total_cents INTEGER NOT NULL,
      coupon_code TEXT,
      payment_provider TEXT NOT NULL DEFAULT 'stripe',
      payment_ref TEXT,
      shipping_address TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      title_snapshot TEXT NOT NULL,
      price_snapshot_cents INTEGER NOT NULL,
      cost_snapshot_cents INTEGER NOT NULL,
      qty INTEGER NOT NULL,
      image_snapshot TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shipments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      supplier_id TEXT,
      supplier_order_ref TEXT,
      carrier TEXT,
      tracking_number TEXT,
      tracking_url TEXT,
      shipped_at TEXT,
      delivered_at TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value_cents INTEGER NOT NULL,
      min_subtotal_cents INTEGER DEFAULT 0,
      free_shipping INTEGER DEFAULT 0,
      starts_at TEXT,
      ends_at TEXT,
      usage_limit INTEGER,
      used_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      order_item_id TEXT,
      rating INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      photos TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      subscribed_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      payload TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_sequence (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      next_number INTEGER NOT NULL DEFAULT 100001
    );

    INSERT OR IGNORE INTO order_sequence (id, next_number) VALUES (1, 100001);
  `);
}

function seedIfEmpty(db: DatabaseSync) {
  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    if (row && row.count > 0) return;
  } catch {
    // Continue to seed
  }

  try {
    // 1. Categories
    const categories = [
      { id: 'dog-chew', slug: 'chew-toys', name: 'Chew Toys', desc: 'Durable rubber, nylon, and natural composite chew toys for dogs.', pos: 1 },
      { id: 'dog-fetch', slug: 'fetch-and-outdoor', name: 'Fetch and Outdoor', desc: 'Balls, flyers, launchers, and retrieve toys for outdoor play.', pos: 2 },
      { id: 'dog-tug', slug: 'tug-and-rope', name: 'Tug and Rope', desc: 'Braided cotton, jute, and natural fiber tug ropes for interactive play.', pos: 3 },
      { id: 'dog-plush', slug: 'plush-and-squeaky', name: 'Plush and Squeaky', desc: 'Reinforced plush toys with squeakers and crinkle paper.', pos: 4 },
      { id: 'dog-puzzle', slug: 'puzzle-and-treat', name: 'Puzzle and Treat Toys', desc: 'Interactive treat dispensers, snuffle mats, and lick mats.', pos: 5 },
      { id: 'dog-water', slug: 'water-and-floating', name: 'Water and Floating Toys', desc: 'Buoyant toys designed for pool, lake, and beach retrieval.', pos: 6 },
      { id: 'dog-interactive', slug: 'interactive-and-electronic', name: 'Interactive and Electronic', desc: 'Motion-activated and automated interactive play toys.', pos: 7 },
      { id: 'puppy-teething', slug: 'puppy-teething', name: 'Teething Toys', desc: 'Soft rubber and textured toys designed for young puppy gums.', pos: 8 },
      { id: 'puppy-starter', slug: 'puppy-starter', name: 'Soft Starter Toys', desc: 'Gentle plush and lightweight starter toys for young dogs.', pos: 9 },
      { id: 'puppy-sets', slug: 'puppy-sets', name: 'Puppy Starter Sets', desc: 'Multi-piece toy assortments for new puppy households.', pos: 10 },
      { id: 'cat-wands', slug: 'wands-and-teasers', name: 'Wands and Teasers', desc: 'Feather wands, ribbon teasers, and flexible chasers for cats.', pos: 11 },
      { id: 'cat-kickers', slug: 'kickers-and-catnip', name: 'Kickers and Catnip', desc: 'Catnip-filled kick sticks and textured pillows for hind-paw play.', pos: 12 },
      { id: 'cat-tracks', slug: 'balls-and-tracks', name: 'Balls and Tracks', desc: 'Tiered ball tracks, rolling chases, and felt wool play balls.', pos: 13 },
      { id: 'cat-electronic', slug: 'cat-electronic', name: 'Electronic and Motion Toys', desc: 'Automated laser tumblers, flutter toys, and robotic rolling balls.', pos: 14 },
      { id: 'cat-tunnels', slug: 'tunnels-and-hideouts', name: 'Tunnels and Hideouts', desc: 'Collapsible crinkle play chutes and pop-up cube tunnels.', pos: 15 },
      { id: 'cat-scratchers', slug: 'cat-scratchers', name: 'Scratchers', desc: 'Corrugated cardboard lounges and sisal scratching posts.', pos: 16 },
      { id: 'cat-plush', slug: 'plush-mice-small-toys', name: 'Plush Mice and Small Toys', desc: 'Rattling felt mice, crinkle balls, and lightweight chase toys.', pos: 17 },
      { id: 'bundles', slug: 'bundles', name: 'Multi-Item Bundles', desc: 'Multi-product value bundles pairing complementary play styles.', pos: 18 },
    ];
    const catStmt = db.prepare('INSERT OR REPLACE INTO categories (id, slug, name, description, position) VALUES (?, ?, ?, ?, ?)');
    for (const c of categories) {
      catStmt.run(c.id, c.slug, c.name, c.desc, c.pos);
    }

    // 2. Coupons
    const coupons = [
      { id: 'c-welcome10', code: 'WELCOME10', type: 'percentage', val: 10, minSub: 2000, freeShip: 0 },
      { id: 'c-freeship', code: 'FREESHIP', type: 'fixed', val: 0, minSub: 0, freeShip: 1 },
      { id: 'c-save5', code: 'SAVE5', type: 'fixed', val: 500, minSub: 3000, freeShip: 0 },
    ];
    const coupStmt = db.prepare('INSERT OR REPLACE INTO coupons (id, code, type, value_cents, min_subtotal_cents, free_shipping, used_count) VALUES (?, ?, ?, ?, ?, ?, 0)');
    for (const c of coupons) {
      coupStmt.run(c.id, c.code, c.type, c.val, c.minSub, c.freeShip);
    }

    // 3. Products
    const seedJsonPath = path.resolve(process.cwd(), 'data', 'catalog.seed.json');
    if (fs.existsSync(seedJsonPath)) {
      const raw = fs.readFileSync(seedJsonPath, 'utf-8');
      const catalog = JSON.parse(raw);

      const prodStmt = db.prepare(`
        INSERT OR REPLACE INTO products (
          id, slug, title, summary, description, pet_types, category_id,
          play_styles, chew_strength, status, brand_label, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const varStmt = db.prepare(`
        INSERT OR REPLACE INTO variants (
          id, product_id, sku, option1_name, option1_value, option2_name, option2_value,
          price_cents, cost_cents, compare_at_cents, weight_g, available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const imgStmt = db.prepare(`
        INSERT OR REPLACE INTO product_images (
          id, product_id, variant_id, url, alt, position, reviewed
        ) VALUES (?, ?, ?, ?, ?, ?, 1)
      `);
      const claimStmt = db.prepare(`
        INSERT OR REPLACE INTO claims (
          id, product_id, key, value, source_url, verified
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const p of catalog.products || []) {
        prodStmt.run(
          p.id,
          p.slug,
          p.title,
          p.summary,
          p.description,
          JSON.stringify(p.pet_types || []),
          p.category_id,
          JSON.stringify(p.play_styles || []),
          p.chew_strength || 'moderate',
          p.status || 'active',
          p.brand_label || '',
          p.created_at || new Date().toISOString(),
          p.updated_at || new Date().toISOString()
        );

        for (const v of p.variants || []) {
          varStmt.run(
            v.id,
            p.id,
            v.sku,
            v.option1_name || null,
            v.option1_value || null,
            v.option2_name || null,
            v.option2_value || null,
            v.price_cents,
            v.cost_cents || Math.round(v.price_cents * 0.4),
            v.compare_at_cents || null,
            v.weight_g || 200,
            v.available !== false ? 1 : 0
          );
        }

        let imgPos = 0;
        for (const img of p.images || []) {
          imgStmt.run(
            img.id || `${p.id}-img-${imgPos}`,
            p.id,
            img.variant_id || null,
            img.url,
            img.alt || p.title,
            imgPos++
          );
        }

        for (const c of p.claims || []) {
          claimStmt.run(
            c.id || `${p.id}-clm-${c.key}`,
            p.id,
            c.key,
            c.value,
            c.source_url || null,
            c.verified ? 1 : 0
          );
        }
      }
    }
  } catch (err) {
    console.warn('Auto-seed encountered non-fatal error:', err);
  }
}

// -------------------------------------------------------------
// Database Service APIs
// -------------------------------------------------------------

export interface ProductRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  petTypes: string[];
  categoryId: string;
  playStyles: string[];
  chewStrength: string;
  status: string;
  brandLabel: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  variants: VariantRecord[];
  images: ProductImageRecord[];
  claims: ClaimRecord[];
}

export interface VariantRecord {
  id: string;
  productId: string;
  sku: string;
  option1Name?: string;
  option1Value?: string;
  option2Name?: string;
  option2Value?: string;
  priceCents: number;
  costCents: number;
  compareAtCents?: number;
  weightG: number;
  supplierId?: string;
  supplierSku?: string;
  supplierUrl?: string;
  leadTimeDaysMin: number;
  leadTimeDaysMax: number;
  available: boolean;
  imageId?: string;
}

export interface ProductImageRecord {
  id: string;
  productId: string;
  variantId?: string;
  url: string;
  alt: string;
  position: number;
  width?: number;
  height?: number;
  phash?: string;
  sourceUrl?: string;
  license?: string;
  reviewed: boolean;
}

export interface ClaimRecord {
  id: string;
  productId: string;
  key: string;
  value: string;
  sourceUrl?: string;
  verified: boolean;
}

export interface OrderRecord {
  id: string;
  number: string;
  email: string;
  status: string;
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  couponCode?: string;
  paymentProvider: string;
  paymentRef?: string;
  shippingAddress: any;
  items: OrderItemRecord[];
  shipments?: ShipmentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  variantId: string;
  titleSnapshot: string;
  priceSnapshotCents: number;
  costSnapshotCents: number;
  qty: number;
  imageSnapshot?: string;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  supplierId?: string;
  supplierOrderRef?: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  valueCents: number;
  minSubtotalCents: number;
  freeShipping: boolean;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  usedCount: number;
}

export interface CategoryRecord {
  id: string;
  parentId?: string;
  slug: string;
  name: string;
  description: string;
  imageId?: string;
  position: number;
}

export const db = {
  getRawDb(): DatabaseSync {
    return getSqlite();
  },
  getSqlite(): DatabaseSync {
    return getSqlite();
  },

  // PRODUCTS
  getProducts(filters?: {
    petType?: string;
    categoryId?: string;
    playStyle?: string;
    chewStrength?: string;
    minPriceCents?: number;
    maxPriceCents?: number;
    status?: string;
    query?: string;
    sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'rating';
  }): ProductRecord[] {
    const s = getSqlite();
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    const status = filters?.status || 'active';
    query += ' AND status = ?';
    params.push(status);

    if (filters?.categoryId && filters.categoryId !== 'All') {
      query += ' AND category_id = ?';
      params.push(filters.categoryId);
    }

    if (filters?.chewStrength) {
      query += ' AND chew_strength = ?';
      params.push(filters.chewStrength);
    }

    if (filters?.query) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR description LIKE ?)';
      const term = `%${filters.query}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const rows = s.prepare(query).all(...params) as any[];
    let products = rows.map((r) => this.hydrateProduct(r));

    if (filters?.petType) {
      products = products.filter((p) => p.petTypes.includes(filters.petType!));
    }
    if (filters?.playStyle) {
      products = products.filter((p) => p.playStyles.includes(filters.playStyle!));
    }
    if (filters?.minPriceCents !== undefined) {
      products = products.filter((p) => {
        const minP = Math.min(...p.variants.map((v) => v.priceCents));
        return minP >= filters.minPriceCents!;
      });
    }
    if (filters?.maxPriceCents !== undefined) {
      products = products.filter((p) => {
        const minP = Math.min(...p.variants.map((v) => v.priceCents));
        return minP <= filters.maxPriceCents!;
      });
    }

    if (filters?.sort === 'price_asc') {
      products.sort((a, b) => (a.variants[0]?.priceCents || 0) - (b.variants[0]?.priceCents || 0));
    } else if (filters?.sort === 'price_desc') {
      products.sort((a, b) => (b.variants[0]?.priceCents || 0) - (a.variants[0]?.priceCents || 0));
    }

    return products;
  },

  getProductBySlug(slug: string): ProductRecord | null {
    const s = getSqlite();
    const row = s.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as any;
    if (!row) return null;
    return this.hydrateProduct(row);
  },

  getProductById(id: string): ProductRecord | null {
    const s = getSqlite();
    const row = s.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (!row) return null;
    return this.hydrateProduct(row);
  },

  hydrateProduct(r: any): ProductRecord {
    const s = getSqlite();
    const variants = (s.prepare('SELECT * FROM variants WHERE product_id = ?').all(r.id) as any[]).map((v) => ({
      id: v.id,
      productId: v.product_id,
      sku: v.sku,
      option1Name: v.option1_name || undefined,
      option1Value: v.option1_value || undefined,
      option2Name: v.option2_name || undefined,
      option2Value: v.option2_value || undefined,
      priceCents: v.price_cents,
      costCents: v.cost_cents,
      compareAtCents: v.compare_at_cents || undefined,
      weightG: v.weight_g,
      supplierId: v.supplier_id || undefined,
      supplierSku: v.supplier_sku || undefined,
      supplierUrl: v.supplier_url || undefined,
      leadTimeDaysMin: v.lead_time_days_min || 3,
      leadTimeDaysMax: v.lead_time_days_max || 7,
      available: Boolean(v.available),
      imageId: v.image_id || undefined,
    }));

    const images = (s.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY position ASC').all(r.id) as any[]).map((img) => ({
      id: img.id,
      productId: img.product_id,
      variantId: img.variant_id || undefined,
      url: img.url,
      alt: img.alt,
      position: img.position,
      width: img.width || undefined,
      height: img.height || undefined,
      phash: img.phash || undefined,
      sourceUrl: img.source_url || undefined,
      license: img.license || undefined,
      reviewed: Boolean(img.reviewed),
    }));

    const claims = (s.prepare('SELECT * FROM claims WHERE product_id = ?').all(r.id) as any[]).map((c) => ({
      id: c.id,
      productId: c.product_id,
      key: c.key,
      value: c.value,
      sourceUrl: c.source_url || undefined,
      verified: Boolean(c.verified),
    }));

    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      description: r.description,
      petTypes: JSON.parse(r.pet_types || '[]'),
      categoryId: r.category_id,
      playStyles: JSON.parse(r.play_styles || '[]'),
      chewStrength: r.chew_strength,
      status: r.status,
      brandLabel: r.brand_label || '',
      seoTitle: r.seo_title || undefined,
      seoDescription: r.seo_description || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      variants,
      images,
      claims,
    };
  },

  getVariantById(variantId: string): (VariantRecord & { productTitle: string; productSlug: string; imageUrl: string }) | null {
    const s = getSqlite();
    const v = s.prepare(`
      SELECT v.*, p.title as product_title, p.slug as product_slug,
        (SELECT url FROM product_images pi WHERE pi.product_id = v.product_id ORDER BY pi.position ASC LIMIT 1) as image_url
      FROM variants v
      JOIN products p ON v.product_id = p.id
      WHERE v.id = ? OR v.product_id = ?
      LIMIT 1
    `).get(variantId, variantId) as any;

    if (!v) return null;
    return {
      id: v.id,
      productId: v.product_id,
      sku: v.sku,
      option1Name: v.option1_name || undefined,
      option1Value: v.option1_value || undefined,
      option2Name: v.option2_name || undefined,
      option2Value: v.option2_value || undefined,
      priceCents: v.price_cents,
      costCents: v.cost_cents,
      compareAtCents: v.compare_at_cents || undefined,
      weightG: v.weight_g,
      supplierId: v.supplier_id || undefined,
      supplierSku: v.supplier_sku || undefined,
      supplierUrl: v.supplier_url || undefined,
      leadTimeDaysMin: v.lead_time_days_min || 3,
      leadTimeDaysMax: v.lead_time_days_max || 7,
      available: Boolean(v.available),
      imageId: v.image_id || undefined,
      productTitle: v.product_title,
      productSlug: v.product_slug,
      imageUrl: v.image_url || '/placeholder.png',
    };
  },

  // CATEGORIES
  getCategories(): CategoryRecord[] {
    const s = getSqlite();
    const rows = s.prepare('SELECT * FROM categories ORDER BY position ASC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      parentId: r.parent_id || undefined,
      slug: r.slug,
      name: r.name,
      description: r.description,
      imageId: r.image_id || undefined,
      position: r.position,
    }));
  },

  getCategoryBySlug(slug: string): CategoryRecord | null {
    const s = getSqlite();
    const r = s.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as any;
    if (!r) return null;
    return {
      id: r.id,
      parentId: r.parent_id || undefined,
      slug: r.slug,
      name: r.name,
      description: r.description,
      imageId: r.image_id || undefined,
      position: r.position,
    };
  },

  // CART & PRICING VERIFICATION
  calculateCartTotals(input: {
    items: { variantId: string; qty: number }[];
    couponCode?: string;
  }): {
    valid: boolean;
    errors: string[];
    subtotalCents: number;
    shippingCents: number;
    discountCents: number;
    taxCents: number;
    totalCents: number;
    verifiedItems: {
      variantId: string;
      title: string;
      sku: string;
      priceCents: number;
      costCents: number;
      qty: number;
      imageUrl: string;
    }[];
    appliedCoupon?: CouponRecord;
  } {
    const verifiedItems: any[] = [];
    const errors: string[] = [];
    let subtotalCents = 0;

    for (const item of input.items) {
      const v = this.getVariantById(item.variantId);
      if (!v) {
        errors.push(`Variant ${item.variantId} not found`);
        continue;
      }
      if (!v.available) {
        errors.push(`"${v.productTitle}" is currently unavailable from supplier`);
        continue;
      }
      const qty = Math.max(1, Math.floor(item.qty || 1));
      subtotalCents += v.priceCents * qty;
      verifiedItems.push({
        variantId: v.id,
        title: v.productTitle + (v.option1Value ? ` (${v.option1Value})` : ''),
        sku: v.sku,
        priceCents: v.priceCents,
        costCents: v.costCents,
        qty,
        imageUrl: v.imageUrl,
      });
    }

    if (verifiedItems.length === 0) {
      return {
        valid: false,
        errors: errors.length > 0 ? errors : ['Cart is empty'],
        subtotalCents: 0,
        shippingCents: 0,
        discountCents: 0,
        taxCents: 0,
        totalCents: 0,
        verifiedItems: [],
      };
    }

    // Coupon calculation
    let discountCents = 0;
    let freeShippingCoupon = false;
    let appliedCoupon: CouponRecord | undefined = undefined;

    if (input.couponCode) {
      const c = this.getCouponByCode(input.couponCode);
      if (c) {
        if (subtotalCents >= c.minSubtotalCents) {
          appliedCoupon = c;
          if (c.type === 'percentage') {
            discountCents = Math.round((subtotalCents * c.valueCents) / 10000);
          } else {
            discountCents = Math.min(subtotalCents, c.valueCents);
          }
          if (c.freeShipping) {
            freeShippingCoupon = true;
          }
        }
      }
    }

    // Shipping threshold rule
    let shippingCents = storeConfig.standardShippingRateCents;
    if (subtotalCents >= storeConfig.freeShippingThresholdCents || freeShippingCoupon) {
      shippingCents = 0;
    }

    const taxCents = 0; // State taxes calculated at payment element
    const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents + taxCents);

    return {
      valid: true,
      errors,
      subtotalCents,
      shippingCents,
      discountCents,
      taxCents,
      totalCents,
      verifiedItems,
      appliedCoupon,
    };
  },

  // ORDERS
  createOrder(data: {
    email: string;
    items: { variantId: string; qty: number }[];
    couponCode?: string;
    shippingAddress: any;
    paymentProvider?: string;
    paymentRef?: string;
  }): OrderRecord {
    const s = getSqlite();
    const calculation = this.calculateCartTotals({
      items: data.items,
      couponCode: data.couponCode,
    });

    if (!calculation.valid) {
      throw new Error(`Cannot create order: ${calculation.errors.join(', ')}`);
    }

    // Next sequential order number
    s.exec('BEGIN TRANSACTION');
    try {
      const seqRow = s.prepare('SELECT next_number FROM order_sequence WHERE id = 1').get() as any;
      const nextNum = seqRow?.next_number || 100001;
      s.prepare('UPDATE order_sequence SET next_number = next_number + 1 WHERE id = 1').run();

      const orderNumber = `ZP-${nextNum}`;
      const orderId = `ord_${Date.now()}_${nextNum}`;
      const now = new Date().toISOString();

      s.prepare(`
        INSERT INTO orders (
          id, number, email, status, currency, subtotal_cents, shipping_cents,
          tax_cents, discount_cents, total_cents, coupon_code, payment_provider,
          payment_ref, shipping_address, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderId,
        orderNumber,
        data.email,
        'pending_payment',
        storeConfig.currency,
        calculation.subtotalCents,
        calculation.shippingCents,
        calculation.taxCents,
        calculation.discountCents,
        calculation.totalCents,
        data.couponCode || null,
        data.paymentProvider || 'stripe',
        data.paymentRef || null,
        JSON.stringify(data.shippingAddress),
        now,
        now
      );

      for (const item of calculation.verifiedItems) {
        s.prepare(`
          INSERT INTO order_items (
            id, order_id, variant_id, title_snapshot, price_snapshot_cents,
            cost_snapshot_cents, qty, image_snapshot
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          orderId,
          item.variantId,
          item.title,
          item.priceCents,
          item.costCents,
          item.qty,
          item.imageUrl
        );
      }

      s.exec('COMMIT');

      if (calculation.appliedCoupon) {
        this.incrementCouponUsage(calculation.appliedCoupon.code);
      }

      return this.getOrderById(orderId)!;
    } catch (err) {
      s.exec('ROLLBACK');
      throw err;
    }
  },

  getOrderById(id: string): OrderRecord | null {
    const s = getSqlite();
    const row = s.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    if (!row) return null;
    return this.hydrateOrder(row);
  },

  getOrderByNumber(number: string): OrderRecord | null {
    const s = getSqlite();
    const row = s.prepare('SELECT * FROM orders WHERE number = ?').get(number) as any;
    if (!row) return null;
    return this.hydrateOrder(row);
  },

  getOrderByNumberAndEmail(number: string, email: string): OrderRecord | null {
    const s = getSqlite();
    const row = s.prepare('SELECT * FROM orders WHERE number = ? AND LOWER(email) = LOWER(?)').get(number, email) as any;
    if (!row) return null;
    return this.hydrateOrder(row);
  },

  getOrders(filters?: { status?: string; limit?: number; offset?: number }): OrderRecord[] {
    const s = getSqlite();
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];
    if (filters?.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    query += ' ORDER BY created_at DESC';
    if (filters?.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    if (filters?.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
    const rows = s.prepare(query).all(...params) as any[];
    return rows.map((r) => this.hydrateOrder(r));
  },

  updateOrderStatus(orderId: string, status: string, paymentRef?: string): boolean {
    const s = getSqlite();
    const now = new Date().toISOString();
    if (paymentRef) {
      s.prepare('UPDATE orders SET status = ?, payment_ref = ?, updated_at = ? WHERE id = ?').run(status, paymentRef, now, orderId);
    } else {
      s.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').run(status, now, orderId);
    }
    return true;
  },

  addShipment(data: {
    orderId: string;
    supplierId?: string;
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
  }): ShipmentRecord {
    const s = getSqlite();
    const id = `ship_${Date.now()}`;
    const now = new Date().toISOString();
    s.prepare(`
      INSERT INTO shipments (
        id, order_id, supplier_id, carrier, tracking_number, tracking_url, shipped_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.orderId, data.supplierId || null, data.carrier, data.trackingNumber, data.trackingUrl || null, now);

    this.updateOrderStatus(data.orderId, 'shipped');
    return {
      id,
      orderId: data.orderId,
      carrier: data.carrier,
      trackingNumber: data.trackingNumber,
      trackingUrl: data.trackingUrl,
      shippedAt: now,
    };
  },

  hydrateOrder(row: any): OrderRecord {
    const s = getSqlite();
    const items = (s.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as any[]).map((it) => ({
      id: it.id,
      orderId: it.order_id,
      variantId: it.variant_id,
      titleSnapshot: it.title_snapshot,
      priceSnapshotCents: it.price_snapshot_cents,
      costSnapshotCents: it.cost_snapshot_cents,
      qty: it.qty,
      imageSnapshot: it.image_snapshot || undefined,
    }));

    const shipments = (s.prepare('SELECT * FROM shipments WHERE order_id = ?').all(row.id) as any[]).map((sh) => ({
      id: sh.id,
      orderId: sh.order_id,
      supplierId: sh.supplier_id || undefined,
      supplierOrderRef: sh.supplier_order_ref || undefined,
      carrier: sh.carrier || undefined,
      trackingNumber: sh.tracking_number || undefined,
      trackingUrl: sh.tracking_url || undefined,
      shippedAt: sh.shipped_at || undefined,
      deliveredAt: sh.delivered_at || undefined,
    }));

    return {
      id: row.id,
      number: row.number,
      email: row.email,
      status: row.status,
      currency: row.currency,
      subtotalCents: row.subtotal_cents,
      shippingCents: row.shipping_cents,
      taxCents: row.tax_cents,
      discountCents: row.discount_cents,
      totalCents: row.total_cents,
      couponCode: row.coupon_code || undefined,
      paymentProvider: row.payment_provider,
      paymentRef: row.payment_ref || undefined,
      shippingAddress: JSON.parse(row.shipping_address || '{}'),
      items,
      shipments,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  },

  // COUPONS
  getCouponByCode(code: string): CouponRecord | null {
    const s = getSqlite();
    const r = s.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?)').get(code) as any;
    if (!r) return null;
    return {
      id: r.id,
      code: r.code,
      type: r.type,
      valueCents: r.value_cents,
      minSubtotalCents: r.min_subtotal_cents || 0,
      freeShipping: Boolean(r.free_shipping),
      startsAt: r.starts_at || undefined,
      endsAt: r.ends_at || undefined,
      usageLimit: r.usage_limit || undefined,
      usedCount: r.used_count || 0,
    };
  },

  incrementCouponUsage(code: string) {
    const s = getSqlite();
    s.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = UPPER(?)').run(code);
  },

  listCoupons(): CouponRecord[] {
    const s = getSqlite();
    const rows = s.prepare('SELECT * FROM coupons ORDER BY code ASC').all() as any[];
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      type: r.type,
      valueCents: r.value_cents,
      minSubtotalCents: r.min_subtotal_cents || 0,
      freeShipping: Boolean(r.free_shipping),
      startsAt: r.starts_at || undefined,
      endsAt: r.ends_at || undefined,
      usageLimit: r.usage_limit || undefined,
      usedCount: r.used_count || 0,
    }));
  },

  // REVIEWS
  getReviewsByProductId(productId: string): any[] {
    const s = getSqlite();
    const rows = s.prepare("SELECT * FROM reviews WHERE product_id = ? AND status = 'published' ORDER BY created_at DESC").all(productId) as any[];
    return rows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      photos: JSON.parse(r.photos || '[]'),
      status: r.status,
      createdAt: r.created_at,
    }));
  },

  // NEWSLETTER SUBSCRIBERS
  addSubscriber(email: string): boolean {
    const s = getSqlite();
    const id = `sub_${Date.now()}`;
    const now = new Date().toISOString();
    try {
      s.prepare('INSERT OR IGNORE INTO subscribers (id, email, status, subscribed_at) VALUES (?, ?, ?, ?)').run(id, email.toLowerCase(), 'active', now);
      return true;
    } catch {
      return false;
    }
  },

  // ANALYTICS & AUDIT LOGS
  logEvent(name: string, payload: any) {
    const s = getSqlite();
    const id = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    s.prepare('INSERT INTO events (id, event_name, payload, created_at) VALUES (?, ?, ?, ?)').run(id, name, JSON.stringify(payload), now);
  },
};

export default db;
