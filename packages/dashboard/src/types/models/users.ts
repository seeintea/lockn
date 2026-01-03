import type { PaginationData } from "../common"

export interface UserModel {
  userId: string
  username: string
  email: string
  phone: string
  isDeleted: number
  isDisabled: number
}

export interface UserListParams {
  page: number
  pageSize: number
  userId?: string
  username?: string
}

export type UserListResponse = PaginationData<UserModel>
