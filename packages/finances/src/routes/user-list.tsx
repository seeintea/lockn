import { createFileRoute } from "@tanstack/react-router"
import { UserList } from "@/features/UserList"

export const Route = createFileRoute("/user-list")({
  component: UserList,
})
