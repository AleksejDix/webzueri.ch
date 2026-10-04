// Facts for the about page, all derived from Hygraph so they stay true:
// totals, every speaker's face, and milestones from the meetup history.

// Martin Splitt, Robert Einars and Aleksej Dix, in this order
const FOUNDERS = ["cjk2vf7zw2ew30953klekcbzg", "clhotj9gojohi0at5kmcgtbnx", "cjiqciytfkego091851ymsogb"];
const QUERY = /* GraphQL */ `
  query about($founders: [ID!]) {
    events(first: 1000, orderBy: date_ASC) {
      id
      date
      title
      eventType
      venue { id }
      talks { id youtubecode }
    }
    speakers(first: 1000, where: { talks_some: {} }) {
      id
      name
      speakerPicture { url fileName }
    }
    talks(first: 1000) {
      id
      youtubecode
      speakers { name }
    }
    sponsors(first: 1000, where: { events_some: {} }) {
      id
    }
    founders: speakers(where: { id_in: $founders }) {
      id
      name
      speakerPicture { url }
    }
  }
`;

interface Data {
  events: {
    id: string;
    date: string;
    title: string | null;
    eventType: string | null;
    venue: { id: string } | null;
    talks: { id: string; youtubecode: string | null }[];
  }[];
  speakers: { id: string; name: string; speakerPicture: { url: string; fileName: string } | null }[];
  talks: { id: string; youtubecode: string | null; speakers: { name: string }[] }[];
  sponsors: { id: string }[];
  founders: { id: string; name: string; speakerPicture: { url: string } | null }[];
}

export default defineCachedEventHandler(
  async () => {
    const { hygraphEndpoint } = useRuntimeConfig();
    const { data } = await $fetch<{ data: Data }>(hygraphEndpoint, { method: "POST", body: { query: QUERY, variables: { founders: FOUNDERS } } });

    const today = new Date().toISOString().slice(0, 10);
    // Placeholder entries like "No event in June" have no talks and no venue
    const events = data.events.filter((e) => !/^no event/i.test(e.title ?? "") && e.date <= today);
    const talks = events.flatMap((e) => e.talks.map((t) => ({ ...t, date: e.date })));
    // "Organising team" is used for notices, not a person
    const speakers = data.speakers.filter((s) => s.name !== "Organising team");
    // Totals match the talks page: every talk except those notices
    const allTalks = data.talks.filter((t) => !(t.speakers.length && t.speakers.every((s) => s.name === "Organising team")));

    const milestones: { date: string; title: string; text: string }[] = [];
    if (events[0]) {
      milestones.push({
        date: events[0].date,
        title: "The first meetup",
        text: "Martin Splitt, Robert Einars and Aleksej Dix start Web Zürich as the successor to the swiss.js community.",
      });
    }
    const firstVideo = talks.find((t) => t.youtubecode);
    if (firstVideo) {
      milestones.push({
        date: firstVideo.date,
        title: "The first recording",
        text: "Talks start going on YouTube, so you can watch them later.",
      });
    }
    const online = events.filter((e) => e.eventType === "Digital");
    if (online[0]) {
      milestones.push({
        date: online[0].date,
        title: "We go online",
        text: `During the pandemic we keep meeting in a stream: ${online.length} meetups online.`,
      });
    }
    for (const n of [100, 200, 300, 400, 500]) {
      const talk = talks[n - 1];
      if (talk) milestones.push({ date: talk.date, title: `Talk number ${n}`, text: `${n} talks on the Web Zürich stage.` });
    }
    milestones.sort((a, b) => a.date.localeCompare(b.date));

    return {
      counts: {
        meetups: events.length,
        talks: allTalks.length,
        recordings: allTalks.filter((t) => t.youtubecode).length,
        speakers: speakers.length,
        sponsors: data.sponsors.length,
        years: new Date().getFullYear() - Number((events[0]?.date ?? today).slice(0, 4)),
      },
      // unicorn.jpg is the stand-in picture for speakers without a photo
      faces: speakers
        .filter((s) => s.speakerPicture?.url && s.speakerPicture.fileName !== "unicorn.jpg")
        .map((s) => ({ id: s.id, name: s.name.trim(), picture: s.speakerPicture!.url })),
      milestones,
      founders: FOUNDERS.map((id) => data.founders.find((f) => f.id === id))
        .filter((f) => !!f)
        .map((f) => ({ id: f.id, name: f.name.trim(), picture: f.speakerPicture?.url ?? "" })),
    };
  },
  { maxAge: 60 * 60, name: "about-v4" }
);
