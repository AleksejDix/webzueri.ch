<template>
  <ui-list :list="events" >
    <template slot-scope="item">
        {{ item.id }}
    </template>
  </ui-list>
</template>

<template>
  <section class="p-12">

    <div class="container mx-auto">

      <div class="py-4">
        <Button>add event</Button>
      </div>


      <ui-list v-if="events" :list="events" v-slot="{item}">
          <div v-if="item" class="p-4 flex flex-wrap items-center">
            <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-pink-light text-white">
              {{item.edition}}
            </div>
            <div class="flex items-center ml-12">
              <div
                class="flex items-center"
                v-if="item.talks"
              >
                <template v-for="talk in item.talks">
                  <ul
                    :key="talk.id"
                    class="list-reset flex flex-col items-center -ml-2"
                  >
                    <li
                      v-for="(speaker,speakerIndex) in talk.speakers"
                      :key="speaker.id"
                    >
                      <div
                        class="flex"
                        :class="{ '-mt-2' : speakerIndex !== 0}"
                      >
                        <img
                          class="w-10 h-10 rounded-full border-2 border-white"
                          :src="speaker.speakerPicture.url"
                          :alt="speaker.name"
                        >
                      </div>
                    </li>
                  </ul>

                </template>
              </div>


            </div>
            <div class="px-4 ml-auto">
              {{item.date  }}
            </div>
            <div class="px-4">
              <Badge :color="item.status === 'PUBLISHED' ? 'green' : 'red'">{{item.status}}</Badge>
            </div>

          </div>
      </ui-list>
    </div>
  </section>
</template>

<script>
  import UiList from "@/components/lists/default";
  import queryEvents from "~/services/apollo/queries/events";
  export default {
    components: { UiList },
    data() {
      return {
        events: []
      };
    },
    apollo: {
      events: {
        prefetch: true,
        query: queryEvents,
      },
    }
  };
</script>
