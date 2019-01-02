<template>
  <a v-if="href" class="button transition text-shadow-black" v-bind="$props" :class="[ muted ? 'button--muted' : '',]">
    <div class=" inline-flex items-center owl-x" :class="[
        muted ? 'button--muted' : '',
        size === 'small' ? 'h-8 text-8' : 'h-10',
        danger ? 'button--danger' : '',
        getPadding]">
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
  <nuxt-link v-else-if="to" class="button transition text-shadow-black" v-bind="$props" :class="[ muted ? 'button--muted' : '',]">
    <div class=" inline-flex items-center owl-x" :class="[
        size === 'small' ? 'h-8 text-8' : 'h-10',
        danger ? 'button--danger' : '',
        getPadding]">
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
  <button v-else @click="handleClick" class="button transition text-shadow-black" v-bind="$props" :class="[ muted ? 'button--muted' : '',]">
    <div class=" inline-flex items-center owl-x" :class="[

        size === 'small' ? 'h-8 text-8' : 'h-10',
        danger ? 'button--danger' : '',
        getPadding]">
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
      return `h-8 text-8`
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
    @apply no-underline inline-block shadow-blue rounded bg-blue cursor-pointer;
  }

  .button > div {
    @apply w-full text-9 text-on-dark-primary tracking-wide no-underline uppercase font-medium rounded;
  }

  .button:hover,
  .button:focus {
    @apply outline-none bg-fuchsia shadow-fuchsia;
  }

  .button.nuxt-link-active > div,
  .button:active > div {
    @apply outline-none bg-fuchsia-light shadow-fuchsia;
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
    @apply shadow-blue bg-transparent text-on-light-secondary;
  }

  .button--muted:hover,
  .button--muted:active,
  .button--muted:focus {
    @apply bg-transparent shadow-fuchsia;
  }

  .button--big > div {
    @apply h-12 text-10;
  }
</style>
