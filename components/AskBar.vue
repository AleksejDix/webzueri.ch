<template>
  <div
    ref="root"
    class="ask"
    :class="[
      `ask--${variant}`,
      { 'ask--open': open, 'ask--hidden translate-y-[calc(100%+2rem)] opacity-0': variant === 'floating' && docked },
      variant === 'hero'
        ? 'relative mx-auto w-full'
        : 'pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4 [transition:translate_0.45s_var(--ease-out-soft),opacity_0.3s]',
    ]"
    :inert="variant === 'floating' && docked ? true : undefined"
  >
    <div class="pointer-events-auto relative" :class="variant === 'hero' ? 'w-full' : 'w-[min(100%,38rem)]'">
      <!-- Results panel. Opens upwards for the floating bar, downwards in the hero -->
      <div
        v-if="open"
        :id="listId"
        class="ask__panel absolute inset-x-0 max-h-[min(60vh,34rem)] overflow-y-auto overscroll-contain rounded-3xl border border-line bg-raised p-4 shadow-[0_24px_60px_-20px_rgb(var(--wz-shadow)/0.35)]"
        :class="variant === 'hero' ? 'top-[calc(100%+0.5rem)] z-30 origin-top text-left' : 'bottom-[calc(100%+0.5rem)] origin-bottom'"
        role="listbox"
        :aria-label="query ? `Results for ${query}` : 'Suggestions'"
      >
        <template v-if="!query.trim()">
          <p class="mx-2 mt-3 mb-1.5 text-[0.8125rem] font-semibold text-muted first:mt-0">Try</p>
          <div class="flex flex-wrap gap-2 px-1">
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
            <p class="mx-2 mt-3 mb-1.5 text-[0.8125rem] font-semibold text-muted first:mt-0">{{ group.label }}</p>
            <ul class="grid gap-0.5">
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
                  class="flex items-center gap-3 rounded-[0.875rem] p-2 text-ink"
                  :class="{ 'is-active bg-soft': isActive(item) }"
                  @mousedown.prevent
                  @mouseenter="activeIndex = items.indexOf(item)"
                  @click.prevent="pick(item)"
                >
                  <img
                    v-if="item.kind === 'speaker' && item.picture"
                    :src="item.picture"
                    alt=""
                    class="size-10 flex-none rounded-full object-cover"
                    width="40"
                    height="40"

                  />
                  <span
                    v-else-if="item.kind === 'speaker'"
                    class="grid size-10 flex-none place-items-center rounded-full bg-soft text-[0.8125rem] font-semibold text-heading"
                  >
                    {{ initials(item.title) }}
                  </span>
                  <span v-else class="grid size-10 flex-none place-items-center rounded-full bg-soft text-link" aria-hidden="true">
                    <LucideMessageCircle v-if="item.kind === 'answer'" :size="16" />
                    <LucidePlay v-else-if="item.kind === 'talk' && item.video" :size="16" />
                    <LucideMic v-else-if="item.kind === 'talk'" :size="16" />
                    <LucideCalendarDays v-else-if="item.kind === 'event'" :size="16" />
                    <LucideList v-else-if="item.kind === 'all-talks'" :size="16" />
                    <LucideArrowUpRight v-else-if="item.external" :size="16" />
                    <LucideCornerDownRight v-else :size="16" />
                  </span>
                  <!-- Answers are sentences: let them wrap, and show where the link goes -->
                  <span class="min-w-0 flex-1">
                    <span
                      class="block overflow-hidden leading-[1.3] text-ellipsis"
                      :class="[
                        item.kind === 'answer' ? 'font-medium text-pretty whitespace-normal' : 'font-semibold whitespace-nowrap',
                        { 'text-link': isActive(item) },
                      ]"
                    >{{ item.title }}</span>
                    <span
                      v-if="item.meta"
                      class="block truncate text-[0.875rem]"
                      :class="item.kind === 'answer' ? 'mt-0.5 font-semibold text-link' : 'text-muted'"
                    >{{ item.meta }}</span>
                  </span>
                </a>
              </li>
            </ul>
          </template>

          <p v-if="!items.length && index" class="p-2 leading-[1.6] text-muted">
            Nothing matches “{{ query }}”. Try a technology like
            <button type="button" class="inline-link" @mousedown.prevent @click="query = 'css'">css</button>,
            a speaker's first name, or
            <button type="button" class="inline-link" @mousedown.prevent @click="query = 'next meetup'">next meetup</button>.
          </p>
          <p v-else-if="!index" class="p-2 leading-[1.6] text-muted">Loading talks and speakers…</p>
        </template>
      </div>

      <form
        class="flex items-center gap-2 rounded-full border bg-raised shadow-[0_1px_2px_rgb(var(--wz-shadow)/0.06),0_12px_32px_-12px_rgb(var(--wz-shadow)/0.25)] [transition:border-color_0.2s,box-shadow_0.2s] focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--wz-link)_15%,transparent),0_12px_32px_-12px_rgb(var(--wz-shadow)/0.3)]"
        :class="variant === 'hero'
          ? 'h-[clamp(3.5rem,4.15vw,6rem)] border-transparent ps-[clamp(1rem,1.73vw,2.5rem)] pe-[clamp(0.5rem,1vw,1.45rem)]'
          : 'h-14 border-line ps-5 pe-2 focus-within:border-link'"
        role="search"
        @submit.prevent="submit"
      >
        <LucideSearch class="flex-none text-link" :size="variant === 'hero' ? 22 : 18" aria-hidden="true" />
        <label :for="inputId" class="sr-only">Ask Web Zürich</label>
        <input
          :id="inputId"
          ref="input"
          v-model="query"
          class="h-full min-w-0 flex-1 bg-transparent placeholder:text-muted focus:outline-none"
          :class="variant === 'hero' ? 'text-[clamp(1rem,0.91vw,1.3125rem)] tracking-[-0.03em] text-heading' : 'text-[1rem] text-ink'"
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
        <kbd
          v-if="variant === 'floating' && !query"
          class="grid size-6 flex-none place-items-center rounded-md border border-line [font:500_0.75rem_var(--font-sans)] text-muted"
          aria-hidden="true"
        >/</kbd>
        <button
          v-else-if="query"
          type="button"
          class="grid size-8 flex-none place-items-center rounded-full text-muted hover:bg-soft"
          aria-label="Clear"
          @mousedown.prevent
          @click="query = ''"
        >
          <LucideX :size="16" />
        </button>
        <button
          type="submit"
          class="grid flex-none place-items-center rounded-full bg-accent text-white [transition:background_0.2s] hover:bg-accent-hover"
          :class="variant === 'hero' ? 'size-[clamp(2.5rem,2.16vw,3.125rem)]' : 'size-10'"
          aria-label="Show results"
        >
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
/* Kept here: Vue renames scoped keyframes, so the animation has to live next to them */
.ask__panel {
  animation: panel-in 0.25s var(--ease-out-soft);
}
@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
}
</style>
