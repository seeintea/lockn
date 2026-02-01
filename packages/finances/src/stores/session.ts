import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserState {
  token: string
  bookId: string
  userId: string
  username: string
  roles: string[]
  permissions: string[]
}

export interface UserActions {
  setToken: (token: string) => void
  setBookId: (bookId: string) => void
  setUserId: (userId: string) => void
  setUsername: (username: string) => void
  setRoles: (roles: string[]) => void
  setPermissions: (permissions: string[]) => void
  setUser: (payload: Partial<UserState>) => void
  reset: () => void
}

export const userStore = create(
  persist<UserState & UserActions>(
    (set) => ({
      token: "",
      bookId: "",
      userId: "",
      username: "",
      roles: [],
      permissions: [],
      setToken: (token) => set({ token }),
      setBookId: (bookId) => set({ bookId }),
      setUserId: (userId) => set({ userId }),
      setUsername: (username) => set({ username }),
      setRoles: (roles) => set({ roles }),
      setPermissions: (permissions) => set({ permissions }),
      setUser: (payload) => set((state) => ({ ...state, ...payload })),
      reset: () =>
        set({
          token: "",
          bookId: "",
          userId: "",
          username: "",
          roles: [],
          permissions: [],
        }),
    }),
    { name: "finances-session" },
  ),
)

export const useUser = userStore
