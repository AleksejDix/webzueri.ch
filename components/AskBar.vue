<template>
  <div
    ref="root"
    class="ask"
    :class="[`ask--${variant}`, { 'ask--open': open, 'ask--hidden': variant === 'floating' && docked }]"
    :inert="variant === 'floating' && docked ? true : undefined"
  >
    <div class="ask__box">
      <!-- Results panel. Opens upwards for the floating bar, downwards in the hero -->
      <div
        v-if="open"
        :id="listId"
        class="ask__panel"
        role="listbox"
        :aria-label="query ? `Results for ${query}` : 'Suggestions'"
      >
        <template v-if="!query.trim()">
          <p class="ask__group">Try</p>
          <div class="ask__chips">
            <button
              v-for="s in suggestions"
              :key="s"
              type="button"
              class="chip"
              @mousedown.prevent
              @click="query = s"
            >
              {{ s }}
            </button>
          </div>
          <NextMeetup
            v-if="index"
            class="mt-4"
            :event="nextEvent"
            :last="lastEvent"
            :active="items[activeIndex]?.key === 'next'"
            :option-id="optionId('next')"
            @pick="pick(items[0]!)"
          />
        </template>

        <template v-else>
          <template v-for="group in groups" :key="group.label">
            <p class="ask__group">{{ group.label }}</p>
            <ul class="ask__list">
              <li v-for="item in group.items" :key="item.key">
                <NextMeetup
                  v-if="item.kind === 'next'"
                  :event="nextEvent"
                  :last="lastEvent"
                  :active="isActive(item)"
                  :option-id="optionId(item.key)"
                  @pick="pick(item)"
                />
                <a
                  v-else
                  :id="optionId(item.key)"
                  :href="hrefOf(item)"
                  role="option"
                  :aria-selected="isActive(item)"
                  class="ask__option"
                  :class="{ 'is-active': isActive(item), 'ask__option--answer': item.kind === 'answer' }"
                  @mousedown.prevent
                  @mouseenter="activeIndex = items.indexOf(item)"
                  @click.prevent="pick(item)"
                >
                  <img
                    v-if="item.kind === 'speaker' && item.picture"
                    :src="item.picture"
                    alt=""
                    class="ask__avatar"
                    width="40"
                    height="40"

                  />
                  <span v-else-if="item.kind === 'speaker'" class="ask__avatar ask__avatar--empty">
                    {{ initials(item.title) }}
                  </span>
                  <span v-else class="ask__icon" aria-hidden="true">
                    <LucideMessageCircle v-if="item.kind === 'answer'" :size="16" />
                    <LucidePlay v-else-if="item.kind === 'talk' && item.video" :size="16" />
                    <LucideMic v-else-if="item.kind === 'talk'" :size="16" />
                    <LucideCalendarDays v-else-if="item.kind === 'event'" :size="16" />
                    <LucideList v-else-if="item.kind === 'all-talks'" :size="16" />
                    <LucideArrowUpRight v-else-if="item.external" :size="16" />
                    <LucideCornerDownRight v-else :size="16" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="ask__title">{{ item.title }}</span>
                    <span v-if="item.meta" class="ask__meta">{{ item.meta }}</span>
                  </span>
                </a>
              </li>
            </ul>
          </template>

          <p v-if="!items.length && index" class="ask__empty">
            Nothing matches “{{ query }}”. Try a technology like
            <button type="button" class="text-link" @mousedown.prevent @click="query = 'css'">css</button>,
            a speaker's first name, or
            <button type="button" class="text-link" @mousedown.prevent @click="query = 'next meetup'">next meetup</button>.
          </p>
          <p v-else-if="!index" class="ask__empty">Loading talks and speakers…</p>
        </template>
      </div>

      <form class="ask__bar" role="search" @submit.prevent="submit">
        <LucideSearch class="ask__lens" :size="variant === 'hero' ? 22 : 18" aria-hidden="true" />
        <label :for="inputId" class="sr-only">Ask Web Zürich</label>
        <input
          :id="inputId"
          ref="input"
          v-model="query"
          class="ask__input"
          type="text"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
          :aria-expanded="open"
          :aria-controls="listId"
          :aria-activedescendant="open && items[activeIndex] ? optionId(items[activeIndex]!.key) : undefined"
          :placeholder="placeholder"
          @focus="onFocus"
          @blur="open = false"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.esc="onEscape"
        />
        <kbd v-if="variant === 'floating' && !query" class="ask__kbd" aria-hidden="true">/</kbd>
        <button
          v-else-if="query"
          type="button"
          class="ask__clear"
          aria-label="Clear"
          @mousedown.prevent
          @click="query = ''"
        >
          <LucideX :size="16" />
        </button>
        <button type="submit" class="ask__go" aria-label="Show results">
          <LucideArrowRight :size="18" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { initials } from "~/utils/assets";
