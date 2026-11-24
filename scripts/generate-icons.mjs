/**
 * Generates every TripSync icon/splash asset from one SVG source so the
 * app icon, splash screen, favicon and in-app logo always match.
 *
 * Run: node scripts/generate-icons.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve('assets/images');
const BRAND = '#3D5AFE';
const BRAND_DARK = '#2A3FD1';

/** White map pin with two "sync" arrows inside: a trip location everyone shares. */
function pinMark({ color = '#FFFFFF', inner = BRAND } = {}) {
  return `
  <g>
    <path d="M512 196c-128 0-226 98-226 222 0 160 180 330 210 357a24 24 0 0 0 32 0c30-27 210-197 210-357 0-124-98-222-226-222z" fill="${color}"/>
    <g fill="none" stroke="${inner}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
      <path d="M430 400a86 86 0 0 1 148-52"/>
      <path d="M594 436a86 86 0 0 1-148 52"/>
    </g>
    <path d="M600 318l-6 70-66-24z" fill="${inner}"/>
    <path d="M424 518l6-70 66 24z" fill="${inner}"/>
  </g>`;
}

function iconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5B74FF"/>
      <stop offset="1" stop-color="${BRAND_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <path d="M150 820c140-70 260-40 362 10s230 70 362-10" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="22" stroke-linecap="round" stroke-dasharray="2 46"/>
  ${pinMark()}
</svg>`;
}

function markOnlySvg({ color = '#FFFFFF', inner = BRAND } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${pinMark({ color, inner })}</svg>`;
}

/** Android adaptive icons crop to a circle, so the mark is scaled into the safe zone. */
function adaptiveForegroundSvg({ color = '#FFFFFF', inner = BRAND } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(512 512) scale(0.66) translate(-512 -486)">${pinMark({ color, inner })}</g>
</svg>`;
}

async function render(svg, file, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(OUT, file));
  console.log(`wrote ${file} (${size}px)`);
}

await mkdir(OUT, { recursive: true });
await render(iconSvg(), 'icon.png', 1024);
await render(iconSvg(), 'logo.png', 256);
await render(iconSvg(), 'favicon.png', 96);
await render(markOnlySvg(), 'splash-icon.png', 512);
await render(adaptiveForegroundSvg(), 'android-icon-foreground.png', 1024);
await render(adaptiveForegroundSvg({ color: '#000000', inner: '#FFFFFF' }), 'android-icon-monochrome.png', 1024);
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BRAND } })
  .png()
  .toFile(path.join(OUT, 'android-icon-background.png'));
console.log('wrote android-icon-background.png (1024px)');

// Keep bundled trip photos small so the app stays fast offline.
const photos = path.join(OUT, 'photos');
for (const name of ['iceland']) {
  const file = path.join(photos, `${name}.jpg`);
  const input = await readFile(file);
  const buffer = await sharp(input).resize({ width: 900 }).jpeg({ quality: 68, mozjpeg: true }).toBuffer();
  await writeFile(file, buffer);
  console.log(`recompressed photos/${name}.jpg`);
}
