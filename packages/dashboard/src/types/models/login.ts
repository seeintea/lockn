export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  userId: string
  username: string
  accessToken: string
}
