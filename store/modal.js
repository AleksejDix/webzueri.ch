export const state = () => ({
  open: false
})

export const mutations = {
  create(state) {
    state.open = true
  },
  destroy(state) {
    state.open = false
  }
}




