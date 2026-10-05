<template>
  <div v-if="talk">
    <PageHero :title="talk.name.trim()">
      <template #before>
        <NuxtLink
          to="/talks"
          class="mb-6 inline-flex items-center gap-1.5 rounded-full bg-raised px-3.5 py-1.5 text-[0.875rem] font-semibold text-heading hover:text-link"
        >
          <LucideArrowLeft :size="16" aria-hidden="true" />
          All talks
        </NuxtLink>
      </template>
      <ul class="mt-7 flex flex-wrap justify-center gap-3">
        <li v-for="s in talk.speakers" :key="s.id">
          <NuxtLink
            :to="`/speakers/${s.id}`"
            class="inline-flex items-center gap-2.5 rounded-full bg-raised py-1 pr-4 pl-1 font-semibold text-heading [transition:color_0.2s] hover:text-link"
          >
            <Avatar :url="s.speakerPicture?.url" :name="s.name" :size="36" />
            {{ s.name }}
          </NuxtLink>
        </li>
      </ul>
      <p v-if="meta" class="mt-3 text-muted">{{ meta }}</p>
    </PageHero>

    <div class="mx-auto mt-[clamp(2.5rem,6vw,4rem)] grid max-w-[48rem] gap-14 px-6">
      <!-- Click-to-play: the YouTube player only loads when someone asks for it -->
      <div v-if="talk.youtubecode" class="tile relative aspect-video bg-deep shadow-[0_40px_80px_-40px_rgb(var(--wz-shadow)/0.55)] lg:-mx-24">
        <iframe
          v-if="playing"
          :src="`https://www.youtube-nocookie.com/embed/${talk.youtubecode}?autoplay=1&rel=0`"
          :title="talk.name"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="absolute inset-0 h-full w-full border-0"
        />
        <button v-else type="button" class="group/poster absolute inset-0 h-full w-full border-0" @click="playing = true">
          <YtThumb :id="talk.youtubecode" hd eager alt="" />
          <span
            class="absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-raised pl-1 text-link shadow-[0_0_0_0.75rem_rgb(255_255_255/0.25)] transition-transform duration-300 ease-out-soft group-hover/poster:scale-108"
          ><LucidePlay :size="28" fill="currentColor" aria-hidden="true" /></span>
          <span class="sr-only">Play video: {{ talk.name }}</span>
        </button>
      </div>

      <div v-if="talk.abstract">
        <h2 class="heading text-2xl">About this talk</h2>
        <p class="mt-4 max-w-[65ch] text-lg leading-[1.7] whitespace-pre-line">{{ talk.abstract }}</p>
      </div>

      <section v-if="talk.speakers?.length" class="grid gap-2">
        <h2 class="heading mb-2 text-2xl">{{ talk.speakers.length === 1 ? "Speaker" : "Speakers" }}</h2>
        <NuxtLink
          v-for="s in talk.speakers"
          :key="s.id"
          :to="`/speakers/${s.id}`"
          class="-mx-3 flex items-center gap-4 rounded-3xl p-3 [transition:background_0.2s] hover:bg-soft"
        >
          <Avatar :url="s.speakerPicture?.url" :name="s.name" :size="56" />
          <span>
            <span class="block text-lg font-semibold text-heading">{{ s.name }}</span>
            <span class="text-muted">See all talks</span>
          </span>
          <LucideArrowRight :size="18" class="ml-auto text-link" aria-hidden="true" />
        </NuxtLink>
      </section>
    </div>
  </div>

  <div v-else>
    <PageHero title="Talk not found" lede="This talk doesn't exist or was removed. Search for it by title or speaker instead.">
      <NuxtLink to="/talks" class="btn btn-primary mt-8">Browse all talks</NuxtLink>
    </PageHero>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import talkQuery from "~/services/apollo/queries/talk.gql";
import PageHero from "~/components/PageHero.vue";
import Avatar from "~/components/Avatar.vue";
import YtThumb from "~/components/YtThumb.vue";

const route = useRoute();
const id = route.params.id as string;

const { data, error } = await useAsyncQuery<any>(talkQuery, { id });

// talks returns an array, so take the first item
const talk = computed(() => data.value?.talks?.[0]);
const playing = ref(false);

if (import.meta.server && !talk.value && !error.value) {
  setResponseStatus(useRequestEvent(), 404);
}

const meta = computed(() => {
  const parts: string[] = [];
  if (talk.value?.category) parts.push(talk.value.category);
  if (talk.value?.event?.date) {
    parts.push(
      `Given on ${new Date(talk.value.event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`
    );
  }
  return parts.join(", ");
});

const speakerNames = computed(() => (talk.value?.speakers ?? []).map((s: any) => s.name.trim()).join(", "));

// Search results show about 155 characters: who, when, then the start of the abstract
const description = computed(() => {
  const t = talk.value;
  if (!t) return "A talk from Web Zürich";
  const when = t.event?.date
    ? new Date(t.event.date).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
    : "";
  const lead = `${t.youtubecode ? "Watch the talk" : "Talk"} by ${speakerNames.value || "a speaker"} at Web Zürich${when ? `, ${when}` : ""}.`;
  const abstract = (t.abstract ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const text = abstract ? `${lead} ${abstract}` : lead;
  return text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, "")}…` : text;
});

useSeoMeta({
  title: () => talk.value?.name?.trim() || "Talk not found",
  description: () => description.value,
  ogTitle: () => talk.value?.name?.trim() || "Talk",
  ogDescription: () => description.value,
});

// schema.org: a recorded talk is a video, so Google can show it in video results
if (talk.value?.youtubecode) {
  const t = talk.value;
  useSchemaOrg([
    defineVideo({
      name: t.name.trim(),
      description: description.value,
      thumbnailUrl: `https://i.ytimg.com/vi/${t.youtubecode}/hqdefault.jpg`,
      uploadDate: t.event?.date ?? t.createdAt,
      embedUrl: `https://www.youtube.com/embed/${t.youtubecode}`,
      contentUrl: `https://www.youtube.com/watch?v=${t.youtubecode}`,
    }),
  ]);
}

// Share card for LinkedIn, X and Slack previews
if (talk.value) {
  const photo = talk.value.speakers?.find((s: any) => s.speakerPicture?.url && s.speakerPicture.fileName !== "unicorn.jpg");
  defineOgImage("Talk", {
    title: talk.value.name.trim(),
    speakers: speakerNames.value,
    photo: photo?.speakerPicture.url ?? "",
    date: talk.value.event?.date
      ? new Date(talk.value.event.date).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
      : "",
    video: Boolean(talk.value.youtubecode),
  });
}

if (talk.value?.youtubecode) {
  useSeoMeta({
    ogVideo: `https://www.youtube.com/embed/${talk.value.youtubecode}`,
    ogVideoType: "text/html",
    ogVideoWidth: "1280",
    ogVideoHeight: "720",
  });
}
</script>
