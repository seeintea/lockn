import { Outlet } from "@tanstack/react-router"

export function AppContent() {
  return (
    <main className="flex-1 min-h-0 overflow-auto p-4">
      <Outlet />
    </main>
  )
}
