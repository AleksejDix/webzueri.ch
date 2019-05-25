<template>
  <div class="bg-primary-light pattern min-h-screen">
    <div class="max-w-md mx-auto px-4">
      <h1 class="py-12 text-center leading-tight text-3xl md:text-5xl text-base text-white text-shadow font-display font-bold tracking-wide">Workshops</h1>

      <div class="p-2 -m-2 rounded-lg bg-primary-dark shadow-blue-darker">
        <Spinner
          v-if="$apollo.loading"
          :active="$apollo.loading"
        />

        <ul
          v-else
          class="list-reset"
        >
          <li
            v-for="workshop in workshops"
            :key="workshop.id"
          >

            <div class="flex items-start zoom no-underline p-2 md:p-4 rounded-lg shadow-blue bg-primary md:h-full">
              <div>
                <nuxt-link
                  :to="{name: 'speaker-id', params: {id: speaker.id}}"
                  class="text-on-dark-primary hover:text-blue-light no-underline inline-block"
                  v-for="speaker in workshop.speakers"
                  :key="speaker.id"
                >
                  <user-card
                    v-if="speaker.speakerPicture"
                    :name="speaker.name"
                    :photo="speaker.speakerPicture.handle"
                  />
                </nuxt-link>
                <nuxt-link
                  :to="`/workshops/${workshop.id}`"
                  class="flex-1 p-2 md:p-4 no-underline"
                >
                  <h2 class="text-white text-xl xl:text-2xl font-display font-bold tracking-wide mb-4 leading-tight">{{workshop.name}}</h2>
                </nuxt-link>

              </div>
            </div>

          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import query from "~/services/apollo/queries/workshops";

export default {
  apollo: {
    workshops: {
      prefetch: true,
      query
    }
  },
  data: () => ({
    workshops: []
  }),
  head () {
    return {
      title: "Speakers"
    };
  }
};
</script>
