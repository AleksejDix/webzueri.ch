<template>
<div>
  {{$route.params.day}}
  <ol class="list-reset p-2 bg-primary-dark rounded-lg">
    <li class="flex" v-for="timeslot in timeslots" :key="timeslot.id">
      <div class="m-4 text-white">
        {{timeslot.startTime}}
      </div>
      <ol
        class="list-reset xl:flex flex-1"
        v-if="timeslot.sessions.length > 0">
        <li
          class="w-1/2 p-4 min-h-28 "
          v-for="(session,index) in timeslot.sessions"
          :key="index">
          <div class="min-h-28 block bg-primary rounded-lg p-4 md:p-8 text-white md:flex zoom no-underline whitespace-normal h-full">
            <h2><nuxt-link :to="`/schedule/${$route.params.day}/${session.items[0]}`" >{{session.items[0]}}</nuxt-link></h2>
          </div>
        </li>
      </ol>
    </li>
  </ol>

  <nuxt-child />

  </div>
</template>

<script>
export default {
  data() {
    return {
      "timeslots": [
        {
          "endTime": "10:00",
          "sessions": [
            { "items": [132]}
          ],
          "startTime": "09:00"
        },
        {
          "endTime": "10:15",
          "sessions": [
            {
              "items": [136]
            }
          ],
          "startTime": "10:00"
        },
        {
          "endTime": "11:00",
          "sessions": [
            {
              "items": [139]
            }
          ],
          "startTime": "10:15"
        },
        {
          "endTime": "11:40",
          "sessions": [
            {
              "items": [103, 112]
            },
            {
              "items": [120]
            },
            {
              "extend": 3,
              "items": [109]
            }
          ],
          "startTime": "11:00"
        },
        {
          "endTime": "12:30",
          "sessions": [
            {
              "items": [129]
            },
            {
              "items": [116]
            }
          ],
          "startTime": "11:50"
        },
        {
          "endTime": "14:00",
          "sessions": [
            {
              "items": [133]
            }
          ],
          "startTime": "12:30"
        },
        {
          "endTime": "14:40",
          "sessions": [
            {
              "items": [101]
            },
            {
              "items": [118]
            },
            {
              "extend": 2,
              "items": [107]
            }
          ],
          "startTime": "14:00"
        },
        {
          "endTime": "15:30",
          "sessions": [
            {
              "items": [140]
            },
            {
              "items": [126]
            }
          ],
          "startTime": "14:50"
        },
        {
          "endTime": "16:00",
          "sessions": [
            {
              "items": [134]
            }
          ],
          "startTime": "15:30"
        },
        {
          "endTime": "16:40",
          "sessions": [
            {
              "items": [105]
            },
            {
              "items": [127]
            },
            {
              "extend": 3,
              "items": [119]
            }
          ],
          "startTime": "16:00"
        },
        {
          "endTime": "17:30",
          "sessions": [
            {
              "items": [112]
            },
            {
              "items": [111]
            }
          ],
          "startTime": "16:50"
        },
        {
          "endTime": "18:20",
          "sessions": [
            {
              "items": [106]
            },
            {
              "items": [125]
            }
          ],
          "startTime": "17:40"
        },
        {
          "endTime": "22:30",
          "sessions": [
            {
              "items": [137]
            }
          ],
          "startTime": "18:30"
        }
      ]
    }
  }
}
</script>

<style>
.grid {
  display: grid;
  grid-column-gap: 16px;
  grid-row-gap: 32px;
  grid-template-columns: 100px, 1fr;
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

</style>
