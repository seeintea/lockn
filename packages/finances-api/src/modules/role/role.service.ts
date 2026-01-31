import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq, like } from "drizzle-orm"
import { PgService, pgSchema } from "@/database/postgresql"
import type { CreateRole, Role, UpdateRole } from "./role.dto"

const { role: roleSchema } = pgSchema

@Injectable()
export class RoleService {
  constructor(private readonly pg: PgService) {}

  async find(roleId: string): Promise<Role> {
    const roles = await this.pg.pdb
      .select({
        roleId: roleSchema.roleId,
        roleCode: roleSchema.roleCode,
        roleName: roleSchema.roleName,
        isDisabled: roleSchema.isDisabled,
        isDeleted: roleSchema.isDeleted,
        createTime: roleSchema.createTime,
        updateTime: roleSchema.updateTime,
      })
      .from(roleSchema)
      .where(and(eq(roleSchema.roleId, roleId), eq(roleSchema.isDeleted, false)))
    const role = roles[0]
    if (!role) throw new NotFoundException("角色不存在")
    return role
  }

  async create(values: CreateRole & { roleId: string }): Promise<Role> {
    await this.pg.pdb.insert(roleSchema).values({
      roleId: values.roleId,
      roleCode: values.roleCode,
      roleName: values.roleName,
      isDisabled: values.isDisabled ?? false,
      isDeleted: false,
    })
    return this.find(values.roleId)
  }

  async update(values: UpdateRole): Promise<Role> {
    await this.pg.pdb
      .update(roleSchema)
      .set({
        ...(values.roleCode !== undefined ? { roleCode: values.roleCode } : {}),
        ...(values.roleName !== undefined ? { roleName: values.roleName } : {}),
        ...(values.isDisabled !== undefined ? { isDisabled: values.isDisabled } : {}),
        ...(values.isDeleted !== undefined ? { isDeleted: values.isDeleted } : {}),
      })
      .where(eq(roleSchema.roleId, values.roleId))
    return this.find(values.roleId)
  }

  async delete(roleId: string): Promise<boolean> {
    await this.pg.pdb.update(roleSchema).set({ isDeleted: true }).where(eq(roleSchema.roleId, roleId))
    return true
  }

  async list(query: { roleCode?: string; roleName?: string }): Promise<Role[]> {
    const where: Parameters<typeof and> = [eq(roleSchema.isDeleted, false)]
    if (query.roleCode) where.push(like(roleSchema.roleCode, `%${query.roleCode}%`))
    if (query.roleName) where.push(like(roleSchema.roleName, `%${query.roleName}%`))

    return this.pg.pdb
      .select({
        roleId: roleSchema.roleId,
        roleCode: roleSchema.roleCode,
        roleName: roleSchema.roleName,
        isDisabled: roleSchema.isDisabled,
        isDeleted: roleSchema.isDeleted,
        createTime: roleSchema.createTime,
        updateTime: roleSchema.updateTime,
      })
      .from(roleSchema)
      .where(and(...where))
  }
}

