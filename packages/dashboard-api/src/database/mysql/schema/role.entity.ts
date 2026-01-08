import { datetime, int, mysqlTable, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core"

export const role = mysqlTable(
  "sys_role",
  {
    roleId: int("role_id").primaryKey().autoincrement(),
    roleName: varchar("role_name", { length: 30 }).notNull(),
    roleKey: varchar("role_key", { length: 100 }).notNull(),
    sort: int("sort").notNull(),
    remark: varchar("remark", { length: 500 }).default(""),
    isDisabled: tinyint("is_disabled").notNull(),
    isDeleted: tinyint("is_deleted").notNull(),
    createTime: datetime("create_time"),
    updateTime: datetime("update_time"),
  },
  (table) => [uniqueIndex("idx_role_key").on(table.roleKey)],
)
