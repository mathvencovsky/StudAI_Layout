#!/usr/bin/env node
/**
 * Pre-beta security scan.
 *
 * Scans source and dist for dangerous values that must never appear in
 * committed code or the frontend bundle before a closed-beta launch.
 *
 * Usage:  npx tsx scripts/prebeta-check.ts
 * Or via: npm run prebeta:check
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

// ─── Patterns that must NEVER appear in source or dist ────────────────────────

const FORBIDDEN: Array<{ label: string; pattern: RegExp }> = [
  // Old rotated AppSync API key — must be gone after rotation
  {
    label: "OLD AppSync API key (da2-rh2uxbyodbh63otw4flrqscnse)",
    pattern: /da2-rh2uxbyodbh63otw4flrqscnse/,
  },
  // Live Stripe secret key
  {
    label: "Stripe live secret key (sk_live_...)",
    pattern: /sk_live_[A-Za-z0-9]{10,}/,
  },
  // Test Stripe secret key — must stay server-side only
  {
    label: "Stripe test secret key (sk_test_...)",
    pattern: /sk_test_[A-Za-z0-9]{10,}/,
  },
  // Stripe webhook signing secret
  {
    label: "Stripe webhook secret (whsec_...)",
    pattern: /whsec_[A-Za-z0-9]{10,}/,
  },
  // Literal env var names that should never be inlined
  {
    label: "Literal STRIPE_SECRET_KEY string",
    pattern: /STRIPE_SECRET_KEY\s*=\s*["'][^"']+["']/,
  },
  {
    label: "Literal STRIPE_WEBHOOK_SECRET string",
    pattern: /STRIPE_WEBHOOK_SECRET\s*=\s*["'][^"']+["']/,
  },
  // AI provider keys
  {
    label: "OpenAI API key (sk-...)",
    pattern: /sk-[A-Za-z0-9]{20,}/,
  },
  {
    label: "Anthropic API key (sk-ant-...)",
    pattern: /sk-ant-[A-Za-z0-9\-]{10,}/,
  },
  // Raw system prompt markers — only flag non-empty assignments
  {
    label: "Raw system prompt marker (<system>)",
    pattern: /<system>\s*You are/i,
  },
  {
    label: "Raw system prompt with content (SYSTEM_PROMPT = non-empty string)",
    // Matches SYSTEM_PROMPT = "..." or `...` only when the string is non-empty
    pattern: /SYSTEM_PROMPT\s*=\s*["'`][^"'`\s]/,
  },
];

// ─── Directories to scan ──────────────────────────────────────────────────────

const SCAN_DIRS = ["src", "amplify", "dist"];

// Extensions to scan (skip binary/media files)
const SCAN_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".env", ".html", ".css", ".md",
]);

// Paths to always skip
const SKIP_PATHS = new Set([
  "node_modules",
  ".git",
  "amplify_outputs.json", // generated file — handled separately
]);

// ─── Scanner ──────────────────────────────────────────────────────────────────

interface Hit {
  file: string;
  line: number;
  label: string;
  excerpt: string;
}

function shouldSkip(name: string): boolean {
  return SKIP_PATHS.has(name);
}

function scanFile(filePath: string, hits: Hit[]): void {
  const ext = filePath.slice(filePath.lastIndexOf("."));
  if (!SCAN_EXTENSIONS.has(ext)) return;

  let content: string;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    return; // unreadable — skip
  }

  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { label, pattern } of FORBIDDEN) {
      if (pattern.test(line)) {
        hits.push({
          file: filePath,
          line: i + 1,
          label,
          excerpt: line.trim().slice(0, 120),
        });
      }
    }
  }
}

function scanDir(dir: string, hits: Hit[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (shouldSkip(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      scanDir(full, hits);
    } else {
      scanFile(full, hits);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const root = process.cwd();
const hits: Hit[] = [];

console.log("🔍  Pre-beta security scan starting...\n");

for (const dir of SCAN_DIRS) {
  const full = join(root, dir);
  try {
    statSync(full);
  } catch {
    console.log(`  ⚠️  Directory not found, skipping: ${dir}`);
    continue;
  }
  console.log(`  Scanning: ${dir}/`);
  scanDir(full, hits);
}

console.log();

if (hits.length === 0) {
  console.log("✅  No forbidden values found. Source and dist look clean.\n");
  process.exit(0);
} else {
  console.error(`❌  FOUND ${hits.length} FORBIDDEN VALUE(S):\n`);
  for (const hit of hits) {
    console.error(`  [${hit.label}]`);
    console.error(`    File : ${relative(root, hit.file)}`);
    console.error(`    Line : ${hit.line}`);
    console.error(`    Code : ${hit.excerpt}`);
    console.error();
  }
  console.error(
    "🚨  Pre-beta check FAILED. Resolve all findings before inviting beta users.\n",
  );
  process.exit(1);
}
