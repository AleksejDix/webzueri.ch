import { NOTABLE_COMPANIES } from "../../utils/notableCompanies";

// The well-known companies our speakers work or worked at, for the logos under the
// home page hero, plus how many other companies they came from. Bios are read here
// so they don't end up in the home page payload
const QUERY = /* GraphQL */ `
  query speakerCompanies {
    speakers(first: 1000, where: { talks_some: {}, name_not: "Organising team" }) {
      company
      bio
    }
  }
`;

export default defineCachedEventHandler(
  async () => {
    const { hygraphEndpoint } = useRuntimeConfig();
    const { data } = await $fetch<{ data: { speakers: { company: string | null; bio: string | null }[] } }>(hygraphEndpoint, {
      method: "POST",
      body: { query: QUERY },
    });

    // "Independent" and "Freelance" aren't companies
    const companies = data.speakers
      .map((s) => (s.company ?? "").trim())
      .filter((c) => c && !/^(independent|freelance)/i.test(c));
    const bios = data.speakers.map((s) => (s.bio ?? "").replace(/\s+/g, " "));

    const found = NOTABLE_COMPANIES.filter((c) => {
      const flags = c.caseSensitive ? "" : "i";
      const inCompany = new RegExp(`\\b(?:${c.pattern})\\b`, flags);
      // Only phrasing that means working there: not "studied at" or "worked with clients such as"
      const inBio = new RegExp(
        `(?:\\bat|@)\\s*(?:${c.pattern})\\b|\\b(?:worked at|works at|roles? include)\\b[^.]*?\\b(?:${c.pattern})\\b`,
        flags,
      );
      return companies.some((x) => inCompany.test(x)) || (c.bio && bios.some((b) => inBio.test(b)));
    });

    const shown = (x: string) =>
      found.some((c) => new RegExp(`\\b(?:${c.pattern})\\b`, c.caseSensitive ? "" : "i").test(x));
    const others = new Set(companies.filter((x) => !shown(x)).map((x) => x.toLowerCase())).size;

    return {
      logos: found.map(({ name, logo, aspect, scale, dark }) => ({ name, logo, aspect, scale, dark })),
      others,
    };
  },
  { maxAge: 60 * 60, name: "speaker-companies" },
);
