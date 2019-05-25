<template functional>
  <div>
    <section>
      <header class="text-center py-6 px-4">
        <h2
          class="leading-normal max-w-md mx-auto text-on-dark-primary font-display text-16 md:text-21"
        >Unlock your community's peer-to-peer sharing potential</h2>
      </header>
      <div class="flex md:justify-center overflow-auto py-12 px-2">
        <div
          class="flex-no-shrink w-64 md:w-96 p-2"
          v-for="feedback in props.feedbacks"
          :key="feedback.id"
        >
          <article class>
            <header
              class="flex justify-between items-center bg-primary shadow-blue py-4 px-8 rounded-lg relative z-10"
            >
              <user-card
                :photo="feedback.speaker.speakerPicture.handle"
                :name="feedback.speaker.name"
              />
              <img
                loading="lazy"
                v-if="feedback.sponsor"
                class="w-auto h-6"
                :src="feedback.sponsor.logo.url"
                alt
              >
            </header>

            <div class="px-2">
              <blockquote
                class="bg-primary shadow-blue-darker px-6 py-4 text-on-dark-secondary rounded-b text-12 leading-normal"
              >
                <svg viewBox="0 0 9 8" xmlns="http://www.w3.org/2000/svg" width="9" height="8">
                  <path
                    fill="#657884"
                    d="M2.1 8c-.4 0-.7-.1-1-.4-.4-.3-.6-.6-.8-1L0 5A6.3 6.3 0 0 1 3 0l.7.6v.3A4 4 0 0 0 2.8 2c-.3.5-.4 1.1-.4 1.8 0 .4 0 .7.2 1 0 .1.2.4.5.6l.4.7v.6c0 .4 0 .7-.3 1-.3.2-.6.3-1 .3zm5.4 0c-.4 0-.8-.1-1.1-.4-.4-.3-.6-.6-.8-1L5.3 5a6.3 6.3 0 0 1 3-5.1l.7.6v.3a4 4 0 0 0-1.3 3c0 .3 0 .6.2.8l.5.7.4.7.1.6c0 .4-.1.7-.4 1-.3.2-.6.3-1 .3z"
                  ></path>
                </svg>
                {{ feedback.quote }}
              </blockquote>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import UserCard from "@/components/UserCard";
export default {
  components: { UserCard }
}
</script>
