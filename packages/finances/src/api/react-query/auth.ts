import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userStore } from "@/stores"
import { type LoginParams, login, logout } from "../controllers/auth"

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: (params: LoginParams) => login(params),
    onSuccess: (resp) => {
      if (resp.code === 200) {
        const { reset, setUser } = userStore.getState()
        reset()
        setUser({
          token: resp.data.accessToken,
          userId: resp.data.userId,
          username: resp.data.username,
        })
        queryClient.invalidateQueries()
      }
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: () => logout(),
    onSuccess: () => {
      userStore.getState().reset()
      queryClient.clear()
    },
  })
}
