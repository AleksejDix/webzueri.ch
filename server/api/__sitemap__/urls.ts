// Every talk, speaker and meetup page for the sitemap, from the same cached
// Hygraph index the search bar uses
import { meetupPath } from "~/utils/meetups";

interface SearchIndex {
  talks: { id: string; date: string | null }[];
  speakers: { id: string }[];
  events: { date: string }[];
}

export default defineSitemapEventHandler(async () => {
  const index = await $fetch<SearchIndex>("/api/search-index");
  return [
    ...index.talks.map((t) => ({ loc: `/talks/${t.id}`, lastmod: t.date ?? undefined })),
    ...index.speakers.map((s) => ({ loc: `/speakers/${s.id}` })),
    ...index.events.map((e) => ({ loc: meetupPath(e.date), lastmod: e.date })),
  ];
});
