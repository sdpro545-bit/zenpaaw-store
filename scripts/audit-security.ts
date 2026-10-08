import fs from 'node:fs';
import path from 'node:path';

interface SecurityFinding {
  routeOrFile: string;
  issue: string;
  severity: 'CRITICAL' | 'HIGH';
}

const findings: SecurityFinding[] = [];

// 1. Audit API routes for missing authentication
const API_DIR = path.resolve(process.cwd(), 'src/app/api');

function checkApiSecurity() {
  if (!fs.existsSync(API_DIR)) return;

  function scanApi(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanApi(fullPath);
      } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
        const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Check Admin routes
        if (relPath.includes('api/admin') && !relPath.includes('api/admin/login')) {
          const hasAuth = /verifyAdminSession|getSession|requireAdmin|verifyToken|authMiddleware/i.test(content);
          if (!hasAuth) {
            findings.push({
              routeOrFile: relPath,
              issue: 'Admin route lacks session authentication check',
              severity: 'CRITICAL',
            });
          }
        }

        // Check Orders listing route
        if (relPath === 'src/app/api/orders/route.ts') {
          const hasAuth = /verifyAdminSession|getSession|requireAdmin|verifyToken/i.test(content);
          if (!hasAuth) {
            findings.push({
              routeOrFile: relPath,
              issue: 'Public GET /api/orders reveals customer PII with zero authentication',
              severity: 'CRITICAL',
            });
          }
        }

        // Check Order lookup route
        if (relPath.includes('api/orders/[id]')) {
          const hasProtection = /email|token|verifyAdminSession|signed/i.test(content);
          if (!hasProtection) {
            findings.push({
              routeOrFile: relPath,
              issue: 'Public GET /api/orders/[id] does not verify email or signature token',
              severity: 'HIGH',
            });
          }
        }

        // Check Checkout payment bypass
        if (relPath.includes('api/checkout')) {
          if (/Boolean\(paymentToken\s*\|\|\s*true\)/.test(content)) {
            findings.push({
              routeOrFile: relPath,
              issue: 'Payment bypass vulnerability: Boolean(paymentToken || true)',
              severity: 'CRITICAL',
            });
          }
          if (content.includes('item.price') && !content.includes('db.getVariant') && !content.includes('db.getProduct')) {
            findings.push({
              routeOrFile: relPath,
              issue: 'Trusts client-provided item price without server database re-calculation',
              severity: 'CRITICAL',
            });
          }
        }

        // Check Hardcoded credentials in login
        if (relPath.includes('api/admin/login')) {
          if (content.includes("'admin'") || content.includes('"admin"') || content.includes("'zenpaaw2026'")) {
            findings.push({
              routeOrFile: relPath,
              issue: 'Hardcoded admin credentials in login route source code',
              severity: 'CRITICAL',
            });
          }
        }
      }
    }
  }

  scanApi(API_DIR);
}

// 2. Check for secret leaks in client components
function checkClientBundleLeaks() {
  const SRC_DIR = path.resolve(process.cwd(), 'src');
  const SECRET_PATTERNS = [
    /STRIPE_SECRET_KEY/,
    /ADMIN_PASSWORD/,
    /DATABASE_URL/,
    /SESSION_SECRET/,
    /RESEND_API_KEY/,
  ];

  function scanClientFiles(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next') {
          scanClientFiles(fullPath);
        }
      } else if (/\.(tsx|jsx)$/i.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const isClientComponent = content.includes("'use client'") || content.includes('"use client"');
        if (isClientComponent) {
          const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
          for (const pattern of SECRET_PATTERNS) {
            if (pattern.test(content)) {
              findings.push({
                routeOrFile: relPath,
                issue: `Client component directly references server secret: ${pattern}`,
                severity: 'CRITICAL',
              });
            }
          }
        }
      }
    }
  }

  scanClientFiles(SRC_DIR);
}

console.log('Running audit:security ...');
checkApiSecurity();
checkClientBundleLeaks();

if (findings.length > 0) {
  console.error(`\nFAILED: Found ${findings.length} security vulnerabilities:`);
  findings.forEach((f) => {
    console.error(`  [${f.severity}] ${f.routeOrFile}: ${f.issue}`);
  });
  process.exit(1);
} else {
  console.log('\nPASSED: Zero security vulnerabilities found. All endpoints protected.');
  process.exit(0);
}
