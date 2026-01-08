import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { paginationDataSchema, paginationQuerySchema } from "@/types"

const shape = {
  roleId: z.number().int().positive().describe("角色ID"),
  roleName: z.string().min(1).max(30).describe("角色名称"),
  roleKey: z.string().min(1).max(100).describe("角色键值"),
  sort: z.number().int().positive().describe("排序"),
  remark: z.string().min(0).max(500).describe("备注"),
  isDisabled: z.number().int().min(0).max(1).describe("是否禁用"),
  isDeleted: z.number().int().min(0).max(1).describe("是否删除"),
  updateTime: z.iso.datetime().describe("更新时间"),
  createTime: z.iso.datetime().describe("创建时间"),
} satisfies z.ZodRawShape

const roleResponseSchema = z
  .object({
    roleId: shape.roleId,
    roleName: shape.roleName,
    roleKey: shape.roleKey,
    sort: shape.sort,
    remark: shape.remark.nullable(),
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
  })
  .meta({ id: "角色响应类型" })

const createRoleServiceSchema = z
  .object({
    roleName: shape.roleName,
    roleKey: shape.roleKey,
    sort: shape.sort,
    remark: shape.remark.nullable(),
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
  })
  .meta({ id: "创建角色Service类型" })

const updateRoleServiceSchema = z
  .object(shape)
  .omit({
    createTime: true,
    updateTime: true,
  })
  .partial()
  .required({
    roleId: true,
  })
  .meta({ id: "更新角色请求类型" })

const paginationRoleResponseSchema = paginationDataSchema(roleResponseSchema)

export class RoleResponseDto extends createZodDto(roleResponseSchema) {}
export class UpdateRoleDto extends createZodDto(updateRoleServiceSchema) {}
export type Role = z.infer<typeof roleResponseSchema>
export type CreateRole = z.infer<typeof createRoleServiceSchema>
export type UpdateRole = z.infer<typeof updateRoleServiceSchema>
export type RolePagination = z.infer<typeof paginationRoleResponseSchema>
export class PaginationRoleResponseDto extends createZodDto(paginationRoleResponseSchema) {}

const createRoleSchema = z
  .object({
    roleName: shape.roleName,
    roleKey: shape.roleKey,
    sort: shape.sort,
    remark: shape.remark.nullable(),
  })
  .meta({ id: "创建角色请求类型" })

const enableRoleSchema = z
  .object({
    roleId: shape.roleId,
    enable: z.boolean().describe("是否启用"),
  })
  .meta({ id: "启用角色请求类型" })

const deleteRoleSchema = z
  .object({
    roleId: shape.roleId,
  })
  .meta({ id: "删除角色请求类型" })

const paginationRoleQuerySchema = paginationQuerySchema
  .extend({
    roleName: shape.roleName.optional(),
  })
  .meta({ id: "分页查询角色" })

export type PaginationRoleQuery = z.infer<typeof paginationRoleQuerySchema>
export class CreateRoleDto extends createZodDto(createRoleSchema) {}
export class EnableRoleDto extends createZodDto(enableRoleSchema) {}
export class DeleteRoleDto extends createZodDto(deleteRoleSchema) {}
export class PaginationRoleQueryDto extends createZodDto(paginationRoleQuerySchema) {}
