import { Outlet, useLocation, useMatches } from "@tanstack/react-router"
import { useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppContainer } from "./components/AppContainer"
import AppContext from "./components/AppContext"
import { AppHeader } from "./components/AppHeader"
import { AppSideBar } from "./components/AppSideBar"

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
      <AppContainer>
        <Outlet />
      </AppContainer>
    )
  }

  return (
    <AppContainer className={"w-full h-full"}>
      <SidebarProvider>
        <AppSideBar />
        <main className={"flex-1"}>
          <AppHeader />
          <AppContext />
        </main>
      </SidebarProvider>
    </AppContainer>
  )
}
