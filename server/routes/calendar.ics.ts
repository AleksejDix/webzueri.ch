// Subscribe to every Web Zürich meetup: webcal://webzurich.ch/calendar.ics
export default defineCachedEventHandler(
  async (event) => {
    const meetups = await fetchCalendarMeetups();
    setResponseHeader(event, "content-type", "text/calendar; charset=utf-8");
    return buildCalendar(meetups);
  },
  { maxAge: 60 * 60, name: "calendar-feed" }
);
