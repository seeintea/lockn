import { Inject, Injectable } from "@nestjs/common"
import { and, count, eq, SQL } from "drizzle-orm"
import { MYSQL_TOKEN } from "@/constants"

import { type MySqlDatabase, mysqlSchema } from "@/database"
import { BaseService } from "@/helper/base.service"
import { createPaginatedData, getPaginationOptions } from "@/helper/pagination"
import type { CreateRole, PaginationRoleQuery, Role, RolePagination, UpdateRole } from "./role.dto"

const { role: roleSchema } = mysqlSchema

@Injectable()
export class RoleService extends BaseService {
  constructor(@Inject(MYSQL_TOKEN) db: MySqlDatabase) {
    super(db)
  }

  async find(roleId: Role["roleId"]): Promise<Role> {
    const roles = await this.db
      .select({
        roleId: roleSchema.roleId,
        roleName: roleSchema.roleName,
        roleKey: roleSchema.roleKey,
        sort: roleSchema.sort,
        remark: roleSchema.remark,
        isDisabled: roleSchema.isDisabled,
        isDeleted: roleSchema.isDeleted,
      })
      .from(roleSchema)
      .where(eq(roleSchema.roleId, roleId))
    return roles[0]
  }

  async create(createRole: CreateRole): Promise<Role> {
    const [{ roleId }] = await this.db.insert(roleSchema).values(createRole).$returningId()
    return await this.find(roleId)
  }

  async update(updateRole: UpdateRole): Promise<Role> {
    await this.db.update(roleSchema).set(updateRole).where(eq(roleSchema.roleId, updateRole.roleId))
    return await this.find(updateRole.roleId)
  }

  async list(params: PaginationRoleQuery): Promise<RolePagination> {
    const eqItems: SQL<unknown>[] = [eq(roleSchema.isDeleted, 0)]
    if (params.roleName) {
      eqItems.push(eq(roleSchema.roleName, params.roleName))
    }
    const counts = await this.db
      .select({ count: count() })
      .from(roleSchema)
      .where(and(...eqItems))
    const total = counts[0].count

    const { limit, offset, page, pageSize } = getPaginationOptions(params)
    const roles = await this.db
      .select({
        roleId: roleSchema.roleId,
        roleName: roleSchema.roleName,
        roleKey: roleSchema.roleKey,
        sort: roleSchema.sort,
        remark: roleSchema.remark,
        isDisabled: roleSchema.isDisabled,
        isDeleted: roleSchema.isDeleted,
      })
      .from(roleSchema)
      .where(and(...eqItems))
      .limit(limit)
      .offset(offset)

    return createPaginatedData(roles, total, page, pageSize)
  }
}
