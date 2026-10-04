// A rotating selection of speakers for the home page. It changes once a day,
// so it is stable within a day and can be cached.
const QUERY = /* GraphQL */ `
  query spotlight {
    speakers(first: 1000, where: { talks_some: {}, speakerPicture: { handle_not: null } }) {
      id
      name
      bio
      role
      company
      speakerPicture { url }
      talks(orderBy: createdAt_DESC) { id name event { date } }
    }
  }
`;

interface Speaker {
  id: string;
  name: string;
  bio: string | null;
  role: string | null;
  company: string | null;
  speakerPicture: { url: string } | null;
  talks: { id: string; name: string; event: { date: string } | null }[];
}

// Small deterministic PRNG so the order only changes with the date
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export default defineCachedEventHandler(
  async () => {
    const { hygraphEndpoint } = useRuntimeConfig();
    const { data } = await $fetch<{ data: { speakers: Speaker[] } }>(hygraphEndpoint, {
      method: "POST",
      body: { query: QUERY },
    });

    const day = Number(new Date().toISOString().slice(0, 10).replaceAll("-", ""));
    const random = seeded(day);

    const people = data.speakers.map((s) => {
      const latest = s.talks.find((t) => t.event?.date) ?? s.talks[0];
      return {
        id: s.id,
        name: s.name.trim(),
        picture: s.speakerPicture?.url ?? "",
        role: s.role ?? "",
        company: s.company ?? "",
        hasBio: Boolean(s.bio && s.bio.trim().length > 20),
        talkCount: s.talks.length,
        latestTalk: latest ? { id: latest.id, name: latest.name.trim(), date: latest.event?.date ?? null } : null,
        sort: random(),
      };
    });

    // Speakers we can say something about come first, shuffled by the day's seed
    return people
      .sort((a, b) => Number(b.hasBio) - Number(a.hasBio) || a.sort - b.sort)
      .slice(0, 12)
      .map(({ sort, hasBio, ...rest }) => rest);
  },
  {
    maxAge: 60 * 60,
    name: "spotlight",
    // A new selection every day
    getKey: () => new Date().toISOString().slice(0, 10),
  }
);
