<template>
  <div v-if="workshop">
    <div class="container bg-white mx-auto  rounded-xl">
      <div class="">
        <div v-if="workshop.banner" class="p-4 md:p-8">
          <img
            v-if="workshop.banner.url"
            class="rounded-xl"
            :src="workshop.banner.url"
            alt=""
          />
          <section class="md:flex md:px-4 md:-m-4">
            <aside class="pt-6 md:py-0 md:px-4 md:w-1/4 pl-6 -mt-16 lg:-mt-24">
              <img
                class="w-24 md:w-full border shadow rounded-full"
                :src="workshop.speakers[0].speakerPicture.url"
                :alt="workshop.speakers[0].name"
              />
              <div
                v-if="workshop.speakers[0].twitterHandler"
                class="-mt-8 md:ml-0 inline-flex md:p-2 rounded-full owl-x"
              >
                <a :href="workshop.speakers[0].twitterHandler" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-8 h-8 rounded-full"
                    viewBox="0 0 400 400"
                  >
                    <circle cx="200" cy="200" r="200" fill="#1da1f2" />
                    <path
                      fill="#fff"
                      d="M163.4 305.5c88.7 0 137.2-73.5 137.2-137.2 0-2.1 0-4.2-.1-6.2 9.4-6.8 17.6-15.3 24.1-25-8.6 3.8-17.9 6.4-27.7 7.6 10-6 17.6-15.4 21.2-26.7-9.3 5.5-19.6 9.5-30.6 11.7-8.8-9.4-21.3-15.2-35.2-15.2-26.6 0-48.2 21.6-48.2 48.2 0 3.8.4 7.5 1.3 11-40.1-2-75.6-21.2-99.4-50.4-4.1 7.1-6.5 15.4-6.5 24.2 0 16.7 8.5 31.5 21.5 40.1-7.9-.2-15.3-2.4-21.8-6v.6c0 23.4 16.6 42.8 38.7 47.3-4 1.1-8.3 1.7-12.7 1.7-3.1 0-6.1-.3-9.1-.9 6.1 19.2 23.9 33.1 45 33.5-16.5 12.9-37.3 20.6-59.9 20.6-3.9 0-7.7-.2-11.5-.7 21.1 13.8 46.5 21.8 73.7 21.8"
                    />
                  </svg>
                </a>
              </div>
            </aside>
            <div class="md:p-4 md:w-3/4">
              <div class="spacer-y">
                <h1
                  v-if="workshop.name"
                  class="text-4xl font-display leading-tight pt-4 mb-8"
                >
                  {{ workshop.name }}
                  <strong> by {{ workshop.speakers[0].name }}</strong>
                </h1>

                <div
                  class="relative bg-purple-100 p-4 md:p-8 rounded-lg mb-8 grid gap-6 md:grid-flow-col items-center overflow-hidden"
                >
                  <div
                    class="absolute w-2 h-full left-0 top-0 bottom-0 bg-purple-700 rounded-l"
                  ></div>
                  <div class="flex-1">
                    <div>
                      <div class="text-black text-16 font-sans">
                        <div
                          class="font-bold font-display text-2xl tracking-tighter uppercase"
                        >
                          when:
                        </div>
                        <span>{{
                          workshop.dateAndTime | date("dd, MMMM, yyyy")
                        }}</span>
                      </div>

                      <div class="text-black text-16 font-sans col-span-2">
                        <div
                          class="font-bold font-display text-2xl tracking-tighter uppercase"
                        >
                          where:
                        </div>
                        <a
                          v-if="workshop.venue"
                          target="_blank"
                          rel="noopener"
                          class="no-underline text-pink-light"
                          :href="workshop.venue.googleMapsUrl"
                          >{{ workshop.venue.name }} •
                          {{ workshop.venue.street }} •
                          {{ workshop.venue.zip }}, {{ workshop.venue.city }}</a
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <Button target="_blank" :href="workshop.ticketUrl"
                      >Level up your skills for just
                      <strong class="font-bold"
                        >CHF {{ workshop.price }}</strong
                      >
                    </Button>
                  </div>
                </div>

                <prose
                  v-if="workshop.description"
                  v-html="$md.render(workshop.description)"
                >
                </prose>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QueryPublishedWorkshop from "~/services/apollo/queries/workshops/published-show";
import Prose from "~/components/Prose";

export default {
  components: { Prose },
  data() {
    return {
      workshops: []
    };
  },
  computed: {
    workshop() {
      if (this.workshops.length === 0) return;
      return this.workshops[0];
    }
  },
  apollo: {
    workshops: {
      query: QueryPublishedWorkshop,
      variables() {
        return {
          id: this.$route.params.id
        };
      }
    }
  },
  head() {
    return {
      title: this.workshop.name
    };
  }
};
</script>
