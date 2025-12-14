import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("sys_user", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  isDisabled: boolean("is_disabled").notNull().default(false),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
