<template>
  <section>
    <div class="container mx-auto px-8">
      <Button @click="$store.commit('modal/create')">add event</Button>
      <portal to="modal">
        <h1 class="text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Et culpa iusto praesentium iste unde modi quidem recusandae fugiat sapiente adipisci debitis nobis a, officiis ratione rerum voluptates at non quis!Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, sed? Ratione modi id illo qui omnis. Numquam distinctio enim placeat incidunt architecto aperiam fuga non odit quod facere, esse ullam?</h1>
      </portal>
      <ul class="grid list-reset">
        <li v-for="event in events" :key="event.id">
          <nuxt-link to="/" class="scene no-underline">
            <div class="event">
              <div class="heading">
                <div class="overline">{{event.status}}</div>
                <h2>{{formatDate(event.date)}}</h2>
              </div>
              <ul class="speakers list-reset">
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
  import queryEvents from "~/services/apollo/queries/events";
  import format from 'date-fns/format';

  export default {
    data() {
      return {
        events: []
      };
    },
    apollo: {
      events: {
        prefetch: true,
        query: queryEvents,
      },
    },
    methods: {
      openModal() {
        this.createNewEvent = true
      },
      formatDate(date) {
        return format(new Date(date),'d MMMM yyyy')
      }
    }
  };
</script>

<style scoped>
.grid {
  --c-main: 200;
  --c-main-1: HSLA(var(--c-main), 100%, 10%, 1);
  --c-main-2: HSLA(var(--c-main), 100%, 20%, 1);
  --c-main-3: HSLA(var(--c-main), 100%, 30%, 1);
  --c-main-8: HSLA(var(--c-main), 100%, 80%, 1);
  --c-main-9: HSLA(var(--c-main), 100%, 90%, 1);
}

  .grid {
    display: grid;
    grid-row-gap: 2rem;
    grid-column-gap: 1rem;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat( auto-fit, minmax(19rem,1fr));
  }



.scene {
  perspective: 30cm;
  perspective-origin: 50% 150%;
  transition: 500ms perspective-origin ease-in-out;
}

.scene:hover {
  perspective-origin: 50% 100%;
}

.event {
  padding: 1.5rem 0 1.5rem 0;
  background: var(--c-main-2);
  border-radius: 1rem;
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12),
              0 2px 4px 0 rgba(0,0,0,0.08);
  transform-style: preserve-3d;
  transition: 500ms transform ease-in-out, 500ms background-color ease-in-out;
  cursor: pointer;
}

.event:hover {
  background: var(--c-main-3);
}

.event::before,
.event::after {
  content: '';
  border-radius: 1rem;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: 500ms transform ease-in-out;
  background-color: var(--c-main-2);
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.12),
              0 2px 4px 0 rgba(0,0,0,0.08);
}

.event::before {
  transform: translateZ(calc(1rem * -10));
}

.event::after {
  transform: translateZ(calc(1rem * -20));
}

.scene:hover .event::before,
.scene:hover .event::after {
  transform: translateZ(-1px);
}

h2 {
  color: var(--c-main-9);
  margin: 0;
  font-size: 21pt;
  letter-spacing: 1px;
  line-height: 1;
}

.overline {
  font-size: 10pt;
  text-transform: uppercase;
  color: var(--c-main-8);
  letter-spacing: 1px;
  line-height: 1.5;
}



.primary {
  fill:  var(--c-main-8);
}

.secondary {
  fill:  var(--c-main-2);
}

.heading {
  border-left: 2px solid white;
  padding-left: 1.5rem;
}


</style>

