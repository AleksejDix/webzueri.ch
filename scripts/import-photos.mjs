#!/usr/bin/env node
/**
 * Puts meetup photos into the Photo model in Hygraph. Hygraph fetches each
 * image itself from its URL (Meetup's full-size originals), so nothing is
 * stored in this repository. Photos that already exist (same caption and
 * date) are skipped.
 *
 *   node scripts/import-photos.mjs           dry run
 *   node scripts/import-photos.mjs --apply   create and publish
 *
 * Needs HYGRAPH_TOKEN in .env with Create/Publish on Photo and Asset.
 */
import { existsSync, readFileSync } from "node:fs";

const ENDPOINT = "https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master";
const APPLY = process.argv.includes("--apply");

const meetup = (path, id) => `https://secure.meetupstatic.com/photos/event/${path}/highres_${id}.webp`;
const AUG = "2025-08-29";
const JAN = "2026-01-30";

const PHOTOS = [
  { url: "https://webzurich.ch/img/people.jpeg", caption: "Web Zürich members talking after a meetup", date: null },
  { url: meetup("6/d/a/0", 529888064), caption: "Attendees laughing together", date: AUG },
  { url: meetup("7/b/9/3", 532531635), caption: "Attendees chatting", date: JAN },
  { url: meetup("6/d/c/e", 529888110), caption: "A full room listening", date: AUG },
  { url: meetup("7/b/9/6", 532531638), caption: "Drinks and conversation", date: JAN },
  { url: meetup("6/d/a/5", 529888069), caption: "A group talking on the stairs", date: AUG },
  { url: meetup("7/b/a/1", 532531649), caption: "The audience listening", date: JAN },
  { url: meetup("6/d/b/b", 529888091), caption: "The audience reacting to a talk", date: AUG },
  { url: meetup("7/b/9/7", 532531639), caption: "Attendees in conversation", date: JAN },
  { url: meetup("6/d/a/9", 529888073), caption: "Two attendees talking", date: AUG },
  { url: meetup("7/b/b/5", 532531669), caption: "A packed room", date: JAN },
  { url: meetup("6/d/c/5", 529888101), caption: "Smiling faces in the audience", date: AUG },
  { url: meetup("7/b/9/a", 532531642), caption: "Two attendees in conversation", date: JAN },
  { url: meetup("6/d/a/c", 529888076), caption: "The audience on the stairs", date: AUG },
  { url: meetup("7/b/a/7", 532531655), caption: "The audience", date: JAN },
  { url: meetup("6/d/c/a", 529888106), caption: "Conversations over drinks", date: AUG },
  { url: meetup("7/b/a/a", 532531658), caption: "An attendee listening closely", date: JAN },
  { url: meetup("6/d/b/4", 529888084), caption: "People standing and talking", date: AUG },
  { url: meetup("7/b/b/1", 532531665), caption: "A speaker presenting", date: JAN },
  { url: meetup("6/d/c/7", 529888103), caption: "The audience during a talk", date: AUG },
  { url: meetup("6/d/c/d", 529888109), caption: "Listening to a talk", date: AUG },
];

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

const { photos: existing } = await gql(`{ photos(stage: DRAFT, first: 1000) { id caption date } }`);
const key = (p) => `${p.caption}|${p.date ?? ""}`;
const have = new Set(existing.map(key));
const todo = PHOTOS.filter((p) => !have.has(key(p)));
console.log(`${existing.length} photos in Hygraph, ${todo.length} to add.`);
if (!APPLY) {
  console.log("Dry run. Run with --apply to create and publish.");
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [i, p] of todo.entries()) {
  const { createPhoto } = await gql(
    `mutation ($data: PhotoCreateInput!) { createPhoto(data: $data) { id image { id } } }`,
    { data: { caption: p.caption, date: p.date, showInHero: true, image: { create: { uploadUrl: p.url } } } }
  );
  // Hygraph fetches the file in the background; publish once it has
  let status = "";
  for (let t = 0; t < 30 && status !== "COMPLETED"; t++) {
    await sleep(2000);
    const { asset } = await gql(`query ($id: ID!) { asset(where: { id: $id }, stage: DRAFT) { upload { status } } }`, {
      id: createPhoto.image.id,
    });
    status = asset?.upload?.status ?? "";
    if (status === "FAILED") break;
  }
  if (status !== "COMPLETED") {
    console.log(`${i + 1}/${todo.length} ${p.caption}: upload ${status || "not finished"}, left as draft`);
    continue;
  }
  await gql(`mutation ($id: ID!) { publishAsset(where: { id: $id }, to: PUBLISHED) { id } }`, { id: createPhoto.image.id });
  await gql(`mutation ($id: ID!) { publishPhoto(where: { id: $id }, to: PUBLISHED) { id } }`, { id: createPhoto.id });
  console.log(`${i + 1}/${todo.length} ${p.caption} (${p.date ?? "no date"}) published`);
}
