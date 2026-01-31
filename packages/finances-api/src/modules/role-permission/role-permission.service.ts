import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq } from "drizzle-orm"
import { PgService, pgSchema } from "@/database/postgresql"
import type { CreateRolePermission, RolePermission } from "./role-permission.dto"

const { rolePermission: rolePermissionSchema } = pgSchema

@Injectable()
export class RolePermissionService {
  constructor(private readonly pg: PgService) {}

  async find(roleId: string, permissionId: string): Promise<RolePermission> {
    const rows = await this.pg.pdb
      .select({
        roleId: rolePermissionSchema.roleId,
        permissionId: rolePermissionSchema.permissionId,
        createTime: rolePermissionSchema.createTime,
      })
      .from(rolePermissionSchema)
      .where(and(eq(rolePermissionSchema.roleId, roleId), eq(rolePermissionSchema.permissionId, permissionId)))
    const row = rows[0]
    if (!row) throw new NotFoundException("角色权限关联不存在")
    return row
  }

  async create(values: CreateRolePermission): Promise<RolePermission> {
    await this.pg.pdb.insert(rolePermissionSchema).values({
      roleId: values.roleId,
      permissionId: values.permissionId,
    })
    return this.find(values.roleId, values.permissionId)
  }

  async delete(roleId: string, permissionId: string): Promise<boolean> {
    await this.pg.pdb
      .delete(rolePermissionSchema)
      .where(and(eq(rolePermissionSchema.roleId, roleId), eq(rolePermissionSchema.permissionId, permissionId)))
    return true
  }

  async list(query: { roleId?: string; permissionId?: string }): Promise<RolePermission[]> {
    const where: Parameters<typeof and> = []
    if (query.roleId) where.push(eq(rolePermissionSchema.roleId, query.roleId))
    if (query.permissionId) where.push(eq(rolePermissionSchema.permissionId, query.permissionId))

    const qb = this.pg.pdb
      .select({
        roleId: rolePermissionSchema.roleId,
        permissionId: rolePermissionSchema.permissionId,
        createTime: rolePermissionSchema.createTime,
      })
      .from(rolePermissionSchema)
    if (where.length) {
      qb.where(and(...where))
    }
    return qb
  }
}
