import { Outlet, useLocation } from "@tanstack/react-router"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppContent } from "./components/AppContent"
import { AppHeader } from "./components/AppHeader"
import { AppSidebar } from "./components/AppSidebar"

export function Layout() {
  const { pathname } = useLocation()

  if (pathname === "/login") {
    return <Outlet />
  }

  return <AppLayout />
}

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <AppContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
