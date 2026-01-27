import { boolean, date, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core"

export const user = pgTable(
  "sys_user",
  {
    userId: varchar("user_id", { length: 32 }).primaryKey().notNull(),
    username: varchar("username", { length: 30 }).notNull(),
    password: varchar("password", { length: 100 }).notNull(),
    salt: varchar("salt", { length: 16 }).notNull(),
    email: varchar("email", { length: 50 }).notNull().default(""),
    phone: varchar("phone", { length: 11 }).notNull().default(""),
    isDisabled: boolean("is_disabled").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createTime: date("create_time").notNull(),
    updateTime: date("update_time").notNull(),
  },
  (table) => [uniqueIndex("username").on(table.username)],
)
