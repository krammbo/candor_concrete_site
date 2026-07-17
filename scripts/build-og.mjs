#!/usr/bin/env node
/**
 * Generates the social share image (public/og-default.jpg, 1200x630) by
 * centering the logo on a branded background. Re-run with `npm run og` if the
 * logo changes.
 */
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const LOGO = path.join(ROOT, 'public', 'candorLogo.svg');
const OUT = path.join(ROOT, 'public', 'og-default.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#ddd0a0'; // warm sand — matches the header, reads the logo well
const LOGO_WIDTH = 820;

// Rasterize the SVG logo at high density for a crisp result, then resize.
const logo = await sharp(LOGO, { density: 400 })
  .resize({ width: LOGO_WIDTH })
  .png()
  .toBuffer();

await sharp({
  create: { width: WIDTH, height: HEIGHT, channels: 3, background: BG },
})
  .composite([{ input: logo, gravity: 'center' }])
  .jpeg({ quality: 90 })
  .toFile(OUT);

console.log(`Wrote ${path.relative(ROOT, OUT)} (${WIDTH}x${HEIGHT})`);
