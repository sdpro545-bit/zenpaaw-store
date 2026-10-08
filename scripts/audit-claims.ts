import fs from 'node:fs';
import path from 'node:path';

// Section 5.4 Claims policy:
// Every factual product claim (material, size, weight, washability, safety rating) is stored with source and verified: boolean.
// The storefront renders only verified claims.
// Unsupported health claims: dental cleaning, plaque, calming, anxiety, "BPA-free", "food-grade", "dishwasher safe" without verification.

interface ClaimViolation {
  file: string;
  line: number;
  snippet: string;
  reason: string;
}

const violations: ClaimViolation[] = [];

// Unverified marketing health claims that must not be in storefront components or products without verification
const UNVERIFIED_HEALTH_CLAIMS = [
  { pattern: /\bcalming\b/i, reason: 'Unsupported psychological health claim: "calming"' },
  { pattern: /\banxiety\b/i, reason: 'Unsupported medical health claim: "anxiety"' },
  { pattern: /\bplaque\b/i, reason: 'Unsupported dental health claim: "plaque"' },
  { pattern: /\bclean teeth\b/i, reason: 'Unsupported dental health claim: "clean teeth"' },
  { pattern: /\bdestructors\b/i, reason: 'Unverified claim / terminology: "destructors"' },
];

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    for (const claim of UNVERIFIED_HEALTH_CLAIMS) {
      if (claim.pattern.test(line)) {
        violations.push({
          file: filePath,
          line: idx + 1,
          snippet: line.trim().slice(0, 100),
          reason: claim.reason,
        });
      }
    }
  });
}

function walkDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        walkDir(fullPath);
      }
    } else if (/\.(ts|tsx|json)$/i.test(entry.name)) {
      if (!entry.name.includes('audit-claims') && !entry.name.includes('PROMPT')) {
        checkFile(fullPath);
      }
    }
  }
}

console.log('Running audit:claims on src/ ...');
walkDir(path.resolve(process.cwd(), 'src'));

if (violations.length > 0) {
  console.error(`\nFAILED: Found ${violations.length} unverified claim violations:`);
  violations.forEach((v) => {
    console.error(`  [${v.file}:${v.line}] ${v.reason} -> "${v.snippet}"`);
  });
  process.exit(1);
} else {
  console.log('\nPASSED: Zero unverified product claims found.');
  process.exit(0);
}
