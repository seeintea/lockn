import { AnimatedThemeToggler } from "@components/ui/animated-theme-toggler"
import { Outlet, useLocation, useMatches } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"

export function Layout() {
  const matches = useMatches()
  const { pathname } = useLocation()

  useEffect(() => {
    const current = matches.at(-1)
    if (current?.staticData.title) {
      document.title = `${current.staticData.title} - Dashboard`
    }
  }, [matches])

  if (pathname === "/login") {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools
          initialIsOpen={false}
          position="bottom-right"
        />
      </>
    )
  }

  return (
    <main>
      <AnimatedThemeToggler />
      <Outlet />
      <Toaster position="top-center" />
      <TanStackRouterDevtools
        initialIsOpen={false}
        position="bottom-right"
      />
    </main>
  )
}
