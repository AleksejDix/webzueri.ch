<template>
  <div v-if="talk">
    <PageHero :title="talk.name.trim()">
      <template #before>
        <NuxtLink to="/talks" class="back">
          <LucideArrowLeft :size="16" aria-hidden="true" />
          All talks
        </NuxtLink>
      </template>
      <ul class="byline">
        <li v-for="s in talk.speakers" :key="s.id">
          <NuxtLink :to="`/speakers/${s.id}`" class="byline__speaker">
            <Avatar :url="s.speakerPicture?.url" :name="s.name" :size="36" />
            {{ s.name }}
          </NuxtLink>
        </li>
      </ul>
      <p v-if="meta" class="mt-3 text-zh-muted">{{ meta }}</p>
    </PageHero>

    <div class="talk">
      <!-- Click-to-play: the YouTube player only loads when someone asks for it -->
      <div v-if="talk.youtubecode" class="talk__video tile">
        <iframe
          v-if="playing"
          :src="`https://www.youtube-nocookie.com/embed/${talk.youtubecode}?autoplay=1&rel=0`"
          :title="talk.name"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        <button v-else type="button" class="talk__poster" @click="playing = true">
          <YtThumb :id="talk.youtubecode" hd eager alt="" />
          <span class="talk__play"><LucidePlay :size="28" fill="currentColor" aria-hidden="true" /></span>
          <span class="sr-only">Play video: {{ talk.name }}</span>
        </button>
      </div>

      <div v-if="talk.abstract" class="talk__abstract">
        <h2 class="heading text-2xl">About this talk</h2>
        <p>{{ talk.abstract }}</p>
      </div>

      <section v-if="talk.speakers?.length" class="talk__speakers">
        <h2 class="heading text-2xl">{{ talk.speakers.length === 1 ? "Speaker" : "Speakers" }}</h2>
        <NuxtLink v-for="s in talk.speakers" :key="s.id" :to="`/speakers/${s.id}`" class="speaker-link">
          <Avatar :url="s.speakerPicture?.url" :name="s.name" :size="56" />
          <span>
            <span class="block text-lg font-semibold text-zh-navy">{{ s.name }}</span>
            <span class="text-zh-muted">See all talks</span>
          </span>
          <LucideArrowRight :size="18" class="ml-auto text-zh-blue" aria-hidden="true" />
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

useSeoMeta({
  title: () => talk.value?.name?.trim() || "Talk not found",
  description: () => talk.value?.abstract || "A talk from Web Zürich",
  ogTitle: () => talk.value?.name || "Talk",
  ogDescription: () => talk.value?.abstract || "A talk from Web Zürich",
  ogImage: () =>
    talk.value?.youtubecode
      ? `https://i.ytimg.com/vi/${talk.value.youtubecode}/sddefault.jpg`
      : talk.value?.speakers?.[0]?.speakerPicture?.url || "https://webzurich.ch/icon.png",
  twitterCard: "summary_large_image",
});

if (talk.value?.youtubecode) {
  useSeoMeta({
    ogVideo: `https://www.youtube.com/embed/${talk.value.youtubecode}`,
    ogVideoType: "text/html",
    ogVideoWidth: "1280",
    ogVideoHeight: "720",
  });
}
</script>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 999px;
  background: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.back:hover {
  color: var(--color-zh-blue);
}
.byline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
}
.byline__speaker {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 1rem 0.25rem 0.25rem;
  border-radius: 999px;
  background: #fff;
  font-weight: 600;
  color: var(--color-zh-navy);
  transition: color 0.2s;
}
.byline__speaker:hover {
  color: var(--color-zh-blue);
}

.talk {
  display: grid;
  gap: 3.5rem;
  max-width: 48rem;
  margin: clamp(2.5rem, 6vw, 4rem) auto 0;
  padding-inline: 1.5rem;
}
.talk__video {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--color-zh-navy);
  box-shadow: 0 40px 80px -40px rgb(0 12 31 / 0.55);
}
@media (min-width: 1024px) {
  .talk__video {
    margin-inline: -6rem;
  }
}
.talk__video iframe,
.talk__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.talk__play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  place-items: center;
  width: 5rem;
  height: 5rem;
  padding-left: 4px;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-blue);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 0.75rem rgb(255 255 255 / 0.25);
  transition: transform 0.3s var(--ease-out-soft);
}
.talk__poster:hover .talk__play {
  transform: translate(-50%, -50%) scale(1.08);
}
.talk__abstract p {
  margin-top: 1rem;
  font-size: 1.125rem;
  line-height: 1.7;
  white-space: pre-line;
  max-width: 65ch;
}
.talk__speakers {
  display: grid;
  gap: 0.5rem;
}
.talk__speakers h2 {
  margin-bottom: 0.5rem;
}
.speaker-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  margin-inline: -0.75rem;
  border-radius: 1.5rem;
  transition: background 0.2s;
}
.speaker-link:hover {
  background: var(--color-zh-soft);
}
</style>
