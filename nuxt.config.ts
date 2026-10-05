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
    'nuxt-security',
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
  // nuxt-security, set up for a static site: the Content-Security-Policy goes into each page
  // as a <meta> tag with hashes of its inline scripts, and scripts get integrity (SRI) checks.
  // The other security headers are in routeRules below, as one rule for Cloudflare's _headers
  // (the per-page export would need more rules than Pages allows). Its server-side features
  // have nothing to run on here
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'base-uri': ["'none'"],
        'object-src': ["'none'"],
        'form-action': ["'self'"],
        'script-src': ["'self'", "'strict-dynamic'", "'nonce-{{nonce}}'"],
        'script-src-attr': ["'none'"],
        // Vue and @nuxtjs/color-mode set inline styles; the CSS is inlined into the HTML
        'style-src': ["'self'", "'unsafe-inline'"],
        // Speaker photos and logos from Hygraph, video thumbnails from YouTube
        'img-src': ["'self'", 'data:', 'blob:', 'https://eu-central-1.graphassets.com', 'https://i.ytimg.com'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'https://api-eu-central-1.hygraph.com'],
        // Talk videos play from YouTube's no-cookie player
        'frame-src': ['https://www.youtube-nocookie.com'],
        'worker-src': ["'self'", 'blob:'],
        'manifest-src': ["'self'"],
        'upgrade-insecure-requests': true,
      },
      // Not as headers: these go out through routeRules instead (see the comment above)
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      originAgentCluster: false,
      referrerPolicy: false,
      strictTransportSecurity: false,
      xContentTypeOptions: false,
      xDNSPrefetchControl: false,
      xDownloadOptions: false,
      xFrameOptions: false,
      xPermittedCrossDomainPolicies: false,
      xXSSProtection: false,
      permissionsPolicy: false,
    },
    ssg: { meta: true, hashScripts: true, hashStyles: false, nitroHeaders: false, exportToPresets: false },
    rateLimiter: false,
    requestSizeLimiter: false,
    xssValidator: false,
    corsHandler: false,
    allowedMethodsRestricter: false,
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'wz-color-mode',
  },
  routeRules: {
    // Security headers for every page, written to Cloudflare's _headers. The YouTube player
    // needs the referrer (it refuses to play without one) and fullscreen
    '/**': {
      headers: {
        'strict-transport-security': 'max-age=15552000; includeSubDomains',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SAMEORIGIN',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'cross-origin-opener-policy': 'same-origin',
        'permissions-policy': 'camera=(), microphone=(), geolocation=(), display-capture=(), fullscreen=(self "https://www.youtube-nocookie.com")',
      },
    },
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
  // The site is built ahead of time and hosted on Cloudflare Pages (npm run generate:cloudflare,
  // rebuilt on every push and whenever content is published in Hygraph)
  nitro: {
    prerender: {
      // Files the crawler can't find through links on the pages
      routes: ['/sitemap.xml', '/robots.txt', '/calendar.ics', '/api/search-index'],
      // talks.html rather than talks/index.html: Cloudflare Pages serves it at /talks,
      // where index.html would get a trailing slash (/talks/)
      autoSubfolderIndex: false,
    },
  },
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