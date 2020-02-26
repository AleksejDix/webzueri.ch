export default {
  mode: "universal",
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
    titleTemplate: `%s - web zurich`,
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
        hid: "description",
        name: "description",
        content:
          "Learn, share and collaborate with your local Web professionals and enthusiasts!"
      },
      {
        hid: "google-site-verification",
        name: "google-site-verification",
        content: "IVcT2HAuAxv-lQubqO2BqwmRDjl4IFoNMBDGBPyELH0"
      }
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
  modules: ["@nuxtjs/apollo", "@nuxtjs/markdownit", "@nuxtjs/pwa"],
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
        httpEndpoint: `https://api-euwest.graphcms.com/v1/cjiqbztau0hjj01i2nukb5bjt/master`
      }
    }
  }
};
