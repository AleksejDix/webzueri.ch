// Nitro's Cloudflare Pages preset ends dist/_redirects with "/* /404.html 404" whenever a
// 404.html exists. Pages rejects 404 as a redirect status and logs a warning on every
// build, and it serves 404.html for unknown paths by itself anyway, so drop that line
import { readFileSync, writeFileSync } from "node:fs";

const file = "dist/_redirects";
const lines = readFileSync(file, "utf8").split("\n");
const kept = lines.filter((line) => !/^\/\*\s+\/404\.html\s+404\s*$/.test(line.trim()));
writeFileSync(file, kept.join("\n"));
console.log(`_redirects: removed ${lines.length - kept.length} fallback line(s), ${kept.filter(Boolean).length} redirect(s) left`);
