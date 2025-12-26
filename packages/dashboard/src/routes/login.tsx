import { Login } from "@features/Login"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  staticData: {
    title: "登录",
  },
})

function RouteComponent() {
  return <Login />
}
