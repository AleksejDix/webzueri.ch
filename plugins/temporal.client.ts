import { Temporal } from '@js-temporal/polyfill'

export default defineNuxtPlugin(() => {
  // Make Temporal available globally
  globalThis.Temporal = Temporal
})