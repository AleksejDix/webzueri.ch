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
    // Light and dark: follows the system, a toggle can override; sets the class before first paint
    '@nuxtjs/color-mode',
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
        { name: 'google-site-verification', content: 'IVcT2HAuAxv-lQubqO2BqwmRDjl4IFoNMBDGBPyELH0' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'theme-color', content: '#0070b4' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  // No twitter:* tags (unhead deprecates them): X reads the og: tags
  seo: {
    automaticTwitterTags: false,
  },
  ogImage: {
    includeTwitter: false,
    security: {
      // Some speaker photos are 10 MB originals; the default 3 s isn't enough to fetch
      // them while the static build renders hundreds of share images at once
      imageFetchTimeout: 20000,
      renderTimeout: 60000,
    },
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'wz-color-mode',
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
    // On a static host the prerendered search data has no file extension, so say it's JSON
    '/api/search-index': { headers: { 'content-type': 'application/json; charset=utf-8' } },
    // The old team page lives on as About; one address keeps search engines from splitting it
    '/team': { redirect: { to: '/about', statusCode: 301 } },
    // Workshops were discontinued; keep old links working
    '/workshops': { redirect: { to: '/', statusCode: 301 } },
    '/workshops/**': { redirect: { to: '/', statusCode: 301 } },
  },
  // For the static build on Cloudflare (npm run generate:cloudflare): files the crawler
  // can't find through links on the pages. Not on Vercel, where these stay live routes
  nitro: process.env.NITRO_PRESET !== 'cloudflare_pages_static' ? {} : {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt', '/calendar.ics', '/api/search-index'],
      // talks.html rather than talks/index.html: Cloudflare Pages serves it at /talks,
      // where index.html would get a trailing slash (/talks/)
      autoSubfolderIndex: false,
    },
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