import { MEETUP_URL, talksLink, useSiteSearch } from "~/composables/useSiteSearch";
import NextMeetup from "~/components/NextMeetup.vue";

const props = withDefaults(defineProps<{ variant?: "hero" | "floating" }>(), {
  variant: "floating",
});

interface Item {
  key: string;
  kind: "next" | "answer" | "page" | "speaker" | "talk" | "all-talks" | "event";
  title: string;
  meta?: string;
  to: string | { path: string; query: Record<string, string> };
  external?: boolean;
  picture?: string;
  video?: boolean;
}

const router = useRouter();
const thumb = useThumb();
const { index, query, load, results, nextEvent, lastEvent } = useSiteSearch();
// The hero bar "docks" the floating one: while the hero is on screen, the floating bar hides
const docked = useState("ask-docked", () => false);

const root = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const open = ref(false);
const activeIndex = ref(0);
const uid = props.variant;
const inputId = `ask-input-${uid}`;
const listId = `ask-list-${uid}`;
const optionId = (key: string) => `ask-${uid}-${key}`;

const suggestions = ["Next meetup", "Videos from 2024", "Talks by Martin", "Accessibility", "Is it free?", "How do I give a talk?"];
const placeholder = props.variant === "hero"
  ? "Try “react videos”, “talks by Aleksej” or “is it free?”"
  : "Ask Web Zürich";

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const items = computed<Item[]>(() => {
  const r = results.value;
  const list: Item[] = [];
  if (!query.value.trim()) {
    if (index.value) list.push(nextItem());
    return list;
  }
  if (r.showNext) list.push(nextItem());
  for (const a of r.answers) {
    list.push({ key: `answer-${a.key}`, kind: "answer", title: a.text, meta: a.link, to: a.to, external: a.external });
  }
  for (const p of r.pages) {
    list.push({ key: `page-${p.title}`, kind: "page", title: p.title, meta: p.description, to: p.to, external: p.external });
  }
  for (const s of r.speakers) {
    list.push({
      key: `speaker-${s.id}`,
      kind: "speaker",
      title: s.name,
      meta: [s.role, s.talkCount === 1 ? "1 talk" : `${s.talkCount} talks`].filter(Boolean).join(", "),
      to: `/speakers/${s.id}`,
      picture: thumb(s.picture, 80),
    });
  }
  for (const t of r.talks) {
    list.push({
      key: `talk-${t.id}`,
      kind: "talk",
      title: t.name,
      meta: [t.speakers.join(", "), t.date && date(t.date)].filter(Boolean).join(", "),
      to: `/talks/${t.id}`,
      video: t.video,
    });
  }
  if (r.talkTotal > r.talks.length) {
    list.push({ key: "all-talks", kind: "all-talks", title: `See all ${r.talkTotal} matching talks`, to: talksLink(r) });
  }
  for (const e of r.events) {
    list.push({
      key: `event-${e.id}`,
      kind: "event",
      title: e.title || `Meetup on ${date(e.date)}`,
      meta: [e.venue, e.talkCount && `${e.talkCount} talks`].filter(Boolean).join(", "),
      to: `/events/${e.date}`,
    });
  }
  return list;
});

