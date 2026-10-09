# ZenPaaw Store Operations & Deployment Guide

This document details the configuration, administration, supplier fulfillment workflows, and deployment procedures for the ZenPaaw pet toy storefront.

---

## 1. Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```bash
# Next.js Application
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://zenpaaw.com

# Database
DATABASE_URL=./.zenpaaw.sqlite

# Administrative Security
ADMIN_EMAIL=admin@zenpaaw.com
ADMIN_PASSWORD=your_secure_admin_password_here
SESSION_SECRET=at_least_32_characters_random_string_for_jwt_signing

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

All environment variables are validated at build time and runtime via `@t3-oss/env-nextjs` in `src/env.ts`.

---

## 2. Installation & Database Seeding

### Prerequisites
- Node.js 20.x or 22.x LTS
- npm 10.x or higher

### Commands
```bash
# Install dependencies
npm install

# Run database migration and seed the catalog with 100 products & 400 images
npx tsx scripts/seed.ts

# Start development server with Turbopack
npm run dev

# Run full production build
npm run build
```

---

## 3. Administrative Portal & Operations

The administration center is hosted at `/admin`.

### Access
- **URL**: `https://zenpaaw.com/admin`
- **Default Development Credentials**:
  - Email: `admin@zenpaaw.com`
  - Password: `zenpaaw2026` (change immediately in production `.env.local`)
- **Security Features**:
  - Signed JWT session cookie (`zenpaaw_admin_session`) with `httpOnly`, `sameSite: lax`, and `secure` flags.
  - Constant-time password comparison to prevent timing side-channel attacks.
  - In-memory rate limiting (max 5 attempts per 15-minute window).

### Administrative Capabilities
1. **Customer Orders Queue**:
   - Filter orders by status: `All`, `Needs Dispatch`, and `Shipped`.
   - Export full orders history to CSV (`Export CSV`).
2. **Supplier Dispatcher**:
   - Select an order to review recipient details and purchased items.
   - Click **"Copy Supplier Order Details"** to copy a standardized address and SKU block formatted for CJ Dropshipping, AliExpress, or DSers entry.
   - Update order status: `pending_payment` -> `paid` -> `sent_to_supplier` -> `shipped` -> `delivered`.
   - Enter tracking carrier (`USPS`, `UPS`, `YunExpress`, `Cainiao`, etc.) and tracking number.
3. **Catalog & Margin Engine**:
   - View retail prices, supplier costs, and calculated gross margin percentages.
   - Automated **Margin Warning Badge** when gross margin is under 40%.
   - Export product catalog to CSV (`Export Catalog CSV`).
4. **Site Announcement Banner**:
   - Edit the top promotional ticker without redeploying code.

---

## 4. Dropshipping Fulfillment Workflow

Follow this procedure for each paid customer order:

1. **Order Detection**:
   - Open `/admin` and filter by **"Needs Dispatch"**.
   - Select the paid order from the list.
2. **Supplier Order Placement**:
   - Click **"Copy Supplier Order Details"**.
   - Navigate to your dropshipping supplier (e.g. CJ Dropshipping or AliExpress).
   - Paste the copied recipient details into the supplier checkout and purchase the corresponding SKUs.
   - Set status in ZenPaaw admin to **"sent_to_supplier"**.
3. **Carrier Tracking Entry**:
   - When the supplier provides the tracking number (typically within 24-48 hours), re-open the order in `/admin`.
   - Select the carrier (e.g. `USPS` or `YunExpress`).
   - Paste the tracking number into **"Carrier Tracking Number"** and click **"Save Fulfillment Update"**.
   - The order status automatically transitions to **"shipped"**.
4. **Customer Tracking**:
   - Customers can immediately track their package at `/track` using their order number (e.g. `ZP-100001`) and email address.

---

## 5. Quality Assurance & Verification Commands

All quality gates must pass before deploying changes:

```bash
# 1. Typecheck
npm run typecheck

# 2. Unit testing (Vitest)
npm run test

# 3. Copy & policy audit (zero banned words, zero emojis)
npm run audit:copy

# 4. Product claims audit (zero unverified health claims)
npm run audit:claims

# 5. Security audit (zero exposed secrets, protected admin APIs)
npm run audit:security

# 6. Image audit (zero duplicate or banned images)
npm run audit:images

# 7. Production launch check
npm run launch:check

# 8. Turbopack production build
npm run build
```

---

## 6. Going Live

1. Provision a Node.js hosting platform (e.g. Vercel, Railway, AWS ECS, or a VPS with PM2).
2. Set all production environment variables in your hosting dashboard.
3. Ensure `.zenpaaw.sqlite` is persisted on a persistent volume if deploying on containerized environments.
4. Set up DNS records for `zenpaaw.com` pointing to your host.
5. Perform an end-to-end test checkout using Stripe test credentials, verify the order appears in `/admin`, and complete a test shipment transition.
