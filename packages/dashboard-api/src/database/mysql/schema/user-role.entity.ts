import { index, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { role } from "./role.entity"
import { user } from "./user.entity"

export const userRole = mysqlTable(
  "sys_user_role",
  {
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => user.userId),
    roleId: int("role_id")
      .notNull()
      .references(() => role.roleId),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] }), index("idx_user_role").on(table.roleId)],
)
