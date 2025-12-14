import { users } from "./users.entity"

export const schema = {
  users,
}

export type Schema = typeof schema
export type SchemaName = keyof Schema
