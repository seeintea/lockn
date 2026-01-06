import { datetime, int, mysqlTable, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core"

export const menu = mysqlTable(
  "sys_menu",
  {
    menuId: int("menu_id").primaryKey().autoincrement(),
    menuName: varchar("menu_name", { length: 50 }).notNull(),
    parentId: int("parent_id").default(0),
    sort: tinyint("sort").default(0),
    path: varchar("path", { length: 200 }).default(""),
    menuType: varchar("menu_type", { length: 1 }).default(""),
    perms: varchar("perms", { length: 100 }).default(""),
    menuStatus: tinyint("menu_status").default(0),
    createTime: datetime("create_time"),
  },
  (table) => [uniqueIndex("idx_parent_id").on(table.parentId)],
)
