// @ts-nocheck
import { createResolver } from "@nuxt/kit";
import vuetify from "vite-plugin-vuetify";
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
    experimental:{
        inlineSSRStyles: false,
    },

    server: {
      host: "127.0.0.1"
    },

    cache: true,

    // ssr: true,
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
  modules: ["@pinia/nuxt"],
    // nitro: {
    //     serveStatic: true,
    // },
    sourcemap: { server: false, client: false },
    devServerHandlers: [],
  // hooks: {
  //   "vite:extendConfig": (config: any) => {
  //     config.plugins.push(
  //         vuetify({
  //           styles: { configFile: resolve("@/assets/scss/variables.scss") },
  //         })
  //     );
  //   },
  // },
})