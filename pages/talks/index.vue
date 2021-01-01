<template>
  <section class="container mx-auto bg-white p-8 rounded-xl">
    <header>
      <h1 class="text-5xl font-semibold font-display pb-8 text-center">
        {{ itemsCount }} Talks
      </h1>
    </header>

    <section
      class="grid gap-6"
      :class="{ 'md:grid-cols-3 lg:grid-cols-5': isFilterVisible }"
    >
      <nav
        class="grid gap-6 md:grid-cols-3 lg:grid-cols-5"
        :class="{
          'md:col-span-3 lg:col-span-5': isFilterVisible
        }"
      >
        <div class="md:col-span-1">
          <Button
            v-if="isFilterVisible"
            class="w-full"
            @click="isFilterVisible = false"
          >
            <Icon slot="start" type="close" /> hide filters
          </Button>
          <Button v-else class="w-full" @click="isFilterVisible = true">
            <Icon slot="start" type="tune" /> show filters
          </Button>
        </div>
        <div class="md:col-span-2 lg:col-span-4 flex justify-between">
          <label class="block">
            <input
              v-model="filters.search"
              placeholder="search..."
              class="form-input block w-full"
            />
          </label>
          <Button
            href="https://docs.google.com/forms/d/e/1FAIpQLSfTaa-_wOFOQv3dZ7Ord9TJ3vN8wNdzUY5VQqzFiTg_WMQwEw/viewform?c=0&w=1"
          >
            <Icon slot="start" type="add" /> Submit your talk
          </Button>
        </div>
      </nav>

      <aside v-if="isFilterVisible" class="lg:col-span-1 ">
        <h2 class="font-bold leading-none tracking-tighter text-2xl py-4">
          Filters:
        </h2>
        <div class="owl">
          <div class="block block rounded-xl bg-main p-4">
            <span class="text-gray-700">Category</span>
            <ul class="flex flex-wrap -m-1">
              <li
                v-for="{ value, label } in categories"
                :key="value"
                class="p-1"
              >
                <Badge
                  :color="getCategoryColor(label)"
                  @click="filters.category = value"
                >
                  {{ label }}
                </Badge>
              </li>
            </ul>
          </div>

          <div class="block rounded-xl bg-main p-4">
            <span class="text-gray-700">Talks with Video</span>
            <div class="mt-2">
              <div>
                <label class="inline-flex items-center">
                  <input
                    v-model="filters.recored"
                    type="checkbox"
                    class="form-checkbox"
                  />
                  <span class="ml-2">Yes</span>
                </label>
              </div>
            </div>
          </div>
          <!-- <label class="block block rounded-xl bg-main p-4">
            <span class="text-gray-700">Release Date</span>
            <select
              v-model="filters.timeAgo"
              class="form-select mt-1 block w-full"
            >
              <option
                v-for="{ value, label } in timeAgoOptions"
                :key="value"
                :value="value"
                >{{ label }}</option
              >
            </select>
          </label> -->
        </div>
      </aside>

      <div :class="{ 'md:col-span-2 lg:col-span-4': isFilterVisible }">
        <div v-if="$apollo.loading" class="bg-yellow-300 p-6 rounded-xl">
          Loading...
        </div>
        <ul v-if="hasItems && !$apollo.loading" class="grid gap-6">
          <li v-for="item in talks" :key="item.id">
            <talk class="h-full" :talk="item">
              <Badge
                v-if="item.category"
                :color="getCategoryColor(item.category)"
                >{{ item.category }}</Badge
              >
            </talk>
          </li>
        </ul>
        <div
          v-if="!hasItems"
          class="border border-red-600 bg-red-100 text-red-600 rounded-xl p-6"
        >
          Couldn't find any talks with this filter setting.
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import QueryPublishedTalks from "~/services/apollo/queries/talks/published-list";
import Talk from "@/components/Talk";
import { subMonths, startOfMonth } from "date-fns";

export default {
  components: {
    Talk
  },
  data() {
    return {
      talks: [],
      isFilterVisible: true,
      filters: {
        category: this.$route.query.category || false,
        search: this.$route.query.search || null,
        recored: this.$route.query.recored == "true" || false,
        timeAgo: false
      },
      timeAgoOptions: [
        {
          label: "All Time",
          value: false
        },
        {
          label: "1 Month ago",
          value: this.monthAgo(1)
        },
        {
          label: "3 Month ago",
          value: this.monthAgo(3)
        },
        {
          label: "6 Month ago",
          value: this.monthAgo(6)
        }
      ],
      categories: [
        {
          label: "All",
          value: "All"
        },
        {
          label: "Frontend",
          value: "Frontend"
        },
        {
          label: "Backend",
          value: "Backend"
        },
        {
          label: "Design",
          value: "Design"
        },
        {
          label: "Others",
          value: "Others"
        }
      ]
    };
  },
  computed: {
    itemsCount() {
      if (!this.talks) return;
      return this.talks.length;
    },
    hasItems() {
      if (!this.talks) return;
      return this.talks.length > 0;
    },
    where() {
      return {
        status: "PUBLISHED",
        ...(this.filters.category &&
          this.filters.category !== "All" && {
            category: this.filters.category
          }),
        ...(this.filters.recored && { youtubecode_not: null }),
        ...(this.filters.timeAgo && { createdAt_gte: this.filters.timeAgo }),
        ...(this.filters.search && { name_contains: this.filters.search })
      };
    }
  },
  watch: {
    filters: {
      handler(n) {
        this.$router.push({
          name: this.$route.name,
          query: {
            ...n
          }
        });
      },
      deep: true
    }
  },
  methods: {
    getCategoryColor(cat) {
      if (cat === "Design") {
        return "purple";
      } else if (cat === "Frontend") {
        return "green";
      } else if (cat === "Backend") {
        return "blue";
      } else if (cat === "All") {
        return "black";
      } else {
        return "gray";
      }
    },
    monthAgo(count) {
      const d = subMonths(new Date(), count);
      const s = startOfMonth(d);
      s.setUTCHours(0, 0, 0, 0);
      return s.toISOString();
    }
  },
  head() {
    return {
      title: `${this.itemsCount} Talks`
    };
  },
  apollo: {
    talks: {
      query: QueryPublishedTalks,
      deep: true,
      variables() {
        return {
          where: this.where
        };
      }
    }
  }
};
</script>

<style></style>
