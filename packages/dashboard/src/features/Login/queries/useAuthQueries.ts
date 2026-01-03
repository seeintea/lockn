import { useMutation } from "@tanstack/react-query"
import { api } from "@/api/client"
import { useAuth } from "@/stores"
import type { LoginParams, LoginResponse } from "@/types"

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  logout: () => [...authKeys.all, "logout"] as const,
}

export const login = (params: LoginParams) => api.post<LoginResponse>("/sys/auth/login", params)

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    mutationKey: authKeys.login(),
    onSuccess: (resp) => {
      if (resp.code === 200) {
        useAuth.getState().updateToken(resp.data.accessToken)
      }
    },
  })
}
