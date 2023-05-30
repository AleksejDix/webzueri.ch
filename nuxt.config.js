export default {
  mode: "spa",
  router: {
    base: "/"
  },
  env: {
    baseUrl: process.env.NOW_URL || "http://localhost:3000"
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: `%s - Web Zurich`,
    htmlAttrs: {
      lang: "en-US"
    },
    meta: [
      {
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        name: "yandex-verification",
        content: "5b394792ab19c0bd"
      },
      {
        hid: "description",
        name: "description",
        content:
          "Learn, share and collaborate with your local Web professionals and enthusiasts!"
      },
      {
        hid: "google-site-verification",
        name: "google-site-verification",
        content: "IVcT2HAuAxv-lQubqO2BqwmRDjl4IFoNMBDGBPyELH0"
      },
      {
        hid: "og:image",
        name: "image",
        property: "og:image",
        content: `${process.env.NOW_URL || "http://localhost:3000"}/icon.png`
      },
      { hid: "twitter:site", name: "twitter:site", content: "@webzuerich" },
      {
        hid: "twitter:creator",
        name: "twitter:creator",
        content: "@aleksejdix"
      },
      { hid: "og:site_name", name: "og:site_name", content: "web zürich" }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Montserrat:400,700,800&display=swap"
      }
    ]
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/components", "~/plugins/filters.js"],
  buildModules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-analytics"],
  modules: [
    "@nuxtjs/apollo",
    "@nuxtjs/markdownit",
    "@nuxtjs/pwa",
    "portal-vue/nuxt"
  ],
  googleAnalytics: {
    id: "UA-122601504-1"
  },
  tailwindcss: {
    configPath: "~/config/tailwind.config.js",
    cssPath: "~/assets/css/tailwind.css"
  },
  markdownit: {
    injected: true
  },
  workbox: {
    publicPath: "/_nuxt/"
  },
  manifest: {
    publicPath: "/_nuxt/"
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: `https://api-eu-central-1.hygraph.com/v2/cjiqbztau0hjj01i2nukb5bjt/master`
      }
    }
  },
  pwa: {
    meta: {
      name: "Web Zurich",
      short_name: "Web Zurich",
      author: "Aleksej Dix",
      description: "Community that matters"
    }
  }
};
