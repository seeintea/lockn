import { boolean, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core"

export const permission = pgTable(
  "sys_permission",
  {
    permissionId: varchar("permission_id", { length: 32 }).primaryKey().notNull(),
    code: varchar("code", { length: 80 }).notNull(),
    name: varchar("name", { length: 80 }).notNull().default(""),
    module: varchar("module", { length: 30 }).notNull().default(""),
    isDisabled: boolean("is_disabled").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createTime: timestamp("create_time").notNull().defaultNow(),
    updateTime: timestamp("update_time")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex("sys_permission_code_uq").on(table.code)],
)
