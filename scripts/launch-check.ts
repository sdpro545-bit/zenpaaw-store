import fs from 'node:fs';
import path from 'node:path';

console.log('Running launch:check ...');

const configPath = path.resolve(process.cwd(), 'src/store.config.ts');
const errors: string[] = [];

if (!fs.existsSync(configPath)) {
  errors.push('src/store.config.ts does not exist');
} else {
  const content = fs.readFileSync(configPath, 'utf-8');
  const placeholderPatterns = [
    /TODO/i,
    /CHANGEME/i,
    /placeholder/i,
    /example\.com/i,
    /\+1\s*\(555\)/i,
    /00000000/,
  ];

  placeholderPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      errors.push(`store.config.ts contains unconfigured placeholder matching: ${pattern}`);
    }
  });
}

// Check env template / example
const envExamplePath = path.resolve(process.cwd(), '.env.example');
if (!fs.existsSync(envExamplePath)) {
  errors.push('.env.example does not exist');
}

if (errors.length > 0) {
  console.error(`\nFAILED: launch:check failed with ${errors.length} issues:`);
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log('\nPASSED: Store configuration and environment setup are complete.');
  process.exit(0);
}
