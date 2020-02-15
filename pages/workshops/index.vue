<template>
  <div class="container mx-auto roudned">
    <pre class="text-white">
      <nuxt-link
        v-for="workshop in workshops"
        :key="workshop.id"
        :to="{ name: 'workshops-id', params: { id: workshop.id }}"
      >
        {{workshop.name}}
      </nuxt-link>
    </pre>
  </div>
</template>

<script>
import gql from "graphql-tag";
import QueryPublishedWorkshops from "~/services/apollo/queries/workshops/published-list";


export default {
  data() {
    return {
      workshops: []
    }
  },
  apollo: {
    workshops: {
      query: QueryPublishedWorkshops,
    }
  }
}
</script>
