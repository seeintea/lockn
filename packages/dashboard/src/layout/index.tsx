import { Outlet, useLocation, useMatches } from "@tanstack/react-router"
import { useEffect } from "react"
import { AppContainer } from "./components/AppContainer"
import { SideBar } from "./components/SideBar"

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
    <AppContainer className={"w-full h-full flex"}>
      <SideBar />
      <Outlet />
    </AppContainer>
  )
}
