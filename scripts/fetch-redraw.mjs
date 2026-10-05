#!/usr/bin/env node
/**
 * Downloads Redraw (redraw.dev) into vendors/ before npm install. Redraw is a
 * subscriber-only preview shipped as tarballs on a private GitHub release, so
 * it is not on npm and must not be committed to this public repository.
 * package.json names the tarball; this fetches that exact file.
 *
 *   node scripts/fetch-redraw.mjs
 *
 * Needs REDRAW_GITHUB_TOKEN: a classic token with the repo scope from an
 * account invited to wcandillon/redraw. The Cloudflare Pages build command runs
 * this before npm ci.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const REPO = "wcandillon/redraw";

const spec = JSON.parse(readFileSync("package.json", "utf8")).dependencies.redraw;
const file = spec.replace(/^file:/, "");
const [, version] = file.match(/redraw-(\d+\.\d+\.\d+)\.tgz$/) ?? [];
if (!version) throw new Error(`Unexpected redraw dependency "${spec}"`);

if (existsSync(file)) {
  console.log(`${file} is already there`);
  process.exit(0);
}

const token = process.env.REDRAW_GITHUB_TOKEN;
if (!token) {
  console.error(`Missing REDRAW_GITHUB_TOKEN to download ${file} from ${REPO}`);
  process.exit(1);
}

const github = (url, accept) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: accept } }).then((res) => {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    return res;
  });

const release = await github(`https://api.github.com/repos/${REPO}/releases/tags/v${version}`, "application/vnd.github+json").then((r) => r.json());
const asset = release.assets.find((a) => a.name === `redraw-${version}.tgz`);
if (!asset) throw new Error(`No redraw-${version}.tgz on ${REPO} v${version}`);

const data = await github(asset.url, "application/octet-stream").then((r) => r.arrayBuffer());
mkdirSync("vendors", { recursive: true });
writeFileSync(file, Buffer.from(data));
console.log(`Downloaded ${file} (${data.byteLength} bytes)`);
