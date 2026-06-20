#!/usr/bin/env node
/**
 * check-links.mjs — a simple, dependency-free Markdown link checker.
 *
 * Usage:  node scripts/check-links.mjs <file.md> [more.md ...]
 *
 * Reports:
 *   - http(s) links that don't respond with 2xx/3xx
 *   - relative file links whose target doesn't exist on disk
 *
 * No npm install needed — uses Node 18+ built-in fetch. Read-only.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/check-links.mjs <file.md> [more.md ...]");
  process.exit(1);
}

const LINK_RE = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

async function checkHttp(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    let res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
    // Some servers reject HEAD — retry with GET.
    if (res.status >= 400) {
      res = await fetch(url, { method: "GET", signal: ctrl.signal });
    }
    clearTimeout(t);
    return res.status < 400
      ? { ok: true, status: res.status }
      : { ok: false, status: res.status };
  } catch (err) {
    return { ok: false, status: err.name === "AbortError" ? "timeout" : "error" };
  }
}

let totalBroken = 0;

for (const file of files) {
  if (!existsSync(file)) {
    console.error(`✗ File not found: ${file}`);
    totalBroken++;
    continue;
  }

  const content = readFileSync(file, "utf-8");
  const baseDir = dirname(resolve(file));
  const links = [...content.matchAll(LINK_RE)].map((m) => m[1]);
  const unique = [...new Set(links)];

  console.log(`\n🔎 ${file} — ${unique.length} link(s)`);

  for (const link of unique) {
    if (link.startsWith("#") || link.startsWith("mailto:")) continue; // anchors / email
    if (/^https?:\/\//i.test(link)) {
      const r = await checkHttp(link);
      if (r.ok) console.log(`  ✅ ${link} (${r.status})`);
      else {
        console.log(`  ❌ ${link} (${r.status})`);
        totalBroken++;
      }
    } else {
      // relative file link
      const target = resolve(baseDir, link.split("#")[0]);
      if (existsSync(target)) console.log(`  ✅ ${link}`);
      else {
        console.log(`  ❌ ${link} (file not found)`);
        totalBroken++;
      }
    }
  }
}

console.log(`\n${totalBroken === 0 ? "✅ All links OK." : `❌ ${totalBroken} broken link(s).`}`);
process.exit(totalBroken === 0 ? 0 : 1);
