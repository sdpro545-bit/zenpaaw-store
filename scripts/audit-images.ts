import { execSync } from 'node:child_process';
import path from 'node:path';

try {
  console.log('Running audit:images ...');
  const pythonScript = path.resolve(process.cwd(), 'scripts/audit_images.py');
  const output = execSync(`python "${pythonScript}"`, { encoding: 'utf-8', stdio: 'inherit' });
  process.exit(0);
} catch (error: any) {
  process.exit(error.status || 1);
}
