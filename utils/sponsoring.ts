// What it costs to cover part of a meetup evening. Covering any one of them
// includes a speaking slot. Used on the sponsors page and the advertising rules.
export const SPONSOR_PRICES = [
  { name: "Cleanup after the evening", short: "Cleanup", price: "CHF 300", covers: "Putting the venue back in order after the meetup." },
  { name: "Catering: pizza and drinks", short: "Catering", price: "CHF 1,000", covers: "Pizza, drinks and water for everyone who comes." },
  { name: "Venue rental for the evening", short: "Venue", price: "CHF 1,500", covers: "The room, projector and sound. Or host us in your own office." },
];

export const SPONSOR_EMAIL = "info@webzurich.ch";

// Sponsors are listed only once they've supported more than one meetup
export const MIN_SPONSOR_MEETUPS = 2;
