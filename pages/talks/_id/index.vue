<template>
<div>
  <div v-if="$apollo.loading" class="text-center">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>
  <div v-else>
    <div class="p-4 bg-indigo-darkest">
      <div class="max-w-md mx-auto owl">
        <h1 class="text-white text-5xl text-center">{{talk.name}}</h1>
      </div>
      <p>{{talk.abstract}}</p>
    </div>
  </div>
</div>


</template>

<script>

import gql from 'graphql-tag'

const talk = gql`
  query talk($id: ID!) {
    talk(where: {id: $id}) {
      id
      name
      abstract
    }
  }
`

export default {
  data: () => ({
    talk: '',
  }),
  apollo: {
    talk: {
      query: talk,
      variables () {
        return {
          id: this.$route.params.id
        }
      }
    }
  }
}
</script>