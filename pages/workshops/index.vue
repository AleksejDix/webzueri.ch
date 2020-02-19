<template>
  <div class="container mx-auto rounded-xl p-6 bg-white">
    <h1 class="text-5xl font-semibold font-display pb-8 text-center">
      {{ workshopCount }} Workshops
    </h1>

    <ul class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="workshop in workshops" :key="workshop.id" class="">
        <nuxt-link
          class="h-full flex flex-col justify-between block rounded-xl py-4 px-6 bg-main "
          :to="{ name: 'workshops-id', params: { id: workshop.id } }"
        >
          <div class="owl">
            <Badge
              :color="isFuture(workshop.dateAndTime) ? 'green' : 'red'"
              class="block mb-2"
            >
              <template v-if="isFuture(workshop.dateAndTime)">
                {{ workshop.dateAndTime | date }}
              </template>
              <template v-else>
                in the past
              </template>
            </Badge>

            <h2
              class="text-2xl block items-center text-black font-bold font-display mb-6 leading-none"
            >
              {{ workshop.name }}
            </h2>
          </div>
          <div>
            <user-card
              v-if="workshop.speakers[0].speakerPicture"
              :photo="workshop.speakers[0].speakerPicture.handle"
              :name="workshop.speakers[0].name"
            />
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import QueryPublishedWorkshops from "~/services/apollo/queries/workshops/published-list";

export default {
  data() {
    return {
      workshops: []
    };
  },
  computed: {
    workshopCount() {
      return this.workshops.length;
    }
  },
  apollo: {
    workshops: {
      query: QueryPublishedWorkshops
    }
  },
  methods: {
    isFuture(date) {
      const today = new Date();
      const tomorrow = today.setDate(today.getDate() - 1);
      return new Date(date) > new Date(tomorrow);
    }
  }
};
</script>
