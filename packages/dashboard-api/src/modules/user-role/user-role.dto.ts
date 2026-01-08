import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { paginationDataSchema, paginationQuerySchema } from "@/types"

const shape = {
  id: z.number().int().positive().describe("ID"),
  userId: z.string().length(32).describe("用户ID"),
  roleId: z.number().int().positive().describe("角色ID"),
  username: z.string().describe("用户名"),
  roleName: z.string().describe("角色名"),
} satisfies z.ZodRawShape

const userRoleResponseSchema = z
  .object({
    id: shape.id,
    userId: shape.userId,
    roleId: shape.roleId,
    username: shape.username.nullable(),
    roleName: shape.roleName.nullable(),
  })
  .meta({ id: "用户角色关联响应类型" })

const createUserRoleSchema = z
  .object({
    userId: shape.userId,
    roleId: shape.roleId,
  })
  .meta({ id: "创建用户角色关联请求类型" })

const deleteUserRoleSchema = z
  .object({
    id: shape.id,
  })
  .meta({ id: "删除用户角色关联请求类型" })

const updateUserRoleSchema = z
  .object({
    id: shape.id,
    roleId: shape.roleId,
  })
  .meta({ id: "更新用户角色关联请求类型" })

const paginationUserRoleQuerySchema = paginationQuerySchema
  .extend({
    userId: shape.userId.optional(),
    roleId: shape.roleId.optional(),
  })
  .meta({ id: "分页查询用户角色关联" })

const paginationUserRoleResponseSchema = paginationDataSchema(userRoleResponseSchema)

export class UserRoleResponseDto extends createZodDto(userRoleResponseSchema) {}
export type UserRole = z.infer<typeof userRoleResponseSchema>
export type CreateUserRole = z.infer<typeof createUserRoleSchema>
export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>
export type UserRolePagination = z.infer<typeof paginationUserRoleResponseSchema>
export class PaginationUserRoleResponseDto extends createZodDto(paginationUserRoleResponseSchema) {}

export class CreateUserRoleDto extends createZodDto(createUserRoleSchema) {}
export class UpdateUserRoleDto extends createZodDto(updateUserRoleSchema) {}
export class DeleteUserRoleDto extends createZodDto(deleteUserRoleSchema) {}
export class PaginationUserRoleQueryDto extends createZodDto(paginationUserRoleQuerySchema) {}
export type PaginationUserRoleQuery = z.infer<typeof paginationUserRoleQuerySchema>
