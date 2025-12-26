import { Layout } from "@layout"
import { createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
  staticData: {
    title: "",
  },
})

function RootComponent() {
  return <Layout />
}
