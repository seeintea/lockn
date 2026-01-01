import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserStore {
  token: string
}

interface UserAction {
  updateToken: (token: string) => void
}

type User = UserStore & UserAction

export const useUser = create(
  persist<User>(
    (set) => ({
      token: "",
      updateToken: (token) => set({ token }),
    }),
    {
      name: "persist-user",
    },
  ),
)
