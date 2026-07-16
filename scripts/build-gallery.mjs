#!/usr/bin/env node
/**
 * Bulk gallery importer.
 *
 * Usage:
 *   1. Drop any number of photos into  ./gallery-import/
 *      (optionally name them with a keyword like "driveway", "patio",
 *       "stamped", "foundation", "overlay", "commercial" to auto-categorize)
 *   2. Run:  npm run gallery
 *
 * It optimizes each photo (resizes to max 1600px wide, compresses to JPEG),
 * saves it to public/uploads/gallery/, and creates a gallery entry in
 * src/content/gallery/. Re-running only processes NEW photos, so it's safe to
 * run repeatedly. Originals in gallery-import/ are never committed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const INPUT_DIR = path.join(ROOT, 'gallery-import');
const IMG_OUT_DIR = path.join(ROOT, 'public', 'uploads', 'gallery');
const CONTENT_DIR = path.join(ROOT, 'src', 'content', 'gallery');
const MAX_WIDTH = 1600;
const QUALITY = 80;

const CATEGORY_KEYWORDS = [
  ['driveway', 'Driveways'],
  ['patio', 'Patios'],
  ['foundation', 'Foundations'],
  ['stamp', 'Stamped Concrete'],
  ['overlay', 'Overlays'],
  ['commercial', 'Commercial'],
];

const hasSips = (() => {
  try {
    execFileSync('sips', ['--help'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleize(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function categoryFor(name) {
  const lower = name.toLowerCase();
  for (const [kw, cat] of CATEGORY_KEYWORDS) if (lower.includes(kw)) return cat;
  return 'Other';
}

function optimize(src, dest) {
  if (!hasSips) {
    fs.copyFileSync(src, dest);
    return;
  }
  // Resize only if wider than MAX_WIDTH (never upscale), then recompress.
  let width = 0;
  try {
    const out = execFileSync('sips', ['-g', 'pixelWidth', src]).toString();
    width = parseInt(out.match(/pixelWidth:\s*(\d+)/)?.[1] ?? '0', 10);
  } catch {}
  const args = ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(QUALITY)];
  if (width > MAX_WIDTH) args.push('--resampleWidth', String(MAX_WIDTH));
  execFileSync('sips', [...args, src, '--out', dest], { stdio: 'ignore' });
}

// --- run -------------------------------------------------------------------
if (!fs.existsSync(INPUT_DIR)) {
  fs.mkdirSync(INPUT_DIR, { recursive: true });
  console.log(`Created ${path.relative(ROOT, INPUT_DIR)}/ — drop photos there and re-run.`);
  process.exit(0);
}
fs.mkdirSync(IMG_OUT_DIR, { recursive: true });
fs.mkdirSync(CONTENT_DIR, { recursive: true });

const files = fs
  .readdirSync(INPUT_DIR)
  .filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.log(`No images found in ${path.relative(ROOT, INPUT_DIR)}/. Add photos and re-run.`);
  process.exit(0);
}

// Continue ordering after any existing gallery entries.
let order = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md')).length
  : 0;

let created = 0;
let skipped = 0;

for (const file of files) {
  const slug = slugify(file);
  const mdPath = path.join(CONTENT_DIR, `${slug}.md`);
  const imgPath = path.join(IMG_OUT_DIR, `${slug}.jpg`);

  if (fs.existsSync(mdPath)) {
    skipped++;
    continue;
  }

  optimize(path.join(INPUT_DIR, file), imgPath);

  const title = titleize(slug);
  const category = categoryFor(file);
  const frontmatter = [
    '---',
    `title: ${title}`,
    `image: /uploads/gallery/${slug}.jpg`,
    `alt: ${title} — concrete work by Candor Concrete in Greenville, SC`,
    `category: ${category}`,
    'featured: false',
    `order: ${order++}`,
    '---',
    '',
  ].join('\n');

  fs.writeFileSync(mdPath, frontmatter);
  created++;
  console.log(`  + ${slug}.jpg  [${category}]`);
}

console.log(
  `\nDone. ${created} new photo(s) added, ${skipped} already existed.` +
    (created ? '\nEdit titles/categories in src/content/gallery/ or the /admin panel, then commit & push.' : ''),
);
