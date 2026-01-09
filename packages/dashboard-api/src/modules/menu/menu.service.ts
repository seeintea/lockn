import { Inject, Injectable } from "@nestjs/common"
import { and, count, eq, like, SQL } from "drizzle-orm"
import { MYSQL_TOKEN } from "@/constants"
import { type MySqlDatabase, mysqlSchema } from "@/database"
import { BaseService } from "@/helper/base.service"
import { createPaginatedData, getPaginationOptions } from "@/helper/pagination"
import type { CreateMenu, Menu, MenuPagination, PaginationMenuQuery, UpdateMenu } from "./menu.dto"

const { menu: menuSchema } = mysqlSchema

@Injectable()
export class MenuService extends BaseService {
  constructor(@Inject(MYSQL_TOKEN) db: MySqlDatabase) {
    super(db)
  }

  async find(menuId: Menu["menuId"]): Promise<Menu> {
    const menus = await this.db
      .select({
        menuId: menuSchema.menuId,
        menuName: menuSchema.menuName,
        parentId: menuSchema.parentId,
        sort: menuSchema.sort,
        path: menuSchema.path,
        menuType: menuSchema.menuType,
        perms: menuSchema.perms,
        menuStatus: menuSchema.menuStatus,
        isDisabled: menuSchema.isDisabled,
        isDeleted: menuSchema.isDeleted,
      })
      .from(menuSchema)
      .where(eq(menuSchema.menuId, menuId))
    return menus[0]
  }

  async create(createMenu: CreateMenu): Promise<Menu> {
    const [{ menuId }] = await this.db
      .insert(menuSchema)
      .values({
        ...createMenu,
        createTime: new Date(),
        updateTime: new Date(),
      })
      .$returningId()
    return await this.find(menuId)
  }

  async update(updateMenu: UpdateMenu): Promise<Menu> {
    await this.db
      .update(menuSchema)
      .set({
        ...updateMenu,
        updateTime: new Date(),
      })
      .where(eq(menuSchema.menuId, updateMenu.menuId))
    return await this.find(updateMenu.menuId)
  }

  async delete(menuId: Menu["menuId"]): Promise<boolean> {
    await this.db
      .update(menuSchema)
      .set({
        isDeleted: 1,
        updateTime: new Date(),
      })
      .where(eq(menuSchema.menuId, menuId))
    return true
  }

  async list(params: PaginationMenuQuery): Promise<MenuPagination> {
    const eqItems: SQL<unknown>[] = [eq(menuSchema.isDeleted, 0)]
    if (params.menuName) {
      eqItems.push(like(menuSchema.menuName, `%${params.menuName}%`))
    }
    if (params.menuType) {
      eqItems.push(eq(menuSchema.menuType, params.menuType))
    }
    if (params.menuStatus !== undefined) {
      eqItems.push(eq(menuSchema.menuStatus, params.menuStatus))
    }
    if (params.parentId !== undefined) {
      eqItems.push(eq(menuSchema.parentId, params.parentId))
    }

    const counts = await this.db
      .select({ count: count() })
      .from(menuSchema)
      .where(and(...eqItems))
    const total = counts[0].count

    const { limit, offset, page, pageSize } = getPaginationOptions(params)
    const menus = await this.db
      .select({
        menuId: menuSchema.menuId,
        menuName: menuSchema.menuName,
        parentId: menuSchema.parentId,
        sort: menuSchema.sort,
        path: menuSchema.path,
        menuType: menuSchema.menuType,
        perms: menuSchema.perms,
        menuStatus: menuSchema.menuStatus,
        isDisabled: menuSchema.isDisabled,
        isDeleted: menuSchema.isDeleted,
      })
      .from(menuSchema)
      .where(and(...eqItems))
      .limit(limit)
      .offset(offset)

    return createPaginatedData(menus, total, page, pageSize)
  }

  async tree() {
    const menus = await this.db
      .select({
        menuId: menuSchema.menuId,
        menuName: menuSchema.menuName,
        parentId: menuSchema.parentId,
        sort: menuSchema.sort,
        path: menuSchema.path,
        menuType: menuSchema.menuType,
        perms: menuSchema.perms,
        menuStatus: menuSchema.menuStatus,
        isDisabled: menuSchema.isDisabled,
        isDeleted: menuSchema.isDeleted,
      })
      .from(menuSchema)
      .where(eq(menuSchema.isDeleted, 0))

    const ms = menus.filter((m) => m.menuType === "M")
    const rs = menus.filter((m) => m.menuType === "R")
    const bs = menus.filter((m) => m.menuType === "B")

    const routesByParentId = new Map<number, typeof rs>()
    for (const r of rs) {
      const parentId = r.parentId ?? 0
      const current = routesByParentId.get(parentId) ?? []
      current.push(r)
      routesByParentId.set(parentId, current)
    }

    const buttonsByParentId = new Map<number, typeof bs>()
    for (const b of bs) {
      const parentId = b.parentId ?? 0
      const current = buttonsByParentId.get(parentId) ?? []
      current.push(b)
      buttonsByParentId.set(parentId, current)
    }

    const bySort = (a: { sort: number | null }, b: { sort: number | null }) => (a.sort ?? 0) - (b.sort ?? 0)

    const directories = ms
      .slice()
      .sort(bySort)
      .map((dir) => {
        const routes = (routesByParentId.get(dir.menuId) ?? []).slice().sort(bySort)
        const routesWithButtons = routes.map((route) => {
          const buttons = (buttonsByParentId.get(route.menuId) ?? []).slice().sort(bySort)
          return { ...route, buttons }
        })
        return { ...dir, children: routesWithButtons }
      })

    return {
      menuId: 0,
      menuName: "root",
      children: directories,
    }
  }
}
