import { api } from "@/utils/request"

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  userId: string
  username: string
  accessToken: string
}

export const login = (params: LoginParams) => api.post<LoginResponse>("/sys/auth/login", params)
