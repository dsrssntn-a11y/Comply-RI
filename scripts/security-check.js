import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const filesToScan = [
  '.env',
  '.env.local',
  '.env.production',
  'vercel.json',
  'package.json',
  'src',
];

const secretPatterns = [
  /AIza[0-9A-Za-z\-_]{35}/,
  /ghp_[A-Za-z0-9]{36}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9]{16,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----/,
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return [fullPath];
  });
}

let issues = [];

for (const target of filesToScan) {
  const fullPath = path.join(root, target);
  if (!fs.existsSync(fullPath)) {
    continue;
  }

  if (fs.statSync(fullPath).isDirectory()) {
    const files = walk(fullPath).filter((file) => fs.statSync(file).isFile());
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of secretPatterns) {
        if (pattern.test(content)) {
          issues.push(`Potential secret detected in ${path.relative(root, file)}`);
        }
      }
    }
  } else {
    const content = fs.readFileSync(fullPath, 'utf8');
    for (const pattern of secretPatterns) {
      if (pattern.test(content)) {
        issues.push(`Potential secret detected in ${target}`);
      }
    }
  }
}

const vercelConfigPath = path.join(root, 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  issues.push('Missing vercel.json security configuration');
}

if (issues.length > 0) {
  console.error('Security check failed:');
  issues.forEach((issue) => console.error(`- ${issue}`));
  process.exit(1);
}

console.log('Security check passed.');
