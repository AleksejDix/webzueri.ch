# webzueri.ch

> Learn, share and collaborate with your local Web professionals and enthusiasts!

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
.

```
{
  "src": "/sw.js",
  "dest": "/_nuxt/static/sw.js",
  "headers": {
    "cache-control": "public, max-age=43200, immutable",
    "Service-Worker-Allowed": "/"
  }
}
```
