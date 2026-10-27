#!/usr/bin/env node
/**
 * V2 builder: src2/ → ds2/. Replaces the style markers __ATOMS__ (tokens-v2/tokens.css +
 * component CSS with embedded Geist font) and __SHEET__ (spec-sheet chrome).
 * No purging needed — atoms.css is hand-built and small.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { dirname, join, relative } from "path";

const ROOT = dirname(new URL(import.meta.url).pathname);
const SRC = join(ROOT, "..", "src2");
const OUT = join(ROOT, "..", "ds2");

const fontB64 = readFileSync(join(ROOT, "geist-latin.woff2")).toString("base64");
const fontFace = `@font-face{font-family:"Geist Variable";font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,${fontB64}) format("woff2-variations");}`;
const TOKENS = readFileSync(join(ROOT, "..", "tokens-v2", "tokens.css"), "utf8");
const ATOMS = [fontFace, TOKENS, readFileSync(join(ROOT, "atoms.css"), "utf8")].join("\n");
const SHEET = readFileSync(join(ROOT, "sheet2.css"), "utf8");

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".html")) yield p;
  }
}

let count = 0;
for (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  const html = readFileSync(file, "utf8")
    .replace("/*__ATOMS__*/", () => ATOMS)
    .replace("/*__SHEET__*/", () => SHEET);
  const outPath = join(OUT, rel);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`${rel}  →  ${(html.length / 1024).toFixed(1)} KB`);
  count++;
}
console.log(`Built ${count} pages into ds2/`);
