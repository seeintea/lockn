import { useMutation } from "@tanstack/react-query"
import { useUser } from "@/stores/useUser"
import { login } from "./api"
import { authKeys } from "./keys"

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    mutationKey: authKeys.login(),
    onSuccess: (resp) => {
      if (resp.code === 200) {
        useUser.getState().updateToken(resp.data.accessToken)
      }
    },
  })
}
