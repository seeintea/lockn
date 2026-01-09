import { Inject, Injectable } from "@nestjs/common"
import { and, count, eq, SQL } from "drizzle-orm"
import { MYSQL_TOKEN } from "@/constants"
import { type MySqlDatabase, mysqlSchema } from "@/database"
import { BaseService } from "@/helper/base.service"
import { createPaginatedData, getPaginationOptions } from "@/helper/pagination"
import type {
  CreateRoleMenu,
  PaginationRoleMenuQuery,
  RoleMenu,
  RoleMenuPagination,
  UpdateRoleMenu,
} from "./role-menu.dto"

const { roleMenu: roleMenuSchema, role: roleSchema, menu: menuSchema } = mysqlSchema

@Injectable()
export class RoleMenuService extends BaseService {
  constructor(@Inject(MYSQL_TOKEN) db: MySqlDatabase) {
    super(db)
  }

  async find(id: number): Promise<RoleMenu | undefined> {
    const [result] = await this.db
      .select({
        id: roleMenuSchema.id,
        roleId: roleMenuSchema.roleId,
        menuId: roleMenuSchema.menuId,
        roleName: roleSchema.roleName,
        menuName: menuSchema.menuName,
        menuType: menuSchema.menuType,
      })
      .from(roleMenuSchema)
      .leftJoin(roleSchema, eq(roleMenuSchema.roleId, roleSchema.roleId))
      .leftJoin(menuSchema, eq(roleMenuSchema.menuId, menuSchema.menuId))
      .where(eq(roleMenuSchema.id, id))
    return result
  }

  async create(createRoleMenu: CreateRoleMenu): Promise<RoleMenu> {
    const [{ id }] = await this.db.insert(roleMenuSchema).values(createRoleMenu).$returningId()
    return (await this.find(id)) as RoleMenu
  }

  async update(updateRoleMenu: UpdateRoleMenu): Promise<RoleMenu> {
    const next: { roleId?: number; menuId?: number } = {}
    if (updateRoleMenu.roleId !== undefined) next.roleId = updateRoleMenu.roleId
    if (updateRoleMenu.menuId !== undefined) next.menuId = updateRoleMenu.menuId

    await this.db.update(roleMenuSchema).set(next).where(eq(roleMenuSchema.id, updateRoleMenu.id))
    return (await this.find(updateRoleMenu.id)) as RoleMenu
  }

  async delete(id: number): Promise<boolean> {
    await this.db.delete(roleMenuSchema).where(eq(roleMenuSchema.id, id))
    return true
  }

  async list(params: PaginationRoleMenuQuery): Promise<RoleMenuPagination> {
    const eqItems: SQL<unknown>[] = []
    if (params.roleId) {
      eqItems.push(eq(roleMenuSchema.roleId, params.roleId))
    }
    if (params.menuId) {
      eqItems.push(eq(roleMenuSchema.menuId, params.menuId))
    }

    const counts = await this.db
      .select({ count: count() })
      .from(roleMenuSchema)
      .where(and(...eqItems))
    const total = counts[0].count

    const { limit, offset, page, pageSize } = getPaginationOptions(params)
    const roleMenus = await this.db
      .select({
        id: roleMenuSchema.id,
        roleId: roleMenuSchema.roleId,
        menuId: roleMenuSchema.menuId,
        roleName: roleSchema.roleName,
        menuName: menuSchema.menuName,
        menuType: menuSchema.menuType,
      })
      .from(roleMenuSchema)
      .leftJoin(roleSchema, eq(roleMenuSchema.roleId, roleSchema.roleId))
      .leftJoin(menuSchema, eq(roleMenuSchema.menuId, menuSchema.menuId))
      .where(and(...eqItems))
      .limit(limit)
      .offset(offset)

    return createPaginatedData(roleMenus, total, page, pageSize)
  }

  async listMenuIdsByRoleId(roleId: number): Promise<number[]> {
    const rows = await this.db
      .select({ menuId: roleMenuSchema.menuId })
      .from(roleMenuSchema)
      .where(eq(roleMenuSchema.roleId, roleId))
    return rows.map((r) => r.menuId)
  }
}
