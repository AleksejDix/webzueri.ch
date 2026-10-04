// One meetup as a calendar file: /calendar/2026-08-28.ics
import { meetupTitle } from "~/utils/meetups";
export default defineEventHandler(async (event) => {
  const file = getRouterParam(event, "file") ?? "";
  const date = file.match(/^(\d{4}-\d{2}-\d{2})\.ics$/)?.[1];
  if (!date) throw createError({ statusCode: 404, statusMessage: "Not found" });

  const [meetup] = await fetchCalendarMeetups({ date });
  if (!meetup) throw createError({ statusCode: 404, statusMessage: "No meetup on this date" });

  setResponseHeader(event, "content-type", "text/calendar; charset=utf-8");
  setResponseHeader(event, "content-disposition", `attachment; filename="web-zurich-${date}.ics"`);
  return buildCalendar([meetup], meetupTitle(meetup));
});
