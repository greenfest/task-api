// @ts-nocheck
import { createResolver } from "@nuxt/kit";
import vuetify from "vite-plugin-vuetify";
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
    experimental:{
        inlineSSRStyles: false
    },

    ssr: true,
    routeRules: {
        '/**': { ssr: false }
    },

    typescript: {
        shim: false,
    },
    app: {
        head: {
            title:
                "UTask",
        },
    },
  modules: ["@nuxtjs/tailwindcss", "nuxt-headlessui", "@pinia/nuxt"],
    nitro: {
        serveStatic: true,
    },
    sourcemap: { server: false, client: false },
    devServerHandlers: [],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
  hooks: {
    "vite:extendConfig": (config: any) => {
      config.plugins.push(
          vuetify({
            styles: { configFile: resolve("/assets/scss/variables.scss") },
          })
      );
    },
  },
})