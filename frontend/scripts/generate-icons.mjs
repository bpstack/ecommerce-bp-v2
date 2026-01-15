import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('Generating icons from SVG...\n');

  for (const { name, size } of sizes) {
    const outputPath = join(publicDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Generate favicon.ico from multiple PNG sizes
  console.log('\nGenerating favicon.ico...');
  const icoBuffer = await pngToIco([
    join(publicDir, 'favicon-16x16.png'),
    join(publicDir, 'favicon-32x32.png'),
    join(publicDir, 'favicon-48x48.png'),
  ]);
  writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Generated favicon.ico (16x16, 32x32, 48x48)');

  console.log('\n✓ All icons generated successfully!');
}

generateIcons().catch(console.error);
