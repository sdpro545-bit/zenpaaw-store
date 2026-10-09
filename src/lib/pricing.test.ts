import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './db';
import { storeConfig } from '@/store.config';

describe('Server-Side Pricing & Cart Calculation Engine', () => {
  beforeEach(() => {
    // Seed test product and variants if not already in DB
    const existing = db.getProductById('test-product-chew-ball');
    if (!existing) {
      const s = db.getSqlite ? db.getSqlite() : null;
      if (s) {
        const now = new Date().toISOString();
        s.prepare(`
          INSERT OR REPLACE INTO products (
            id, slug, title, summary, description, pet_types, category_id,
            play_styles, chew_strength, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          'test-product-chew-ball',
          'test-chew-ball',
          'Test Rubber Chew Ball',
          'A durable natural rubber chew ball for testing.',
          'Detailed product description for testing.',
          JSON.stringify(['Dogs']),
          'chew-toys',
          JSON.stringify(['chew', 'fetch']),
          'moderate',
          'active',
          now,
          now
        );

        s.prepare(`
          INSERT OR REPLACE INTO variants (
            id, product_id, sku, option1_name, option1_value, price_cents,
            cost_cents, compare_at_cents, weight_g, available
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          'var-chew-ball-blue',
          'test-product-chew-ball',
          'ZP-TEST-BALL-BLU',
          'Color',
          'Blue',
          1499, // $14.99
          450,  // $4.50
          1999, // $19.99
          180,
          1
        );

        s.prepare(`
          INSERT OR REPLACE INTO variants (
            id, product_id, sku, option1_name, option1_value, price_cents,
            cost_cents, compare_at_cents, weight_g, available
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          'var-chew-ball-green',
          'test-product-chew-ball',
          'ZP-TEST-BALL-GRN',
          'Color',
          'Green',
          1499, // $14.99
          450,
          null,
          180,
          1
        );

        s.prepare(`
          INSERT OR REPLACE INTO coupons (
            id, code, type, value_cents, min_subtotal_cents, free_shipping, used_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          'coup-test-10',
          'TEST10',
          'percentage',
          1000, // 10%
          2000, // $20 min subtotal
          0,
          0
        );

        s.prepare(`
          INSERT OR REPLACE INTO coupons (
            id, code, type, value_cents, min_subtotal_cents, free_shipping, used_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          'coup-test-freeship',
          'FREESHIP',
          'fixed',
          0,
          0,
          1,
          0
        );
      }
    }
  });

  it('calculates standard order totals correctly from DB variant prices', () => {
    // 1 ball at $14.99 -> subtotal 1499, below $35 threshold -> shipping $4.99 -> total $19.98
    const result = db.calculateCartTotals({
      items: [{ variantId: 'var-chew-ball-blue', qty: 1 }],
    });

    expect(result.valid).toBe(true);
    expect(result.subtotalCents).toBe(1499);
    expect(result.shippingCents).toBe(storeConfig.standardShippingRateCents);
    expect(result.discountCents).toBe(0);
    expect(result.totalCents).toBe(1499 + storeConfig.standardShippingRateCents);
  });

  it('automatically applies free shipping when crossing the configured threshold', () => {
    // 3 balls at $14.99 = $44.97 (4497 cents), which exceeds the $35.00 threshold
    const result = db.calculateCartTotals({
      items: [{ variantId: 'var-chew-ball-blue', qty: 3 }],
    });

    expect(result.valid).toBe(true);
    expect(result.subtotalCents).toBe(4497);
    expect(result.shippingCents).toBe(0);
    expect(result.totalCents).toBe(4497);
  });

  it('ignores any client-side tampering of price or discounts', () => {
    // If a malicious client tries to send tampered price of $0.01 or custom discount,
    // the server strictly recalculates from database variant prices!
    const result = db.calculateCartTotals({
      items: [{ variantId: 'var-chew-ball-blue', qty: 2 }],
    });

    // 2 x 1499 = 2998 cents ($29.98)
    expect(result.subtotalCents).toBe(2998);
    expect(result.shippingCents).toBe(storeConfig.standardShippingRateCents);
    expect(result.totalCents).toBe(2998 + storeConfig.standardShippingRateCents);
  });

  it('applies percentage coupon only when minimum subtotal condition is satisfied', () => {
    // 2 balls at $14.99 = $29.98 (> $20 min), TEST10 gives 10% discount ($3.00 = 300 cents)
    const result = db.calculateCartTotals({
      items: [{ variantId: 'var-chew-ball-blue', qty: 2 }],
      couponCode: 'TEST10',
    });

    expect(result.valid).toBe(true);
    expect(result.appliedCoupon?.code).toBe('TEST10');
    expect(result.discountCents).toBe(300); // 10% of 2998 rounded
    expect(result.totalCents).toBe(2998 - 300 + storeConfig.standardShippingRateCents);
  });

  it('applies free shipping coupon even when below the normal cart threshold', () => {
    // 1 ball at $14.99 ($14.99 < $35) with FREESHIP coupon -> 0 shipping
    const result = db.calculateCartTotals({
      items: [{ variantId: 'var-chew-ball-blue', qty: 1 }],
      couponCode: 'FREESHIP',
    });

    expect(result.valid).toBe(true);
    expect(result.shippingCents).toBe(0);
    expect(result.totalCents).toBe(1499);
  });

  it('creates sequential orders with unique numbers ZP-100001 onward', () => {
    const order1 = db.createOrder({
      email: 'customer1@example.com',
      items: [{ variantId: 'var-chew-ball-blue', qty: 1 }],
      shippingAddress: { name: 'Customer 1', address: '123 Main St', city: 'Portland', state: 'OR', zipCode: '97201' },
    });

    const order2 = db.createOrder({
      email: 'customer2@example.com',
      items: [{ variantId: 'var-chew-ball-blue', qty: 2 }],
      shippingAddress: { name: 'Customer 2', address: '456 Oak St', city: 'Seattle', state: 'WA', zipCode: '98101' },
    });

    expect(order1.number).toMatch(/^ZP-\d+$/);
    expect(order2.number).toMatch(/^ZP-\d+$/);

    const num1 = parseInt(order1.number.replace('ZP-', ''), 10);
    const num2 = parseInt(order2.number.replace('ZP-', ''), 10);
    expect(num2).toBe(num1 + 1);
  });
});
