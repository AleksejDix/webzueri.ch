// Well-known companies to show under the hero, most recognisable first. A logo only
// shows if a speaker's company in Hygraph matches it, so the strip never claims too much.
// Logos are the official ones from Wikimedia Commons in public/img/companies; "dark" means
// there's a -dark.svg with light text for dark mode. aspect is width / height, for sizing;
// scale nudges logos with lots of built-in space or a heavy solid block
export const NOTABLE_COMPANIES: { name: string; match: RegExp; logo: string; aspect: number; scale?: number; dark?: boolean }[] = [
  { name: "Google", match: /\bgoogle\b/i, logo: "google", aspect: 2.96 },
  { name: "Microsoft", match: /\bmicrosoft\b/i, logo: "microsoft", aspect: 4.69, dark: true },
  { name: "YouTube", match: /\byoutube\b/i, logo: "youtube", aspect: 4.48, dark: true },
  { name: "GitLab", match: /\bgitlab\b/i, logo: "gitlab", aspect: 3.27 },
  { name: "Hugging Face", match: /\bhugging ?face\b/i, logo: "huggingface", aspect: 3.76, scale: 1.25, dark: true },
  { name: "Swiss Post", match: /\bswiss post\b|\bdie post\b/i, logo: "swisspost", aspect: 3.34, scale: 0.85 },
  { name: "SRF", match: /\bSRF\b/, logo: "srf", aspect: 3.71, scale: 1.1, dark: true },
  { name: "Ringier", match: /\bringier\b/i, logo: "ringier", aspect: 4.89, dark: true },
  { name: "ETH Zürich", match: /\beth z(u|ü)rich\b/i, logo: "eth", aspect: 6, dark: true },
  { name: "Homegate", match: /\bhomegate\b/i, logo: "homegate", aspect: 5.9, dark: true },
  { name: "Accenture", match: /\baccenture\b/i, logo: "accenture", aspect: 3.64, dark: true },
  { name: "Capgemini", match: /\bcapgemini\b/i, logo: "capgemini", aspect: 4.29, dark: true },
  { name: "XING", match: /\bxing\b/i, logo: "xing", aspect: 2.57, scale: 0.85, dark: true },
];
