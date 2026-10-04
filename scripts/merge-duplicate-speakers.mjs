#!/usr/bin/env node
/**
 * Merges duplicate speakers in Hygraph (agreed 2026-10-04).
 * A backup of every affected record is in scripts/data/backup-before-merge-2026-10-04.json.
 *
 *   node scripts/merge-duplicate-speakers.mjs            updates the records we keep, then publishes them
 *   node scripts/merge-duplicate-speakers.mjs --delete   also deletes the empty copies
 *
 * --delete needs Delete permission on Speaker and Talk (plus Read on Talk) for the
 * token in .env (HYGRAPH_TOKEN). Deleting cannot be undone.
 */
import { existsSync, readFileSync } from "node:fs";

const ENDPOINT = "https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master";
const DELETE = process.argv.includes("--delete");

// Records we keep: fill gaps from the copy being removed
const UPDATES = [
  // David Buchmann: the 2018 copy had his Twitter handle
  { id: "cliioy5aabclw0btcp5zrzekn", name: "David Buchmann", data: { twitterHandle: "dbu" }, onlyIfEmpty: true },
  // "Jordan" holds both BoostedHost talks; give it the full name
  { id: "cmc8y6brl99ld07t9j29zggrk", name: "Jordan", data: { name: "Jordan Unegbu" }, onlyIfEmpty: false },
];

// Empty or never-published copies. Talks first, so no speaker is deleted while a talk still points at it.
const DELETIONS = [
  { model: "Talk", id: "ck991vbc1hn960b84g17tv7ss", label: "duplicate unpublished talk of Schepp Schaefer" },
  { model: "Speaker", id: "ck991mjbihmqx0b84p4frw9ns", label: "Christian \"Schepp\" Schaefer (never-published copy)" },
  { model: "Speaker", id: "cjjudlss9lnqm0953569cv7lr", label: "David Buchmann (2018 copy, no talks)" },
  { model: "Speaker", id: "cl0ceecde2roq0cxsrfbpcfpo", label: "Llorenç Muntaner (never-published copy, no talks)" },
  { model: "Speaker", id: "cmehawrm8muxv07t68kcebnw2", label: "Jordan Unegbu (empty copy, no talks)" },
];

function loadToken() {
  if (process.env.HYGRAPH_TOKEN) return process.env.HYGRAPH_TOKEN;
  const envFile = new URL("../.env", import.meta.url);
  if (!existsSync(envFile)) return null;
  const line = readFileSync(envFile, "utf8").split("\n").find((l) => l.trim().startsWith("HYGRAPH_TOKEN="));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : null;
}
const token = loadToken();
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
  if (json.errors) {
    // Hygraph lists the exact missing permissions under extensions.failedActions
    const detail = json.errors
      .map((e) => {
        const failed = (e.extensions?.failedActions ?? []).map((f) => `${f.action} ${f.model}${f.stage ? ` (${f.stage})` : ""}`);
        return failed.length ? `${e.message}: ${failed.join(", ")}` : e.message;
      })
      .join("; ");
    throw new Error(detail);
  }
  return json.data;
}

for (const u of UPDATES) {
  const { speaker } = await gql(`query ($id: ID!) { speaker(where: { id: $id }, stage: DRAFT) { id name twitterHandle } }`, { id: u.id });
  if (!speaker) {
    console.log(`skip ${u.name}: not found`);
    continue;
  }
  // Skip values that are already set (or, for onlyIfEmpty, any existing value)
  const data = Object.fromEntries(
    Object.entries(u.data).filter(
      ([key, value]) => speaker[key] !== value && (!u.onlyIfEmpty || !(speaker[key] ?? "").trim())
    )
  );
  if (!Object.keys(data).length) {
    console.log(`ok   ${u.name}: nothing to change`);
    continue;
  }
  await gql(`mutation ($id: ID!, $data: SpeakerUpdateInput!) { updateSpeaker(where: { id: $id }, data: $data) { id } }`, { id: u.id, data });
  await gql(`mutation ($id: ID!) { publishSpeaker(where: { id: $id }, to: PUBLISHED) { id } }`, { id: u.id });
  console.log(`done ${u.name}: ${JSON.stringify(data)}`);
}

if (!DELETE) {
  console.log(`\nNot deleting (run with --delete):\n  ${DELETIONS.map((d) => `${d.model} ${d.id}  ${d.label}`).join("\n  ")}`);
  process.exit(0);
}

for (const d of DELETIONS) {
  try {
    await gql(`mutation ($id: ID!) { delete${d.model}(where: { id: $id }) { id } }`, { id: d.id });
    console.log(`deleted ${d.label}`);
  } catch (error) {
    console.log(`FAILED  ${d.label}: ${error.message}`);
  }
}
