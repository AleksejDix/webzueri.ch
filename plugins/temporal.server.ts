import { Temporal } from '@js-temporal/polyfill'

export default defineNuxtPlugin(() => {
  // Make Temporal available globally on server
  globalThis.Temporal = Temporal
})