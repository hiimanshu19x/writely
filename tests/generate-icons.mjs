import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicIconsDir = path.resolve('public/icons');
const publicDir = path.resolve('public');

if (!fs.existsSync(publicIconsDir)) {
  fs.mkdirSync(publicIconsDir, { recursive: true });
}

// 1. Standard Ultra-High-Resolution App Icon (Squircle)
const standardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF6EE" />
      <stop offset="100%" stop-color="#EFE6D6" />
    </linearGradient>
    <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A86230" />
      <stop offset="100%" stop-color="#80471F" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#4A280F" flood-opacity="0.22" />
    </filter>
  </defs>

  <!-- Luxury Squircle Base -->
  <rect x="18" y="18" width="476" height="476" rx="116" fill="url(#bgGrad)" stroke="#E4D7C2" stroke-width="4" />

  <!-- Inner Chamfer Highlight -->
  <rect x="28" y="28" width="456" height="456" rx="106" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-opacity="0.65" />

  <!-- Signature Geometric 'W' Calligraphic Monogram -->
  <g filter="url(#dropShadow)">
    <path d="M128 148 L192 364 L256 212 L320 364 L384 148" 
          stroke="url(#strokeGrad)" 
          stroke-width="50" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="none" />
  </g>
</svg>
`.trim();

// 2. Full-bleed Maskable Icon (for Android & Chrome Adaptive Icon circles)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF6EE" />
      <stop offset="100%" stop-color="#EFE6D6" />
    </linearGradient>
    <linearGradient id="strokeGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A86230" />
      <stop offset="100%" stop-color="#80471F" />
    </linearGradient>
    <filter id="dropShadowFull" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#4A280F" flood-opacity="0.2" />
    </filter>
  </defs>

  <!-- Full Bleed Background for Safe-Zone Masking -->
  <rect width="512" height="512" fill="url(#bgGradFull)" />

  <!-- Centered 'W' inside the 80% safe circle -->
  <g filter="url(#dropShadowFull)">
    <path d="M152 176 L204 336 L256 224 L308 336 L360 176" 
          stroke="url(#strokeGradFull)" 
          stroke-width="42" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="none" />
  </g>
</svg>
`.trim();

async function generate() {
  console.log('Generating ultra-high quality PWA icons...');

  // Save SVG
  fs.writeFileSync(path.join(publicIconsDir, 'icon.svg'), standardSvg, 'utf8');

  // Generate 512x512 standard
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicIconsDir, 'icon-512.png'));
  console.log('✓ Created public/icons/icon-512.png');

  // Generate 192x192 standard
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicIconsDir, 'icon-192.png'));
  console.log('✓ Created public/icons/icon-192.png');

  // Generate 512x512 maskable
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicIconsDir, 'icon-maskable-512.png'));
  console.log('✓ Created public/icons/icon-maskable-512.png');

  // Generate 180x180 Apple Touch Icon
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created public/apple-touch-icon.png');

  console.log('All ultra-high-resolution icons generated successfully!');
}

generate().catch(console.error);
