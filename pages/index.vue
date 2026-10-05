<template>
  <div>
    <section class="frame">
      <!-- 144px above and below, as on america.gov. Their controls row only exists with several photos -->
      <div class="flex flex-col items-center px-[clamp(1rem,1.38vw,2rem)] py-[clamp(6rem,6.23vw,9rem)] text-center">
        <!-- The title is drawn by hand, so its size is a width rather than a font size -->
        <h1 class="mx-auto w-[min(100%,clamp(18rem,50vw,64rem))]"><HandwrittenTitle /></h1>
        <p class="lede hero__lede mt-[clamp(1.25rem,1.8vw,2.5rem)] text-[clamp(1.125rem,1.44vw,2.25rem)] leading-[1.1]">Talks, speakers and meetups. Whatever you're looking for, start here.</p>
        <!-- 56vw wide at 3:2, radius 64px and the search bar 16px from the top, as on america.gov.
             The bottom margin leaves room for the slideshow buttons under the card -->
        <div
          class="hero__card relative mt-[clamp(2rem,2.6vw,3.75rem)] mb-14 aspect-[3/2] w-[min(100%,max(40rem,56.34vw))] rounded-[clamp(1.5rem,2.77vw,4rem)] shadow-[0_2px_2px_rgb(0_0_0/0.05),0_7px_3.5px_rgb(0_0_0/0.04),0_15px_4.5px_rgb(0_0_0/0.03),0_27px_5.5px_rgb(0_0_0/0.01)] max-[40rem]:aspect-[4/5]"
        >
          <HeroGallery v-if="gallery.length" :photos="gallery" />
          <div class="absolute inset-x-[7.68%] top-4 z-2 max-[40rem]:inset-x-3">
            <AskBar variant="hero" />
          </div>
        </div>
        <SpeakerCompanies class="mt-[clamp(1rem,2vw,2.5rem)]" />
      </div>
    </section>

    <!-- The one scroll-driven moment on the page -->
    <section class="px-6 pt-[clamp(5rem,11.86vw,17.125rem)] pb-[clamp(5rem,14.6vw,21.125rem)]" aria-label="Web Zürich in numbers">
      <RevealStatement :parts="statement" />
    </section>

    <!-- 448px tile, 136px gutter, 308px text and 120px between rows -->
    <section class="grid gap-[clamp(4rem,5.2vw,7.5rem)] px-6" aria-label="What you'll find here">
      <article class="grid items-center justify-center gap-8 md:grid-cols-[minmax(0,28rem)_minmax(0,19.25rem)] md:gap-x-[clamp(2.5rem,5.9vw,8.5rem)]">
        <NuxtLink
          to="/speakers"
          class="tile grid aspect-square grid-cols-3 place-items-center rounded-[19.2%] bg-soft p-7 transition-transform duration-500 ease-out-soft hover:-translate-y-1"
          tabindex="-1"
          aria-hidden="true"
        >
          <img
            v-for="s in faces"
            :key="s.id"
            :src="thumb(s.speakerPicture?.url, 160)"
            alt=""
            width="80"
            height="80"
            loading="lazy"
            class="aspect-square w-[82%] rounded-full border-4 border-white object-cover shadow-[0_10px_24px_-12px_rgb(var(--wz-shadow)/0.45)]"
          />
        </NuxtLink>
        <div>
          <h2 class="heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">The people behind the talks.</h2>
          <p class="mt-6 mb-8 text-lg leading-[1.45] text-muted">
            {{ speakerCount }} people have shared what they know on our stage. Find them and everything they presented.
          </p>
          <NuxtLink to="/speakers" class="text-[1rem] leading-none font-bold tracking-[-0.01em] text-heading [transition:color_0.2s] hover:text-link">Meet the speakers</NuxtLink>
        </div>
      </article>

      <article v-if="event" class="grid items-center justify-center gap-8 md:grid-cols-[minmax(0,28rem)_minmax(0,19.25rem)] md:gap-x-[clamp(2.5rem,5.9vw,8.5rem)]">
        <a
          :href="event.meetupLink || MEETUP_URL"
          target="_blank"
          rel="noopener"
          class="tile flex aspect-square flex-col items-center justify-center rounded-[19.2%] bg-accent p-8 text-center text-white transition-transform duration-500 ease-out-soft hover:-translate-y-1"
          tabindex="-1"
          aria-hidden="true"
        >
          <span class="text-[1.0625rem] font-semibold">{{ fmt(event.date, { month: "long", year: "numeric" }) }}</span>
          <span class="text-[clamp(7rem,17vw,10.5rem)] leading-none font-medium tracking-[-0.06em]">{{ fmt(event.date, { day: "numeric" }) }}</span>
          <span class="max-w-[15rem] text-[0.9375rem] text-[rgb(255_255_255/0.85)]">{{ event.venue ? [event.venue.name, event.venue.city].filter(Boolean).join(", ") : "Zürich" }}</span>
        </a>
        <div>
          <h2 class="heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
            {{ upcoming ? "Next meetup" : "Last meetup" }}, {{ fmt(event.date, { weekday: "long", day: "numeric", month: "long" }) }}.
          </h2>
          <ul class="mt-5 mb-6 grid gap-3.5">
            <li v-for="talk in event.talks" :key="talk.id">
              <NuxtLink :to="`/talks/${talk.id}`" class="group/talk grid leading-[1.4]">
                <span class="font-semibold text-heading [transition:color_0.2s] group-hover/talk:text-link">{{ talk.name.trim() }}</span>
                <span class="text-muted">{{ talk.speakers.map((s) => s.name).join(", ") }}</span>
              </NuxtLink>
            </li>
          </ul>
          <a :href="event.meetupLink || MEETUP_URL" target="_blank" rel="noopener" class="text-[1rem] leading-none font-bold tracking-[-0.01em] text-heading [transition:color_0.2s] hover:text-link">
            {{ upcoming ? "Register on Meetup" : "Get notified about the next one" }}
          </a>
        </div>
      </article>

      <article class="grid items-center justify-center gap-8 md:grid-cols-[minmax(0,28rem)_minmax(0,19.25rem)] md:gap-x-[clamp(2.5rem,5.9vw,8.5rem)]">
        <a
          :href="SUBMIT_TALK_URL"
          target="_blank"
          rel="noopener"
          class="tile grid aspect-square place-items-center rounded-[19.2%] bg-soft transition-transform duration-500 ease-out-soft hover:-translate-y-1"
          tabindex="-1"
          aria-hidden="true"
        >
          <span class="grid size-24 place-items-center rounded-full bg-accent text-white shadow-[0_0_0_1.25rem_color-mix(in_oklab,var(--wz-accent)_8%,transparent),0_0_0_2.5rem_color-mix(in_oklab,var(--wz-accent)_5%,transparent)]"><LucideMic :size="36" /></span>
        </a>
        <div>
          <h2 class="heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">Your turn on stage.</h2>
          <p class="mt-6 mb-8 text-lg leading-[1.45] text-muted">
            Anyone can apply to speak, whether it's your first talk or your fiftieth. Send us your idea through a short form.
          </p>
          <a :href="SUBMIT_TALK_URL" target="_blank" rel="noopener" class="text-[1rem] leading-none font-bold tracking-[-0.01em] text-heading [transition:color_0.2s] hover:text-link">Submit a talk</a>
        </div>
      </article>
    </section>

    <SpeakerSpotlight :total="speakerCount" />

    <HomeSponsors :sponsors="data?.sponsors ?? []" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import homeQuery from "~/services/apollo/queries/home.gql";
