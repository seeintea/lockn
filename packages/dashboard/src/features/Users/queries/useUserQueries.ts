import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { UserListParams, UserListResponse } from "@/types"
import { enable, list } from "./api"
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

export const useUserEnable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: userKeys.enable(),
    mutationFn: async (userId: string) => {
      const { data } = await enable(userId)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] })
    },
  })
}
