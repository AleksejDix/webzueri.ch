// Well-known companies to show under the hero, most recognisable first. A logo only shows
// if a speaker works or worked there: their company in Hygraph matches `pattern`, or, with
// `bio`, their bio says so ("at Swisscom", "@SBB", "worked at …", "roles include …").
// Logos are the official ones in public/img/companies; `dark` means there's a -dark.svg with
// light text for dark mode. `aspect` is width / height, for sizing, and `scale` nudges logos
// with lots of built-in space or a heavy solid block
export interface NotableCompany {
  name: string;
  pattern: string;
  caseSensitive?: boolean;
  bio?: boolean;
  logo: string;
  aspect: number;
  scale?: number;
  dark?: boolean;
}

export const NOTABLE_COMPANIES: NotableCompany[] = [
  { name: "Google", pattern: "Google", bio: true, logo: "google", aspect: 2.96 },
  { name: "Microsoft", pattern: "Microsoft", bio: true, logo: "microsoft", aspect: 4.69, dark: true },
  { name: "YouTube", pattern: "YouTube", logo: "youtube", aspect: 4.48, dark: true },
  { name: "Amazon Web Services", pattern: "AWS|Amazon Web Services", caseSensitive: true, bio: true, logo: "aws", aspect: 1.67, scale: 0.8, dark: true },
  { name: "Swisscom", pattern: "Swisscom", bio: true, logo: "swisscom", aspect: 3.41, dark: true },
  { name: "SBB", pattern: "SBB", caseSensitive: true, bio: true, logo: "sbb", aspect: 8.9, dark: true },
  { name: "UBS", pattern: "UBS", caseSensitive: true, bio: true, logo: "ubs", aspect: 2.83, dark: true },
  { name: "Swiss Post", pattern: "Swiss Post|Die Post", logo: "swisspost", aspect: 3.34, scale: 0.85 },
  { name: "Red Hat", pattern: "Red Hat", bio: true, logo: "redhat", aspect: 4.23, dark: true },
  { name: "GitLab", pattern: "GitLab", bio: true, logo: "gitlab", aspect: 3.27 },
  { name: "Hugging Face", pattern: "Hugging ?Face", bio: true, logo: "huggingface", aspect: 3.76, scale: 1.25, dark: true },
  { name: "SRF", pattern: "SRF", caseSensitive: true, bio: true, logo: "srf", aspect: 3.71, scale: 1.1, dark: true },
  { name: "NZZ", pattern: "NZZ", caseSensitive: true, bio: true, logo: "nzz", aspect: 5.2, scale: 1.2, dark: true },
  { name: "Ringier", pattern: "Ringier", logo: "ringier", aspect: 4.89, dark: true },
  { name: "ETH Zürich", pattern: "ETH Z(?:u|ü)rich", caseSensitive: true, logo: "eth", aspect: 6, dark: true },
  { name: "Homegate", pattern: "Homegate", bio: true, logo: "homegate", aspect: 5.9, dark: true },
  { name: "Accenture", pattern: "Accenture", bio: true, logo: "accenture", aspect: 3.64, dark: true },
  { name: "Capgemini", pattern: "Capgemini", logo: "capgemini", aspect: 4.29, dark: true },
  { name: "XING", pattern: "XING", logo: "xing", aspect: 2.57, scale: 0.85, dark: true },
];
