import Vue from "vue";
import fromUnixTime from "date-fns/fromUnixTime";
import formatDistance from "date-fns/formatDistance";
import format from "date-fns/format";

Vue.filter("humanDate", value => {
  if (!value) return "just now";
  return formatDistance(fromUnixTime(value.seconds), new Date()) + " ago";
});

Vue.filter("date", (value, f = "dd.MM.yyyy") => {
  if (!value) return "";
  return format(new Date(value), f);
});

Vue.filter("time", value => {
  if (!value) return "";
  return format(fromUnixTime(value.seconds), `hh:mm:ss`);
});

Vue.filter("capitalize", value => {
  if (!value) return;
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("shorten", (value, limit) => {
  if (!value) return "";
  value = value.toString();
  return value.length > limit ? value.substr(0, limit - 1) + "…" : value;
});
