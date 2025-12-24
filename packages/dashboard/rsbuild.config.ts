import { defineConfig } from "@rsbuild/core"
import { pluginBabel } from "@rsbuild/plugin-babel"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcss from "@tailwindcss/postcss"

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
  },
})
