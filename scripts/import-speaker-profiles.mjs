#!/usr/bin/env node
/**
 * Writes the researched speaker profiles (scripts/data/speaker-profiles.json)
 * into Hygraph and publishes them.
 *
 *   node scripts/import-speaker-profiles.mjs           dry run, prints what would change
 *   node scripts/import-speaker-profiles.mjs --apply   writes and publishes
 *
 * Needs HYGRAPH_TOKEN in .env: a Permanent Auth Token with read/update/publish
 * rights on Speaker (Project settings > Access > Permanent Auth Tokens).
 *
 * Safety rules:
 * - Only fills fields that are empty in Hygraph. Existing bios, handles etc. are never overwritten.
 * - Only "high" and "medium" confidence profiles are imported.
 * - A speaker whose draft content differs from the published version is skipped,
 *   so we never publish someone else's work in progress. Timestamps alone don't
 *   count: Hygraph bumps a draft's updatedAt when related entries change.
 * - PENDING_RELATION_EDITS lists speakers whose draft has unpublished links to
 *   other entries (talks, photos). The token can only read Speaker, so those are
 *   listed by hand after checking.
 */
import { readFileSync, existsSync } from "node:fs";

const ENDPOINT = "https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master";
const APPLY = process.argv.includes("--apply");

// Checked 2026-10-04: draft links a 4th talk that isn't published yet
const PENDING_RELATION_EDITS = new Map([["Robert Einars", "draft links a talk that isn't published yet"]]);
const OWN_FIELDS = ["name", "bio", "twitterHandle", "github", "type"];

function loadToken() {
  if (process.env.HYGRAPH_TOKEN) return process.env.HYGRAPH_TOKEN;
  const envFile = new URL("../.env", import.meta.url);
  if (existsSync(envFile)) {
    const line = readFileSync(envFile, "utf8")
      .split("\n")
      .find((l) => l.trim().startsWith("HYGRAPH_TOKEN="));
    if (line) return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  }
  return null;
}

const token = loadToken();
if (!token) {
  console.error("HYGRAPH_TOKEN is missing. Add it to new/.env (see the comment at the top of this file).");
  process.exit(1);
}

async function gql(query, variables = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ query, variables }),
    });
    if (res.status === 429 && attempt < 5) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      continue;
    }
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }
}

const handle = (value, host) =>
  (value ?? "")
    .replace(new RegExp(`^https?://(www\\.)?${host}/@?`, "i"), "")
    .replace(/^@/, "")
    .replace(/\/.*$/, "")
    .trim();

const profiles = JSON.parse(readFileSync(new URL("./data/speaker-profiles.json", import.meta.url), "utf8"))
  .filter((p) => p.confidence === "high" || p.confidence === "medium");

// Current state of every speaker in both stages
const { speakers } = await gql(`
  query current {
    speakers(first: 1000, stage: DRAFT) {
      id name bio role company website linkedIn mastodon bluesky profileAsOf profileSources
      github twitterHandle type
    }
  }
`);
const { speakers: published } = await gql(`
  query published { speakers(first: 1000, stage: PUBLISHED) { id ${OWN_FIELDS.join(" ")} } }
`);
const byId = new Map(speakers.map((s) => [s.id, s]));
const publishedById = new Map(published.map((s) => [s.id, s]));
const ownFields = (s) => JSON.stringify(OWN_FIELDS.map((f) => s?.[f] ?? null));

const plan = [];
const skipped = [];
for (const p of profiles) {
  const s = byId.get(p.id);
  if (!s) {
    skipped.push(`${p.name}: not found in Hygraph`);
    continue;
  }
  if (PENDING_RELATION_EDITS.has(s.name.trim())) {
    skipped.push(`${p.name}: ${PENDING_RELATION_EDITS.get(s.name.trim())}`);
    continue;
  }
  const pub = publishedById.get(p.id);
  if (pub && ownFields(pub) !== ownFields(s)) {
    skipped.push(`${p.name}: draft has unpublished edits, left untouched`);
    continue;
  }

  const wanted = {
    bio: p.bio,
    role: p.role,
    company: p.company,
    website: p.links?.website,
    linkedIn: p.links?.linkedin,
    mastodon: p.links?.mastodon,
    bluesky: p.links?.bluesky,
    profileAsOf: p.asOf,
    profileSources: (p.sources ?? []).join("\n"),
    github: handle(p.links?.github, "github\\.com"),
    twitterHandle: handle(p.links?.twitter, "(twitter|x)\\.com"),
  };
  // Fill only what is empty in Hygraph
  const data = Object.fromEntries(
    Object.entries(wanted).filter(([key, value]) => value && !(s[key] ?? "").toString().trim())
  );
  if (Object.keys(data).length) plan.push({ id: p.id, name: p.name, data });
}

console.log(`${profiles.length} profiles to import, ${plan.length} speakers with empty fields to fill.`);
if (skipped.length) console.log(`Skipped ${skipped.length}:\n  ${skipped.join("\n  ")}`);

if (!APPLY) {
  for (const { name, data } of plan.slice(0, 5)) console.log(`\n${name}\n`, data);
  console.log(`\nDry run. Run again with --apply to write and publish.`);
  process.exit(0);
}

let done = 0;
const failed = [];
for (const { id, name, data } of plan) {
  try {
    await gql(`mutation ($id: ID!, $data: SpeakerUpdateInput!) { updateSpeaker(where: { id: $id }, data: $data) { id } }`, { id, data });
    await gql(`mutation ($id: ID!) { publishSpeaker(where: { id: $id }, to: PUBLISHED) { id } }`, { id });
    done++;
    process.stdout.write(`\r${done}/${plan.length} written and published`);
  } catch (error) {
    failed.push(`${name}: ${error.message}`);
  }
}
console.log(`\nDone: ${done} published.`);
if (failed.length) {
  console.log(`Failed ${failed.length}:\n  ${failed.join("\n  ")}`);
  process.exit(1);
}
