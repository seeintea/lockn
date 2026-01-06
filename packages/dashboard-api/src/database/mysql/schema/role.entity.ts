import { datetime, int, mysqlTable, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core"

export const role = mysqlTable(
  "sys_role",
  {
    roleId: int("role_id").primaryKey().autoincrement(),
    roleName: varchar("role_name", { length: 30 }).notNull(),
    roleKey: varchar("role_key", { length: 100 }).notNull(),
    sort: int("sort").notNull(),
    roleStatus: tinyint("role_status").notNull(),
    createTime: datetime("create_time"),
    updateTime: datetime("update_time"),
    remark: varchar("remark", { length: 500 }).default(""),
  },
  (table) => [uniqueIndex("idx_role_key").on(table.roleKey)],
)
