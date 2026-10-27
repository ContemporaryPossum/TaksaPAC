// Copies the site's public files into dist/ for Cloudflare to serve.
// The site itself needs no compiling; this only keeps README, config and
// build files out of what visitors can download.
import fs from 'node:fs';

const SKIP = new Set(['README.md', 'package.json', 'package-lock.json', 'wrangler.jsonc', 'build.mjs']);

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

let count = 0;
for (const entry of fs.readdirSync('.', { withFileTypes: true })) {
  if (!entry.isFile() || entry.name.startsWith('.') || SKIP.has(entry.name)) continue;
  fs.copyFileSync(entry.name, `dist/${entry.name}`);
  count++;
}

if (!fs.existsSync('dist/index.html')) throw new Error('index.html is missing, nothing to deploy');
console.log(`Copied ${count} files to dist/`);
