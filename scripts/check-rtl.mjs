/**
 * Fails the build on physical-direction utilities.
 *
 * The site is RTL-first, so every directional utility must be logical:
 * ms-/me-/ps-/pe-/start-/end-/text-start/text-end/border-s/border-e.
 * A stray `ml-4` looks fine in review and silently mirrors wrong in Hebrew,
 * which is exactly the class of bug this catches.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src"];
const EXTS = new Set([".ts", ".tsx", ".css"]);

/** Physical utilities, matched as whole class tokens. */
const BANNED = [
  /(^|[\s"'`{])(-?)(ml|mr|pl|pr)-/,
  /(^|[\s"'`{])(-?)(left|right)-/,
  /(^|[\s"'`{])text-(left|right)(\s|["'`}]|$)/,
  /(^|[\s"'`{])border-(l|r)(-|\s|["'`}]|$)/,
  /(^|[\s"'`{])(rounded-(tl|tr|bl|br|l|r)-)/,
];

/** CSS properties that should be logical too. */
const BANNED_CSS = [
  /(^|[\s;{])(margin|padding)-(left|right)\s*:/,
  /(^|[\s;{])(border-(left|right))(-|\s*:)/,
  /(^|[\s;{])(left|right)\s*:/,
  /text-align\s*:\s*(left|right)/,
];

const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (EXTS.has(extname(full))) files.push(full);
  }
}
for (const root of ROOTS) walk(root);

const violations = [];
for (const file of files) {
  const isCss = extname(file) === ".css";
  const patterns = isCss ? [...BANNED, ...BANNED_CSS] : BANNED;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);

  lines.forEach((line, i) => {
    if (line.includes("rtl-allow")) return; // deliberate, documented escape hatch
    for (const pattern of patterns) {
      if (pattern.test(line)) {
        violations.push(`${file}:${i + 1}  ${line.trim()}`);
        return;
      }
    }
  });
}

if (violations.length > 0) {
  console.error(
    `\nRTL check failed — ${violations.length} physical-direction utility/property found.\n` +
      `Use logical equivalents (ms-/me-/ps-/pe-/start-/end-/text-start/text-end).\n`,
  );
  for (const violation of violations) console.error("  " + violation);
  console.error("");
  process.exit(1);
}

console.log(`RTL check passed — ${files.length} files clean.`);
