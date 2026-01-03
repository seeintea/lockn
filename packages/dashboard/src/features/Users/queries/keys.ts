import type { UserListParams } from "@/types"

export const userKeys = {
  all: ["user"] as const,
  list: (params: UserListParams) => [...userKeys.all, "list", params] as const,
}