function nextItem(): Item {
  const e = nextEvent.value;
  return {
    key: "next",
    kind: "next",
    title: "Next meetup",
    to: e?.meetupLink || MEETUP_URL,
    external: true,
  };
}

const groups = computed(() => {
  const labels: Record<Item["kind"], string> = {
    next: "Next meetup",
    answer: "Answer",
    page: "Pages",
    speaker: "Speakers",
    talk: "Talks",
    "all-talks": "Talks",
    event: "Events",
  };
  // When nothing matched exactly, the group says so before the closest results
  const r = results.value;
  if (r.talksNote) labels.talk = labels["all-talks"] = r.talksNote;
  if (r.eventsNote) labels.event = r.eventsNote;
  const out: { label: string; items: Item[] }[] = [];
  for (const item of items.value) {
    const label = labels[item.kind];
    const last = out[out.length - 1];
    if (last && last.label === label) last.items.push(item);
    else out.push({ label, items: [item] });
  }
  return out;
});

watch(query, () => {
  activeIndex.value = 0;
  if (document.activeElement === input.value) open.value = true;
});

const isActive = (item: Item) => items.value[activeIndex.value]?.key === item.key;

function move(delta: number) {
  open.value = true;
  const n = items.value.length;
  if (!n) return;
  activeIndex.value = (activeIndex.value + delta + n) % n;
  requestAnimationFrame(() => {
    document.getElementById(optionId(items.value[activeIndex.value]!.key))?.scrollIntoView({ block: "nearest" });
  });
}

function hrefOf(item: Item) {
  if (typeof item.to === "string") return item.to;
  return router.resolve(item.to).href;
}

function pick(item: Item) {
  open.value = false;
  input.value?.blur();
  if (item.external) {
    window.open(item.to as string, "_blank", "noopener");
    return;
  }
  query.value = "";
  navigateTo(item.to);
}

function submit() {
  const item = items.value[activeIndex.value];
  if (item) pick(item);
  else if (query.value.trim()) navigateTo({ path: "/talks", query: { search: query.value.trim() } });
}

function onFocus() {
  load();
  open.value = true;
}

function onEscape() {
  if (query.value) query.value = "";
  else {
    open.value = false;
    input.value?.blur();
  }
}

// "/" or Cmd/Ctrl+K jumps into whichever bar is visible
function onKey(e: KeyboardEvent) {
  if (props.variant !== "floating") return;
  const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable]");
  if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
    e.preventDefault();
    const target = docked.value ? document.getElementById("ask-input-hero") : input.value;
    (target as HTMLInputElement | null)?.focus();
  }
}

let observer: IntersectionObserver | undefined;
onMounted(() => {
  window.addEventListener("keydown", onKey);
  if (props.variant === "hero" && root.value) {
    observer = new IntersectionObserver(([entry]) => (docked.value = entry!.isIntersecting), { threshold: 0 });
    observer.observe(root.value);
  }
  // Warm the index once the page is idle so the first keystroke is instant
  ("requestIdleCallback" in window ? window.requestIdleCallback : setTimeout)(() => load());
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  observer?.disconnect();
  if (props.variant === "hero") docked.value = false;
});
</script>

<style scoped>
.ask {
  --bar-h: 3.5rem;
}
.ask--hero {
  --bar-h: clamp(3.5rem, 4.15vw, 6rem);
  position: relative;
  width: 100%;
  margin-inline: auto;
}
.ask--floating {
  position: fixed;
  inset-inline: 0;
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 40;
  display: flex;
  justify-content: center;
  padding-inline: 1rem;
  pointer-events: none;
  transition: transform 0.45s var(--ease-out-soft), opacity 0.3s;
}
.ask--hidden {
  transform: translateY(calc(100% + 2rem));
  opacity: 0;
}
.ask__box {
  position: relative;
  width: min(100%, 38rem);
  pointer-events: auto;
}
.ask--hero .ask__box {
  width: 100%;
}

