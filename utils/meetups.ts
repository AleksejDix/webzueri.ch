// Shared helpers for meetups: titles, times and calendar dates in Zürich time.
// Used by the events pages, the .ics calendar routes and the search bar.

export interface MeetupVenue {
  name: string;
  street?: string | null;
  zip?: string | null;
  city?: string | null;
  googleMapsUrl?: string | null;
}

/** How long a meetup evening lasts, for calendars */
export const MEETUP_HOURS = 3;
/** When doors open if a meetup has no time set */
export const DEFAULT_TIME = "18:30";

/** Placeholders like "No event in June" are not meetups */
export const isPlaceholder = (e: { title?: string | null }) => /^no event/i.test(e.title ?? "");

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

export const meetupTitle = (e: { title?: string | null; date: string }) =>
  e.title || `Web Zürich, ${fmt(e.date, { month: "long", year: "numeric" })}`;

export const meetupPath = (date: string) => `/events/${date}`;
export const calendarPath = (date: string) => `/calendar/${date}.ics`;

/** A link field from Hygraph, or null when it holds a note instead ("no stream, join us AFK") */
export const webLink = (url?: string | null) => (url && /^https?:\/\//i.test(url.trim()) ? url.trim() : null);

/** "18:30", "1830" or "19:00 (Stream open from 18:00)" all become "18:30"-style times */
export function clock(t?: string | null) {
  const m = (t ?? "").match(/(\d{1,2}):?(\d{2})/);
  return m ? `${m[1]!.padStart(2, "0")}:${m[2]}` : "";
}

export const venueLine = (v?: MeetupVenue | null) =>
  v ? [v.name, v.city && !v.name.includes(v.city) ? v.city : null].filter(Boolean).join(", ") : "";

export const venueAddress = (v?: MeetupVenue | null) =>
  v ? [v.street, [v.zip, v.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") : "";

// Last Sunday of a month, as a day number
function lastSunday(year: number, month: number) {
  const last = new Date(Date.UTC(year, month + 1, 0));
  return last.getUTCDate() - last.getUTCDay();
}

/** Zürich's UTC offset on a date: summer time runs from the last Sunday of March to the last Sunday of October */
export function zurichOffset(date: string) {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const start = lastSunday(y, 2);
  const end = lastSunday(y, 9);
  const summer = (m > 3 && m < 10) || (m === 3 && d >= start) || (m === 10 && d < end);
  return summer ? "+02:00" : "+01:00";
}

/** Start and end of a meetup as ISO timestamps with Zürich's offset */
export function meetupTimes(date: string, time?: string | null) {
  const start = `${date}T${clock(time) || DEFAULT_TIME}:00${zurichOffset(date)}`;
  const end = new Date(new Date(start).getTime() + MEETUP_HOURS * 3600_000);
  return { start, end: end.toISOString() };
}
