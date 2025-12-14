import type { InsertUser, User } from "@database/postgres/schema/users.entity"
import { z } from "zod"

const shareShape = {
  name: z.string().min(6).max(32),
  email: z.email(),
  password: z.string().length(21),
} satisfies z.ZodRawShape

export const CreateUserSchema = z.object(shareShape)

export const UpdateUserSchema = z.object({
  id: z.number(),
  name: shareShape.name.nullish(),
  email: shareShape.name.nullish(),
  password: shareShape.name.nullish(),
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

export type { User, InsertUser }
