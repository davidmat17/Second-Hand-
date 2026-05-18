const { Jimp } = require("jimp");
const path = require("path");

const INPUT  = path.join(__dirname, "images", "Logo.png");
const OUTPUT = path.join(__dirname, "frontend", "public", "Logo.png");

const TOLERANCE = 60;

(async () => {
  const img = await Jimp.read(INPUT);
  const { width, height, data } = img.bitmap;

  // Color de fondo: píxel (2,2)
  const idx0 = (2 * width + 2) * 4;
  const bgR = data[idx0];
  const bgG = data[idx0 + 1];
  const bgB = data[idx0 + 2];
  console.log(`Color de fondo detectado: rgb(${bgR}, ${bgG}, ${bgB})`);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (
        Math.abs(r - bgR) < TOLERANCE &&
        Math.abs(g - bgG) < TOLERANCE &&
        Math.abs(b - bgB) < TOLERANCE
      ) {
        data[idx + 3] = 0;
      }
    }
  }

  await img.write(OUTPUT);
  console.log("Logo guardado con fondo transparente en:", OUTPUT);
})().catch(console.error);
