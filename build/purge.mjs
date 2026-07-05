#!/usr/bin/env node
/**
 * Build script: turns src/ pages into self-contained ds/ pages.
 *
 * Each src page contains two markers inside <head> (style tags whose comment
 * body is __NEETOUI__ or __SHEET__): the first is replaced with purged
 * neetoui CSS, the second with the shared spec-sheet chrome.
 *
 * Purge logic: keep a CSS rule when at least one comma-alternative of its
 * selector either (a) contains no class tokens (element/:root/normalize rules)
 * or (b) has all its class tokens present in the page's class attributes.
 * Class tokens inside :not(...) are ignored. @media blocks are recursed,
 * @keyframes kept only when referenced by kept rules, @import dropped
 * (no external fetches — previews must be self-contained).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { dirname, join, relative } from "path";

const ROOT = dirname(new URL(import.meta.url).pathname); // build/
const SRC = join(ROOT, "..", "src");
const OUT = join(ROOT, "..", "ds");
const CSS = readFileSync(join(ROOT, "neetoui.css"), "utf8");

const SHEET = readFileSync(join(ROOT, "sheet.css"), "utf8");

// ---------- CSS tokenizer ----------
function parseRules(css) {
  const rules = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    while (i < n && /\s/.test(css[i])) i++;
    if (i >= n) break;
    if (css.startsWith("@import", i)) {
      const end = css.indexOf(";", i);
      i = end === -1 ? n : end + 1;
      continue; // drop imports
    }
    if (css.startsWith("@charset", i)) {
      const end = css.indexOf(";", i);
      i = end === -1 ? n : end + 1;
      continue;
    }
    const braceStart = css.indexOf("{", i);
    if (braceStart === -1) break;
    const selector = css.slice(i, braceStart).trim();
    // find matching close brace
    let depth = 1;
    let j = braceStart + 1;
    while (j < n && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const body = css.slice(braceStart + 1, j - 1);
    rules.push({ selector, body });
    i = j;
  }
  return rules;
}

function classTokens(selectorAlt) {
  const cleaned = selectorAlt.replace(/:not\([^)]*\)/g, "");
  return [...cleaned.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)].map(m => m[1]);
}

function keepSelector(selector, used) {
  const alts = selector.split(",").map(s => s.trim());
  const kept = alts.filter(alt => {
    const tokens = classTokens(alt);
    if (tokens.length === 0) return true;
    return tokens.every(t => used.has(t));
  });
  return kept.length ? kept.join(",") : null;
}

function purge(css, used) {
  const out = [];
  for (const rule of parseRules(css)) {
    if (rule.selector.startsWith("@media")) {
      const inner = purge(rule.body, used);
      if (inner.trim()) out.push(`${rule.selector}{${inner}}`);
    } else if (rule.selector.startsWith("@keyframes") || rule.selector.startsWith("@-webkit-keyframes")) {
      out.push({ keyframes: rule }); // decide later
    } else if (rule.selector.startsWith("@supports")) {
      const inner = purge(rule.body, used);
      if (inner.trim()) out.push(`${rule.selector}{${inner}}`);
    } else if (rule.selector.startsWith("@")) {
      continue; // other at-rules (font-face etc.) dropped
    } else {
      const sel = keepSelector(rule.selector, used);
      if (sel) out.push(`${sel}{${rule.body}}`);
    }
  }
  const plain = out.filter(r => typeof r === "string").join("\n");
  const keyframes = out
    .filter(r => typeof r === "object")
    .map(r => r.keyframes)
    .filter(k => {
      const name = k.selector.replace(/@(-webkit-)?keyframes\s+/, "").trim();
      return plain.includes(name);
    })
    .map(k => `${k.selector}{${k.body}}`)
    .join("\n");
  return plain + "\n" + keyframes;
}

// ---------- page processing ----------
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
  const html = readFileSync(file, "utf8");
  const used = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c) used.add(c);
  }
  const purged = purge(CSS, used);
  const outHtml = html
    .replace("/*__NEETOUI__*/", () => purged)
    .replace("/*__SHEET__*/", () => SHEET);
  const outPath = join(OUT, rel);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, outHtml);
  const kb = (outHtml.length / 1024).toFixed(1);
  console.log(`${rel}  →  ${kb} KB (classes: ${used.size})`);
  if (outHtml.length > 250 * 1024) console.warn(`  ⚠ ${rel} exceeds 250 KB`);
  count++;
}
console.log(`Built ${count} pages into ds/`);
