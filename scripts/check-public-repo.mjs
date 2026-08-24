import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbiddenNames = new Set([".env", "id_rsa", "id_ed25519", "credentials.json", "service-account.json", "secrets.json"]);
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /(?:PRIVATE_KEY|SECRET_KEY|JWT_SECRET|DATABASE_URL|DB_PASSWORD)\s*[:=]\s*["'][^"']{8,}["']/i,
];
const skipped = new Set([".git", "node_modules", ".next", "out", "coverage"]);
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replaceAll("\\", "/");
    if (forbiddenNames.has(entry.name)) hits.push(`forbidden file: ${rel}`);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    let text;
    try { text = fs.readFileSync(full, "utf8"); } catch { continue; }
    for (const pattern of secretPatterns) {
      if (pattern.test(text)) hits.push(`credential-like material: ${rel}`);
    }
  }
}

walk(root);
if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}
console.log("Public repository guard passed.");
