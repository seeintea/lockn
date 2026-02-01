import type { PageQuery, PageResult } from "@/types/api"
import { api } from "../client"

export type Permission = {
  permissionId: string
  code: string
  name: string
  module: string
  isDisabled: boolean
  isDeleted: boolean
  createTime: string
  updateTime: string
}

export type CreatePermission = {
  code: string
  name?: string
  module?: string
  isDisabled?: boolean
}

export type UpdatePermission = {
  permissionId: string
  code?: string
  name?: string
  module?: string
  isDisabled?: boolean
  isDeleted?: boolean
}

export type PermissionListQuery = PageQuery & {
  code?: string
  module?: string
}

export const createPermission = (body: CreatePermission) => api.post<Permission>("/api/sys/permission/create", body)

export const findPermission = (permissionId: string) =>
  api.get<Permission>("/api/sys/permission/find", { permissionId })

export const listPermissions = (query?: PermissionListQuery) =>
  api.get<PageResult<Permission>>("/api/sys/permission/list", query)

export const updatePermission = (body: UpdatePermission) => api.post<Permission>("/api/sys/permission/update", body)

export const deletePermission = (permissionId: string) =>
  api.post<boolean>("/api/sys/permission/delete", { permissionId })
