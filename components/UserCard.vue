<template functional>
  <article class="flex items-center">
    <div
      class="flex-no-shrink relative"
      :class="{
        'w-16 h-16': props.size === 'xl',
        'w-12 h-12': props.size === 'lg',
        'w-10 h-10': props.size === 'md',
        'w-8 h-8': props.size === 'sm',
        'w-6 h-6': props.size === 'xs'
      }"
    >
      <img
        loading="lazy"
        class="absolute pin rounded-full w-full"
        :src="props.photo"
        :alt="props.name"
      />
      <div class="rounded-full absolute pin shadow-inner"></div>
    </div>
    <div class="flex-1">
      <h3
        class="leading-none text-current-color font-normal"
        style="padding-left: 0.5em;"
        :class="{
          'text-16': props.size === 'xl',
          'text-14': props.size === 'lg',
          'text-12': props.size === 'md',
          'text-12': props.size === 'sm',
          'text-12': props.size === 'xs'
        }"
      >
        {{ props.name }}
      </h3>
      <aside
        style="padding-left: 0.5em;"
        class="text-current-color leading-normal"
        :class="{
          'text-16': props.size === 'xl',
          'text-14': props.size === 'lg',
          'text-12': props.size === 'md',
          'text-12': props.size === 'sm',
          'text-12': props.size === 'xs'
        }"
      >
        {{ props.meta }}
      </aside>
    </div>
  </article>
</template>
