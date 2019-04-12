<template>
  <section>
    <div class="bg-white shadow p-4 min-h-16"></div>

    <div class="container mx-auto p-8">
      <header>
        <h1 class="text-24 font-hairline">Events</h1>
      </header>

      <div class="action-bar py-8 flex justify-between">
        <input
          v-model="search"
          placeholder="search..."
          class="rounded py-3 px-6 shadow font-medium leading-normal"
          type="search"
        />

        <button
          class="rounded py-3 px-6 shadow text-white bg-blue-dark font-medium leading-normal"
          @click="$store.commit('modal/create')"
        >
          add event
          <portal to="modal">
            <h1>modal content</h1>
          </portal>
        </button>
      </div>

      <div class="rounded shadow bg-white">
        <table class="text-left w-full border-collapse rounded">
          <thead>
            <tr>
              <th
                class="pt-8 pb-4 px-6 border-b border-grey-light"
              >
                Edition
              </th>
              <th
                class="pt-8 pb-4 px-6 border-b border-grey-light"
              >
                Status
              </th>
              <th
                class="pt-8 pb-4 px-6 border-b border-grey-light"
              >
                Event Date
              </th>
              <th
                class="pt-8 pb-4 px-6 border-b border-grey-light"
              >
                actions
              </th>
            </tr>
          </thead>
          <tbody v-if="events">
            <tr class="hover:bg-grey-lighter" v-for="event in events" :key="event.id">
              <td class="py-4 px-6 border-b border-grey-light">{{ event.edition }} </td>
              <td class="py-4 px-6 border-b border-grey-light">{{ event.status }} </td>
              <td class="py-4 px-6 border-b border-grey-light">{{ formatDate(event.date) }}</td>
              <td class="py-4 px-6 border-b border-grey-light">
                <nuxt-link
                  :to="{name: 'dashboard-index-events-id', params: { id: event.id}}"
                  class="no-underline text-grey-lighter font-bold py-1 px-3 rounded text-xs bg-blue-dark hover:bg-blue-light"
                  >view</nuxt-link>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import queryEvents from "~/services/apollo/queries/events";
import format from "date-fns/format";

export default {
  data() {
    return {
      events: [],
      search: null
    };
  },
  apollo: {
    events: {
      prefetch: true,
      query: queryEvents,
      variables() {
        if (!this.search) {
          return;
        }
        return {
          query: +this.search
        };
      }
    }
  },
  methods: {
    openModal() {
      this.createNewEvent = true;
    },
    formatDate(date) {
      return format(new Date(date), "d MMMM yyyy");
    }
  }
};
</script>
