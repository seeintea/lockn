import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { paginationDataSchema, paginationQuerySchema } from "@/types"

const shape = {
  menuId: z.number().int().positive().describe("菜单ID"),
  menuName: z.string().min(1).max(50).describe("菜单名称"),
  parentId: z.number().int().min(0).describe("父菜单ID"),
  sort: z.number().int().min(0).max(255).describe("排序"),
  path: z.string().max(200).describe("路由地址"),
  menuType: z.string().max(1).describe("菜单类型"),
  perms: z.string().max(100).describe("权限标识"),
  menuStatus: z.number().int().min(0).max(1).describe("菜单状态"),
  isDisabled: z.number().int().min(0).max(1).describe("是否禁用"),
  isDeleted: z.number().int().min(0).max(1).describe("是否删除"),
  updateTime: z.iso.datetime().describe("更新时间"),
  createTime: z.iso.datetime().describe("创建时间"),
} satisfies z.ZodRawShape

const menuResponseSchema = z
  .object({
    menuId: shape.menuId,
    menuName: shape.menuName,
    parentId: shape.parentId.nullable(),
    sort: shape.sort.nullable(),
    path: shape.path.nullable(),
    menuType: shape.menuType.nullable(),
    perms: shape.perms.nullable(),
    menuStatus: shape.menuStatus.nullable(),
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
  })
  .meta({ id: "菜单响应类型" })

const createMenuServiceSchema = z
  .object({
    menuName: shape.menuName,
    parentId: shape.parentId.default(0),
    sort: shape.sort.default(0),
    path: shape.path.default(""),
    menuType: shape.menuType.default(""),
    perms: shape.perms.default(""),
    menuStatus: shape.menuStatus.default(0),
    isDisabled: shape.isDisabled,
    isDeleted: shape.isDeleted,
    createTime: z.date().optional(),
    updateTime: z.date().optional(),
  })
  .meta({ id: "创建菜单Service类型" })

const updateMenuServiceSchema = z
  .object(shape)
  .omit({
    createTime: true,
    updateTime: true,
  })
  .partial()
  .required({
    menuId: true,
  })
  .meta({ id: "更新菜单请求类型" })

const paginationMenuResponseSchema = paginationDataSchema(menuResponseSchema)

export class MenuResponseDto extends createZodDto(menuResponseSchema) {}
export class UpdateMenuDto extends createZodDto(updateMenuServiceSchema) {}
export type Menu = z.infer<typeof menuResponseSchema>
export type CreateMenu = z.infer<typeof createMenuServiceSchema>
export type UpdateMenu = z.infer<typeof updateMenuServiceSchema>
export type MenuPagination = z.infer<typeof paginationMenuResponseSchema>
export class PaginationMenuResponseDto extends createZodDto(paginationMenuResponseSchema) {}

const createMenuSchema = z
  .object({
    menuName: shape.menuName,
    parentId: shape.parentId.default(0),
    sort: shape.sort.default(0),
    path: shape.path.default(""),
    menuType: shape.menuType.default(""),
    perms: shape.perms.default(""),
    menuStatus: shape.menuStatus.default(0),
  })
  .meta({ id: "创建菜单请求类型" })

const deleteMenuSchema = z
  .object({
    menuId: shape.menuId,
  })
  .meta({ id: "删除菜单请求类型" })

const paginationMenuQuerySchema = paginationQuerySchema
  .extend({
    menuName: shape.menuName.optional(),
    menuType: shape.menuType.optional(),
    menuStatus: shape.menuStatus.optional(),
    parentId: shape.parentId.optional(),
  })
  .meta({ id: "分页查询菜单" })

export type PaginationMenuQuery = z.infer<typeof paginationMenuQuerySchema>
export class CreateMenuDto extends createZodDto(createMenuSchema) {}
export class DeleteMenuDto extends createZodDto(deleteMenuSchema) {}
export class PaginationMenuQueryDto extends createZodDto(paginationMenuQuerySchema) {}

const menuTreeButtonSchema = menuResponseSchema.meta({ id: "按钮节点" })

const menuTreeRouteSchema = menuResponseSchema
  .extend({
    buttons: z.array(menuTreeButtonSchema).default([]),
  })
  .meta({ id: "路由节点" })

const menuTreeDirectorySchema = menuResponseSchema
  .extend({
    children: z.array(menuTreeRouteSchema).default([]),
  })
  .meta({ id: "目录节点" })

const menuTreeRootSchema = z
  .object({
    menuId: z.number().int().min(0).describe("根节点ID"),
    menuName: z.string().min(1).describe("根节点名称"),
    children: z.array(menuTreeDirectorySchema).default([]),
  })
  .meta({ id: "菜单树" })

export class MenuTreeResponseDto extends createZodDto(menuTreeRootSchema) {}
