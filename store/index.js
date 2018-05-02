import Vuex from 'vuex'
import StoryblokClient from 'storyblok-js-client'

const $storyapi = new StoryblokClient({
  accessToken: 'IuVWvQkX74oxYX02lx5fYwtt',
  cache: {
    clear: 'auto',
    type: 'memory'
  }
})


const User = {
  get: async (id) => await $storyapi.get("cdn/stories/", { version: 'published', by_uuids: id })
}

const Story = {
  get: async (slug) => await $storyapi.get("cdn/stories/", { version: 'published', starts_with: slug, is_startpage: 0 })
}

const createStore = () => {
  return new Vuex.Store({
    state: {
      story: {},
      talks: []
    },
    mutations: {
      SET_TALKS (state, payload) {
        state.talks = payload
      },

      SET_STORY (state, payload) {
        state.story = payload.story
      }
    },
    actions: {
      async GET_TALKS (store) {
        const {data: {stories}} = await Story.get('talks');

        const talks = stories.map(async (talk) => {
          const id = talk.content.speaker
          const {data: {stories}} = await User.get(id)
          talk.content.speaker = stories[0]
          return talk
        })

        store.commit('SET_TALKS', await Promise.all(talks))

      },
      async FETCH_STORY_BY_SLUG({commit, state}, {route}) {
        const options = {
          version: state.version
        }
        const path = (route.fullPath !== "/") ? route.fullPath : 'home/'
        const res = await $storyapi.get(`cdn/stories/${path}`, options)
        commit('SET_STORY', res.data)
      }
    }
  })
}

export default createStore