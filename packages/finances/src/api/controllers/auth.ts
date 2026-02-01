import { api } from "../client"

export type LoginParams = {
  username: string
  password: string
}

export type LoginResponse = {
  userId: string
  username: string
  accessToken: string
}

export const login = (params: LoginParams) => api.post<LoginResponse>("/api/sys/auth/login", params)

export const logout = () => api.post<boolean>("/api/sys/auth/logout")

