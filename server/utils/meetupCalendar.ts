// iCalendar (.ics) for meetups: one file per meetup, and a feed of all of them
// that people can subscribe to in their calendar app.
import { isPlaceholder, meetupPath, meetupTimes, meetupTitle, venueAddress, type MeetupVenue } from "~/utils/meetups";

interface CalendarMeetup {
  date: string;
  time: string | null;
  title: string | null;
  eventType: string | null;
  meetupLink: string | null;
  streamLink: string | null;
  venue: MeetupVenue | null;
  talks: { name: string; speakers: { name: string }[] }[];
}

const QUERY = /* GraphQL */ `
  query calendar($where: EventWhereInput) {
    events(where: $where, orderBy: date_DESC, first: 1000) {
      date
      time
      title
      eventType
      meetupLink
      streamLink
      venue { name street zip city googleMapsUrl }
      talks { name speakers { name } }
    }
  }
`;

export async function fetchCalendarMeetups(where: Record<string, unknown> = {}) {
  const { hygraphEndpoint } = useRuntimeConfig();
  const { data } = await $fetch<{ data: { events: CalendarMeetup[] } }>(hygraphEndpoint, {
    method: "POST",
    body: { query: QUERY, variables: { where } },
  });
  return data.events.filter((e) => !isPlaceholder(e));
}

// Escape text and fold lines at 75 octets, as RFC 5545 asks
const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (m) => `\\${m}`);
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest) > 74) {
    let cut = 74;
    while (Buffer.byteLength(rest.slice(0, cut)) > 74) cut--;
    out.push(rest.slice(0, cut));
    rest = ` ${rest.slice(cut)}`;
  }
  out.push(rest);
  return out.join("\r\n");
}
const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function vevent(e: CalendarMeetup) {
  const { start, end } = meetupTimes(e.date, e.time);
  const url = `https://webzurich.ch${meetupPath(e.date)}`;
  const talks = e.talks
    .filter((t) => !t.speakers.some((s) => /organising team/i.test(s.name)))
    .map((t) => `• ${t.name.trim()} (${t.speakers.map((s) => s.name.trim()).join(", ")})`);
  const description = [...(talks.length ? ["Talks:", ...talks, ""] : []), `Free to attend. Details: ${url}`, e.meetupLink ? `RSVP: ${e.meetupLink}` : ""]
    .filter((l, i, a) => l || i < a.length - 1)
    .join("\n");
  const location = e.eventType === "Digital" ? e.streamLink || "Online" : [e.venue?.name, venueAddress(e.venue)].filter(Boolean).join(", ");
  return [
    "BEGIN:VEVENT",
    `UID:${e.date}@webzurich.ch`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(meetupTitle(e))}`,
    location ? `LOCATION:${escape(location)}` : "",
    `DESCRIPTION:${escape(description)}`,
    `URL:${url}`,
    "END:VEVENT",
  ].filter(Boolean);
}

export function buildCalendar(meetups: CalendarMeetup[], name = "Web Zürich meetups") {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Web Zürich//Meetups//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escape(name)}`,
    "X-WR-TIMEZONE:Europe/Zurich",
    // Ask calendar apps to refresh the subscription twice a day
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
    ...meetups.flatMap(vevent),
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
