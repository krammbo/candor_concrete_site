#!/usr/bin/env node
/**
 * Generates PWA / touch icons from the favicon monogram (public/favicon.svg):
 *   - apple-touch-icon.png (180)  — iOS home screen
 *   - icon-192.png, icon-512.png  — Android / web manifest
 * Re-run with `npm run icons` if favicon.svg changes.
 */
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'public', 'favicon.svg');
const BG = '#e9e4cb'; // brand sand backing (touch icons should not be transparent)
const PAD = 0.16; // padding around the mark

async function make(size, outName) {
  const inner = Math.round(size * (1 - PAD * 2));
  const mark = await sharp(SRC, { density: 512 })
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(path.join(ROOT, 'public', outName));
  console.log(`  + ${outName} (${size}x${size})`);
}

await make(180, 'apple-touch-icon.png');
await make(192, 'icon-192.png');
await make(512, 'icon-512.png');
console.log('Done.');
