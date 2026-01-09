import { Inject, Injectable } from "@nestjs/common"
import { and, asc, count, eq, SQL } from "drizzle-orm"
import { MYSQL_TOKEN } from "@/constants"

import { type MySqlDatabase, mysqlSchema } from "@/database"
import { BaseService } from "@/helper/base.service"
import { createPaginatedData, getPaginationOptions } from "@/helper/pagination"
import type {
  CreateUserRole,
  PaginationUserRoleQuery,
  UpdateUserRole,
  UserRole,
  UserRolePagination,
} from "./user-role.dto"

const { userRole: userRoleSchema, user: userSchema, role: roleSchema } = mysqlSchema

@Injectable()
export class UserRoleService extends BaseService {
  constructor(@Inject(MYSQL_TOKEN) db: MySqlDatabase) {
    super(db)
  }

  async find(id: number): Promise<UserRole | undefined> {
    const [result] = await this.db
      .select({
        id: userRoleSchema.id,
        userId: userRoleSchema.userId,
        roleId: userRoleSchema.roleId,
        username: userSchema.username,
        roleName: roleSchema.roleName,
      })
      .from(userRoleSchema)
      .leftJoin(userSchema, eq(userRoleSchema.userId, userSchema.userId))
      .leftJoin(roleSchema, eq(userRoleSchema.roleId, roleSchema.roleId))
      .where(eq(userRoleSchema.id, id))
    return result
  }

  async create(createUserRole: CreateUserRole): Promise<UserRole> {
    const [{ id }] = await this.db.insert(userRoleSchema).values(createUserRole).$returningId()
    return await this.find(id) as UserRole
  }

  async update(updateUserRole: UpdateUserRole): Promise<UserRole> {
    await this.db
      .update(userRoleSchema)
      .set({ roleId: updateUserRole.roleId })
      .where(eq(userRoleSchema.id, updateUserRole.id))
    return await this.find(updateUserRole.id) as UserRole
  }

  async delete(id: number): Promise<boolean> {
    await this.db
      .delete(userRoleSchema)
      .where(eq(userRoleSchema.id, id))
    return true
  }

  async list(params: PaginationUserRoleQuery): Promise<UserRolePagination> {
    const eqItems: SQL<unknown>[] = []
    if (params.userId) {
      eqItems.push(eq(userRoleSchema.userId, params.userId))
    }
    if (params.roleId) {
      eqItems.push(eq(userRoleSchema.roleId, params.roleId))
    }

    const counts = await this.db
      .select({ count: count() })
      .from(userRoleSchema)
      .where(and(...eqItems))
    const total = counts[0].count

    const { limit, offset, page, pageSize } = getPaginationOptions(params)
    const userRoles = await this.db
      .select({
        id: userRoleSchema.id,
        userId: userRoleSchema.userId,
        roleId: userRoleSchema.roleId,
        username: userSchema.username,
        roleName: roleSchema.roleName,
      })
      .from(userRoleSchema)
      .leftJoin(userSchema, eq(userRoleSchema.userId, userSchema.userId))
      .leftJoin(roleSchema, eq(userRoleSchema.roleId, roleSchema.roleId))
      .where(and(...eqItems))
      .limit(limit)
      .offset(offset)

    return createPaginatedData(userRoles, total, page, pageSize)
  }

  async findPrimaryRole(userId: string): Promise<{ roleId: number; roleName: string | null } | undefined> {
    const [result] = await this.db
      .select({
        roleId: userRoleSchema.roleId,
        roleName: roleSchema.roleName,
      })
      .from(userRoleSchema)
      .leftJoin(roleSchema, eq(userRoleSchema.roleId, roleSchema.roleId))
      .where(eq(userRoleSchema.userId, userId))
      .orderBy(asc(roleSchema.sort))
      .limit(1)
    return result
  }
}
