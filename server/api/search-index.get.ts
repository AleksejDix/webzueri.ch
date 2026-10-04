// Compact index of everything on the site, used by the "Ask Web Zürich" bar.
// Cached for an hour so the bar never waits on Hygraph.
const QUERY = /* GraphQL */ `
  query searchIndex {
    talks(first: 1000, orderBy: createdAt_DESC) {
      id
      name
      category
      youtubecode
      event { date }
      speakers { name }
    }
    speakers(first: 1000) {
      id
      name
      speakerPicture { url }
      talks { id }
    }
    events(first: 1000, orderBy: date_DESC) {
      id
      date
      time
      title
      meetupLink
      venue { name city }
      talks { id }
    }
  }
`;

interface HygraphResponse {
  data: {
    talks: {
      id: string;
      name: string;
      category: string | null;
      youtubecode: string | null;
      event: { date: string } | null;
      speakers: { name: string }[];
    }[];
    speakers: {
      id: string;
      name: string;
      speakerPicture: { url: string } | null;
      talks: { id: string }[];
    }[];
    events: {
      id: string;
      date: string;
      time: string | null;
      title: string | null;
      meetupLink: string | null;
      venue: { name: string; city: string | null } | null;
      talks: { id: string }[];
    }[];
  };
}

export default defineCachedEventHandler(
  async () => {
    const { hygraphEndpoint } = useRuntimeConfig();
    const { data } = await $fetch<HygraphResponse>(hygraphEndpoint, {
      method: "POST",
      body: { query: QUERY },
    });

    return {
      talks: data.talks.map((t) => ({
        id: t.id,
        name: t.name.trim(),
        category: t.category,
        video: Boolean(t.youtubecode),
        date: t.event?.date ?? null,
        speakers: t.speakers.map((s) => s.name),
      })),
      speakers: data.speakers
        .filter((s) => s.talks.length > 0)
        .map((s) => ({
          id: s.id,
          name: s.name.trim(),
          // Resized on the client through @nuxt/image (see useThumb)
          picture: s.speakerPicture?.url ?? "",
          talkCount: s.talks.length,
        })),
      // Placeholder entries like "No event in June" have no talks and no venue
      events: data.events
        .filter((e) => !/^no event/i.test(e.title ?? "") && (e.venue || e.talks.length > 0))
        .map((e) => ({
          id: e.id,
          date: e.date,
          time: e.time,
          title: e.title,
          meetupLink: e.meetupLink,
          venue: e.venue ? [e.venue.name, e.venue.city].filter(Boolean).join(", ") : null,
          talkCount: e.talks.length,
        })),
    };
  },
  { maxAge: 60 * 60, name: "search-index" }
);
