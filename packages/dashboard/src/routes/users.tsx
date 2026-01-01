import { createFileRoute } from "@tanstack/react-router"
import { Users } from "@/features/Users"

export const Route = createFileRoute("/users")({
  component: RouteComponent,
  staticData: {
    title: "用户列表",
  },
})

function RouteComponent() {
  return <Users />
}
