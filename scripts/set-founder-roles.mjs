#!/usr/bin/env node
/**
 * Sets the role of Web Zürich's three co-founders on their speaker profiles and
 * publishes them. Writes a backup of the previous values first.
 *
 *   node scripts/set-founder-roles.mjs           dry run
 *   node scripts/set-founder-roles.mjs --apply   update and publish
 *
 * Needs HYGRAPH_TOKEN in .env with Read/Update/Publish on Speaker.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ENDPOINT = "https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master";
const APPLY = process.argv.includes("--apply");

const ROLES = {
  // Martin Splitt: profiles show "role, company", so his job stays in the line
  cjk2vf7zw2ew30953klekcbzg: "Co-founder of Web Zürich and developer advocate, Search Relations",
  // Robert Einars
  clhotj9gojohi0at5kmcgtbnx: "Co-founder of Web Zürich",
  // Aleksej Dix
  cjiqciytfkego091851ymsogb: "Co-founder of Web Zürich",
};

const envFile = new URL("../.env", import.meta.url);
const token =
  process.env.HYGRAPH_TOKEN ??
  (existsSync(envFile)
    ? readFileSync(envFile, "utf8")
        .split("\n")
        .find((l) => l.startsWith("HYGRAPH_TOKEN="))
        ?.slice("HYGRAPH_TOKEN=".length)
        .trim()
        .replace(/^["']|["']$/g, "")
    : undefined);
if (!token) {
  console.error("HYGRAPH_TOKEN is missing in .env");
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

const ids = Object.keys(ROLES);
const { speakers } = await gql(
  `query ($ids: [ID!]) { speakers(where: { id_in: $ids }, stage: DRAFT) { id name role company } }`,
  { ids }
);

for (const s of speakers) console.log(`${s.name}: "${s.role ?? ""}" -> "${ROLES[s.id]}" (company: ${s.company || "none"})`);
if (!APPLY) {
  console.log("Dry run. Run with --apply to update and publish.");
  process.exit(0);
}

const backup = new URL(`./data/backup-before-founder-roles-${new Date().toISOString().slice(0, 10)}.json`, import.meta.url);
writeFileSync(backup, JSON.stringify(speakers, null, 2));
console.log(`Backup written to ${backup.pathname}`);

for (const s of speakers) {
  await gql(`mutation ($id: ID!, $role: String) { updateSpeaker(where: { id: $id }, data: { role: $role }) { id } }`, {
    id: s.id,
    role: ROLES[s.id],
  });
  await gql(`mutation ($id: ID!) { publishSpeaker(where: { id: $id }, to: PUBLISHED) { id } }`, { id: s.id });
  console.log(`Updated and published ${s.name}`);
}
