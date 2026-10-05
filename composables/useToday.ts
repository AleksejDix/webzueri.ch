/**
 * Today's date as YYYY-MM-DD. The site is built ahead of time, so the server-rendered
 * HTML holds the build day; once the page loads in the browser it switches to the real
 * date, and anything that depends on it ("Next meetup" or "Last meetup", "Add to
 * calendar") updates. That way a meetup passing doesn't need a rebuild
 */
export function useToday() {
  const today = useState("today", () => new Date().toISOString().slice(0, 10));
  onMounted(() => {
    today.value = new Date().toISOString().slice(0, 10);
  });
  return today;
}
