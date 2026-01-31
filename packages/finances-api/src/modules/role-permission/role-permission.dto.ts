import { createZodDto } from "nestjs-zod"
import { z } from "zod"

const shape = {
  roleId: z.string().length(32).describe("角色ID"),
  permissionId: z.string().length(32).describe("权限ID"),
  createTime: z.date().describe("创建时间"),
} satisfies z.ZodRawShape

const rolePermissionResponseSchema = z
  .object({
    roleId: shape.roleId,
    permissionId: shape.permissionId,
    createTime: shape.createTime,
  })
  .meta({ id: "角色权限关联响应类型" })

const createRolePermissionSchema = z
  .object({
    roleId: shape.roleId,
    permissionId: shape.permissionId,
  })
  .meta({ id: "创建角色权限关联请求" })

const deleteRolePermissionSchema = z
  .object({
    roleId: shape.roleId,
    permissionId: shape.permissionId,
  })
  .meta({ id: "删除角色权限关联请求" })

const rolePermissionListQuerySchema = z
  .object({
    roleId: shape.roleId.optional(),
    permissionId: shape.permissionId.optional(),
  })
  .meta({ id: "查询角色权限关联列表请求" })

export class RolePermissionResponseDto extends createZodDto(rolePermissionResponseSchema) {}
export class CreateRolePermissionDto extends createZodDto(createRolePermissionSchema) {}
export class DeleteRolePermissionDto extends createZodDto(deleteRolePermissionSchema) {}
export class RolePermissionListQueryDto extends createZodDto(rolePermissionListQuerySchema) {}

export type RolePermission = z.infer<typeof rolePermissionResponseSchema>
export type CreateRolePermission = z.infer<typeof createRolePermissionSchema>
