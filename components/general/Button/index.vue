<template>
  <a
    v-if="href"
    class="button transition"
    v-bind="$props"
    :class="[
    size === 'small' ? 'button--small' : '',
    danger ? 'button--danger' : '',
    getPadding]"
  >
    <div class="inline-flex items-center owl-x">
      <div v-if="$slots['start']" class="w-6 h-6 rounded-full overflow-hidden bg-on-dark-secondary">
        <slot name="start"></slot>
      </div>
      <span>
        <slot></slot>
      </span>
      <div v-if="$slots['end']" class="w-6 h-6 rounded-full overflow-hidden bg-on-dark-secondary">
        <slot name="end"></slot>
      </div>
    </div>
  </a>
  <nuxt-link
    v-else-if="to"
    class="button transition"
    v-bind="$props"
    :class="[
    size === 'small' ? 'button--small' : '',
    danger ? 'button--danger' : '',
    getPadding]"
  >
    <div class="inline-flex items-center owl-x">
      <div v-if="$slots['start']" class="w-6 h-6 rounded-full overflow-hidden bg-on-dark-secondary">
        <slot name="start"></slot>
      </div>
      <span>
        <slot></slot>
      </span>
      <div v-if="$slots['end']" class="w-6 h-6 rounded-full overflow-hidden bg-on-dark-secondary">
        <slot name="end"></slot>
      </div>
    </div>
  </nuxt-link>
  <button
    v-else
    @click="handleClick"
    class="button transition"
    :class="[{
      'button--small' : size === 'small',
      'button--danger' : danger,
      'button--muted' : muted,
    },
    getPadding]"
  >
    <div class="inline-flex items-center owl-x">
      <div v-if="$slots['start']" class="w-6 h-6 rounded-full overflow-hidden bg-on-dark-secondary">
        <slot name="start"></slot>
      </div>
      <span>
        <slot></slot>
      </span>
      <div v-if="$slots['end']" class="w-6 h-6 rounded-full overflow-hidden bg-on-dark-secondary">
        <slot name="end"></slot>
      </div>
    </div>
  </button>
</template>

<script>

export default {
  props: ['to', 'size', 'href', 'danger', 'muted'],
  computed: {
    getSize() {
      if (!this.size) return
      return `button--small`
    },
    getPadding () {
      if (this.$slots['end'] && this.$slots['start']) return 'px-2'
      if (this.$slots['end']) return 'pl-4 pr-2'
      if (this.$slots['start']) return 'pl-2 pr-4'
      return 'px-4'
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style >
  .button {
    @apply shadow text-9 inline-flex text-on-dark-primary no-underline bg-blue tracking-wide no-underline uppercase font-semibold rounded h-10 cursor-pointer;
  }

  .button:hover,
  .button:focus {
    @apply outline-none bg-blue-light;
  }

  .button.nuxt-link-active,
  .button:active {
    @apply outline-none bg-blue-light;
  }

  .button--small {
    @apply h-8 text-8;
  }

  .button--danger {
    @apply bg-red;
  }

  .button--danger:hover,
  .button--danger:active,
  .button--danger:focus {
    @apply bg-red-dark text-on-dark-primary;
  }

  .button--muted {
    @apply bg-transparent shadow-none text-on-light-secondary;
  }

  .button--muted:hover,
  .button--muted:active,
  .button--muted:focus {
    @apply bg-grey text-on-light-primary;
  }

  .button--big {
    @apply h-12 text-10;
  }
</style>

