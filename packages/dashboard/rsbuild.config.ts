import { defineConfig } from "@rsbuild/core"
import { pluginBabel } from "@rsbuild/plugin-babel"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcss from "@tailwindcss/postcss"
import { tanstackRouter } from "@tanstack/router-plugin/rspack"

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift("babel-plugin-react-compiler")
      },
    }),
  ],
  tools: {
    postcss: (_, { addPlugins }) => {
      addPlugins(tailwindcss)
    },
    rspack: {
      plugins: [
        tanstackRouter({
          target: "react",
          autoCodeSplitting: true,
        }),
      ],
    },
  },
  html: {
    mountId: "app",
    title: "Dashboard",
  },
  server: {
    port: 5721,
  },
})
