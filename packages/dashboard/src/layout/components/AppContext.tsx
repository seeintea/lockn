import { Outlet } from "@tanstack/react-router"

export default function AppContext() {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  )
}