import heroPhotosQuery from "~/services/apollo/queries/heroPhotos.gql";
import { GALLERY_PHOTOS } from "~/utils/galleryPhotos";
import { MEETUP_URL, SUBMIT_TALK_URL } from "~/composables/useSiteSearch";
import AskBar from "~/components/AskBar.vue";
import RevealStatement from "~/components/RevealStatement.vue";
import SpeakerSpotlight from "~/components/SpeakerSpotlight.vue";
import HomeSponsors from "~/components/HomeSponsors.vue";
import SpeakerCompanies from "~/components/SpeakerCompanies.vue";

const thumb = useThumb();
const { data } = await useAsyncQuery<any>(homeQuery);

const event = computed(() => data.value?.events?.[0] ?? null);
const talkCount = computed(() => data.value?.talksConnection?.aggregate?.count ?? 0);
const speakerCount = computed(() => data.value?.speakersConnection?.aggregate?.count ?? 0);
const eventCount = computed(() => data.value?.eventsConnection?.aggregate?.count ?? 0);
const since = computed(() => data.value?.firstEvent?.[0]?.date?.slice(0, 4) ?? "2016");

// "Next meetup" until the day is over, "Last meetup" after; decided in the browser too
const today = useToday();
const upcoming = computed(() => !!event.value && event.value.date >= today.value);

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" });

