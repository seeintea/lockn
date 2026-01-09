import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { paginationDataSchema, paginationQuerySchema } from "@/types"

const shape = {
  id: z.number().int().positive().describe("ID"),
  roleId: z.number().int().positive().describe("角色ID"),
  menuId: z.number().int().positive().describe("菜单ID"),
  roleName: z.string().describe("角色名"),
  menuName: z.string().describe("菜单名称"),
  menuType: z.string().max(1).describe("菜单类型"),
} satisfies z.ZodRawShape

const roleMenuResponseSchema = z
  .object({
    id: shape.id,
    roleId: shape.roleId,
    menuId: shape.menuId,
    roleName: shape.roleName.nullable(),
    menuName: shape.menuName.nullable(),
    menuType: shape.menuType.nullable(),
  })
  .meta({ id: "角色菜单关联响应类型" })

const createRoleMenuSchema = z
  .object({
    roleId: shape.roleId,
    menuId: shape.menuId,
  })
  .meta({ id: "创建角色菜单关联请求类型" })

const deleteRoleMenuSchema = z
  .object({
    id: shape.id,
  })
  .meta({ id: "删除角色菜单关联请求类型" })

const updateRoleMenuSchema = z
  .object({
    id: shape.id,
    roleId: shape.roleId.optional(),
    menuId: shape.menuId.optional(),
  })
  .refine((v) => v.roleId !== undefined || v.menuId !== undefined, {
    message: "roleId 和 menuId 至少提供一个",
  })
  .meta({ id: "更新角色菜单关联请求类型" })

const paginationRoleMenuQuerySchema = paginationQuerySchema
  .extend({
    roleId: shape.roleId.optional(),
    menuId: shape.menuId.optional(),
  })
  .meta({ id: "分页查询角色菜单关联" })

const paginationRoleMenuResponseSchema = paginationDataSchema(roleMenuResponseSchema)

export class RoleMenuResponseDto extends createZodDto(roleMenuResponseSchema) {}
export type RoleMenu = z.infer<typeof roleMenuResponseSchema>
export type CreateRoleMenu = z.infer<typeof createRoleMenuSchema>
export type UpdateRoleMenu = z.infer<typeof updateRoleMenuSchema>
export type RoleMenuPagination = z.infer<typeof paginationRoleMenuResponseSchema>
export class PaginationRoleMenuResponseDto extends createZodDto(paginationRoleMenuResponseSchema) {}

export class CreateRoleMenuDto extends createZodDto(createRoleMenuSchema) {}
export class UpdateRoleMenuDto extends createZodDto(updateRoleMenuSchema) {}
export class DeleteRoleMenuDto extends createZodDto(deleteRoleMenuSchema) {}
export class PaginationRoleMenuQueryDto extends createZodDto(paginationRoleMenuQuerySchema) {}
export type PaginationRoleMenuQuery = z.infer<typeof paginationRoleMenuQuerySchema>

