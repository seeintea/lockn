import { createRouter, RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as TanStackQueryProvider from "@/integrations/tanstack-query/root-provider"

import "./index.css"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }

  interface StaticDataRouteOption {
    title: string
  }
}

const rootEl = document.getElementById("app")
if (rootEl) {
  const root = createRoot(rootEl)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}