// Unique speaker faces from the latest meetup first, then recent talks
const faces = computed(() => {
  const seen = new Map<string, any>();
  const pool = [
    ...(event.value?.talks ?? []).flatMap((t: any) => t.speakers),
    ...(data.value?.recent ?? []).flatMap((t: any) => t.speakers),
  ];
  for (const s of pool) if (s.speakerPicture?.url && !seen.has(s.id)) seen.set(s.id, s);
  return [...seen.values()].slice(0, 9);
});

const statement = computed(() => [
  `Since ${since.value}, ${speakerCount.value} speakers`,
  { faces: faces.value.slice(0, 3).map((s: any) => thumb(s.speakerPicture.url, 128)) },
  `have given ${talkCount.value} talks at ${eventCount.value} meetups in Zürich. Entry is free, and anyone can apply to speak`,
  { icon: "mic" as const },
]);


// Meetup photos from Hygraph (Photo entries with "Show in hero" switched on),
// plus the ones shipped with the site (utils/galleryPhotos.ts). A photo in both,
// matched by caption and date, is shown once. The slideshow takes turns between
// meetups, newest first, so it doesn't show one evening a dozen times in a row
const { data: photoData } = await useAsyncQuery<{
  photos: { id: string; caption: string | null; date: string | null; image: { url: string } }[];
}>(heroPhotosQuery);
const gallery = computed(() => {
  const fromHygraph = (photoData.value?.photos ?? []).map((p) => ({ src: p.image.url, caption: p.caption ?? "", date: p.date ?? "" }));
  const seen = new Set(fromHygraph.map((p) => `${p.caption}|${p.date}`));
  const all = [...fromHygraph, ...GALLERY_PHOTOS.filter((p) => !seen.has(`${p.caption}|${p.date}`))];
  const meetups = [...new Set(all.map((p) => p.date))].sort().reverse().map((d) => all.filter((p) => p.date === d));
  const turns = Math.max(...meetups.map((m) => m.length));
  return Array.from({ length: turns }, (_, i) => meetups.map((m) => m[i]))
    .flat()
    .filter((p) => p !== undefined)
    .map((p) => ({ src: p.src, alt: p.caption || "Web Zürich meetup" }));
});

useSeoMeta({
  title: "Web Zürich: meetups, talks and speakers",
  description:
    "Zürich's web community: free monthly meetups and the people who give the talks. Find a talk, a speaker or the next meetup.",
  ogTitle: "Web Zürich",
  ogDescription: "Free monthly meetups and the people who give the talks.",
});
defineOgImage("Page", {
  kicker: "Zürich's web community",
  title: "Web Zürich",
  description: "Free meetups, talks and speakers since 2016. Find a talk, a speaker or the next meetup.",
});
</script>

<style scoped>
/* Lede and photo card rise in on load (the keyframes are scoped, so the animations stay here) */
.hero__lede {
  animation: rise 1s var(--ease-out-soft) 0.1s both;
}
.hero__card {
  animation: rise 1.1s var(--ease-out-soft) 0.2s both;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
}
</style>
