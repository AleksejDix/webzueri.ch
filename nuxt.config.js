import glob from 'glob-all';
import path from 'path';
import PurgecssPlugin from 'purgecss-webpack-plugin';

const pkg = require("./package");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:/]+/g) || [];
  }
}

export default {
  mode: "universal",
  router: {
    base: "/"
  },
  env: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000"
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: `%s - ${pkg.name}`,
    htmlAttrs: {
      lang: "en-US"
    },
    bodyAttrs: {
      class: "antialiased bg-indigo-darkest"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Rubik:400,700,900"
      }
    ]
  },
  loading: { color: "hsla(214,64%,46%,1.00)" },
  /*
  ** Global CSS
  */
  css: ["~/assets/css/tailwind.css"],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ["~/plugins/components"],

  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    postcss: [require("tailwindcss")("./tailwind.js"), require("autoprefixer")],
    extend(config, { isDev }) {
      if (!isDev) {
        config.plugins.push(
          new PurgecssPlugin({
            // purgecss configuration
            // https://github.com/FullHuman/purgecss
            paths: glob.sync([
              path.join(__dirname, "./pages/**/*.vue"),
              path.join(__dirname, "./layouts/**/*.vue"),
              path.join(__dirname, "./components/**/*.vue")
            ]),
            extractors: [
              {
                extractor: TailwindExtractor,
                extensions: ["vue"]
              }
            ],
            whitelist: ["html", "body", "nuxt-progress"],
            whitelistPatterns: [/^group-hover/],
            whitelistPatternsChildren: [/^group-hover/]
          })
        );
      }
    }
  },
  modules: ["@nuxtjs/apollo"],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: "https://api-euwest.graphcms.com/v1/cjiqbztau0hjj01i2nukb5bjt/master",
      }
    }
  }
};
