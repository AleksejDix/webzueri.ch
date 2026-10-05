import tailwindcss from "@tailwindcss/vite";
import typegpu from "unplugin-typegpu/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  features: {
    // All CSS goes inline into the HTML (cached at the edge), so no stylesheet
    // request blocks the first paint
    inlineStyles: true,
  },
  experimental: {
    viewTransition: true,
  },
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/apollo',
    "nuxt-lucide-icons",
    'vue-view-transitions/nuxt',
    // Nuxt SEO, module by module: the @nuxtjs/seo bundle only loads them on Nuxt 4
    'nuxt-site-config',
    'nuxt-seo-utils',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
    'nuxt-og-image',
  ],
  site: {
    url: 'https://webzurich.ch',
    name: 'Web Zürich',
    description: "Zürich's web community: free meetups, talks and speakers since 2016.",
    defaultLocale: 'en',
    trailingSlash: false,
  },
  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Web Zürich',
      url: 'https://webzurich.ch',
      logo: 'https://webzurich.ch/icon.png',
      sameAs: ['https://www.meetup.com/web-zurich/', 'https://twitter.com/webzuerich', 'https://github.com/AleksejDix/webzueri.ch'],
    },
  },
  sitemap: {
    // Talks, speakers and meetups come from Hygraph (server/api/__sitemap__/urls.ts)
    sources: ['/api/__sitemap__/urls'],
  },
  vite: {
    plugins: [
      tailwindcss(),
      // Compiles Redraw's "use gpu" shader functions to WGSL
      typegpu({}),
    ],
  },
  css: ['~/assets/css/main.css', '~/assets/css/transition.css'],
  image: {
    // Hygraph originals are resized by @nuxt/image, not by Hygraph (it rate-limits transformations)
    domains: ['eu-central-1.graphassets.com', 'i.ytimg.com', 'images.unsplash.com'],
    quality: 75,
  },
  runtimeConfig: {
    hygraphEndpoint: 'https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master',
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-US' },
      meta: [
        { name: 'description', content: 'Learn, share and collaborate with your local Web professionals and enthusiasts!' },
        { name: 'yandex-verification', content: '5b394792ab19c0bd' },
        { name: 'google-site-verification', content: 'IVcT2HAuAxv-lQubqO2BqwmRDjl4IFoNMBDGBPyELH0' },
        { property: 'og:site_name', content: 'Web Zürich' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#0070b4' },
        { name: 'twitter:site', content: '@webzuerich' },
        { name: 'twitter:creator', content: '@aleksejdix' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  routeRules: {
    // Served from Vercel's edge cache and re-rendered in the background, so
    // visitors don't wait for Hygraph. Content edits show up within the hour
    // (ten minutes on the home page, which shows the next meetup)
    '/': { isr: 600 },
    '/talks': { isr: 3600 },
    '/talks/**': { isr: 3600 },
    '/speakers': { isr: 3600 },
    '/speakers/**': { isr: 3600 },
    '/events': { isr: 3600 },
    '/events/**': { isr: 3600 },
    '/about': { isr: 3600 },
    '/sponsors': { isr: 3600 },
    '/communities': { isr: 3600 },
    '/code-of-conduct': { isr: 3600 },
    '/advertising-rules': { isr: 3600 },
    // Gallery photos rarely change; a week in the browser, refreshed in the background
    '/img/**': { headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' } },
    // The old team page lives on as About; one address keeps search engines from splitting it
    '/team': { redirect: { to: '/about', statusCode: 301 } },
    // Workshops were discontinued; keep old links working
    '/workshops': { redirect: { to: '/', statusCode: 301 } },
    '/workshops/**': { redirect: { to: '/', statusCode: 301 } },
  },
  // Leftover Nuxt 2 page (superseded by pages/talks/[id].vue); safe to delete
  ignore: ['pages/talks/_id/**'],
  lucide: {
    namePrefix: "Lucide",
  },
  // Apollo GraphQL configuration
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master'
      }
    }
  },
})