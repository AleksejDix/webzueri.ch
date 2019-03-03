<template>
  <nuxt-link
    v-bind="$attrs"
    class="text-current-color hover:text-current-color relative transition no-underline block transition"
    :active-class="text-on-light-primary"
    :to="{name: `dashboard-index-status-index-id-edit`, params: { id: data.id } }"
  >
    <div class="flex items-center">
      <div class="flex-1 px-3 py-2 md:px-6 md:py-4 owl-lg">
        <h3 class="text-current-color leading-tight text-11 md:text-16 font-normal">{{data.title}}</h3>
        <div class="stack">
          <div>
            <user-card size="xs" :photo="data.authorPhotoURL" :name="data.authorDisplayName"/>
          </div>
          <div>
            <Badge :color="badgeText.color">{{data.rejected ? 'rejected' : badgeText.text}}</Badge>
          </div>
        </div>
      </div>
      <div class="hidden xl:block p-2">
        <slot></slot>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    badgeText() {
      switch (this.data.status) {
        case "approved":
          return {
            color: "green",
            text: "scheduling"
          }
        case "proposal":
          return {
            color: "orange",
            text: "pending review"
          }
        default:
          return {
            color: "red",
            text: "not submitted"
          }
      }
    }
  }
}
</script>

