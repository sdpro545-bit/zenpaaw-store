import fs from 'node:fs';
import path from 'node:path';
import { db } from '../src/lib/db';

async function seed() {
  console.log('--- Starting ZenPaaw Database Seeder ---');
  const sqlite = db.getSqlite();

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
    { id: 'bundles', slug: 'bundles', name: 'Multi-Item Bundles', desc: 'Curated value bundles pairing complementary play styles.', pos: 18 },
  ];

  const catStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO categories (id, slug, name, description, position)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const c of categories) {
    catStmt.run(c.id, c.slug, c.name, c.desc, c.pos);
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 2. Collections
  const collections = [
    { id: 'col-new', slug: 'new-arrivals', name: 'New Arrivals', desc: 'Latest arrivals in durable and engaging pet play.' },
    { id: 'col-staff', slug: 'staff-picks', name: 'Staff Picks', desc: 'Hand-tested favorites recommended by our team.' },
    { id: 'col-under15', slug: 'under-15', name: 'Under $15', desc: 'High-value essentials under fifteen dollars.' },
    { id: 'col-chewers', slug: 'power-chewers', name: 'Power Chewers', desc: 'High-density rubber and composite toys built for strong chewers.' },
    { id: 'col-puppy', slug: 'puppy-starter', name: 'Puppy Starter', desc: 'Gentle textures and starter sets for growing pups.' },
    { id: 'col-indoor', slug: 'indoor-play', name: 'Indoor Play', desc: 'Quiet, floor-safe play toys for apartments and rainy days.' },
    { id: 'col-outdoor', slug: 'outdoor-water', name: 'Outdoor and Water', desc: 'High-visibility floating and aerodynamic park toys.' },
    { id: 'col-bundles', slug: 'bundles', name: 'Bundles & Sets', desc: 'Multi-item collections offering complete play variety.' },
  ];

  const colStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO collections (id, slug, name, description, rule_type)
    VALUES (?, ?, ?, ?, 'manual')
  `);

  for (const col of collections) {
    colStmt.run(col.id, col.slug, col.name, col.desc);
  }
  console.log(`Seeded ${collections.length} collections.`);

  // 3. Suppliers
  const suppliers = [
    {
      id: 'sup-us-direct',
      name: 'US Pet Supplies Warehouse',
      contact: 'orders@uspetwarehouse.example.com',
      country: 'US',
      proc: 1,
      deliv: JSON.stringify({ US: '3-5 business days', CA: '5-8 business days' }),
      notes: 'Domestic warehouse stocking unbranded durable pet gear.',
    },
    {
      id: 'sup-eu-logistics',
      name: 'European Pet Care Hub',
      contact: 'b2b@eupetcare.example.com',
      country: 'DE',
      proc: 2,
      deliv: JSON.stringify({ EU: '3-6 business days', UK: '4-7 business days' }),
      notes: 'European distribution partner for unbranded cat and dog items.',
    },
  ];

  const supStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO suppliers (id, name, contact, warehouse_country, avg_processing_days, avg_delivery_days_by_region, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const s of suppliers) {
    supStmt.run(s.id, s.name, s.contact, s.country, s.proc, s.deliv, s.notes);
  }
  console.log(`Seeded ${suppliers.length} suppliers.`);

  // 4. Coupons
  const coupons = [
    { id: 'c-welcome10', code: 'WELCOME10', type: 'percentage', val: 10, minSub: 2000, freeShip: 0 },
    { id: 'c-freeship', code: 'FREESHIP', type: 'fixed', val: 0, minSub: 0, freeShip: 1 },
    { id: 'c-save5', code: 'SAVE5', type: 'fixed', val: 500, minSub: 3000, freeShip: 0 },
  ];

  const coupStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO coupons (id, code, type, value_cents, min_subtotal_cents, free_shipping, used_count)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `);

  for (const c of coupons) {
    coupStmt.run(c.id, c.code, c.type, c.val, c.minSub, c.freeShip);
  }
  console.log(`Seeded ${coupons.length} coupons.`);

  // 5. Products from catalog.seed.json
  const seedJsonPath = path.resolve(process.cwd(), 'data', 'catalog.seed.json');
  if (!fs.existsSync(seedJsonPath)) {
    throw new Error(`File not found: ${seedJsonPath}. Run build_catalog.py first.`);
  }

  const raw = fs.readFileSync(seedJsonPath, 'utf-8');
  const catalog = JSON.parse(raw);

  const prodStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO products (
      id, slug, title, summary, description, pet_types, category_id,
      play_styles, chew_strength, status, brand_label, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const varStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO variants (
      id, product_id, sku, option1_name, option1_value, option2_name, option2_value,
      price_cents, cost_cents, compare_at_cents, weight_g, supplier_id, supplier_sku,
      supplier_url, lead_time_days_min, lead_time_days_max, available, image_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const imgStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO product_images (
      id, product_id, variant_id, url, alt, position, width, height, phash, source_url, license, reviewed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const claimStmt = sqlite.prepare(`
    INSERT OR REPLACE INTO claims (
      id, product_id, key, value, source_url, verified
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const colItemStmt = sqlite.prepare(`
    INSERT OR IGNORE INTO collection_items (id, collection_id, product_id, position)
    VALUES (?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  let totalVariants = 0;
  let totalImages = 0;
  let totalClaims = 0;

  for (let pIdx = 0; pIdx < catalog.length; pIdx++) {
    const p = catalog[pIdx];

    prodStmt.run(
      p.id,
      p.slug,
      p.title || p.name,
      p.summary || '',
      p.description || '',
      JSON.stringify(p.petTypes || p.pet_types || ['Dogs']),
      p.categoryId || p.category_id,
      JSON.stringify(p.playStyles || p.play_styles || ['chew']),
      p.chewStrength || p.chew_strength || 'moderate',
      'active',
      p.brandLabel || '',
      now,
      now
    );

    // Variants
    if (p.variants && Array.isArray(p.variants)) {
      for (const v of p.variants) {
        varStmt.run(
          v.id,
          p.id,
          v.sku,
          v.option1Name || null,
          v.option1Value || null,
          v.option2Name || null,
          v.option2Value || null,
          v.priceCents || Math.round((p.price || 15) * 100),
          v.costCents || Math.round((v.priceCents || 1500) * 0.3),
          v.compareAtCents || null,
          v.weightG || 200,
          p.supplier?.id || 'sup-us-direct',
          v.sku,
          'https://uspetwarehouse.example.com/sku/' + v.sku,
          p.supplier?.leadTimeDaysMin || 3,
          p.supplier?.leadTimeDaysMax || 7,
          v.available !== false ? 1 : 0,
          v.imageId || null
        );
        totalVariants++;
      }
    }

    // Images
    if (p.images && Array.isArray(p.images)) {
      for (let iIdx = 0; iIdx < p.images.length; iIdx++) {
        const img = p.images[iIdx];
        const imgUrl = typeof img === 'string' ? img : img.url;
        const imgAlt = typeof img === 'string' ? `${p.title} view ${iIdx + 1}` : img.alt;
        const imgId = typeof img === 'string' ? `img-${p.slug}-${iIdx + 1}` : img.id;

        imgStmt.run(
          imgId,
          p.id,
          img.variantId || null,
          imgUrl,
          imgAlt,
          img.position || iIdx + 1,
          img.width || 1000,
          img.height || 1000,
          img.phash || null,
          img.sourceUrl || null,
          'Creative Commons / Unbranded',
          1
        );
        totalImages++;
      }
    }

    // Claims
    if (p.claims && Array.isArray(p.claims)) {
      for (let cIdx = 0; cIdx < p.claims.length; cIdx++) {
        const c = p.claims[cIdx];
        claimStmt.run(
          `clm-${p.slug}-${cIdx + 1}`,
          p.id,
          c.key,
          c.value,
          c.sourceUrl || 'supplier-spec-sheet',
          c.verified ? 1 : 0
        );
        totalClaims++;
      }
    }

    // Collection assignments
    if (pIdx < 12) {
      colItemStmt.run(`ci-new-${p.id}`, 'col-new', p.id, pIdx);
    }
    if (p.priceCents < 1500 || (p.price && p.price < 15)) {
      colItemStmt.run(`ci-u15-${p.id}`, 'col-under15', p.id, pIdx);
    }
    if (p.chewStrength === 'power') {
      colItemStmt.run(`ci-chw-${p.id}`, 'col-chewers', p.id, pIdx);
    }
    if (p.categoryId?.startsWith('puppy-')) {
      colItemStmt.run(`ci-pup-${p.id}`, 'col-puppy', p.id, pIdx);
    }
    if (p.categoryId === 'bundles') {
      colItemStmt.run(`ci-bdl-${p.id}`, 'col-bundles', p.id, pIdx);
    }
    if (pIdx % 8 === 0) {
      colItemStmt.run(`ci-stf-${p.id}`, 'col-staff', p.id, pIdx);
    }
  }

  console.log(`Seeded ${catalog.length} products, ${totalVariants} variants, ${totalImages} images, ${totalClaims} claims.`);
  console.log('--- Database Seeding Successfully Completed ---');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
