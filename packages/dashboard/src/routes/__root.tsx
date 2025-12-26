import { createRootRoute, Outlet, useMatches } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  component: RootComponent,
  staticData: {
    title: "",
  },
})

function RootComponent() {
  const matches = useMatches()

  useEffect(() => {
    const current = matches.at(-1)
    if (current?.staticData.title) {
      document.title = `${current.staticData.title} - Dashboard`
    }
  }, [matches])

  return (
    <>
      <Outlet />
      <Toaster position="top-center" />
      <TanStackRouterDevtools
        initialIsOpen={false}
        position="bottom-right"
      />
    </>
  )
}
