// One-off: generate app/favicon.ico from app/icon.svg (16px + 32px PNG-in-ICO).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function main() {
  const svgPath = path.join(__dirname, "..", "app", "icon.svg");
  const outPath = path.join(__dirname, "..", "app", "favicon.ico");
  const svg = fs.readFileSync(svgPath);

  const sizes = [16, 32];
  const entries = [];
  for (const size of sizes) {
    const png = await sharp(svg, { density: 300 })
      .resize(size, size)
      .png()
      .toBuffer();
    entries.push({ size, png });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + 16 * entries.length;
  entries.forEach((entry, i) => {
    const base = i * 16;
    dir.writeUInt8(entry.size === 256 ? 0 : entry.size, base + 0); // width
    dir.writeUInt8(entry.size === 256 ? 0 : entry.size, base + 1); // height
    dir.writeUInt8(0, base + 2); // palette
    dir.writeUInt8(0, base + 3); // reserved
    dir.writeUInt16LE(1, base + 4); // planes
    dir.writeUInt16LE(32, base + 6); // bpp
    dir.writeUInt32LE(entry.png.length, base + 8);
    dir.writeUInt32LE(offset, base + 12);
    offset += entry.png.length;
  });

  const ico = Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
  fs.writeFileSync(outPath, ico);
  console.log(`Wrote ${outPath} (${ico.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
