import Vue from 'vue'
import fromUnixTime from 'date-fns/fromUnixTime'
import formatDistance from 'date-fns/formatDistance'


Vue.filter( 'humanDate', (value) => {
  if(!value) return 'just now'
  return formatDistance(fromUnixTime(value.seconds), new Date()) + ' ago'
})
