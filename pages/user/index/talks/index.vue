<template>
  <section>
    <header>
      <h1 class=" text-18 font-display">My Talks</h1>
    </header>
    <div>
      <ul class="owl list-reset">
        <li v-for="n in 10" :key="n" class="shadow py-6 px-8 bg-primary rounded text-on-dark-primary">
          some text
        </li>
      </ul>
    </div>
  </section>
</template>
