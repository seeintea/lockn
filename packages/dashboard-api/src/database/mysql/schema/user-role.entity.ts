import { index, int, mysqlTable, unique, varchar } from "drizzle-orm/mysql-core"
import { role } from "./role.entity"
import { user } from "./user.entity"

export const userRole = mysqlTable(
  "sys_user_role",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("user_id", { length: 32 })
      .notNull()
      .references(() => user.userId),
    roleId: int("role_id")
      .notNull()
      .references(() => role.roleId),
  },
  (table) => [unique("uk_user_role").on(table.userId, table.roleId), index("idx_user_role").on(table.roleId)],
)
