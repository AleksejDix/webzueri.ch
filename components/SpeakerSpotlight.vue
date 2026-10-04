<template>
  <section v-if="people?.length" class="spotlight" aria-labelledby="spotlight-title">
    <div class="spotlight__head">
      <h2 id="spotlight-title" class="display spotlight__title">Meet our speakers</h2>
      <p class="lede spotlight__lede">A few of the {{ total || "many" }} people who have taken the stage. A new selection every day.</p>
      <NuxtLink to="/speakers" class="btn btn-quiet">See all speakers</NuxtLink>
    </div>

    <div class="spotlight__rail-wrap">
      <ul ref="rail" class="spotlight__rail">
        <li v-for="p in people" :key="p.id" class="spotlight__item">
          <NuxtLink :to="`/speakers/${p.id}`" class="card">
            <img
              :src="thumb(p.picture, 520)"
              :alt="p.name"
              class="card__photo"
              width="260"
              height="260"
              loading="lazy"
              :style="{ viewTransitionName: `speaker-${p.id}` }"
            />
            <span class="card__name">{{ p.name }}</span>
            <span v-if="p.role || p.company" class="card__role">{{ [p.role, p.company].filter(Boolean).join(", ") }}</span>
            <span v-if="p.latestTalk" class="card__talk">
              <LucideMic :size="14" aria-hidden="true" />
              {{ p.latestTalk.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="spotlight__controls">
      <button type="button" class="spotlight__btn" aria-label="Previous speakers" @click="scroll(-1)">
        <LucideChevronLeft :size="18" />
      </button>
      <button type="button" class="spotlight__btn" aria-label="More speakers" @click="scroll(1)">
        <LucideChevronRight :size="18" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ total?: number }>();

interface Person {
  id: string;
  name: string;
  picture: string;
  role: string;
  company: string;
  talkCount: number;
  latestTalk: { id: string; name: string; date: string | null } | null;
}

const thumb = useThumb();
const { data: people } = await useFetch<Person[]>("/api/spotlight");

const rail = ref<HTMLElement>();
function scroll(direction: number) {
  const el = rail.value;
  if (!el) return;
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
}
</script>

<style scoped>
/* Full-width light band with a card rail, like america.gov's "More coming" section */
.spotlight {
  margin-top: clamp(7rem, 12vw, 11rem);
  padding-block: clamp(5rem, 7.5vw, 10.75rem);
  background: #f7f7f7;
}
.spotlight__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding-inline: 1.5rem;
  text-align: center;
}
.spotlight__title {
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.06;
}
.spotlight__lede {
  max-width: 34rem;
  margin-top: -0.5rem;
}

.spotlight__rail-wrap {
  margin-top: clamp(3rem, 5vw, 5rem);
}
.spotlight__rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(14rem, 22vw, 17.5rem);
  gap: 1rem;
  padding-inline: max(1.5rem, calc((100vw - 76rem) / 2));
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: max(1.5rem, calc((100vw - 76rem) / 2));
  scrollbar-width: none;
}
.spotlight__rail::-webkit-scrollbar {
  display: none;
}
.spotlight__item {
  scroll-snap-align: start;
}
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.75rem 0.75rem 1.25rem;
  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.04), 0 7px 3.5px rgb(0 0 0 / 0.03), 0 15px 4.5px rgb(0 0 0 / 0.02);
  transition: transform 0.4s var(--ease-out-soft);
}
.card:hover {
  transform: translateY(-4px);
}
.card__photo {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 1.5rem;
  object-fit: cover;
  object-position: top;
  background: var(--color-zh-soft);
}
.card__name {
  margin: 1rem 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-zh-navy);
}
.card:hover .card__name {
  color: var(--color-zh-blue);
}
.card__role {
  margin: 0.25rem 0.5rem 0;
  font-size: 0.9375rem;
  color: var(--color-zh-muted);
}
.card__talk {
  display: flex;
  gap: 0.375rem;
  margin: auto 0.5rem 0;
  padding-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.35;
  color: var(--color-zh-ink);
}
.card__talk svg {
  flex: none;
  margin-top: 0.15em;
  color: var(--color-zh-blue);
}

.spotlight__controls {
  display: flex;
  justify-content: center;
  gap: 0.625rem;
  margin-top: 3rem;
}
.spotlight__btn {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 999px;
  background: #fff;
  color: var(--color-zh-navy);
  box-shadow: 0 2px 2px rgb(0 0 0 / 0.05), 0 7px 3.5px rgb(0 0 0 / 0.04), 0 15px 4.5px rgb(0 0 0 / 0.03), 0 27px 5.5px rgb(0 0 0 / 0.01);
  transition: transform 0.2s;
}
.spotlight__btn:hover {
  transform: translateY(-1px);
}
</style>
