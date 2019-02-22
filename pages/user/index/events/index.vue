<template>
  <section class="p-12">

    <div class="container mx-auto">

      <div class="py-4">
        <Button>add event</Button>
      </div>

      <ul
        v-if="events"
        class="list-reset border bg-white rounded-lg"
      >
        <li
          v-for="(event, index) in events"
          :key="event.id"
          :class="{'border-t': index !== 0}"
        >
          <div class="p-4 flex flex-wrap items-center">
            <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-pink-light text-white">
              {{event.edition}}
            </div>
            <div class="flex items-center ml-12">
              <div class="mr-8">
                <Badge>
                  <div :class="[event.talks.length > 2 ? 'text-green-dark' : 'text-red-dark']">
                    {{event.talks.length}} <span class="text-on-light-secondary">/</span> 3 <span class="text-on-light-secondary">talks</span>
                  </div>
                </Badge>

              </div>
              <div
                class="flex items-center"
                v-if="event.talks"
              >
                <template v-for="talk in event.talks">
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

              <div class="flex items-center">

                <button
                  v-if="event.talks.length < 3"
                  title="add speaker"
                  class=" focus:outline-none ml-2 bg-grey w-10 h-10 flex items-center justify-center border border-white border-2 rounded-full"
                >
                  +
                </button>
              </div>

            </div>
            <div class="px-4 ml-auto">
              {{event.date | date }}
            </div>
            <div class="px-4">
              <Badge :color="event.status === 'PUBLISHED' ? 'green' : 'red'">{{event.status}}</Badge>
            </div>

          </div>

          <!-- <pre>{{event}}</pre> -->

        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import queryEvents from "~/services/apollo/queries/events";
  export default {
    data() {
      return {
        events: []
      };
    },
    apollo: {
      events: {
        prefetch: true,
        query: queryEvents
      }
    },
    filters: {
      date(val) {
        const date = new Date(val);
        var options = {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit"
        };

        return date.toLocaleDateString("en-US", options);
      }
    }
  };
</script>
