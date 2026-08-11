/**
 * One-time asset script: crops the album-art tiles used as mockup imagery out of
 * the two supplied in-app screenshots — the same approach the design system took.
 *
 * These are placeholders for layout only. Licensed cover art must replace them
 * before launch (docs/OPEN_ITEMS.md).
 *
 *   node scripts/make-covers.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/covers";
const SIZE = 400;

/** [source, left, top, size] in real screenshot pixels (1440 × 2936). */
const CROPS = [
  ["public/app/home.jpg", 706, 688, 630],
  ["public/app/playlist.jpg", 326, 279, 402],
  ["public/app/home.jpg", 192, 690, 468],
  ["public/app/playlist.jpg", 728, 279, 402],
  ["public/app/home.jpg", 1163, 1524, 212],
  ["public/app/playlist.jpg", 326, 681, 402],
  ["public/app/home.jpg", 1154, 1806, 229],
  ["public/app/playlist.jpg", 728, 681, 402],
  ["public/app/home.jpg", 1154, 2092, 229],
  ["public/app/playlist.jpg", 1155, 2084, 228],
];

await mkdir(OUT, { recursive: true });

await Promise.all(
  CROPS.map(([src, left, top, size], i) =>
    sharp(src)
      .extract({ left, top, width: size, height: size })
      .resize(SIZE, SIZE, { fit: "cover" })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(`${OUT}/cover-${String(i + 1).padStart(2, "0")}.jpg`),
  ),
);

console.log(`wrote ${CROPS.length} covers to ${OUT}`);
