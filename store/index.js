export const state = () => ({
  version: 'published',
  story: {},
  talks: []
})

export const mutations = {
  SET_TALKS(state, payload) {
    state.talks = payload.stories
  },

  SET_STORY(state, payload) {
    state.story = payload.story
  }
}

export const actions = {
  async nuxtServerInit ({dispatch}, {$storyapi}) {
    await dispatch('GET_TALKS', {$storyapi})
  },

  async GET_TALKS ({commit}, {$storyapi}) {
    const options = {
      version: 'published',
      starts_with: "talks/",
      is_startpage: 0
    }
    const res = await $storyapi.get('cdn/stories', options)
    commit('SET_TALKS', res.data)
  },

  async FETCH_STORY_BY_SLUG({commit, state}, {app, route}) {
    const options = {
      version: state.version
    }
    const path = (route.fullPath !== "/") ? route.fullPath : 'home/'
    console.log(path)
    const res = await app.$storyapi.get(`cdn/stories/${path}`, options)
    commit('SET_STORY', res.data)
  }

}