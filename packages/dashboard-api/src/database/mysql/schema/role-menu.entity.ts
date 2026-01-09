import { index, int, mysqlTable, unique } from "drizzle-orm/mysql-core"
import { menu } from "./menu.entity"
import { role } from "./role.entity"

export const roleMenu = mysqlTable(
  "sys_role_menu",
  {
    id: int("id").autoincrement().primaryKey(),
    roleId: int("role_id")
      .notNull()
      .references(() => role.roleId),
    menuId: int("menu_id")
      .notNull()
      .references(() => menu.menuId),
  },
  (table) => [unique("uk_user_menu").on(table.roleId, table.menuId), index("idx_role_menu").on(table.menuId)],
)
