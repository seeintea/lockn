import { api } from "@/api/client"
import type { UserListParams, UserListResponse } from "@/types"

export const list = (params: UserListParams) => api.get<UserListResponse>("/sys/user/list", params)

export const enable = (userId: string) => api.post("/sys/user/update/enable", { userId })
