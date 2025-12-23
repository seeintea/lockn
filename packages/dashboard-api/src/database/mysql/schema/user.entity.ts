import { bigint, datetime, index, mysqlTable, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core"

export const user = mysqlTable(
  "sys_user",
  {
    userId: varchar("user_id", { length: 32 }).primaryKey().notNull(),
    username: varchar("username", { length: 30 }).notNull(),
    password: varchar("password", { length: 100 }).notNull(),
    salt: varchar("salt", { length: 16 }).notNull(),

    deptId: bigint("dept_id", { mode: "number" }).notNull(),
    email: varchar("email", { length: 50 }).notNull().default(""),
    phone: varchar("phone", { length: 11 }).notNull().default(""),

    isDisabled: tinyint("is_disabled").notNull().default(0),
    isDeleted: tinyint("is_deleted").notNull().default(0),
    createTime: datetime("create_time")
      .notNull()
      .$default(() => new Date()),
    updateTime: datetime("update_time")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("username").on(table.username), index("idx_dept_id").on(table.deptId)],
)
