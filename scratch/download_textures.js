import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

const texturesDir = path.resolve('public/textures');
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

const files = [
  'sun.jpg',
  'mercury.jpg',
  'venus.jpg',
  'earth.jpg',
  'mars.jpg',
  'jupiter.jpg',
  'saturn.jpg',
  'saturn_ring.png',
  'uranus.jpg',
  'neptune.jpg'
];

async function download(file) {
  const url = `https://raw.githubusercontent.com/SoumyaEXE/3d-Solar-System-ThreeJS/main/public/textures/${file}`;
  const dest = path.join(texturesDir, file);
  console.log(`Downloading ${file} from ${url}...`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(dest, buffer);
    console.log(`Successfully downloaded ${file}`);
  } catch (error) {
    console.error(`Failed to download ${file}:`, error.message);
  }
}

async function main() {
  for (const file of files) {
    await download(file);
  }
  console.log('Finished downloading textures.');
}

main();
