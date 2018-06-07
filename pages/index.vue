<template>
  <div>
    <pre>{{story}}</pre>
    <section class="py-24 bg-green-lighter">
      <div class="max-w-3xl mx-auto pt-8">
        <div class="px-4">
          <h1 class="mb-4 leading-tight text-3xl md:text-5xl text-base text-indigo-darker font-display font-bold tracking-wide uppercase text-center">People making <br class="md:hidden"> the web in Zürich</h1>
          <p class="leading-normal text-center text-xl md:text-2xl text-yellow-darkerst">Learn, share and collaborate with your local <strong>web professionals</strong> and enthusiasts!</p>
        </div>
        <div class="my-12 h-64 bg-auto bg-center bg-no-repeat" style="background-image: url('/people.svg')">
        </div>
      </div>
      <div class="text-right text-xs no-underline">
        <a class="no-underline text-green-dark pr-8" href="https://www.freepik.com/free-vector/background-of-people-in-isometric-perspective_1201321.htm">Illustration by Freepik</a>
      </div>
    </section>

    <section class="px-4">
      <div class="max-w-2xl mx-auto relative bg-indigo-darker shadow-lg rounded -mt-24 overflow-hidden">
        <div class="flex text-white text-lg">
          <div class="flex-1 px-8">
            <h2 class="py-6  text-2xl inkline-block text-base text-grey-lightest font-display font-medium tracking-wide border-b-2">Next Event: <span class="text-white font-bold">22. June 2018 18:30</span></h2>
             <ol class="list-reset py-4">
               <li>
                 <div class="flex py-2">
                    <div class=" flex items-center">
                      <time class="text-2xl font-mono text-white pr-4">18:40</time>
                      <img class="rounded-full mr-4 inline-block w-24 h-24 border-2 border-white" src="https://randomuser.me/api/portraits/men/49.jpg" alt="">
                      <h4 class="text-2xl leading-normal">
                        <div ><a class="name font-light text-green-lighter no-underline" href="">Gilbert Carter</a></div>
                        <div>Let’s Talk About Speech CSS</div>
                      </h4>
                    </div>
                  </div>
               </li>
                 <li>
                 <div class="flex py-2">
                    <div class=" flex items-center">
                      <time class="text-2xl font-mono text-white pr-4">19:00</time>
                      <img class="rounded-full mr-4 inline-block w-24 h-24 border-2 border-white" src="https://randomuser.me/api/portraits/women/34.jpg" alt="">
                      <h4 class="text-2xl leading-normal">
                        <div ><a class="name font-light text-green-lighter no-underline" href="">Heather Newman</a></div>
                        <div>Let’s Talk About Speech CSS</div>
                      </h4>
                    </div>
                  </div>
               </li>
                 <li>
                 <div class="flex py-2">
                    <div class=" flex items-center">
                      <time class="text-2xl font-mono text-white pr-4">19:20</time>
                      <img class="rounded-full mr-4 inline-block w-24 h-24 border-2 border-white" src="https://randomuser.me/api/portraits/men/23.jpg" alt="">
                      <h4 class="text-2xl leading-normal">
                        <div ><a class="name font-light text-green-lighter no-underline" href="">Gilbert Carter</a></div>
                        <div>Let’s Talk About Speech CSS</div>
                      </h4>
                    </div>
                  </div>
               </li>
             </ol>
          </div>
          <div class=" px-8 bg-pink-dark py-8 text-pink-lightest font-medium flex flex-col">
            <div class="flex-1">
            <h3 class="uppercase text-sm py-4 tracking-wide text-pink-darker">Where</h3>
            <div class="leading-normal pb-4">
            <p>Impact Hub Zürich - Viadukt</p>
            <p>Viaduktstrasse 93, 8005 Zürich</p>
            </div>
            <h3 class="uppercase text-sm py-4 tracking-wide text-pink-darker">When</h3>
            <div class="leading-normal pb-4">
              <p>Date: Wednesday May 30th</p>
              <p>Time: 18:30</p>
            </div>
            </div>
            <button class="shadow bg-grey-lightest text-indigo-darkest py-4 px-8 rounded font-bold">RSVP on Meetup</button>
          </div>
         </div>
      </div>
    </section>

<section class="max-w-2xl mx-auto">
  <div class="banner min-h-64 shadow-lg mt-4 flex items-center rounded overflow-hidden">
    <figure class="w-1/2 bg-cover bg-center"
      style="clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);  background-color: rgba(0,0,0,.45);
  background-blend-mode: multiply; background-image: url(https://assets.brandfolder.com/orgcu6-edcnnk-egeh9s/original/2727_019D.jpg)">
      <img class="py-16 px-24" style="transform: translateX(-6%)" src="https://assets.brandfolder.com/irnq5s6s/original/slack_monochrome_white.png" alt="">
    </figure>
    <div class="text w-1/2">
      <div class="py-4 px-8">
        <h2 class="py-6 text-2xl text-base text-indigo-darkest font-display font-normal tracking-wide ">Join our community on <strong>slack</strong></h2>
        <p class="text-lg leading-normal text-indigo-darkest font-medium">Get the latest Zurich- and web-news in our Slack channel.
Or <strong>find help</strong> from your local peers and see what’s up around you.
        </p>
        <div class="cta-bar py-8">
          <button class="shadow-md bg-pink-dark text-white py-4 px-8 rounded font-bold">Join Slack</button>
        </div>
      </div>
    </div>
  </div>
</section>
</div>

    <!-- <component v-if="story.content.component"
      :key="story.content._uid"
      :blok="story.content"
      :is="story.content.component"></component> -->
</template>

<script>
export default {
  // get data from storyblok
};
</script>