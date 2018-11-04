<template>

  <a v-if="href" class="button transition" v-bind="$props" :class="[getSize,getPadding]">
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

  <nuxt-link v-else-if="to" class="button transition" v-bind="$props" :class="[getSize,getPadding]">
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

  <button v-else @click="handleClick" class="button transition" :class="[getSize,getPadding]">
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
  props: ['to', 'size', 'href'],
  computed: {
    getSize() {
      if (!this.size) return
      return `button--${this.size}`
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
    @apply text-9 inline-flex text-on-light-primary no-underline bg-secondary tracking-wide no-underline uppercase font-semibold rounded-full h-10 cursor-pointer;
  }
  .button:focus {
    @apply outline-none bg-secondary-dark;
  }

  .button--small {
    @apply h-8 text-8;
  }

  .button--big {
    @apply h-12 text-10;
  }

  .button:hover {
    @apply bg-yellow shadow;
  }

  .button.nuxt-link-active {
    @apply bg-secondary-light text-on-light-secondary;
  }
</style>

