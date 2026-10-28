const { execFileSync } = require('node:child_process');

const forbidden = /(^|\/)(\.env(?:\..*)?|node_modules|dist|build)(\/|$)/i;
let tracked;
try {
  tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0').filter(Boolean);
} catch {
  console.error('Release check must run inside a Git checkout.');
  process.exit(2);
}
const matches = tracked.filter((file) => forbidden.test(file) && !/(^|\/)(\.env\.example)$/.test(file));
if (matches.length) {
  console.error('Potential release artifacts/secrets are tracked by Git:');
  for (const file of matches) console.error(` - ${file}`);
  console.error('Remove them from Git tracking and keep real environment files local.');
  process.exit(1);
}
console.log(`Release artifact check passed (${tracked.length} tracked files inspected).`);
