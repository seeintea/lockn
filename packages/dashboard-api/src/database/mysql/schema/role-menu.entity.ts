import { index, int, mysqlTable, primaryKey } from "drizzle-orm/mysql-core"
import { menu } from "./menu.entity"
import { role } from "./role.entity"

export const roleMenu = mysqlTable(
  "sys_role_menu",
  {
    roleId: int("role_id")
      .notNull()
      .references(() => role.roleId),
    menuId: int("menu_id")
      .notNull()
      .references(() => menu.menuId),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.menuId] }), index("idx_role_menu").on(table.menuId)],
)
