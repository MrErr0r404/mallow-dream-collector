/**
 * Setup script: Copy generated artwork to public directory.
 * Run once after cloning: node setup-assets.js
 */
const fs = require('fs');
const path = require('path');

const artifactDir = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  '.gemini', 'antigravity', 'brain', '19eac5f6-780a-42e9-85f6-cfb57b86bbf1'
);

const copies = [
  {
    patterns: ['mallow_hero_*.jpg'],
    dest: path.join(__dirname, 'public', 'images', 'mallow-hero.jpg')
  },
  {
    patterns: ['mallow_expressions_*.jpg'],
    dest: path.join(__dirname, 'public', 'mallow-expressions.jpg')
  }
];

function findFile(dir, pattern) {
  try {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    const files = fs.readdirSync(dir);
    return files.find(f => regex.test(f));
  } catch { return null; }
}

copies.forEach(({ patterns, dest }) => {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const pattern of patterns) {
    const found = findFile(artifactDir, pattern);
    if (found) {
      const src = path.join(artifactDir, found);
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${found} → ${dest}`);
      return;
    }
  }
  console.log(`⚠ No matching file for ${dest} (SVG fallbacks will be used)`);
});

console.log('\n✦ Asset setup complete!');
