import { menu } from "./menu.entity"
import { role } from "./role.entity"
import { roleMenu } from "./role-menu.entity"
import { user } from "./user.entity"
import { userRole } from "./user-role.entity"
export const schema = {
  user,
  role,
  menu,
  roleMenu,
  userRole,
}

export type Schema = typeof schema
export type SchemaName = keyof Schema
