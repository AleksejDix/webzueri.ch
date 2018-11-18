<template>
  <div class="px-2">
    <section>

      <header class="container mx-auto flex items-center justify-between pt-8 pb-4 px-4">
        <h2 class="leading-normal text-on-dark-primary font-display text-16 md:text-21 text-shadow">featured videos</h2>
        <Button to="/events/1">{{talksCount - 3}} more videos</Button>
      </header>

      <div class="container mx-auto shadow-blue-darker rounded-lg bg-primary-dark">

        <div class="flex flex-wrap px-2 p-6">
          <div class="w-full xl:w-1/3 p-4" v-for="talk in talks" :key="talk.id">

            <article class="owl-lg">
              <nuxt-link :to="{name: 'speaker-id', params: {id: speaker.id}}" class="group no-underline inline-block text-on-dark-secondary hover:text-blue-light transition" v-for="speaker in talk.speakers" v-if="talk.speakers" :key="speaker.id">
                <user-card size="lg" :photo="speaker.speakerPicture.url" :name="speaker.name" />
              </nuxt-link>
              <div class="group transition flex-1 relative block bg-primary hover:bg-primary-dark rounded-lg p-4 text-white hover:text-blue-light md:flex no-underline whitespace-normal shadow-blue">
                <svg viewBox="0 0 24 8" class="w-8 h-8 absolute pin-l ml-2" style="bottom: 100%">
                  <path transform="translate(0,7.3)" class="fill-blue " d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z" />
                  <path transform="translate(0,8.2)" class="transition fill-primary group-hover:fill-primary-dark " d="M3 8s2.021-.015 5.253-4.218C9.584 2.051 10.797 1.007 12 1c1.203-.007 2.416 1.035 3.761 2.782C19.012 8.005 21 8 21 8H3z" />
                </svg>
                <div class="w-full owl">
                  <h3 class="text-current-color text-14 md:text-18 leading-tight font-medium">
                    {{talk.name}}
                  </h3>
                  <Ratio class="rounded-lg " width="16" height="9">
                    <iframe class="w-full h-full" type="text/html" allowfullscreen="allowfullscreen" :src="`https://www.youtube.com/embed/${talk.youtubecode}?modestbranding=1&showinfo=0`" frameborder="0" />
                  </Ratio>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import QueryRecentVideos from '~/services/apollo/queries/recentVideos'
export default {
  data() {
    return {
      talks: [],
      talksCount: ''
    }
  },
  apollo: {
    talks: {
      query: QueryRecentVideos,
        prefetch: () => {
          return {
            skip: Math.floor(Math.random() * 10) + 1
          }
        },
        variables() {
          return {
            skip: Math.floor(Math.random() * 10) + 1
          }
        },
        result({data}) {
          this.talks = data.talks
          this.talksCount = data.talksConnection.aggregate.count
        }
      }
    }
  }
</script>
