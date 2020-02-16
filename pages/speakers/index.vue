<template>
  <div class="bg-white container mx-auto p-6 rounded-xl">
    <h1 class="text-5xl font-semibold font-display pb-8 text-center">
      {{ speakers.length }} Speakers
    </h1>

    <div v-if="!$apollo.loading">
      <ul v-if="speakers" class="md:flex md:flex-wrap ">
        <li
          v-for="(speaker, index) in sortedByTalks"
          :key="speaker.id"
          class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2 relative"
        >
          <div
            v-if="speaker.talks.length > 2"
            class="absolute top-0 right-0 bg-purple-700 w-10 h-10 p-2 rounded-full border-2 border-yellow-500 text-yellow-500"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="currentColor"
                d="m7 4v2h-3v4c0 1.1.9 2 2 2h1v2h-1a4 4 0 0 1 -4-4v-4c0-1.1.9-2 2-2zm10 2v-2h3a2 2 0 0 1 2 2v4a4 4 0 0 1 -4 4h-1v-2h1a2 2 0 0 0 2-2v-4zm-3 14h2a1 1 0 0 1 0 2h-8a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1z"
              />
              <path
                fill="currentColor"
                d="m8 2h8a2 2 0 0 1 2 2v7a6 6 0 1 1 -12 0v-7c0-1.1.9-2 2-2z"
              />
            </svg>
          </div>
          <nuxt-link
            :to="`/speaker/${speaker.id}`"
            class="block w-full bg-main flex justify-between items-center hover:bg no-underline p-2 md:p-4 rounded-xl "
            :class="{ 'border-2 border-yellow-500': speaker.talks.length > 2 }"
          >
            <user-card
              :photo="speaker.speakerPicture.handle"
              :name="speaker && speaker.name"
            ></user-card>
            <Badge color="purple">
              {{
                speaker.talks.length > 0
                  ? speaker.talks.length + " talks"
                  : speaker.talks.length + " talk"
              }}
            </Badge>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import QuerySpeakers from "~/services/apollo/queries/speakers";
import UserCard from "@/components/UserCard";

export default {
  components: {
    UserCard
  },
  apollo: {
    speakers: {
      prefetch: true,
      query: QuerySpeakers
    }
  },
  data() {
    return {
      speakers: []
    };
  },
  computed: {
    sortedByTalks() {
      const speakers = [...this.speakers];
      const sorted = speakers.sort((a, b) => {
        return b.talks.length - a.talks.length;
      });
      return sorted;
    }
  },
  head() {
    return {
      title: "Speakers"
    };
  }
};
</script>
