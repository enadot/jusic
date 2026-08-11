/**
 * Health check for the wiki.
 *
 *   node wiki/scripts/wiki-lint.mjs
 *
 * Catches the failure modes that make a wiki rot: broken links, orphans,
 * pages missing from the index, and — the one that matters most for a wiki
 * about a live codebase — code_refs pointing at paths that no longer exist.
 *
 * Exit code 1 on errors, 0 on warnings only, so it can gate CI later.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, basename, extname } from "node:path";

const WIKI = "wiki";
const PAGES = join(WIKI, "pages");
const REPO = process.cwd();
const VALID_TYPES = new Set([
  "concept",
  "component",
  "decision",
  "source",
  "topic",
]);

const errors = [];
const warnings = [];

/* ---------------------------------------------------------------- collect */

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (extname(full) === ".md") out.push(full);
  }
  return out;
}

const files = walk(PAGES);
if (files.length === 0) {
  console.error("No pages found under wiki/pages/.");
  process.exit(1);
}

const pages = new Map(); // slug -> page

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const slug = basename(file, ".md");
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  const page = {
    file: file.replace(/\\/g, "/"),
    slug,
    body: raw,
    front: fm ? fm[1] : null,
    links: [...raw.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim()),
    inbound: 0,
  };

  if (!page.front) {
    errors.push(`${page.file}: missing YAML frontmatter`);
  } else {
    const type = page.front.match(/^type:\s*(\S+)/m)?.[1];
    if (!type) errors.push(`${page.file}: frontmatter has no "type"`);
    else if (!VALID_TYPES.has(type))
      errors.push(`${page.file}: invalid type "${type}"`);

    if (!/^updated:\s*\d{4}-\d{2}-\d{2}/m.test(page.front))
      warnings.push(`${page.file}: missing or malformed "updated" date`);

    page.type = type;
    page.status = page.front.match(/^status:\s*(\S+)/m)?.[1];

    // code_refs is a YAML list; grab the indented "- path" lines under it
    const refBlock = page.front.match(/^code_refs:\s*\r?\n((?:\s+-\s+.+\r?\n?)+)/m);
    page.codeRefs = refBlock
      ? refBlock[1]
          .split(/\r?\n/)
          .map((l) => l.replace(/^\s*-\s*/, "").trim())
          .filter(Boolean)
      : [];
  }

  if (pages.has(slug))
    errors.push(`duplicate slug "${slug}": ${pages.get(slug).file} and ${page.file}`);
  pages.set(slug, page);
}

/* ------------------------------------------------------------------ links */

for (const page of pages.values()) {
  const outbound = new Set(page.links.filter((l) => l !== page.slug));

  for (const link of outbound) {
    const target = pages.get(link);
    if (!target) warnings.push(`${page.file}: [[${link}]] is a stub — page does not exist`);
    else target.inbound += 1;
  }

  if (outbound.size < 2)
    warnings.push(`${page.file}: only ${outbound.size} outbound link(s) — schema asks for 2+`);
}

for (const page of pages.values()) {
  // Source pages are entry points; they are legitimately linked-to less often.
  if (page.inbound === 0 && page.type !== "source")
    warnings.push(`${page.file}: orphan — no page links to it`);
}

/* -------------------------------------------------------------- code_refs */

for (const page of pages.values()) {
  for (const ref of page.codeRefs ?? []) {
    if (!existsSync(join(REPO, ref)))
      errors.push(`${page.file}: code_ref "${ref}" no longer exists — page may be stale`);
  }
}

/* ------------------------------------------------------------------ index */

const indexPath = join(WIKI, "index.md");
if (!existsSync(indexPath)) {
  errors.push("wiki/index.md is missing");
} else {
  const index = readFileSync(indexPath, "utf8");
  const listed = new Set([...index.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim()));

  for (const slug of pages.keys())
    if (!listed.has(slug)) errors.push(`wiki/index.md: "${slug}" is not listed`);

  for (const slug of listed)
    if (!pages.has(slug)) errors.push(`wiki/index.md: lists "${slug}", which does not exist`);
}

/* -------------------------------------------------------------------- log */

const logPath = join(WIKI, "log.md");
if (!existsSync(logPath)) {
  errors.push("wiki/log.md is missing");
} else {
  const entries = readFileSync(logPath, "utf8").match(/^## \[\d{4}-\d{2}-\d{2}\] \w+ \| .+/gm);
  if (!entries?.length)
    warnings.push("wiki/log.md has no entries in the '## [YYYY-MM-DD] action | subject' format");
}

/* ----------------------------------------------------------------- report */

const line = (s) => console.log("  " + s);

console.log(`\nwiki-lint — ${pages.size} pages\n`);

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length})`);
  warnings.forEach(line);
  console.log("");
}

if (errors.length) {
  console.log(`ERRORS (${errors.length})`);
  errors.forEach(line);
  console.log("");
  process.exit(1);
}

console.log(warnings.length ? "No errors.\n" : "Clean.\n");
