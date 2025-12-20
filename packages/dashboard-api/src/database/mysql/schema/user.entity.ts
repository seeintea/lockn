import { bigint, datetime, index, mysqlTable, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core"

export const user = mysqlTable(
  "sys_user",
  {
    userId: varchar("user_id", { length: 32 }).primaryKey().notNull(),
    username: varchar("username", { length: 30 }).notNull(),
    password: varchar("password", { length: 100 }).notNull(),
    salt: varchar("salt", { length: 16 }).notNull(),

    deptId: bigint("dept_id", { mode: "number" }),
    email: varchar("email", { length: 50 }).default(""),
    phone: varchar("phone", { length: 11 }).default(""),

    isDisabled: tinyint("is_disabled").default(0),
    isDeleted: tinyint("is_deleted").default(0),
    createTime: datetime("create_time").$default(() => new Date()),
    updateTime: datetime("update_time").$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("username").on(table.username), index("idx_dept_id").on(table.deptId)],
)

export type User = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert
