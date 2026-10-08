import fs from 'node:fs';
import path from 'node:path';

// Section 5.1 Banned words and phrases
const BANNED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bthoughtfully\b/i, reason: 'Banned marketing word: "thoughtfully"' },
  { pattern: /\bengineered\b/i, reason: 'Banned word unless literally engineering: "engineered"' },
  { pattern: /\bergonomic\b/i, reason: 'Banned word unless measurement given: "ergonomic"' },
  { pattern: /\bcurated\b/i, reason: 'Banned marketing word: "curated"' },
  { pattern: /\bpremium\b/i, reason: 'Banned marketing word: "premium"' },
  { pattern: /\belevate\b/i, reason: 'Banned marketing word: "elevate"' },
  { pattern: /\bunleash\b/i, reason: 'Banned marketing word: "unleash"' },
  { pattern: /\bseamless\b/i, reason: 'Banned marketing word: "seamless"' },
  { pattern: /\beffortless\b/i, reason: 'Banned marketing word: "effortless"' },
  { pattern: /\bgame-changer\b/i, reason: 'Banned buzzword: "game-changer"' },
  { pattern: /\brevolutionary\b/i, reason: 'Banned buzzword: "revolutionary"' },
  { pattern: /\bcutting-edge\b/i, reason: 'Banned buzzword: "cutting-edge"' },
  { pattern: /\bstate-of-the-art\b/i, reason: 'Banned buzzword: "state-of-the-art"' },
  { pattern: /\bnext-level\b/i, reason: 'Banned buzzword: "next-level"' },
  { pattern: /\bultimate\b/i, reason: 'Banned buzzword: "ultimate"' },
  { pattern: /\bbespoke\b/i, reason: 'Banned buzzword: "bespoke"' },
  { pattern: /\bworld-class\b/i, reason: 'Banned buzzword: "world-class"' },
  { pattern: /\bcrafted\b/i, reason: 'Banned buzzword: "crafted"' },
  { pattern: /\bjourney\b/i, reason: 'Banned buzzword: "journey"' },
  { pattern: /\btailored\b/i, reason: 'Banned buzzword: "tailored"' },
  { pattern: /no friction/i, reason: 'Banned phrase: "no friction"' },
  { pattern: /zero spam/i, reason: 'Banned phrase: "zero spam"' },
  { pattern: /furry friend/i, reason: 'Banned phrase: "furry friend"' },
  { pattern: /registered trademark/i, reason: 'Banned unsupported claim: "Registered Trademark"' },
];

// Emoji regex covering general unicode emoji ranges
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/u;

// Fake social proof checks
const FAKE_PROOF_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /rating:\s*4\.[789]/i, reason: 'Fabricated rating (4.7-4.9)' },
  { pattern: /reviewCount:\s*\d+/i, reason: 'Fabricated review count' },
  { pattern: /stockCount:\s*\d+/i, reason: 'Fabricated stock count / scarcity' },
  { pattern: /verified buyer/i, reason: 'Fabricated "verified buyer" badge' },
];

interface Violation {
  file: string;
  line: number;
  snippet: string;
  reason: string;
}

const violations: Violation[] = [];

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Skip comments if desired, but prompt says zero emoji even in comments
    // Check banned words
    for (const { pattern, reason } of BANNED_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: idx + 1,
          snippet: line.trim().slice(0, 100),
          reason,
        });
      }
    }

    // Check emoji
    if (EMOJI_REGEX.test(line)) {
      violations.push({
        file: filePath,
        line: idx + 1,
        snippet: line.trim().slice(0, 100),
        reason: 'Forbidden emoji found in code/copy',
      });
    }

    // Check fake social proof
    for (const { pattern, reason } of FAKE_PROOF_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: filePath,
          line: idx + 1,
          snippet: line.trim().slice(0, 100),
          reason,
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
    } else if (/\.(ts|tsx|js|jsx|json|md)$/i.test(entry.name)) {
      // Exclude prompt and audit reports themselves from flagging their own banned word list
      if (!entry.name.includes('audit-copy') && !entry.name.includes('PROMPT') && !entry.name.includes('AUDIT_REPORT')) {
        scanFile(fullPath);
      }
    }
  }
}

console.log('Running audit:copy on src/ and content/ ...');
walkDir(path.resolve(process.cwd(), 'src'));
walkDir(path.resolve(process.cwd(), 'content'));

if (violations.length > 0) {
  console.error(`\nFAILED: Found ${violations.length} copy / policy violations:`);
  violations.forEach((v) => {
    console.error(`  [${v.file}:${v.line}] ${v.reason} -> "${v.snippet}"`);
  });
  process.exit(1);
} else {
  console.log('\nPASSED: Zero copy violations found. Tone is clean, honest, and plain.');
  process.exit(0);
}