.ask__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: var(--bar-h);
  padding-inline: 1.25rem 0.5rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--color-zh-line);
  box-shadow: 0 1px 2px rgb(0 12 31 / 0.06), 0 12px 32px -12px rgb(0 12 31 / 0.25);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ask__bar:focus-within {
  border-color: var(--color-zh-blue);
  box-shadow: 0 0 0 4px rgb(0 112 180 / 0.15), 0 12px 32px -12px rgb(0 12 31 / 0.3);
}
.ask__lens {
  flex: none;
  color: var(--color-zh-blue);
}
.ask__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  font-size: 1rem;
  color: var(--color-zh-ink);
}
.ask--hero .ask__input {
  font-size: clamp(1rem, 0.91vw, 1.3125rem);
  letter-spacing: -0.03em;
  color: var(--color-zh-navy);
}
.ask--hero .ask__bar {
  padding-inline: clamp(1rem, 1.73vw, 2.5rem) clamp(0.5rem, 1vw, 1.45rem);
  border-color: transparent;
}
.ask--hero .ask__go {
  width: clamp(2.5rem, 2.16vw, 3.125rem);
  height: clamp(2.5rem, 2.16vw, 3.125rem);
}
.ask__input::placeholder {
  color: var(--color-zh-muted);
}
.ask__input:focus {
  outline: none;
}
.ask__kbd {
  flex: none;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-zh-line);
  font: 500 0.75rem var(--font-sans);
  color: var(--color-zh-muted);
}
.ask__clear {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  color: var(--color-zh-muted);
}
.ask__clear:hover {
  background: var(--color-zh-soft);
}
.ask__go {
  flex: none;
  display: grid;
  place-items: center;
  width: calc(var(--bar-h) - 1rem);
  height: calc(var(--bar-h) - 1rem);
  border-radius: 999px;
  background: var(--color-zh-blue);
  color: #fff;
  transition: background 0.2s;
}
.ask__go:hover {
  background: var(--color-zh-blue-hover);
}

.ask__panel {
  position: absolute;
  inset-inline: 0;
  max-height: min(60vh, 34rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem;
  border-radius: 1.5rem;
  background: #fff;
  border: 1px solid var(--color-zh-line);
  box-shadow: 0 24px 60px -20px rgb(0 12 31 / 0.35);
  animation: panel-in 0.25s var(--ease-out-soft);
}
.ask--floating .ask__panel {
  bottom: calc(100% + 0.5rem);
  transform-origin: bottom center;
}
.ask--hero .ask__panel {
  top: calc(100% + 0.5rem);
  z-index: 30;
  text-align: left;
  transform-origin: top center;
}
@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
}

.ask__group {
  margin: 0.75rem 0.5rem 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-zh-muted);
}
.ask__group:first-child {
  margin-top: 0;
}
.ask__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-inline: 0.25rem;
}
.ask__list {
  display: grid;
  gap: 0.125rem;
}
.ask__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.875rem;
  color: var(--color-zh-ink);
}
.ask__option.is-active {
  background: var(--color-zh-soft);
}
.ask__option.is-active .ask__title {
  color: var(--color-zh-blue);
}
.ask__avatar {
  flex: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  object-fit: cover;
}
.ask__avatar--empty {
  display: grid;
  place-items: center;
  background: var(--color-zh-soft);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-zh-navy);
}
.ask__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: var(--color-zh-soft);
  color: var(--color-zh-blue);
}
.ask__title {
  display: block;
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ask__meta {
  display: block;
  font-size: 0.875rem;
  color: var(--color-zh-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Answers are sentences: let them wrap, and show where the link goes */
.ask__option--answer .ask__title {
  font-weight: 500;
  white-space: normal;
  text-wrap: pretty;
}
.ask__option--answer .ask__meta {
  margin-top: 0.125rem;
  font-weight: 600;
  color: var(--color-zh-blue);
}
.ask__empty {
  padding: 0.5rem;
  color: var(--color-zh-muted);
  line-height: 1.6;
}
</style>
