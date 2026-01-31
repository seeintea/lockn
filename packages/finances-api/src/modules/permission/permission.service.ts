import { Injectable, NotFoundException } from "@nestjs/common"
import { and, eq, like } from "drizzle-orm"
import { PgService, pgSchema } from "@/database/postgresql"
import type { CreatePermission, Permission, UpdatePermission } from "./permission.dto"

const { permission: permissionSchema } = pgSchema

@Injectable()
export class PermissionService {
  constructor(private readonly pg: PgService) {}

  async find(permissionId: string): Promise<Permission> {
    const permissions = await this.pg.pdb
      .select({
        permissionId: permissionSchema.permissionId,
        code: permissionSchema.code,
        name: permissionSchema.name,
        module: permissionSchema.module,
        isDisabled: permissionSchema.isDisabled,
        isDeleted: permissionSchema.isDeleted,
        createTime: permissionSchema.createTime,
        updateTime: permissionSchema.updateTime,
      })
      .from(permissionSchema)
      .where(and(eq(permissionSchema.permissionId, permissionId), eq(permissionSchema.isDeleted, false)))
    const permission = permissions[0]
    if (!permission) throw new NotFoundException("权限不存在")
    return permission
  }

  async create(values: CreatePermission & { permissionId: string }): Promise<Permission> {
    await this.pg.pdb.insert(permissionSchema).values({
      permissionId: values.permissionId,
      code: values.code,
      name: values.name ?? "",
      module: values.module ?? "",
      isDisabled: values.isDisabled ?? false,
      isDeleted: false,
    })
    return this.find(values.permissionId)
  }

  async update(values: UpdatePermission): Promise<Permission> {
    await this.pg.pdb
      .update(permissionSchema)
      .set({
        ...(values.code !== undefined ? { code: values.code } : {}),
        ...(values.name !== undefined ? { name: values.name } : {}),
        ...(values.module !== undefined ? { module: values.module } : {}),
        ...(values.isDisabled !== undefined ? { isDisabled: values.isDisabled } : {}),
        ...(values.isDeleted !== undefined ? { isDeleted: values.isDeleted } : {}),
      })
      .where(eq(permissionSchema.permissionId, values.permissionId))
    return this.find(values.permissionId)
  }

  async delete(permissionId: string): Promise<boolean> {
    await this.pg.pdb
      .update(permissionSchema)
      .set({ isDeleted: true })
      .where(eq(permissionSchema.permissionId, permissionId))
    return true
  }

  async list(query: { code?: string; module?: string }): Promise<Permission[]> {
    const where: Parameters<typeof and> = [eq(permissionSchema.isDeleted, false)]
    if (query.code) where.push(like(permissionSchema.code, `%${query.code}%`))
    if (query.module) where.push(eq(permissionSchema.module, query.module))

    return this.pg.pdb
      .select({
        permissionId: permissionSchema.permissionId,
        code: permissionSchema.code,
        name: permissionSchema.name,
        module: permissionSchema.module,
        isDisabled: permissionSchema.isDisabled,
        isDeleted: permissionSchema.isDeleted,
        createTime: permissionSchema.createTime,
        updateTime: permissionSchema.updateTime,
      })
      .from(permissionSchema)
      .where(and(...where))
  }
}

