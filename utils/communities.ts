import { SPONSOR_EMAIL } from "~/utils/sponsoring";

// Other tech communities in Switzerland, shown on /communities.
// Every entry was checked for activity since spring 2025 on 2026-10-04.
// Suggestions come in by email through COMMUNITY_SUGGEST_URL.

export const COMMUNITY_TOPICS = [
  "Web & JavaScript",
  "Design & UX",
  "Languages & Backend",
  "Cloud & DevOps",
  "AI & Data",
  "Security",
  "Inclusion & Learning",
  "Conferences",
  "General",
] as const;

export type CommunityTopic = (typeof COMMUNITY_TOPICS)[number];

export interface Community {
  name: string;
  url: string;
  city: string;
  topic: CommunityTopic;
  description: string;
}

// Opens the visitor's mail app with a short template to fill in
export const COMMUNITY_SUGGEST_URL = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(
  "Community suggestion"
)}&body=${encodeURIComponent("Name:\nWebsite or Meetup page:\nCity:\nWhat it's about and how often it meets:\n")}`;

export const COMMUNITIES: Community[] = [
  // Web & JavaScript
  {
    name: "ZurichJS",
    url: "https://zurichjs.com/",
    city: "Zürich",
    topic: "Web & JavaScript",
    description: "The JavaScript community in Zürich, with regular meetups and the yearly ZurichJS Conf. The Vue meetup is now part of it too.",
  },
  {
    name: "Angular Zürich",
    url: "https://www.meetup.com/angularzrh/",
    city: "Zürich",
    topic: "Web & JavaScript",
    description: "Angular meetups in Zürich with talks on the framework and the tooling around it.",
  },
  {
    name: "TypeScript Switzerland",
    url: "https://www.meetup.com/typescript-switzerland/",
    city: "Zürich",
    topic: "Web & JavaScript",
    description: "TypeScript and software delivery meetup in Zürich, relaunched in 2026 with occasional evening events.",
  },
  {
    name: "GraphQL Zurich",
    url: "https://www.meetup.com/graphql-zurich/",
    city: "Zürich",
    topic: "Web & JavaScript",
    description: "Occasional GraphQL and API meetup, hosted at local tech companies.",
  },
  {
    name: "WordPress Zurich",
    url: "https://www.meetup.com/wordpress-zurich/",
    city: "Zürich",
    topic: "Web & JavaScript",
    description: "Quarterly WordPress meetup with talks for developers, designers and site owners.",
  },
  {
    name: "Drupal Switzerland",
    url: "https://www.meetup.com/drupal-switzerland/",
    city: "Switzerland",
    topic: "Web & JavaScript",
    description: "Drupal meetups in Zürich and Bern, plus hackathons and release parties, a few times a year.",
  },
  {
    name: "Flutter Zürich",
    url: "https://www.meetup.com/flutter-zurich/",
    city: "Zürich",
    topic: "Web & JavaScript",
    description: "Hybrid Flutter and Dart meetup, held about twice a year.",
  },
  {
    name: "Bärner JS Talks",
    url: "https://www.meetup.com/Barner-JS-Talks/",
    city: "Bern",
    topic: "Web & JavaScript",
    description: "JavaScript and web development talk evenings in Bern, about three times a year.",
  },
  {
    name: "JavaScript Luzern",
    url: "https://www.meetup.com/javascript-luzern/",
    city: "Lucerne",
    topic: "Web & JavaScript",
    description: "JavaScript meetup in Lucerne, revived in 2026, with talks and networking every one to two months.",
  },
  {
    name: "Webmardi",
    url: "https://www.meetup.com/webmardi/",
    city: "Lausanne",
    topic: "Web & JavaScript",
    description: "A monthly Tuesday evening talk on web, digital and tech topics, held in French.",
  },
  {
    name: "Mobile Romandie Beer",
    url: "https://www.meetup.com/Mobile-Romandie-Beer/",
    city: "Lausanne",
    topic: "Web & JavaScript",
    description: "Monthly mobile app development meetup with one talk followed by drinks.",
  },
  {
    name: "Webnesday St. Gallen",
    url: "https://www.meetup.com/webnesday/",
    city: "St. Gallen",
    topic: "Web & JavaScript",
    description: "Web developer evening with several short talks, every one to two months.",
  },

  // Design & UX
  {
    name: "IxDF Zurich",
    url: "https://ixdf.org/local-group/europe/switzerland/zurich",
    city: "Zürich",
    topic: "Design & UX",
    description: "The Interaction Design Foundation's local group, with UX meetups and coffee meetings.",
  },
  {
    name: "UX Schweiz: Last Thursday Talks",
    url: "https://www.meetup.com/ux-schweiz-last-thursday-talks/",
    city: "Zürich",
    topic: "Design & UX",
    description: "Talks on UX, usability and interaction design on the last Thursday of the month, followed by drinks.",
  },
  {
    name: "ProductTank Zürich",
    url: "https://www.meetup.com/producttank-zurich/",
    city: "Zürich",
    topic: "Design & UX",
    description: "The Zürich chapter of ProductTank, with talks and workshops for product people a few times a year.",
  },
  {
    name: "Data Visualization Zurich",
    url: "https://www.meetup.com/datavis-zurich/",
    city: "Zürich",
    topic: "Design & UX",
    description: "Monthly talks by people who design and build data visualisations, some streamed online.",
  },
  {
    name: "UX Meetups Bern",
    url: "https://www.meetup.com/ux-meetups-bern/",
    city: "Bern",
    topic: "Design & UX",
    description: "UX Schweiz evening talks on user experience and design, several times a year.",
  },
  {
    name: "UX Schweiz Basel",
    url: "https://www.meetup.com/ux-basel-meetups/",
    city: "Basel",
    topic: "Design & UX",
    description: "Monthly UX talks and networking, organised by UX Schweiz.",
  },
  {
    name: "UX Meetup Luzern",
    url: "https://www.meetup.com/ux-meetup-luzern/",
    city: "Lucerne",
    topic: "Design & UX",
    description: "UX talks a few times a year, on topics such as accessibility and AI in design.",
  },
  {
    name: "UX Meetup St. Gallen",
    url: "https://www.meetup.com/ux-meetup-st-gallen/",
    city: "St. Gallen",
    topic: "Design & UX",
    description: "UX and design talks a few times a year.",
  },

  // Languages & Backend
  {
    name: ".NET User Group Zürich",
    url: "https://www.meetup.com/dotnet-zurich/",
    city: "Zürich",
    topic: "Languages & Backend",
    description: "A user group by and for developers working with Microsoft .NET, with regular evening talks.",
  },
  {
    name: "Zürich Gophers",
    url: "https://www.meetup.com/zurich-gophers/",
    city: "Zürich",
    topic: "Languages & Backend",
    description: "Go meetup every two to three months, hosted by local companies.",
  },
  {
    name: "HaskellerZ",
    url: "https://www.meetup.com/HaskellerZ/",
    city: "Zürich",
    topic: "Languages & Backend",
    description: "Haskell and functional programming meetup, whose community also runs the yearly ZuriHac hackathon.",
  },
  {
    name: "Software Crafters Zürich",
    url: "https://www.meetup.com/Software-Craftsmanship-Zurich/",
    city: "Zürich",
    topic: "Languages & Backend",
    description: "Software craftsmanship talks and hands-on workshops a few times a year.",
  },
  {
    name: "Bärner Go Meetup",
    url: "https://www.meetup.com/berner-go-meetup/",
    city: "Bern",
    topic: "Languages & Backend",
    description: "Go meetup about four times a year, with talks and live code review sessions.",
  },
  {
    name: "Guild42",
    url: "https://www.meetup.com/guild42ch/",
    city: "Bern",
    topic: "Languages & Backend",
    description: "Software engineering talks, roughly monthly, on architecture, security and development practice.",
  },
  {
    name: "Rust Basel",
    url: "https://www.meetup.com/Rust-Basel/",
    city: "Basel",
    topic: "Languages & Backend",
    description: "Rust meetup a few times a year, plus occasional embedded Rust workshops.",
  },
  {
    name: "Geneva.rb",
    url: "https://www.meetup.com/geneva-rb/",
    city: "Geneva",
    topic: "Languages & Backend",
    description: "Ruby and Rails meetup with talks and community nights, roughly monthly.",
  },
  {
    name: "Software Crafts Romandie",
    url: "https://www.meetup.com/romandie-software-craftsmanship/",
    city: "Lausanne",
    topic: "Languages & Backend",
    description: "Software craftsmanship community with talks and mob programming sessions several times a year.",
  },
  {
    name: "Java User Group Switzerland",
    url: "https://www.jug.ch/",
    city: "Switzerland",
    topic: "Languages & Backend",
    description: "Regular evening talks in Zürich, Bern, Basel, Lucerne and St. Gallen.",
  },
  {
    name: "Railshöck: Ruby on Rails Schweiz",
    url: "https://www.meetup.com/rubyonrails-ch/",
    city: "Switzerland",
    topic: "Languages & Backend",
    description: "Railshöck meetups that connect Ruby and Rails developers across the country.",
  },
  {
    name: "Swiss Laravel Association",
    url: "https://laravel.swiss/",
    city: "Switzerland",
    topic: "Languages & Backend",
    description: "Laravel meetups in Zürich, Bern, Zug and other cities for developers who build with the PHP framework.",
  },

  // Cloud & DevOps
  {
    name: "DevOps Meetup Zürich",
    url: "https://www.meetup.com/DevOps-Meetup-Zurich/",
    city: "Zürich",
    topic: "Cloud & DevOps",
    description: "DevOps and SRE meetup, usually monthly, with two talks per evening.",
  },
  {
    name: "Cloud Native Computing Switzerland",
    url: "https://www.meetup.com/cloud-native-computing-switzerland/",
    city: "Zürich",
    topic: "Cloud & DevOps",
    description: "Cloud native and Kubernetes meetup, held a few times a year.",
  },
  {
    name: "Cloud Native Bern",
    url: "https://www.meetup.com/cloudnativebern/",
    city: "Bern",
    topic: "Cloud & DevOps",
    description: "Cloud native and Kubernetes meetup about every three months.",
  },

  // AI & Data
  {
    name: "zurich.tech",
    url: "https://zurich.tech/",
    city: "Zürich",
    topic: "AI & Data",
    description: "Formerly ZurichAI: regular machine learning and NLP meetups, including the ZurichNLP series.",
  },
  {
    name: "PyData Zurich",
    url: "https://www.meetup.com/pydata-zurich/",
    city: "Zürich",
    topic: "AI & Data",
    description: "Data science with Python: machine learning, analytics, open source sprints and the tools behind them.",
  },
  {
    name: "AI Tinkerers Zürich",
    url: "https://zurich.aitinkerers.org/",
    city: "Zürich",
    topic: "AI & Data",
    description: "People building with AI demo their work at evening meetups and build nights.",
  },
  {
    name: "Basel Data Science & AI",
    url: "https://www.meetup.com/basel-data-scientists/",
    city: "Basel",
    topic: "AI & Data",
    description: "Data science and AI talks every two to three months.",
  },

  // Security
  {
    name: "OWASP Switzerland",
    url: "https://www.meetup.com/owaspswitzerland/",
    city: "Zürich",
    topic: "Security",
    description: "The Swiss OWASP chapter, running application security events a few times a year.",
  },
  {
    name: "DEF CON Switzerland (DC4131)",
    url: "https://www.meetup.com/dc4131/",
    city: "Switzerland",
    topic: "Security",
    description: "Hacker community with weekly Beer on Tuesday meetups in several cities, CTFs and the yearly AREA41 conference.",
  },
  {
    name: "Swiss Cyber Security Platform",
    url: "https://www.meetup.com/swiss-cyber-security-platform/",
    city: "Switzerland",
    topic: "Security",
    description: "Cyber Security Breakfasts for experts and beginners to learn, network and collaborate.",
  },
  {
    name: "Chaostreff Bern",
    url: "https://www.meetup.com/chaostreff-bern/",
    city: "Bern",
    topic: "Security",
    description: "Hacker space with theme evenings and talks on privacy, open data and technology.",
  },

  // Inclusion & Learning
  {
    name: "WoSEC Zürich: Women of Security",
    url: "https://www.meetup.com/wist-women-in-security-and-tech-zurich/",
    city: "Zürich",
    topic: "Inclusion & Learning",
    description: "Women in security meeting to exchange knowledge on web, network and information security.",
  },
  {
    name: "Rubymonstas Zürich",
    url: "https://rubymonstas.ch/",
    city: "Zürich",
    topic: "Inclusion & Learning",
    description: "Free programming study groups for women, with a monthly intro session for newcomers.",
  },
  {
    name: "PyLadies Zurich",
    url: "https://www.meetup.com/pyladies-zurich/",
    city: "Zürich",
    topic: "Inclusion & Learning",
    description: "Supporting women in Python, with talks and open source workshops a few times a year.",
  },
  {
    name: "OpenTechSchool Zurich",
    url: "https://www.meetup.com/opentechschool-zurich/",
    city: "Zürich",
    topic: "Inclusion & Learning",
    description: "Free weekly Tuesday evenings to learn or practise programming with volunteer coaches.",
  },

  // Conferences
  {
    name: "Front Conference Zurich",
    url: "https://frontconference.com/",
    city: "Zürich",
    topic: "Conferences",
    description: "Yearly frontend, design and UX conference, running since 2011.",
  },
  {
    name: "Voxxed Days Zürich",
    url: "https://voxxeddays.com/zurich/",
    city: "Zürich",
    topic: "Conferences",
    description: "Yearly one-day developer conference on Java, cloud, architecture and software engineering.",
  },
  {
    name: "DevOpsDays Zurich",
    url: "https://devopsdays.org/events/2026-zurich/welcome/",
    city: "Zürich",
    topic: "Conferences",
    description: "Yearly community-run DevOps conference, part of the worldwide DevOpsDays series.",
  },
  {
    name: "Uphill Conf",
    url: "https://uphillconf.com/",
    city: "Bern",
    topic: "Conferences",
    description: "Yearly two-day conference on applied AI for software engineers, with talks and hands-on workshops.",
  },
  {
    name: "Swiss Python Summit",
    url: "https://www.python-summit.ch/",
    city: "Switzerland",
    topic: "Conferences",
    description: "Yearly Python and data science conference run by a non-profit association in Rapperswil.",
  },
  {
    name: "SoCraTes Switzerland",
    url: "https://socrates-ch.org/",
    city: "Switzerland",
    topic: "Conferences",
    description: "Yearly residential unconference in Ilanz for software crafters, run as open space sessions.",
  },

  // General
  {
    name: "Coders Only",
    url: "https://www.meetup.com/coders-only/",
    city: "Zürich",
    topic: "General",
    description: "Curious coders working on their craft, with a monthly evening, weekly study groups and the Global Day of Coderetreat.",
  },
  {
    name: "Hackergarten Zürich",
    url: "https://www.meetup.com/Hackergarten-Zurich/",
    city: "Zürich",
    topic: "General",
    description: "A monthly evening where developers contribute to open source projects together.",
  },
  {
    name: "Hackergarten Basel",
    url: "https://www.meetup.com/Hackergarten-Basel/",
    city: "Basel",
    topic: "General",
    description: "A monthly open source contribution evening where people work on projects together.",
  },
];
