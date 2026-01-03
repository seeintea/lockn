import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthStore {
  token: string
}

interface AuthAction {
  updateToken: (token: string) => void
}

export const useAuth = create(
  persist<AuthStore & AuthAction>(
    (set) => ({
      token: "",
      updateToken: (token) => set({ token }),
    }),
    {
      name: "persist-auth",
    },
  ),
)
