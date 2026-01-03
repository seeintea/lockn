import { useQuery } from "@tanstack/react-query"
import type { UserListParams, UserListResponse } from "@/types"
import { list } from "./api"
import { userKeys } from "./keys"

export const useUserList = (params: UserListParams) => {
  return useQuery<UserListResponse>({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const { data } = await list(params)
      return data
    },
  })
}
