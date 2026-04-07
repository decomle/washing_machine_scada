import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertSvgToPng() {
  const svgPath = path.join(__dirname, 'src/assets/industrial-washing-machine.svg');
  const pngPath = path.join(__dirname, 'src/assets/logo.png');

  try {
    // Read SVG content
    const svgBuffer = fs.readFileSync(svgPath);

    // Convert to PNG with transparent background at 512x512
    await sharp(svgBuffer)
      .png()
      .resize(512, 512)
      .toFile(pngPath);

    console.log('✅ Successfully converted industrial-washing-machine.svg to logo.png (512x512)');
    console.log(`📁 Output: ${pngPath}`);
    console.log('📏 Size: 512x512 pixels');
  } catch (error) {
    console.error('❌ Error converting SVG to PNG:', error);
  }
}

convertSvgToPng();