<template>
  <div class="bg-primary-light pattern min-h-screen pb-4">
    <div class="max-w-md mx-auto px-4">
      <h1
        class="py-12 text-center leading-tight text-3xl md:text-5xl text-base text-white text-shadow font-display font-bold tracking-wide"
      >Speakers</h1>

      <div class="p-2 -m-2 rounded-lg bg-primary-dark shadow-blue-darker">
        <Spinner v-if="$apollo.loading" :active="$apollo.loading"/>
        <ul v-if="speakers" class="list-reset md:flex md:flex-wrap justify-center">
          <li class="w-full" v-for="speaker in speakers" :key="speaker.id">
            <nuxt-link
              :to="`/speaker/${speaker.id}`"
              class="flex justify-between items-center hover:bg no-underline p-2 md:p-4 rounded-lg md:h-full"
            >
              <user-card :photo="speaker.speakerPicture.handle" :name="speaker && speaker.name"></user-card>

              <Badge color="blue">
                {{
                speaker.talks.length > 0
                ? speaker.talks.length + " talk"
                : speaker.talks.length + " talks"
                }}
              </Badge>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import QuerySpeakers from "~/services/apollo/queries/speakers";
import UserCard from "@/components/UserCard"
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
  data: () => ({
    speakers: []
  }),
  head () {
    return {
      title: "Speakers"
    };
  }
};
</script>
