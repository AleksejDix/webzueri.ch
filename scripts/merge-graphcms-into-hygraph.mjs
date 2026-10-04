#!/usr/bin/env node
/**
 * GraphCMS renamed itself Hygraph in 2022. Moves every meetup linked to the
 * GraphCMS sponsor onto the Hygraph sponsor, publishes it, and deletes GraphCMS.
 * Backup: scripts/data/backup-before-graphcms-merge-2026-10-04.json
 *
 *   node scripts/merge-graphcms-into-hygraph.mjs           dry run
 *   node scripts/merge-graphcms-into-hygraph.mjs --apply   merge, publish, verify, then delete GraphCMS
 *
 * Needs HYGRAPH_TOKEN in .env with Read/Update/Publish/Unpublish/Delete on Sponsor
 * and Read/Update on Event.
 */
import { existsSync, readFileSync } from "node:fs";

const ENDPOINT = "https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master";
const GRAPHCMS = "cjkieplosvf6z09537dzdrra2";
const HYGRAPH = "cl9pqxo8truvn0aupzxcjp89i";
const APPLY = process.argv.includes("--apply");

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
  if (json.errors) {
    const detail = json.errors
      .map((e) => {
        const failed = (e.extensions?.failedActions ?? []).map((f) => `${f.action} ${f.model} (${f.stage})`);
        return failed.length ? `${e.message}: ${failed.join(", ")}` : e.message;
      })
      .join("; ");
    throw new Error(detail);
  }
  return json.data;
}

const sponsor = async (id, stage) =>
  (
    await gql(
      `query ($id: ID!) { sponsor(where: { id: $id }, stage: ${stage}) { id name feedback { id } events(first: 1000) { id date } } }`,
      { id }
    )
  ).sponsor;

const graphcms = await sponsor(GRAPHCMS, "DRAFT");
const hygraph = await sponsor(HYGRAPH, "DRAFT");
if (!hygraph) throw new Error("Hygraph sponsor not found");
if (!graphcms) {
  console.log("GraphCMS is already gone. Nothing to do.");
  process.exit(0);
}

const already = new Set(hygraph.events.map((e) => e.id));
const toMove = graphcms.events.filter((e) => !already.has(e.id));
const expected = hygraph.events.length + toMove.length;
console.log(`${graphcms.name}: ${graphcms.events.length} meetups, ${hygraph.name}: ${hygraph.events.length} meetups`);
console.log(`Moving ${toMove.length} meetups to ${hygraph.name}, which will then have ${expected}.`);

if (!APPLY) {
  console.log("Dry run. Run with --apply to merge and delete GraphCMS.");
  process.exit(0);
}

if (toMove.length) {
  await gql(
    `mutation ($id: ID!, $events: [EventConnectInput!]) {
      updateSponsor(where: { id: $id }, data: { events: { connect: $events } }) { id }
    }`,
    { id: HYGRAPH, events: toMove.map((e) => ({ where: { id: e.id } })) }
  );
}

// GraphCMS also carries a testimonial (Feedback); move it to Hygraph unless Hygraph has its own
const feedbackId = graphcms.feedback?.id;
if (feedbackId && !hygraph.feedback) {
  await gql(
    `mutation ($id: ID!, $feedback: ID!) {
      updateSponsor(where: { id: $id }, data: { feedback: { connect: { id: $feedback } } }) { id }
    }`,
    { id: HYGRAPH, feedback: feedbackId }
  );
}
await gql(`mutation ($id: ID!) { publishSponsor(where: { id: $id }, to: PUBLISHED) { id } }`, { id: HYGRAPH });
if (feedbackId) {
  await gql(`mutation ($id: ID!) { publishFeedback(where: { id: $id }, to: PUBLISHED) { id } }`, { id: feedbackId });
}

// Only delete GraphCMS once the published Hygraph sponsor really has every meetup
const published = await sponsor(HYGRAPH, "PUBLISHED");
if (published.events.length !== expected) {
  throw new Error(`Hygraph has ${published.events.length} published meetups, expected ${expected}. Not deleting GraphCMS.`);
}
if (feedbackId && published.feedback?.id !== feedbackId) {
  throw new Error("The testimonial did not move to Hygraph. Not deleting GraphCMS.");
}
console.log(`Published ${hygraph.name} with ${published.events.length} meetups${feedbackId ? " and the testimonial" : ""}.`);

await gql(`mutation ($id: ID!) { deleteSponsor(where: { id: $id }) { id } }`, { id: GRAPHCMS });
console.log(`Deleted ${graphcms.name}.`);
